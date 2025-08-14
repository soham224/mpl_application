import datetime
import json
import math
import os
import re
import subprocess
import time
from datetime import timedelta
import pymongo
import requests
from bson.json_util import dumps
from bson.objectid import ObjectId
from fastapi import HTTPException

import crud
import schemas
from core.aws_utils import upload_image_to_s3_main_bucket
from core.config import settings
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("result_utils")

mongo_client = pymongo.MongoClient(
    host=settings.MONGO_HOST,
    port=int(settings.MONGO_PORT),
    username=settings.MONGO_USER,
    password=settings.MONGO_PASS,
    authSource=settings.MONGO_AUTH_DB_NAME,
)
db = mongo_client[settings.MONGO_DB]
collection = db[settings.MONGO_COLL_NAME]
PAGE_SIZE = 10
RESULT_MANAGER_PAGE_SIZE = 8


def get_initial_info(
    user_id, camera_id_list, label_list, start_date, end_date, page_size
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": True},
        }
        if camera_id_list:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if label_list:
            my_filter["$or"] = []
            for label in label_list:
                my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        if start_date and end_date:
            my_filter["created_date"] = {"$gte": start_date, "$lte": end_date}
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / page_size)
            return {
                "page_size": page_size,
                "total_pages": total_pages,
                "total_count": total_records,
            }
        else:
            return {"page_size": page_size, "total_pages": 0, "total_count": 0}
    except Exception as e:
        logging.error("Exception get_result_by_user_camera : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_initial_info_admin(user_id, camera_id):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "result.detection.0": {"$exists": "true"},
        }
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error("Exception get_result_by_user_camera : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_paginated_result(
    user_id, camera_id_list, page_number, label_list, start_date, end_date, page_size
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": True},
        }
        if camera_id_list:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if label_list:
            my_filter["$or"] = []
            for label in label_list:
                my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        if start_date and end_date:
            my_filter["created_date"] = {"$gte": start_date, "$lte": end_date}

        skip_number = page_size * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter)
            .sort("created_date", -1)
            .skip(skip_number)
            .limit(page_size)
        )
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_paginated_result : {} ".format(e))
        return []


def get_paginated_result_admin(user_id, camera_id, page_number):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
        }
        skip_number = PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter).skip(skip_number).limit(PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_paginated_result : {} ".format(e))
        return []


def update_status_record(oid, status_val):
    try:
        my_filter = {"_id": ObjectId(oid)}
        new_val = {"$set": {"is_hide": status_val}}
        collection.update_one(my_filter, new_val)
        return True
    except Exception as e:
        logging.error("Exception update_status_record : {} ".format(e))
        return False


def get_datetime_initial_info_resultmanager(
    user_id,
    camera_id_list,
    label_list,
    from_datetime,
    to_datetime,
    is_hide,
    isDetection,
    isViewAll,
    isLocationSelected,
):
    try:
        if isViewAll:
            my_filter = {
                "user_id": str(user_id),
            }
        else:
            my_filter = {
                "user_id": str(user_id),
                "is_hide": is_hide,
                "result.detection.0": {"$exists": isDetection},
            }
        if camera_id_list != [] or isLocationSelected == True:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if label_list:
            my_filter["$or"] = []
            for label in label_list:
                my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        if from_datetime and to_datetime:
            my_filter["created_date"] = {"$gte": from_datetime, "$lte": to_datetime}
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / RESULT_MANAGER_PAGE_SIZE)
            return {"page_size": RESULT_MANAGER_PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": RESULT_MANAGER_PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error(
            "Exception get_datetime_initial_info_resultmanager : {} ".format(e)
        )
        return {"page_size": RESULT_MANAGER_PAGE_SIZE, "total_pages": 0}


