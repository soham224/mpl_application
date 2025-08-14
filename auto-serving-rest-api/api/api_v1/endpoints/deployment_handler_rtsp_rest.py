import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.aws_utils import setup_ecs_rtsp, check_and_create_bucket, deploy_model
from core.result_utils import filter_camera_list
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("deployment_handler_rtsp_rest")


#
# @router.post("/start_rtsp_deployment_old")
# def start_deployment(
#         deployment_job_rtsp_id: int,
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_superuser)
# ) -> Any:
#     logging.info("deployment started")
#     deployment_rtsp_job = crud.deployment_job_rtsp.get_by_id(db, deployment_job_rtsp_id)
#     if not deployment_rtsp_job:
#         raise HTTPException(status_code=404, detail="No Deployment RTSP Job Found")
#
#     epoch = str(int(time.time()))
#
#     security_groups = [settings.SECURITY_GROUP]
#
#     docker_command = "docker run -dit --restart unless-stopped -e AWS_ACCESS_KEY_ID={} -e AWS_SECRET_ACCESS_KEY={} -e AWS_DEFAULT_REGION={} -e _INFERENCE_DEVICE={} -e _COMPANY_NAME={} -e _MODEL_S3_PATH={} -e _MODEL_S3_KEY={} -e _MODEL_S3_NAME={} -e _MODEL_VERSION={} -e _IMAGE_SIZE={} -e _CONFIDENCE_THRESHOLD={} -e _IOU_THRESHOLD={} -m {} -p 8080:8080 --name {} {}".format(
#         settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY, settings.AWS_DEFAULT_REGION,
#         deployment_rtsp_job.model_details.device_details.device_name,
#         deployment_rtsp_job.user_details.company_name.replace(" ", ""),
#         deployment_rtsp_job.model_details.model_s3_data.model_s3_url,
#         deployment_rtsp_job.model_details.model_s3_data.model_s3_key,
#         deployment_rtsp_job.model_details.model_s3_data.model_s3_name,
#         deployment_rtsp_job.model_details.model_s3_data.model_version, deployment_rtsp_job.image_size,
#         deployment_rtsp_job.confidence_threshold,
#         settings.CONTAINER_MEMORY_LIMIT,
#         deployment_rtsp_job.iou_threshold, deployment_rtsp_job.user_details.company_name.replace(" ", ""),
#         deployment_rtsp_job.model_details.model_framework_details.framework_name
#     )
#
#     logging.info("docker_command :: {}".format(docker_command))
#
#     user_data_script = """#cloud-boothook
# #!/bin/bash
# echo "
# #!/bin/bash
# echo '$(date -u) :: RUNNING COMMAND :: {}'
# {}
# echo '$(date -u) :: PROCESS COMPLETED'" > /home/ubuntu/serving_init_script.sh
#
# echo "
# export DEPLOYMENT_JOB_RTSP_ID={}
# export DB_HOST={}
# export DB_USERNAME={}
# export DB_PASS={}
# export DB_NAME={}
# export S3_BUCKET_NAME={}
# export AWS_REGION={}
# export ACCESS_KEY={}
# export SECRET_KEY={}
# export MODEL_API_ENDPOINT={}
# export MONGO_HOST={}
# export MONGO_USER={}
# export MONGO_PASS={}
# export MONGO_DB={}
# export MONGO_PORT={}" > /home/ubuntu/auto_serving_envs.sh
# """.format(docker_command, docker_command, deployment_rtsp_job.id, settings.MYSQL_HOSTNAME, settings.MYSQL_USERNAME,
#            settings.MYSQL_PASS, settings.MYSQL_DB_NAME, settings.RESULT_S3_BUCKET_NAME, settings.RESULT_S3_REGION,
#            settings.RESULT_AWS_ACCESS_KEY, settings.RESULT_AWS_SECRET_KEY, settings.MODEL_API_ENDPOINT,
#            settings.MONGO_HOST, settings.MONGO_USER, settings.MONGO_PASS, settings.MONGO_DB, settings.MONGO_PORT)
#
#     logging.info("user_data_script :: {}".format(user_data_script))
#
#     ec2 = client('ec2', aws_access_key_id=settings.ACCESS_KEY,
#                  aws_secret_access_key=settings.SECRET_KEY,
#                  region_name='ap-south-1')
#
#     try:
#         new_reservation = ec2.run_instances(
#             ImageId=settings.AWS_RTSP_IMAGE_ID,
#             InstanceType=settings.INSTANCE_TYPE,
#             KeyName=settings.KEY_NAME,
#             MaxCount=settings.MAX_COUNT,
#             MinCount=settings.MIN_COUNT,
#             SecurityGroupIds=security_groups,
#             UserData=user_data_script
#         )
#
#         instance_dict = new_reservation.get("Instances")[0]
#         instance_id = instance_dict.get("InstanceId")
#
#         instance_name = "auto_rtsp_serving_" + epoch
#
#         tag_list = [{"Key": "Name", "Value": instance_name}, {"Key": "Dev", "Value": "Mihir"}]
#
#         ec2.create_tags(Resources=[instance_id], Tags=tag_list)
#
#         ec2_r = resource('ec2', aws_access_key_id=settings.ACCESS_KEY,
#                          aws_secret_access_key=settings.SECRET_KEY,
#                          region_name=settings.AWS_DEFAULT_REGION)
#
#         my_instance = ec2_r.Instance(instance_id)
#
#         my_instance.wait_until_running(WaiterConfig={'Delay': 20})
#
#         logging.info("Instance state : {}".format(my_instance.state))
#         logging.info("Public IP : {}".format(my_instance.public_ip_address))
#
#         api_end_point = "http://{}:8080".format(my_instance.public_ip_address)
#         api_docs = ["http://{}:8080/docs".format(my_instance.public_ip_address),
#                     "http://{}:8080/redoc".format(my_instance.public_ip_address)]
#
#         created_date = datetime.datetime.utcnow().replace(microsecond=0)
#         updated_date = datetime.datetime.utcnow().replace(microsecond=0)
#
#         deployed_job_rtsp_details = schemas.DeployedJobRTSPCreate(instance_id=instance_id,
#                                                                   instance_status=my_instance.state.get("Name"),
#                                                                   deployment_job_rtsp_id=deployment_job_rtsp_id,
#                                                                   created_date=created_date,
#                                                                   updated_date=updated_date,
#                                                                   status=True,
#                                                                   api_endpoint=api_end_point)
#
#         if isinstance(deployed_job_rtsp_details, dict):
#             in_obj = deployed_job_rtsp_details
#         else:
#             in_obj = deployed_job_rtsp_details.dict(exclude_unset=True)
#
#         deployed_rtsp_job = crud.deployed_rtsp_job.create(db=db, obj_in=in_obj)
#         if not deployed_rtsp_job:
#             logging.warning("Deployed RTSP Job Details Not Added into the DB")
#         logging.info("Deployed RTSP Job Details Added Successfully")
#
#         is_updated = crud.deployment_job_rtsp.update_status(db=db, status=1, job_obj=deployment_rtsp_job)
#         if is_updated:
#             logging.info("Deployment RTSP Job Status Updated Successfully")
#         else:
#             logging.warning("Deployment RTSP Job Status Not Updated")
#
#         # send email
#         send_deployed_rtsp_job_mail_user(deployment_rtsp_job.model_details.model_name,
#                                          [deployment_rtsp_job.user_details.user_email])
#
#         send_deployed_rtsp_job_mail_admin(deployment_rtsp_job.model_details.model_name,
#                                           deployment_rtsp_job.user_details.company_name, settings.SUPER_ADMIN_MAIL_LIST)
#
#         logging.info("deployment completed")
#         return "Deployment Completed Successful"
#
#     except Exception as e:
#         logging.error("Exception In RTSP Deployment: {} ".format(e))
#         raise HTTPException(status_code=500, detail="Exception In RTSP Deployment: {} ".format(e))


