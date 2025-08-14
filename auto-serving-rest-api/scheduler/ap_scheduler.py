import json
import shutil
import time
import traceback

import boto3
from apscheduler.schedulers.background import BackgroundScheduler
from random import randrange

from core.image_utils import plot_bounding_box
from core.notification_utils import send_notification_message
from core.pdf_utils import create_pdf
from core.request_utils import download_image_from_url
from core.result_utils import (
    get_mongo_data_for_send_notification,
    get_one_data_for_send_notification,
)
from crud.deployment_job_rtsp_crud import deployment_job_rtsp
import crud
from db.session import SessionLocal
from core.config import settings
from applogging.applogger import MyLogger
from models import SchedulerTime, RtspDownOdit
from subprocess import TimeoutExpired, Popen
import os
import datetime

logging = MyLogger().get_logger("ap_scheduler")

scheduler_job = None
scheduler_time = None
scheduler_time_config = {}
scheduler_job_config = {}

notification_scheduler_type = "NOTIFICATION"
rtsp_odit_scheduler_type = "RTSP_ODIT"
last_date_id_config = {}


def get_scheduler_time():
    db = SessionLocal()
    time_obj = db.query(SchedulerTime).filter(SchedulerTime.status == True).first()
    return time_obj.time_min


def start_fun(service_name, region):
    try:
        sqs_queue = boto3.resource("sqs").get_queue_by_name(
            QueueName="scheduled-services-management-queue"
        )
        logging.info("starting : {} @ {}".format(service_name, region))
        msg_body = {
            "execution_tag": "start",
            "service_name": service_name,
            "deployment_region": region,
        }
        response = sqs_queue.send_message(MessageBody=json.dumps(msg_body))
        logging.info("response msgId : ".format(response.get("MessageId")))
        if response.get("MessageId"):
            logging.info("successful job start")
        else:
            logging.info("job start queue message send fail")
    except Exception as e:
        logging.error("Exception : start_fun ", e)


def stop_fun(service_name, region):
    try:
        sqs_queue = boto3.resource("sqs").get_queue_by_name(
            QueueName="scheduled-services-management-queue"
        )
        logging.info("stopping : {} @ {}".format(service_name, region))
        msg_body = {
            "execution_tag": "stop",
            "service_name": service_name,
            "deployment_region": region,
        }
        response = sqs_queue.send_message(MessageBody=json.dumps(msg_body))
        logging.info("response msgId : ".format(response.get("MessageId")))
        if response.get("MessageId"):
            logging.info("successful job stop")
        else:
            logging.info("job stop queue message send fail")
    except Exception as e:
        logging.error("Exception : stop_fun ", e)


# def check_all_rtsp():
#     try:
#         db = SessionLocal()
#         crud_obj = crud.deployment_camera.get_all(db)
#         for data in crud_obj:
#             if not check_rtsp_new(data.rtsp_url):
#                 update_obj = crud.deployment_camera.get(db=db, id=data.id)
#                 res = crud.deployment_camera.update_rtsp_status(
#                     db=db, status_type="is_active", status_val=False, db_obj=update_obj
#                 )
#     except Exception as ex:
#         logging.error("Exception : check_all_rtsp ", ex)


def kill_process():
    Popen("pkill -x ffmpeg", shell=True).communicate()


def check_rtsp(rtsp_url):
    try:
        process = Popen(
            "ffmpeg -rtsp_transport tcp -i {} frame.png".format(rtsp_url),
            shell=True,
            preexec_fn=os.setsid,
        )
        process.communicate(timeout=10)
        if os.path.exists("frame.png"):
            logging.info("RTSP Running: {}".format(rtsp_url))
            os.remove("frame.png")
            return True
        kill_process()
        logging.info("RTSP Not Running: {}".format(rtsp_url))
        return False
    except TimeoutExpired:
        kill_process()
        logging.error("RTSP Not Running: {}".format(rtsp_url))
        return False
    except KeyboardInterrupt as ki:
        kill_process()
        logging.error("RTSP Not Running: {}".format(rtsp_url))
        return False
    except Exception as e:
        logging.error("Exception in check_rtsp : {}".format(e))
        logging.error("RTSP Not Running: {}".format(rtsp_url))
        kill_process()
        return False