def get_paginated_result_resultmanager(
    user_id,
    camera_id_list,
    label_list,
    from_datetime,
    to_datetime,
    page_number,
    is_hide,
    isDetection,
    isViewAll,
    isLocationSelected,
):
    try:
        if isViewAll:
            my_filter = {
                "user_id": str(user_id),
            }
        else:
            my_filter = {
                "user_id": str(user_id),
                "is_hide": is_hide,
                "result.detection.0": {"$exists": isDetection},
            }
        if camera_id_list != [] or isLocationSelected == True:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if label_list:
            my_filter["$or"] = []
            for label in label_list:
                my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        if from_datetime and to_datetime:
            my_filter["created_date"] = {"$gte": from_datetime, "$lte": to_datetime}

        skip_number = RESULT_MANAGER_PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter)
            .sort("created_date", -1)
            .skip(skip_number)
            .limit(RESULT_MANAGER_PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_paginated_result_resultmanager : {} ".format(e))
        return []


def get_datetime_initial_info_admin(user_id, camera_id, from_datetime, to_datetime):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": from_datetime, "$lte": to_datetime},
        }
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error("Exception get_result_by_user_camera : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_datetime_initial_info(user_id, camera_id, from_datetime, to_datetime):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": from_datetime, "$lt": to_datetime},
        }
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error("Exception get_result_by_user_camera : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_paginated_datetime_result_admin(
    user_id, camera_id, page_number, from_datetime, to_datetime
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": from_datetime, "$lt": to_datetime},
        }
        skip_number = PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter).skip(skip_number).limit(PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        logging.info("data>>>>>>>>{}".format(data))
        return data
    except Exception as e:
        logging.error("Exception get_paginated_result : {} ".format(e))
        return []


def get_paginated_datetime_result(
    user_id, camera_id, page_number, from_datetime, to_datetime
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": from_datetime, "$lt": to_datetime},
        }
        skip_number = PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter).skip(skip_number).limit(PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        logging.info("data>>>>>>>>{}".format(data))
        return data
    except Exception as e:
        logging.error("Exception get_paginated_result : {} ".format(e))
        return []


def check_file_size(file_location, capacity):
    try:
        file_size = os.path.getsize(file_location)
        if file_size / (1024 * 1024) > capacity:
            return False
        else:
            return True
    except Exception as e:
        logging.error("Exception check_file_size : {} ".format(e))
        return []


def check_video_duration(file_location):
    try:
        process = subprocess.Popen(
            ["ffmpeg", "-i", file_location],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        stdout, stderr = process.communicate()
        matches = re.search(
            b"Duration:\s{1}(?P<hours>\d+?):(?P<minutes>\d+?):(?P<seconds>\d+\.\d+?),",
            stdout,
            re.DOTALL,
        ).groupdict()
        hours = int(matches["hours"].decode("utf-8"))
        minutes = int(matches["minutes"].decode("utf-8"))
        seconds = int(float(matches["seconds"].decode("utf-8")))
        if hours != 0 or minutes != 0 or seconds > 20:
            return False
        else:
            return True
    except Exception as e:
        logging.error("Exception check_video_duration : {} ".format(e))
        return []


def get_image_coordinate(user_id, image_location, image_name_list, model_data):
    try:
        images_response_list = []
        if image_name_list:
            for image_name in range(len(image_name_list)):
                s3_key = (
                    "as/"
                    + str(user_id)
                    + "/"
                    + "video_frame"
                    + "/"
                    + str(int(time.time()))
                    + "/"
                    + image_name_list[image_name]
                )
                image_url = upload_image_to_s3_main_bucket(
                    image_location + image_name_list[image_name],
                    s3_key,
                    settings.TEST_IMG_STORAGE_BUCKET,
                    True,
                )
                response = get_infer_response(model_data, s3_key)
                if response.reason == "Service Unavailable":
                    for iteration in range(4):
                        response = get_infer_response(model_data, s3_key)
                response_json_data = response.json()
                if response_json_data and "detection" in response_json_data:
                    detection = response_json_data.get("detection")
                    if detection:
                        if image_url:
                            response_json_data["image_url"] = image_url
                            images_response_list.append(response_json_data)
                    else:
                        # os.remove(image_location + image_name_list[image_name])
                        logging.info("No detection found for the image")
                else:
                    os.remove(image_location + image_name_list[image_name])
                    logging.info("No detection found for the image")
        return images_response_list
    except Exception as e:
        logging.error("Exception get_image_coordinate : {} ".format(e))
        return []


def get_image_name_list(start_with, end_with, image_name_list, image_folder_location):
    try:
        for file in os.listdir(image_folder_location):
            if file.startswith(start_with) and file.endswith(end_with):
                image_name_list.append(file)
        image_name_list.sort()
        return image_name_list
    except Exception as e:
        logging.error("Exception get_image_name_list : {} ".format(e))
        return []


def raise_notification(notification_details, db):
    try:
        if isinstance(notification_details, dict):
            obj_in = notification_details
        else:
            obj_in = notification_details.dict(exclude_unset=True)
        out_obj = crud.notification_crud_obj.create(db=db, obj_in=obj_in)
        return out_obj
    except Exception as e:
        logging.error("Exception add_notification_utils : {} ".format(e))
        return []


def create_notification_schema(notification_message, type_of_notification, user_id):
    try:
        notification_details = schemas.NotificationCreate(
            notification_message=notification_message,
            type_of_notification=type_of_notification,
            is_unread=True,
            user_id=user_id,
            status=True,
            created_date=datetime.datetime.utcnow().replace(microsecond=0),
            updated_date=datetime.datetime.utcnow().replace(microsecond=0),
        )
        return notification_details
    except Exception as e:
        logging.error("Exception create_notification_schema : {} ".format(e))
        return []


def get_filter_mongo_data(
    user_id, camera_id, start_date, end_date, selected_model_labels
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
        }
        if camera_id:
            my_filter = {
                "user_id": str(user_id),
                "camera_id": str(camera_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
            }
        if start_date and end_date:
            my_filter = {
                "user_id": str(user_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "created_date": {"$gte": start_date, "$lt": end_date},
            }
        if start_date and end_date and camera_id:
            my_filter = {
                "user_id": str(user_id),
                "camera_id": str(camera_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "created_date": {"$gte": start_date, "$lt": end_date},
            }
        if selected_model_labels:
            filter_labels_list = []
            selected_model_labels_list = selected_model_labels.split(",")
            for labels in selected_model_labels_list:
                labels_obj = {"result.detection.label": labels}
                filter_labels_list.append(labels_obj)
            my_filter = {
                "user_id": str(user_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "$and": filter_labels_list,
            }
        if selected_model_labels and camera_id:
            filter_labels_list = []
            selected_model_labels_list = selected_model_labels.split(",")
            for labels in selected_model_labels_list:
                labels_obj = {"result.detection.label": labels}
                filter_labels_list.append(labels_obj)
            my_filter = {
                "user_id": str(user_id),
                "camera_id": str(camera_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "$and": filter_labels_list,
            }
        if selected_model_labels and start_date and end_date:
            filter_labels_list = []
            selected_model_labels_list = selected_model_labels.split(",")
            for labels in selected_model_labels_list:
                labels_obj = {"result.detection.label": labels}
                filter_labels_list.append(labels_obj)
            my_filter = {
                "user_id": str(user_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "created_date": {"$gte": start_date, "$lt": end_date},
                "$and": filter_labels_list,
            }
        if start_date and end_date and selected_model_labels and camera_id:
            filter_labels_list = []
            selected_model_labels_list = selected_model_labels.split(",")
            for labels in selected_model_labels_list:
                labels_obj = {"result.detection.label": labels}
                filter_labels_list.append(labels_obj)
            my_filter = {
                "user_id": str(user_id),
                "camera_id": str(camera_id),
                "is_hide": False,
                "result.detection.0": {"$exists": "true"},
                "created_date": {"$gte": start_date, "$lt": end_date},
                "$and": filter_labels_list,
            }
        connection_cursor = collection.find(my_filter)
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_filter_mongo_data : {} ".format(e))
        return []


def get_supervisor_filter_mongo_data(
    user_id,
    camera_id,
    start_date,
    end_date,
    selected_model_labels,
    duration_type,
    *args,
):
    try:
        my_filter = {"user_id": str(user_id), "is_hide": False}
        if camera_id:
            my_filter = {
                "user_id": str(user_id),
                "camera_id": {"$in": camera_id},
                "is_hide": False,
                "result.detection.0": {"$exists": True},
            }
        if start_date and end_date:
            my_filter = {
                "user_id": str(user_id),
                "is_hide": False,
                "result.detection.0": {"$exists": True},
                "created_date": {"$gte": start_date, "$lt": end_date},
            }
        if start_date and end_date and camera_id:
            my_filter = {
                "user_id": str(user_id),
                "camera_id": {"$in": camera_id},
                "is_hide": False,
                "result.detection.0": {"$exists": True},
                "created_date": {"$gte": start_date, "$lt": end_date},
            }
        if args:
            final_filter = get_initial_final_mongo_filter(
                duration_type, my_filter, selected_model_labels
            )
            connection_cursor = collection.aggregate(final_filter)
            data = list(connection_cursor)
            if data:
                data[0]["_id"] = str(args[1]).split(" ")[0]
                return data
            else:
                return []
        else:
            final_filter = get_final_mongo_filter(
                duration_type, my_filter, selected_model_labels
            )
            connection_cursor = collection.aggregate(final_filter)
            data = list(connection_cursor)
            return data
    except Exception as e:
        logging.error("Exception get_supervisor_filter_mongo_data : {} ".format(e))
        return []


def get_final_mongo_filter(duration_type, my_filter, selected_model_labels):
    try:
        selected_model_labels_list = selected_model_labels.split(",")
        group_obj = {}
        hour_group_obj = {}
        project_obj = {
            "_id": {"$toString": "$_id"},
            "time": {
                "$concat": [
                    {"$toString": {"$hour": "$created_date"}},
                    ":",
                    {"$toString": {"$minute": "$created_date"}},
                    ":",
                    {"$toString": {"$second": "$created_date"}},
                ]
            },
        }
        for labels in selected_model_labels_list:
            label_json = {}
            hour_label_json = {}
            project_obj[labels] = "$counts." + labels
            label_json[labels] = {"$sum": "$counts." + labels}
            hour_label_json[labels] = {"$sum": "$" + labels}
            group_obj.update(label_json)
            hour_group_obj.update(hour_label_json)
        if duration_type == "month":
            group_obj["_id"] = "$month"
            final_filter = [
                {"$match": my_filter},
                {
                    "$project": {
                        "counts": "$counts",
                        "month": {
                            "$dateToString": {
                                "format": "%Y-%m",
                                "date": "$created_date",
                            }
                        },
                    }
                },
                {"$group": group_obj},
                {"$sort": {"_id": 1}},
            ]
        if duration_type == "day":
            group_obj["_id"] = "$month"
            final_filter = [
                {"$match": my_filter},
                {
                    "$project": {
                        "counts": "$counts",
                        "month": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$created_date",
                            }
                        },
                    }
                },
                {"$group": group_obj},
                {"$sort": {"_id": 1}},
            ]
        if duration_type == "hour":
            hour_group_obj["_id"] = "$time"
            hour_group_obj["id"] = {"$addToSet": "$_id"}
            if selected_model_labels_list:
                for labels in selected_model_labels_list:
                    my_filter["counts." + labels] = {"$exists": "true"}
            final_filter = [
                {"$match": my_filter},
                {"$project": project_obj},
                {"$group": hour_group_obj},
                {"$sort": {"_id": 1}},
            ]
        return final_filter
    except Exception as e:
        logging.error("Exception get_final_mongo_filter : {} ".format(e))
        return []


def get_initial_final_mongo_filter(duration_type, my_filter, selected_model_labels):
    try:
        selected_model_labels_list = selected_model_labels.split(",")
        group_obj = {}
        hour_group_obj = {}
        project_obj = {
            "_id": {"$toString": "$_id"},
            "time": {
                "$concat": [
                    {"$toString": {"$hour": "$created_date"}},
                    ":",
                    {"$toString": {"$minute": "$created_date"}},
                    ":",
                    {"$toString": {"$second": "$created_date"}},
                ]
            },
        }
        for labels in selected_model_labels_list:
            label_json = {}
            hour_label_json = {}
            project_obj[labels] = "$counts." + labels
            label_json[labels] = {"$sum": "$counts." + labels}
            hour_label_json[labels] = {"$first": "$" + labels}
            group_obj.update(label_json)
            hour_group_obj.update(hour_label_json)
        if duration_type == "day":
            group_obj["_id"] = "$month"
            final_filter = [
                {"$match": my_filter},
                {
                    "$project": {
                        "counts": "$counts",
                    }
                },
                {"$group": group_obj},
                {"$sort": {"_id": 1}},
            ]
        return final_filter
    except Exception as e:
        logging.error("Exception get_final_mongo_filter : {} ".format(e))
        return []


def get_labels_list_by_user_id(user_id):
    try:
        labels_list_query = [
            {"$match": {"user_id": str(user_id)}},
            {"$project": {"arrayofkeyvalue": {"$objectToArray": "$counts"}}},
            {"$unwind": "$arrayofkeyvalue"},
            {"$group": {"_id": 1, "allkeys": {"$addToSet": "$arrayofkeyvalue.k"}}},
        ]
        connection_cursor = collection.aggregate(labels_list_query)
        data_list = list(connection_cursor)
        if data_list:
            list_obj = data_list[0]
            if list_obj["allkeys"]:
                labels_str = ",".join(list_obj["allkeys"])
                return labels_str
            else:
                return None
        else:
            return None
    except Exception as e:
        logging.error("Exception get_labels_list_by_user_id : {} ".format(e))
        return []


def get_data_of_last_graph_step(data_id):
    try:
        data_id_list = [ObjectId(str(data)) for data in data_id]
        connection_cursor = collection.find({"_id": {"$in": data_id_list}})
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_data_of_last_graph_step : {} ".format(e))
        return []


def get_filter_response(data_list, selected_model_labels, duration_type):
    try:
        filter_response_list = []
        checked_list = []
        if selected_model_labels:
            selected_model_labels_list = selected_model_labels.split(",")
            for selected_model_labels_list_name in selected_model_labels_list:
                for response_obj in data_list:
                    detection_list = response_obj["result"]["detection"]
                    label_count = 0
                    if detection_list:
                        for data_list_obj in detection_list:
                            data_list_obj_label = data_list_obj["label"]
                            if data_list_obj_label == selected_model_labels_list_name:
                                label_count += 1
                                filter_response_obj = {
                                    "label": data_list_obj_label,
                                    "count": label_count,
                                    "created_date": response_obj["created_date"],
                                }
                                filter_response_list.append(filter_response_obj)
        else:
            all_label_list_main = []
            for response_obj in data_list:
                all_label_list = []
                detection_list = response_obj["result"]["detection"]
                if detection_list:
                    for data_list_obj in detection_list:
                        data_list_obj_label_name = data_list_obj["label"]
                        all_label_list.append(data_list_obj_label_name)
                    all_label_list_dict = {
                        "labels": all_label_list,
                        "created_date": response_obj["created_date"],
                    }
                all_label_list_main.append(all_label_list_dict)
            filter_response_list = get_filter_response_with_count(all_label_list_main)
        return filter_response_list
    except Exception as e:
        logging.error("Exception get_filter_response : {} ".format(e))
        return []


def get_filter_default_mongo_data(user_id):
    try:
        today = datetime.datetime.utcnow()
        yesterday = today - datetime.timedelta(days=1)
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": yesterday, "$lt": today},
        }
        connection_cursor = collection.find(my_filter).limit(PAGE_SIZE)
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_filter_default_mongo_data : {} ".format(e))
        return []


def get_filter_response_with_count(data):
    try:
        final_label_list = []
        for value in data:
            temp_color_list = []
            unique_list = set(value["labels"])
            for unique_item in unique_list:
                pattern = {
                    "label": unique_item,
                    "count": value["labels"].count(unique_item),
                    "created_date": value["created_date"],
                }
                final_label_list.append(pattern)

        return final_label_list
    except Exception as e:
        logging.error("Exception get_filter_response_with_count : {} ".format(e))
        return []


# def get_today_processed_images(user_id):
#     try:
#         today = datetime.datetime.utcnow()
#         start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
#         end_date = start_date + timedelta(1)
#         my_filter = {
#             "user_id": str(user_id),
#             "is_hide": False,
#             "created_date": {"$gte": start_date, "$lt": end_date},
#         }
#         connection_count = collection.find(my_filter).count()
#         return connection_count
#     except Exception as e:
#         logging.error("Exception get_today_processed_images : {} ".format(e))
#         return []


def get_processed_images(
    user_id, camera_id, start_date, end_date, selected_model_labels
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
        }
        # if not '-1' in selected_model_labels.split(',') and selected_model_labels:
        #     selected_labels_list = selected_model_labels.split(",")
        #     # my_filter["result.detection.0"] = {"$exists": "true"}
        #     my_filter["result.detection.label"] = {'$in': selected_labels_list}
        if camera_id:
            my_filter["camera_id"] = {"$in": camera_id}
        if start_date and end_date:
            my_filter["created_date"] = {"$gte": start_date, "$lt": end_date}
        # else:
        #     today = datetime.datetime.utcnow()
        #     start_date = today.replace(
        #         hour=0, minute=0, second=0, microsecond=0)
        #     end_date = start_date + timedelta(1)
        #     my_filter["created_date"] = {"$gte": start_date, "$lt": end_date}
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_processed_images : {} ".format(e))
        return []


# def get_today_total_detection(user_id):
#     try:
#         today = datetime.datetime.utcnow()
#         start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
#         end_date = start_date + timedelta(1)
#         my_filter = {
#             "user_id": str(user_id),
#             "is_hide": False,
#             "result.detection.0": {"$exists": "true"},
#             "created_date": {"$gte": start_date, "$lt": end_date},
#         }
#         connection_count = collection.find(my_filter).count()
#         return connection_count
#     except Exception as e:
#         logging.error("Exception get_today_total_detection : {} ".format(e))
#         return []


def get_today_total_detection(user_id, camera_id, selected_model_labels):
    try:
        today = datetime.datetime.utcnow()
        start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(1)

        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": start_date, "$lt": end_date},
        }
        if not "-1" in selected_model_labels.split(",") and selected_model_labels:
            selected_labels_list = selected_model_labels.split(",")
            my_filter["result.detection.label"] = {"$in": selected_labels_list}
        if camera_id:
            my_filter["camera_id"] = {"$in": camera_id}
        my_filter["result.detection.0"] = {"$exists": "true"}
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_total_detection : {} ".format(e))
        return []


# def get_total_detection(user_id):
#     try:
#         my_filter = {
#             "user_id": str(user_id),
#             "is_hide": False,
#             "result.detection.0": {"$exists": "true"},
#         }
#         connection_count = collection.find(my_filter).count()
#         return connection_count
#     except Exception as e:
#         logging.error("Exception get_today_total_detection : {} ".format(e))
#         return []


def get_total_detection(
    user_id, camera_id, start_date, end_date, selected_model_labels
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
        }
        if not "-1" in selected_model_labels.split(",") and selected_model_labels:
            selected_labels_list = selected_model_labels.split(",")
            my_filter["result.detection.label"] = {"$in": selected_labels_list}
        if camera_id:
            my_filter["camera_id"] = {"$in": camera_id}
        if start_date and end_date:
            my_filter["created_date"] = {"$gte": start_date, "$lt": end_date}
        # else:
        #     today = datetime.datetime.utcnow()
        #     start_date = today.replace(
        #         hour=0, minute=0, second=0, microsecond=0)
        #     end_date = start_date + timedelta(1)
        #     my_filter["created_date"] = {"$gte": start_date, "$lt": end_date}
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_total_detection : {} ".format(e))
        return []


def get_supervisor_today_processed_images(user_id, camera_id):
    try:
        today = datetime.datetime.utcnow()
        start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(1)
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "created_date": {"$gte": start_date, "$lt": end_date},
        }
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_processed_images : {} ".format(e))
        return []


def get_supervisor_today_total_detection(user_id, camera_id):
    try:
        today = datetime.datetime.utcnow()
        start_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = start_date + timedelta(1)
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
            "created_date": {"$gte": start_date, "$lt": end_date},
        }
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_total_detection : {} ".format(e))
        return []


def get_supervisor_total_detection(user_id, camera_id):
    try:
        my_filter = {
            "user_id": str(user_id),
            "camera_id": str(camera_id),
            "is_hide": False,
            "result.detection.0": {"$exists": "true"},
        }
        connection_count = collection.find(my_filter).count()
        return connection_count
    except Exception as e:
        logging.error("Exception get_today_total_detection : {} ".format(e))
        return []


def filter_camera_list(locations, deployed_rtsp_jobs):
    try:
        location_list = []
        if locations:
            for location_obj in locations:
                location_list.append(location_obj.__dict__["id"])
            for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
                camera_settings_list = (
                    deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings
                )
                if camera_settings_list:
                    for camera_settings_obj in camera_settings_list:
                        location_id = camera_settings_obj.location_id
                        if location_id not in location_list:
                            camera_settings_list.remove(camera_settings_obj)
                        else:
                            pass
                else:
                    deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings = (
                        camera_settings_list
                    )
                if (
                    not deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings
                ):
                    deployed_rtsp_jobs.remove(deployed_rtsp_jobs_obj)
                else:
                    pass
        else:
            deployed_rtsp_jobs = []
        return deployed_rtsp_jobs
    except Exception as e:
        logging.error("Exception filter_camera_list : {} ".format(e))
        return []


def get_camera_id_list_by_user_id(user_id, db):
    try:
        deployed_rtsp_jobs = crud.deployed_rtsp_job.get_by_user_id(
            db=db, user_id=user_id
        )
        if not deployed_rtsp_jobs:
            return []
        camera_id_list = []
        for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
            camera_settings_list = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings
            )
            if camera_settings_list:
                for camera_settings_obj in camera_settings_list:
                    camera_id = camera_settings_obj.id
                    camera_id_list.append(camera_id)
            else:
                pass
        return camera_id_list
    except Exception as e:
        logging.error("Exception get_camera_id_list_by_user_id : {} ".format(e))
        return []


def get_camera_id_list_for_supervisor(location_list, db):
    try:
        deployment_camera_list = (
            crud.deployment_camera.get_total_enabled_cameras_by_location(
                db, location_list
            )
        )
        if not deployment_camera_list:
            logging.info("No Camera Found For User")
            return []
        camera_id = []
        for camera in deployment_camera_list:
            camera_id.append(str(camera.id))
        return camera_id
    except Exception as e:
        logging.error("Exception get_camera_id_list_for_supervisor : {} ".format(e))
        return []


def get_camera_id_list_for_admin(user_id, db):
    try:
        db_obj = crud.deployment_camera.get_admin_total_cameras(db, user_id)
        if not db_obj:
            return []
        camera_id_list = []
        for camera in db_obj:
            camera_id_list.append(str(camera.id))
        return camera_id_list
    except Exception as e:
        logging.error("Exception get_camera_id_list_for_admin : {} ".format(e))
        return []


def get_labels_list_for_supervisor(location_list, db):
    try:
        deployment_camera_list = (
            crud.deployment_camera.get_total_enabled_cameras_by_location(
                db, location_list
            )
        )
        if not deployment_camera_list:
            return []
        camera_list = []
        for camera in deployment_camera_list:
            camera_list.append(camera.id)
        db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
            db, camera_list
        )
        if not db_obj:
            return []
        new_label_list = [
            label for labels in db_obj for label in labels.__dict__["labels"].split(",")
        ]
        return list(set(new_label_list))
    except Exception as e:
        logging.error("Exception get_labels_list_for_supervisor : {} ".format(e))
        return []