@router.get(
    "/get_rtsp_deployed_jobs_for_current_user",
    response_model=List[schemas.DeployedJobRTSPRead],
)
def get_rtsp_deployed_jobs_for_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployed_rtsp_jobs = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(
                db=db, user_id=company_admin.id
            )
            deployed_rtsp_jobs = filter_camera_list(
                current_user.locations, deployed_jobs
            )
    else:
        deployed_rtsp_jobs = crud.deployed_rtsp_job.get_by_user_id(
            db=db, user_id=current_user.id
        )
    if not deployed_rtsp_jobs:
        return []
    return deployed_rtsp_jobs


@router.get(
    "/get_all_deployed_rtsp_jobs", response_model=List[schemas.DeployedJobRTSPRead]
)
def get_all_deployed_rtsp_jobs(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    deployed_rtsp_jobs = crud.deployed_rtsp_job.get_all(db)
    if not deployed_rtsp_jobs:
        raise HTTPException(status_code=404, detail="No Deployed RTSP Jobs Found")
    return deployed_rtsp_jobs


@router.get(
    "/get_all_deployed_rtsp_jobs_for_result_manager",
    response_model=List[schemas.DeployedJobRTSPRead],
)
def get_all_deployed_rtsp_jobs_for_result_manager(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    deployed_rtsp_jobs = crud.deployed_rtsp_job.get_all(db)
    if not deployed_rtsp_jobs:
        raise HTTPException(status_code=404, detail="No Deployed RTSP Jobs Found")
    return deployed_rtsp_jobs


# @router.post("/terminate_running_rtsp_job_old")
# def terminate_running_job(
#         deployed_rtsp_job_id: int,
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_superuser)
# ) -> Any:
#     logging.info("terminating deployment started, deployed_rtsp_job_id : {}".format(deployed_rtsp_job_id))
#     deployed_rtsp_job = crud.deployed_rtsp_job.get_by_id(db, deployed_rtsp_job_id)
#     if not deployed_rtsp_job:
#         raise HTTPException(status_code=404, detail="No Deployed RTSP Job Found For the Requested ID")
#
#     deployment_rtsp_job = crud.deployment_job_rtsp.get_by_id(db, deployed_rtsp_job.deployment_job_rtsp_id)
#     if not deployment_rtsp_job:
#         raise HTTPException(status_code=404, detail="No Deployment RTSP Job Found")
#
#     ec2_r = resource('ec2', aws_access_key_id=settings.ACCESS_KEY,
#                      aws_secret_access_key=settings.SECRET_KEY,
#                      region_name=settings.AWS_DEFAULT_REGION)
#
#     try:
#         ec2_r.instances.filter(InstanceIds=[deployed_rtsp_job.instance_id]).terminate()
#
#         is_updated = crud.deployment_job.update_status(db=db, status=0, job_obj=deployment_rtsp_job)
#         if is_updated:
#             logging.info("Deployment RTSP Job Status Updated Successfully")
#         else:
#             logging.warning("Deployment RTSP Job Status Not Updated")
#
#         deployed_rtsp_job_new = schemas.DeployedJobRTSPCreate(instance_status="terminated",
#                                                               status=0,
#                                                               updated_date=datetime.datetime.utcnow().replace(
#                                                                   microsecond=0),
#                                                               api_endpoint=deployed_rtsp_job.api_endpoint,
#                                                               instance_id=deployed_rtsp_job.instance_id,
#                                                               deployment_job_rtsp_id=deployed_rtsp_job.deployment_job_rtsp_id,
#                                                               created_date=deployed_rtsp_job.created_date)
#
#         crud.deployed_job.update(db=db, db_obj=deployed_rtsp_job, obj_in=deployed_rtsp_job_new)
#
#         send_stop_deployed_job_mail_user(deployment_rtsp_job.model_details.model_name,
#                                          [deployment_rtsp_job.user_details.user_email])
#
#         send_stop_deployed_job_mail_admin(deployment_rtsp_job.model_details.model_name,
#                                           deployment_rtsp_job.user_details.company_name,
#                                           settings.SUPER_ADMIN_MAIL_LIST)
#         logging.info("terminating completed, deployed_rtsp_job_id : {}".format(deployed_rtsp_job_id))
#         return "Job Terminated Successfully"
#     except Exception as e:
#         logging.error("Exception in terminating the job : {}".format(e))
#         raise HTTPException(status_code=500, detail="Exception In Deployment Termination: {} ".format(e))


@router.post("/start_rtsp_deployment")
def start_rtsp_deployment_fg(
    deployment_job_rtsp_id: int,
    is_only_record: bool,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    logging.info("deployment started")
    deployment_rtsp_job = crud.deployment_job_rtsp.get_by_id(db, deployment_job_rtsp_id)
    if not deployment_rtsp_job:
        raise HTTPException(status_code=404, detail="No Deployment RTSP Job Found")

    try:
        bucket_name = "tusker-img-storage-{}-{}".format(
            deployment_rtsp_job.user_details.company.company_name.split(" ")[0],
            deployment_rtsp_job.user_details.company.id,
        )
        is_checked = check_and_create_bucket(
            bucket_name, deployment_rtsp_job.user_details.company.deployment_region
        )

        if is_checked:
            is_done_1 = setup_ecs_rtsp(deployment_rtsp_job, bucket_name)
            if is_done_1 and not is_only_record:
                is_done_2 = deploy_model(deployment_rtsp_job, bucket_name)
                if is_done_2:
                    created_date = datetime.datetime.utcnow().replace(microsecond=0)
                    updated_date = datetime.datetime.utcnow().replace(microsecond=0)

                    deployed_job_rtsp_details = schemas.DeployedJobRTSPCreate(
                        instance_id="",
                        instance_status="",
                        deployment_job_rtsp_id=deployment_job_rtsp_id,
                        created_date=created_date,
                        updated_date=updated_date,
                        status=True,
                        api_endpoint="",
                    )

                    if isinstance(deployed_job_rtsp_details, dict):
                        in_obj = deployed_job_rtsp_details
                    else:
                        in_obj = deployed_job_rtsp_details.dict(exclude_unset=True)

                    deployed_rtsp_job = crud.deployed_rtsp_job.create(
                        db=db, obj_in=in_obj
                    )
                    if not deployed_rtsp_job:
                        logging.warning(
                            "Deployed RTSP Job Details Not Added into the DB"
                        )
                    logging.info("Deployed RTSP Job Details Added Successfully")

                    is_updated = crud.deployment_job_rtsp.update_status(
                        db=db, status=1, job_obj=deployment_rtsp_job
                    )
                    if is_updated:
                        logging.info("Deployment RTSP Job Status Updated Successfully")
                    else:
                        logging.warning("Deployment RTSP Job Status Not Updated")
                    return "Deployment Completed Successful"
                else:
                    return "Deploy and Mapping not done"
            else:
                if is_only_record and is_done_1:
                    return "Deployment Completed Successful"
                else:
                    return "ECS setup not done"
        else:
            return "Bucket checking or creation was unsuccessful."
    except Exception as e:
        logging.error("Exception In RTSP Deployment: {} ".format(e))
        raise HTTPException(
            status_code=500, detail="Exception In RTSP Deployment: {} ".format(e)
        )