def add_down_data(db, camera_id, rtsp_status):
    created_time = datetime.datetime.utcnow()
    created_date = datetime.datetime.utcnow()
    db_object = (
        db.query(RtspDownOdit)
        .filter(RtspDownOdit.camera_id == camera_id)
        .filter(RtspDownOdit.created_time == created_time)
        .all()
    )
    if not db_object:
        add_db_obj = RtspDownOdit(
            camera_id=camera_id,
            created_time=created_time,
            created_date=created_date,
            rtsp_status=rtsp_status,
        )
        db.add(add_db_obj)
        db.commit()


def check_all_rtsp():
    try:
        global scheduler_job, scheduler_time
        new_time = get_scheduler_time()
        if new_time != scheduler_time:
            scheduler_time = new_time
            scheduler_job.reschedule(trigger="interval", minutes=new_time)

        db = SessionLocal()
        crud_obj = crud.deployment_camera.get_all(db)
        for data in crud_obj:
            rtsp_status = check_rtsp(data.rtsp_url)
            logging.info("Rtsp: {} | status: {}".format(data.rtsp_url, rtsp_status))
            if data.is_active != rtsp_status:
                update_obj = crud.deployment_camera.get(db=db, id=data.id)
                res = crud.deployment_camera.update_rtsp_status(
                    db=db,
                    status_type="is_active",
                    status_val=rtsp_status,
                    db_obj=update_obj,
                )
                add_down_data(db, data.id, rtsp_status)
    except Exception as ex:
        logging.error("Exception : check_all_rtsp ", ex)


def custom_schedule():
    try:
        my_scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
        db = SessionLocal()
        jobs_data = deployment_job_rtsp.get_schedule_deployment_jobs_rtsp(db)
        logging.info("custom_schedule jobs_data : {}".format(jobs_data))
        for job in jobs_data:
            company_name = job.user_details.company.company_name.split(" ")[0]
            company_id = job.user_details.company.id
            s_hour = job.start_time.split(":")[0]
            s_min = job.start_time.split(":")[1]
            e_hour = job.end_time.split(":")[0]
            e_min = job.end_time.split(":")[1]
            tz = "Asia/Kolkata"
            service_name = "tusker-frame-extractor-service-{}-{}-{}".format(
                company_name, company_id, job.id
            )
            logging.info("custom_schedule job : {} @ {}".format(service_name, job))
            region = job.user_details.company.deployment_region
            sec = randrange(60)
            my_scheduler.add_job(
                start_fun,
                "cron",
                args=[service_name, region],
                hour=s_hour,
                minute=s_min,
                second=sec,
                timezone=tz,
                id="s_{}".format(job.id),
                name="start-{}@{}".format(service_name, region),
            )
            my_scheduler.add_job(
                stop_fun,
                "cron",
                args=[service_name, region],
                hour=e_hour,
                minute=e_min,
                second=sec,
                timezone=tz,
                id="e_{}".format(job.id),
                name="stop-{}@{}".format(service_name, region),
            )

        my_scheduler.add_job(
            check_all_rtsp, "interval", hours=settings.CAMERA_SCHEDULER_TIME
        )

        my_scheduler.start()
        my_scheduler.print_jobs()
    except Exception as e:
        logging.error("Exception : custom_schedule ", e)
        db.close()
    finally:
        db.close()


def check_rtsp_custom_schedule():
    global scheduler_job, scheduler_time
    try:
        my_scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
        db = SessionLocal()
        scheduler_time = get_scheduler_time()
        scheduler_job = my_scheduler.add_job(
            check_all_rtsp, "interval", minutes=scheduler_time
        )

        my_scheduler.start()
        my_scheduler.print_jobs()
    except Exception as e:
        logging.error("Exception : custom_schedule ", e)
        db.close()
    finally:
        db.close()


def check_scheduler_time(db_time, company_id, scheduler_type):
    global scheduler_time_config
    if (company_id, scheduler_type) in scheduler_time_config and scheduler_time_config[
        company_id, scheduler_type
    ] != db_time:
        scheduler_time_config[company_id, scheduler_type] = db_time
        scheduler_job_config[company_id, scheduler_type].reschedule(
            trigger="interval", minutes=db_time
        )