def get_labels_list_for_admin(user_id, db):
    try:
        label_list = crud.camera_label_mappping_crud_obj.get_all_labels_by_user_id(
            db, user_id
        )
        if not label_list:
            raise HTTPException(status_code=404, detail="No Labels Found")
        label_list = [item for sub_list in label_list for item in sub_list]
        if not label_list:
            return []
        new_label_list = [label for labels in label_list for label in labels.split(",")]
        return list(set(new_label_list))
    except Exception as e:
        logging.error("Exception get_labels_list_for_admin : {} ".format(e))
        return []


def get_camera_coordinates(camera_id_list, db):
    try:
        camera_coordinates_response = {}
        for camera_id in camera_id_list:
            db_obj = crud.camera_roi_crud_obj.get_by_camera__id(db, camera_id)
            camera_coordinates_obj = {}
            if db_obj:
                coordinates = ""
                for coordinates_list_obj in db_obj:
                    if coordinates_list_obj.coordinates:
                        if not coordinates:
                            coordinates = coordinates_list_obj.coordinates
                        else:
                            coordinates = (
                                coordinates + "," + coordinates_list_obj.coordinates
                            )
                    camera_coordinates_obj["coordinates"] = eval(coordinates)
                    camera_coordinates_obj["roi_type"] = (
                        coordinates_list_obj.camera_settings.roi_type
                    )
            if camera_coordinates_obj:
                camera_coordinates = {camera_id: camera_coordinates_obj}
                camera_coordinates_response.update(camera_coordinates)
        return camera_coordinates_response
    except Exception as e:
        logging.error("Exception get_camera_coordinates : {} ".format(e))
        return []


