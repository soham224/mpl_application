import pymongo
from bson.json_util import dumps
import math
from core.config import settings
from bson.objectid import ObjectId
from datetime import datetime
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("event_utils")

mongo_client = pymongo.MongoClient(
    host=settings.MONGO_HOST,
    port=int(settings.MONGO_PORT),
    username=settings.MONGO_USER,
    password=settings.MONGO_PASS,
    authSource=settings.MONGO_AUTH_DB_NAME,
)

db = mongo_client[settings.MONGO_DB]
collection = db["events"]
PAGE_SIZE = 10


def add_event_in_mongo_db(
    company_id,
    user_id,
    camera_id,
    event_name,
    event_desc,
    event_type,
    event_date,
    created_date,
    updated_date,
    status,
    is_hide,
    image_list,
):
    try:
        data_dict = {
            "company_id": company_id,
            "user_id": user_id,
            "camera_id": camera_id,
            "event_name": event_name,
            "event_desc": event_desc,
            "event_type": event_type,
            "event_date": event_date,
            "created_date": datetime.utcnow(),
            "updated_date": datetime.utcnow(),
            "status": status,
            "is_hide": is_hide,
            "counts": {event_type: 1},
            "image_list": image_list,
        }
        data = collection.insert_one(data_dict)
        if data:
            return True
        else:
            return False
    except Exception as e:
        logging.error("Exception add_event_in_mongo_db : {} ".format(e))
        return []