def get_scheduler_details(company_id, scheduler_type):
    db = SessionLocal()
    try:
        time_obj = (
            db.query(SchedulerTime)
            .filter(SchedulerTime.status == True)
            .filter(SchedulerTime.company_id == company_id)
            .filter(SchedulerTime.scheduler_type == scheduler_type)
            .first()
        )
        if not time_obj:
            return None
        return time_obj
    except Exception as e:
        logging.error("Exception : get_scheduler_details ", e)
    finally:
        db.close()


def get_camera_by_company_id(company_id, add_filter=True):
    db = SessionLocal()
    try:
        data_object = crud.deployment_camera.get_all_camera_by_company_id(
            db, company_id, add_filter
        )
        return {
            camera_details.id: {
                "location_name": camera_details.location_details.location_name,
                "location_id": camera_details.location_id,
                "camera_name": camera_details.camera_name,
            }
            for camera_details in data_object
        }
    except Exception as e:
        logging.error("Exception : get_camera_by_company_id ", e)
    finally:
        db.close()


def get_user_name_by_company_and_vehicle(company_id, number_plate):
    db = SessionLocal()
    try:
        data_object = crud.anpr_vms_details_crud_obj.get_user_name_by_company_and_vehicle_db(
            db, company_id, number_plate.upper()
        )
        return data_object
    except Exception as e:
        logging.error("Exception : get_user_name_by_company_and_vehicle ", e)
    finally:
        db.close()


def get_anpr_details_pdf(speed, check_id):
    db = SessionLocal()
    try:
        data_object = crud.anpr_vms_details_crud_obj.get_anpr_details_pdf(
            db, speed, check_id
        )
        for data in data_object:
            data.camera_details
            data.camera_details.location_details
        return data_object
    except Exception as e:
        logging.error("Exception : get_camera_by_company_id ", e)
    finally:
        db.close()


def get_one_anpr_details_pdf(speed):
    db = SessionLocal()
    try:
        return crud.anpr_vms_details_crud_obj.get_one_anpr_details_pdf(db, speed)
    except Exception as e:
        logging.error("Exception : get_camera_by_company_id ", e)
    finally:
        db.close()


def get_and_send_notification_message(company_id, pdf_file_name):
    db = SessionLocal()
    try:
        notification_config = (
            crud.notification_config_crud_object.get_data_by_company_id(db, company_id)
        )

        if not notification_config:
            logging.error(f"Notification config not found for company_id: {company_id}")

        for config_details in notification_config:
            status = send_notification_message(
                config_details.notification_type,
                config_details.meta_data,
                pdf_file_name,
            )
            logging.info(
                f"Notification status: {status} | company_id: {company_id} | notification_type: {config_details.notification_type} | meta_data: {config_details.meta_data}"
            )
    except Exception as e:
        logging.error("Exception : get_and_send_notification_message ", e)
    finally:
        db.close()