def get_infer_response(model_data, image_key):
    try:
        model_key = model_data.model_s3_data.model_s3_key
        url = settings.MODEL_TEST_API_URL
        payload = {
            "_model_key": model_key,
            "_img_key": image_key,
        }
        headers = {"Content-Type": "application/json"}
        response = requests.request(
            "POST", url, headers=headers, data=json.dumps(payload)
        )
        return response
    except Exception as e:
        logging.error("Exception get_infer_response : {} ".format(e))
        return []


def get_model_list_for_graph(deployed_rtsp_jobs):
    try:
        model_list = []
        if deployed_rtsp_jobs:
            for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
                model_json = {}
                model_id = (
                    deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.id
                )
                if model_id == 12 or model_id == 13:
                    model_json["name"] = (
                        deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_name
                    )
                    model_json["labels_list"] = (
                        deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
                    )
                    model_list.append(model_json)
        return model_list
    except Exception as e:
        logging.error("Exception get_model_list_for_graph : {} ".format(e))
        return []


def get_datetime_slot(user_datetime):
    try:
        morning_start_datetime = user_datetime
        time_difference = datetime.timedelta(hours=3)
        morning_end_datetime = datetime.datetime.strptime(
            (morning_start_datetime + time_difference).strftime("%Y-%m-%d %H:%M:%S"),
            "%Y-%m-%d %H:%M:%S",
        )
        noon_end_time = datetime.datetime.strptime(
            (morning_end_datetime + time_difference).strftime("%Y-%m-%d %H:%M:%S"),
            "%Y-%m-%d %H:%M:%S",
        )
        evening_end_time = datetime.datetime.strptime(
            (noon_end_time + time_difference).strftime("%Y-%m-%d %H:%M:%S"),
            "%Y-%m-%d %H:%M:%S",
        )
        time_difference = datetime.timedelta(hours=1)
        night_end_time = datetime.datetime.strptime(
            (evening_end_time + time_difference).strftime("%Y-%m-%d %H:%M:%S"),
            "%Y-%m-%d %H:%M:%S",
        )
        datetime_slot_list = [
            [morning_start_datetime, morning_end_datetime],
            [morning_end_datetime, noon_end_time],
            [noon_end_time, evening_end_time],
            [evening_end_time, night_end_time],
        ]
        return datetime_slot_list
    except Exception as e:
        logging.error("Exception get_datetime_slot : {} ".format(e))
        return []