def get_event_initial_info(
    user_id, camera_id_list, event_type_list, start_date, end_date
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
        }
        if camera_id_list:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if event_type_list:
            my_filter["event_type"] = {"$in": event_type_list}
        if start_date and end_date:
            my_filter["event_date"] = {"$gte": start_date, "$lte": end_date}
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error("Exception get_event_initial_info : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_paginated_event(
    user_id, camera_id_list, page_number, event_type_list, start_date, end_date
):
    try:
        my_filter = {
            "user_id": str(user_id),
            "is_hide": False,
        }
        if camera_id_list:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if event_type_list:
            my_filter["event_type"] = {"$in": event_type_list}
        if start_date and end_date:
            my_filter["event_date"] = {"$gte": start_date, "$lte": end_date}

        skip_number = PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter)
            .sort("created_date", -1)
            .skip(skip_number)
            .limit(PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_paginated_event : {} ".format(e))
        return []


def get_event_datetime_initial_info_result_manager(
    user_id,
    camera_id_list,
    event_type_list,
    start_date,
    end_date,
    isHide,
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
                "is_hide": isHide,
            }
        if camera_id_list or isLocationSelected:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if event_type_list:
            my_filter["event_type"] = {"$in": event_type_list}
        if start_date and end_date:
            my_filter["event_date"] = {"$gte": start_date, "$lte": end_date}
        total_records = collection.count_documents(my_filter)

        if total_records > 0:
            total_pages = math.ceil(total_records / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}
    except Exception as e:
        logging.error(
            "Exception get_event_datetime_initial_info_result_manager : {} ".format(e)
        )
        return {"page_size": PAGE_SIZE, "total_pages": 0}


def get_event_paginated_result_manager(
    user_id,
    camera_id_list,
    page_number,
    event_type_list,
    start_date,
    end_date,
    isHide,
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
                "is_hide": isHide,
            }
        if camera_id_list or isLocationSelected:
            my_filter["camera_id"] = {"$in": camera_id_list}
        if event_type_list:
            my_filter["event_type"] = {"$in": event_type_list}
        if start_date and end_date:
            my_filter["event_date"] = {"$gte": start_date, "$lte": end_date}

        skip_number = PAGE_SIZE * (page_number - 1)
        connection_cursor = (
            collection.find(my_filter)
            .sort("created_date", -1)
            .skip(skip_number)
            .limit(PAGE_SIZE)
        )
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_event_paginated_result_manager : {} ".format(e))
        return []


def get_events_type_list_by_user_id(user_id):
    try:
        connection_cursor = collection.distinct("event_type", {"user_id": str(user_id)})
        data_list = list(connection_cursor)
        return data_list
    except Exception as e:
        logging.error("Exception get_events_type_list_by_user_id : {} ".format(e))
        return []


def get_events_type_list_by_user_camera_id(user_id, camera_id_list):
    try:
        connection_cursor = collection.distinct(
            "event_type",
            {"user_id": str(user_id), "camera_id": {"$in": camera_id_list}},
        )
        data_list = list(connection_cursor)
        return data_list
    except Exception as e:
        logging.error(
            "Exception get_events_type_list_by_user_camera_id : {} ".format(e)
        )
        return []


def update_event_status(oid, status_val):
    try:
        my_filter = {"_id": ObjectId(oid)}
        new_val = {"$set": {"is_hide": status_val}}
        collection.update_one(my_filter, new_val)
        return True
    except Exception as e:
        logging.error("Exception update_event_status : {} ".format(e))
        return False


def get_supervisor_filter_event_mongo_data(
    user_id, camera_id, start_date, end_date, event_type_list, duration_type, *args
):
    try:
        my_filter = {"user_id": str(user_id), "is_hide": False}
        if camera_id:
            my_filter["camera_id"] = {"$in": camera_id}
        if start_date and end_date:
            my_filter["event_date"] = {"$gte": start_date, "$lte": end_date}
        if args:
            final_filter = get_initial_final_event_mongo_filter(
                duration_type, my_filter, event_type_list
            )
            connection_cursor = collection.aggregate(final_filter)
            data = list(connection_cursor)
            if data:
                data[0]["_id"] = str(args[1]).split(" ")[0]
                return data
            else:
                return []
        else:
            final_filter = get_final_event_mongo_filter(
                duration_type, my_filter, event_type_list
            )
            connection_cursor = collection.aggregate(final_filter)
            data = list(connection_cursor)
            return data
    except Exception as e:
        logging.error("Exception get_supervisor_filter_mongo_data : {} ".format(e))
        return []


def get_initial_final_event_mongo_filter(duration_type, my_filter, event_type_list):
    try:
        selected_event_type_list = event_type_list.split(",")
        group_obj = {}
        hour_group_obj = {}
        project_obj = {
            "_id": {"$toString": "$_id"},
            "time": {
                "$concat": [
                    {"$toString": {"$hour": "$event_date"}},
                    ":",
                    {"$toString": {"$minute": "$event_date"}},
                    ":",
                    {"$toString": {"$second": "$event_date"}},
                ]
            },
        }
        for events in selected_event_type_list:
            label_json = {}
            hour_label_json = {}
            project_obj[events] = "$counts." + events
            label_json[events] = {"$sum": "$counts." + events}
            hour_label_json[events] = {"$first": "$" + events}
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
        logging.error("Exception get_initial_final_event_mongo_filter : {} ".format(e))
        return []


def get_final_event_mongo_filter(duration_type, my_filter, event_type_list):
    try:
        selected_event_type_list = event_type_list.split(",")
        group_obj = {}
        hour_group_obj = {}
        project_obj = {
            "_id": {"$toString": "$_id"},
            "time": {
                "$concat": [
                    {"$toString": {"$hour": "$event_date"}},
                    ":",
                    {"$toString": {"$minute": "$event_date"}},
                    ":",
                    {"$toString": {"$second": "$event_date"}},
                ]
            },
        }
        for events in selected_event_type_list:
            label_json = {}
            hour_label_json = {}
            project_obj[events] = "$counts." + events
            label_json[events] = {"$sum": "$counts." + events}
            hour_label_json[events] = {"$first": "$" + events}
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
                                "date": "$event_date",
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
                                "date": "$event_date",
                            }
                        },
                    }
                },
                {"$group": group_obj},
                {"$sort": {"_id": 1}},
            ]
        if duration_type == "hour":
            hour_group_obj["_id"] = "$time"
            hour_group_obj["id"] = {"$first": "$_id"}
            if selected_event_type_list:
                for events in selected_event_type_list:
                    my_filter["counts." + events] = {"$exists": "true"}
            final_filter = [
                {"$match": my_filter},
                {"$project": project_obj},
                {"$group": hour_group_obj},
                {"$sort": {"_id": 1}},
            ]
        return final_filter
    except Exception as e:
        logging.error("Exception get_final_event_mongo_filter : {} ".format(e))
        return []


def get_event_data_of_last_graph_step(data_id):
    try:
        connection_cursor = collection.find({"_id": ObjectId(data_id)})
        data = dumps(connection_cursor)
        return data
    except Exception as e:
        logging.error("Exception get_event_data_of_last_graph_step : {} ".format(e))
        return []