def send_notification(company_id):
    folder_path = f"{time.time()}"
    final_pdf_data = {}
    os.makedirs(folder_path, exist_ok=True)
    try:
        global last_date_id_config
        logging.info(
            f"Start send notification process. company_id: {company_id} | start_time: {datetime.datetime.now()}"
        )
        db_scheduler_details = get_scheduler_details(
            company_id, notification_scheduler_type
        )
        check_scheduler_time(
            db_scheduler_details.time_min, company_id, notification_scheduler_type
        )

        if not last_date_id_config.get(
                (company_id, notification_scheduler_type, "MONGO")
        ):
            data = get_one_data_for_send_notification(db_scheduler_details.meta_data)
            if data:
                last_date_id_config[
                    company_id, notification_scheduler_type, "MONGO"
                ] = data["_id"]["$oid"]
        if not last_date_id_config.get(
                (company_id, notification_scheduler_type, "MONGO")
        ):
            logging.info(
                f"No mongo ID data found for send notification. company_id: {company_id}"
            )
            mongo_data = []
        else:
            mongo_data = get_mongo_data_for_send_notification(
                db_scheduler_details.meta_data,
                last_date_id_config[company_id, notification_scheduler_type, "MONGO"],
            )

        if mongo_data:
            last_date_id_config[company_id, notification_scheduler_type, "MONGO"] = max(
                [data["id"]["$oid"] for data in mongo_data]
            )

        if not mongo_data:
            logging.info(
                f"No mongo data found for send notification. company_id: {company_id}"
            )

        camera_config = get_camera_by_company_id(company_id, add_filter=False)
        for data in mongo_data:
            file_name = f"{time.time()}.png"
            file_path = f"{folder_path}/{file_name}"
            download_status = download_image_from_url(
                url=data["_id"]["image_url"], file_path=file_path
            )
            if download_status:
                for data_detection in data["result"]:
                    plot_bounding_box(
                        coordinate=data_detection["location"],
                        img_name=file_path,
                        label=data_detection["label"],
                    )
                if data["_id"]["label"] not in final_pdf_data:
                    final_pdf_data[data["_id"]["label"]] = []
                camera_data = camera_config[int(data["camera_id"])]
                utc_time = datetime.datetime.fromtimestamp(
                    data["created_date"]["$date"] / 1000, tz=datetime.timezone.utc
                )
                ist_time = utc_time + datetime.timedelta(hours=5, minutes=30)
                formatted_date = ist_time.strftime("%Y-%m-%d %I:%M:%S %p")
                final_pdf_data[data["_id"]["label"]].append(
                    {
                        "file_path": file_path,
                        "Location": camera_data["location_name"],
                        "Camera": camera_data["camera_name"],
                        "Count": data["count"],
                        "Time": formatted_date,
                    }
                )
        if not last_date_id_config.get(
                (company_id, notification_scheduler_type, "SQL")
        ):
            data = get_one_anpr_details_pdf(30)
            if data:
                last_date_id_config[company_id, notification_scheduler_type, "SQL"] = (
                    data.id
                )

        if not last_date_id_config.get(
                (company_id, notification_scheduler_type, "SQL")
        ):
            logging.info(
                f"No sql ID data found for send notification. company_id: {company_id}"
            )
            sql_data = []
        else:
            sql_data = get_anpr_details_pdf(
                30,
                last_date_id_config[company_id, notification_scheduler_type, "SQL"],
            )
        if sql_data:
            last_date_id_config[company_id, notification_scheduler_type, "SQL"] = max(
                [data.id for data in sql_data]
            )

        if not sql_data:
            logging.info(
                f"No sql data found for send notification. company_id: {company_id}"
            )

        for data in sql_data:
            speed_label = "Speed"
            file_name = f"{time.time()}.png"
            file_path = f"{folder_path}/{file_name}"
            download_status = download_image_from_url(
                url=data.full_image_url, file_path=file_path
            )
            if download_status:
                if speed_label not in final_pdf_data:
                    final_pdf_data[speed_label] = []

                owner_name = get_user_name_by_company_and_vehicle(
                    company_id=company_id,
                    number_plate=data.plate
                )

                final_pdf_data[speed_label].append(
                    {
                        "file_path": file_path,
                        "Location": data.camera_details.location_details.location_name,
                        "Camera": data.camera_details.camera_name,
                        "Number Plate": data.plate,
                        "Owner Name": owner_name.owner_name if owner_name else "-",
                        "Speed": data.speed,
                        "Time": data.time_msec.strftime("%Y-%m-%d %I:%M:%S %p"),
                    }
                )
        if final_pdf_data:
            output_pdf_file_path = f"{folder_path}/Tusker_AI_{company_id}.pdf"
            status = create_pdf(final_pdf_data, output_pdf_file_path)
            if status:
                get_and_send_notification_message(company_id, output_pdf_file_path)
        else:
            logging.info(
                f"No PDF data found for notification. company_id: {company_id}"
            )
        logging.info("+++++ last_date_id_config", last_date_id_config)
        logging.info(
            f"Stop send notification process. company_id: {company_id} | start_time: {datetime.datetime.now()}"
        )
    except Exception as e:
        logging.error("Exception : send_notification ", e)
    finally:
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)


def send_user_notification(company_id):
    global scheduler_time_config
    try:
        logging.info(f"Setup send notification schedule | company_id: {company_id}")
        my_scheduler = BackgroundScheduler(timezone="Asia/Kolkata")
        db_scheduler_details = get_scheduler_details(
            company_id, notification_scheduler_type
        )
        if db_scheduler_details:
            scheduler_time_config[company_id, notification_scheduler_type] = (
                db_scheduler_details.time_min
            )
            scheduler_job_config[company_id, notification_scheduler_type] = (
                my_scheduler.add_job(
                    send_notification,
                    "interval",
                    minutes=db_scheduler_details.time_min,
                    args=[company_id],
                )
            )
            my_scheduler.start()
            my_scheduler.print_jobs()
    except Exception as e:
        logging.error("Exception : send_user_notification ", e)