def get_graph_with_rate_data(model_list, user_id, datetime_slot_list):
    try:
        graph_result_list = []
        if model_list and datetime_slot_list:
            created_date = datetime_slot_list[0][0]
            for model in model_list:
                model_name = model["name"]
                if model_name == "Chair occupancy detection(inhouse)":
                    chair_model_json = {"model_name": model["name"]}
                    chair_model_json["model_pie_data"] = get_pie_chart_rate_info(
                        user_id, model["labels_list"].split(","), created_date
                    )
                    chair_graph_list = []
                    for index in datetime_slot_list:
                        start_datetime = index[0]
                        end_datetime = index[1]
                        chair_graph_json = get_graph_info(
                            user_id,
                            model["labels_list"].split(","),
                            start_datetime,
                            end_datetime,
                        )
                        if chair_graph_json:
                            chair_graph_json.update(
                                {
                                    "time_slot": str(start_datetime.hour)
                                    + "-"
                                    + str(end_datetime.hour)
                                }
                            )
                            chair_graph_list.append(chair_graph_json)
                    chair_model_json.update({"model_graph_data": chair_graph_list})
                    graph_result_list.append(chair_model_json)
                elif model_name == "Table cleanliness detection":
                    table_model_json = {}
                    table_model_json["model_name"] = model["name"]
                    table_model_json["model_pie_data"] = get_pie_chart_rate_info(
                        user_id, model["labels_list"].split(","), created_date
                    )
                    table_graph_list = []
                    for row in datetime_slot_list:
                        start_datetime = row[0]
                        end_datetime = row[1]
                        table_graph_json = get_graph_info(
                            user_id,
                            model["labels_list"].split(","),
                            start_datetime,
                            end_datetime,
                        )
                        if table_graph_json:
                            table_graph_json.update(
                                {
                                    "time_slot": str(start_datetime.hour)
                                    + "-"
                                    + str(end_datetime.hour)
                                }
                            )
                            table_graph_list.append(table_graph_json)
                    table_model_json.update({"model_graph_data": table_graph_list})
                    graph_result_list.append(table_model_json)
        return graph_result_list
    except Exception as e:
        logging.error("Exception get_graph_with_rate_data : {} ".format(e))
        return []


def get_graph_info(user_id, label_list, start_datetime, end_datetime):
    try:
        label_count_json = {}
        if label_list:
            total_records = 0
            start_date = start_datetime.replace(microsecond=0)
            end_date = end_datetime.replace(microsecond=0)
            for label in label_list:
                my_filter = {
                    "user_id": str(user_id),
                    "is_hide": False,
                    "result.detection.0": {"$exists": "true"},
                    "created_date": {"$gte": start_date, "$lte": end_date},
                    "counts." + label: {"$exists": "true"},
                }
                if total_records == 0:
                    total_records = collection.count_documents(my_filter)
                else:
                    total_records = total_records + collection.count_documents(
                        my_filter
                    )
            if total_records == 0:
                pass
            else:
                for label in label_list:
                    my_filter = {
                        "user_id": str(user_id),
                        "is_hide": False,
                        "result.detection.0": {"$exists": "true"},
                        "created_date": {"$gte": start_date, "$lte": end_date},
                        "counts." + label: {"$exists": "true"},
                    }
                    label_count_json[label] = round(
                        100 * collection.count_documents(my_filter) / total_records
                    )
        return label_count_json
    except Exception as e:
        logging.error("Exception get_graph_info : {} ".format(e))
        return {}


def get_pie_chart_rate_info(user_id, label_list, created_date):
    try:
        label_count_json = {}
        # testing datetime
        # start_date_str = "2021-04-03 00:00:00"
        # end_date_str = "2021-04-03 23:59:00"
        # start_date = datetime.datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
        # end_date = datetime.datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')
        start_date = created_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = created_date.replace(hour=23, minute=59, second=0, microsecond=0)
        if label_list:
            total_records = 0
            for label in label_list:
                my_filter = {
                    "user_id": str(user_id),
                    "is_hide": False,
                    "result.detection.0": {"$exists": "true"},
                    "created_date": {"$gte": start_date, "$lte": end_date},
                    "counts." + label: {"$exists": "true"},
                }
                if total_records == 0:
                    total_records = collection.count_documents(my_filter)
                else:
                    total_records = total_records + collection.count_documents(
                        my_filter
                    )
            if total_records == 0:
                pass
            else:
                for label in label_list:
                    my_filter = {
                        "user_id": str(user_id),
                        "is_hide": False,
                        "result.detection.0": {"$exists": "true"},
                        "created_date": {"$gte": start_date, "$lte": end_date},
                        "counts." + label: {"$exists": "true"},
                    }
                    label_count_json[label] = round(
                        100 * collection.count_documents(my_filter) / total_records
                    )
        return label_count_json
    except Exception as e:
        logging.error("Exception get_pie_chart_rate_info : {} ".format(e))
        return {}


def add_updated_result_in_mongo_database(data_id, request_data, count_data):
    try:
        query = {"_id": ObjectId(data_id)}
        new_values = {"$set": {"result": request_data, "counts": count_data}}
        data = collection.update(query, new_values, upsert=True)
        return True
    except Exception as e:
        logging.error("Exception add_annotation_in_mongo_database : {} ".format(e))
        return []


def remove_result_in_mongo_database(data_id):
    try:
        data = collection.remove({"_id": ObjectId(data_id)})
        return True
    except Exception as e:
        logging.error("Exception add_annotation_in_mongo_database : {} ".format(e))
        return []


def get_result_popup_data(user_id, start_date, end_date, label_list):
    try:
        match_1 = {
            "$match": {
                "user_id": str(user_id),
                "$or": [
                    {f"counts.{label_str}": {"$exists": True}}
                    for label_str in label_list
                ],
                "created_date": {"$gte": start_date, "$lte": end_date},
                "is_hide": False,
            }
        }
        unwind = {"$unwind": {"path": "$result.detection"}}
        match_2 = {"$match": {"result.detection.label": {"$in": label_list}}}
        sort = {"$sort": {"created_date": 1}}
        group = {
            "$group": {
                "_id": "$image_url",
                "camera_id": {"$first": "$camera_id"},
                "image_name": {"$first": "$image_name"},
                "image_url": {"$first": "$image_url"},
                "result": {"$push": "$result.detection"},
                "created_date": {"$first": "$created_date"},
                "updated_date": {"$first": "$updated_date"},
            }
        }
        return dumps(collection.aggregate([match_1, unwind, match_2, sort, group]))
    except Exception as e:
        logging.error("Exception add_annotation_in_mongo_database : {} ".format(e))
        return []


def get_mongo_data_for_send_notification(meta_data, last_id):
    try:
        query = [
            {
                "$match": {
                    "result.detection.0": {"$exists": True},
                    "_id": {"$gt": ObjectId(last_id)},
                }
            },
            {"$unwind": "$result.detection"},
            {"$match": {"result.detection.label": {"$in": meta_data["label_list"]}}},
            {
                "$group": {
                    "_id": {
                        "image_url": "$image_url",
                        "label": "$result.detection.label",
                    },
                    "result": {"$push": "$result.detection"},
                    "created_date": {"$first": "$created_date"},
                    "count": {"$sum": 1},
                    "camera_id": {"$first": "$camera_id"},
                    "image_name": {"$first": "$image_name"},
                    "id": {"$last": "$_id"},
                }
            },
            {"$sort": {"created_date": 1}},
        ]
        return json.loads(dumps(collection.aggregate(query)))
        # my_filter = {
        #     "user_id": str(meta_data["user_id"]),
        #     "is_hide": False,
        #     "result.detection.0": {"$exists": True},
        # }
        # if meta_data.get("camera_id_list"):
        #     my_filter["camera_id"] = {"$in": meta_data["camera_id_list"]}
        # if meta_data.get("label_list"):
        #     my_filter["$or"] = []
        #     for label in meta_data["label_list"]:
        #         my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        # return json.loads(dumps(collection.find(my_filter).sort("_id", -1).limit(1)))
    except Exception as e:
        logging.error("Exception get_mongo_data_for_send_notification : {} ".format(e))
        return []


def get_one_data_for_send_notification(meta_data):
    try:
        my_filter = {
            "user_id": str(meta_data["user_id"]),
            "is_hide": False,
            "result.detection.0": {"$exists": True},
        }
        if meta_data.get("camera_id_list"):
            my_filter["camera_id"] = {"$in": meta_data["camera_id_list"]}
        if meta_data.get("label_list"):
            my_filter["$or"] = []
            for label in meta_data["label_list"]:
                my_filter["$or"].append({"counts.{}".format(label): {"$exists": True}})
        return json.loads(dumps(collection.find_one(my_filter, sort=[("_id", -1)])))
    except Exception as e:
        logging.error("Exception get_one_data_for_send_notification : {} ".format(e))
        return []
