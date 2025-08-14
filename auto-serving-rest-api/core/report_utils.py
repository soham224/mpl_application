from datetime import timedelta
import pymongo
import json
import math
from datetime import datetime
from core.config import settings
from bson.json_util import dumps
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("report_utils")

mongo_client = pymongo.MongoClient(
    host=settings.MONGO_HOST,
    port=int(settings.MONGO_PORT),
    username=settings.MONGO_USER,
    password=settings.MONGO_PASS,
    authSource=settings.MONGO_AUTH_DB_NAME,
)

db = mongo_client[settings.MONGO_DB]
collection = db[settings.MONGO_COLL_NAME]
PAGE_SIZE = 6


def get_ISO_from_date_and_time(date, hour, minute):
    return datetime(
        int(str(date).split(" ")[0].split("-")[0]),
        int(str(date).split(" ")[0].split("-")[1]),
        int(str(date).split(" ")[0].split("-")[2]),
        hour,
        minute,
    )


def getUtcRangeForDay(start_hour):
    if start_hour + 6 > 24:
        next_hour = 24 - start_hour
        start_hour = 6 - next_hour
        return start_hour
    return start_hour + 6


def get_violation_report_by_date_utils(
    utcStartDate,
    utcEndDate,
    start_time,
    end_time,
    start_min,
    end_min,
    day_start,
    labels,
    camera_id_list,
    user_id,
):
    try:
        start_date = utcStartDate.replace(
            hour=day_start, minute=0, second=0, microsecond=0
        )
        end_date = utcEndDate.replace(hour=day_start, minute=0, second=0, microsecond=0)
        yesterday = start_date - timedelta(days=1)
        yesterday_end_date = end_date - timedelta(days=1)

        yesterDayUtcStartDate = get_ISO_from_date_and_time(
            yesterday, start_time, start_min
        )
        yesterDayUtcEndDate = get_ISO_from_date_and_time(
            yesterday_end_date, end_time, end_min
        )
        enter_date_list_from_query = get_filter_data_from_mongo_query(
            utcStartDate,
            utcEndDate,
            labels,
            camera_id_list,
            user_id,
        )
        yesterday_date_list_from_query = get_filter_data_from_mongo_query(
            yesterDayUtcStartDate,
            yesterDayUtcEndDate,
            labels,
            camera_id_list,
            user_id,
        )
        final_response_dict = {}
        final_yesterday_response_dict = {}
        if enter_date_list_from_query:
            final_response_dict.update(enter_date_list_from_query[0])
        if yesterday_date_list_from_query:
            final_yesterday_response_dict.update(yesterday_date_list_from_query[0])
        time_slot_dict = get_time_slot_range_from_time(
            start_date,
            end_date,
            start_time,
            end_time,
            day_start,
            labels,
            camera_id_list,
            user_id,
        )
        get_min_max_violation_label_dict = get_min_max_violation_label(
            final_response_dict, labels
        )
        if get_min_max_violation_label_dict:
            final_response_dict.update(get_min_max_violation_label_dict)

        get_min_max_violation_time_dict = get_min_max_violation_time(
            final_response_dict, time_slot_dict
        )
        final_response_dict.update(get_min_max_violation_time_dict)

        get_yesterday_compare_date_dict = get_yesterday_compare_date(
            final_response_dict, final_yesterday_response_dict, labels
        )
        if get_yesterday_compare_date_dict:
            final_response_dict.update(get_yesterday_compare_date_dict)

        return final_response_dict
    except Exception as e:
        logging.error("Exception get_violation_report_by_date_utils : {} ".format(e))
        return {}


def get_filter_data_from_mongo_query(
    utcStartDate, utcEndDate, violation_label_list, camera_id_list, user_id
):
    try:
        pipeline = []
        project = {
            "$project": {
                "_id": 1,
                "created_date": 1,
                "counts": 1,
                "result": 1,
                "user_id": 1,
                "is_hide": 1,
                "year": {"$year": "$created_date"},
                "month": {"$month": "$created_date"},
                "day": {"$dayOfMonth": "$created_date"},
                "hour": {"$hour": "$created_date"},
                "minutes": {"$minute": "$created_date"},
                "seconds": {"$second": "$created_date"},
                "epoch": {"$floor": {"$divide": [{"$toLong": "$created_date"}, 1000]}},
            }
        }
        pipeline.append(project)
        my_filter = {
            "$match": {
                "$and": [
                    {"is_hide": False},
                    {"result.detection.0": {"$exists": True}},
                    {"camera_id": {"$in": camera_id_list}},
                    {"created_date": {"$gte": utcStartDate, "$lt": utcEndDate}},
                    {"user_id": str(user_id)},
                ]
            }
        }
        pipeline.append(my_filter)
        group_time_filter = {
            "$group": {
                "_id": {"_id": "_id"},
            }
        }

        project_time_filter = {"$project": {}}
        label_list = []
        project_time_filter["$project"]["_id"] = 1
        for label in violation_label_list:
            group_time_filter["$group"][label] = {"$sum": "$counts." + label}
            label_list.append("${}".format(label))
            project_time_filter["$project"][label] = 1
        project_time_filter["$project"]["count"] = {"$add": label_list}
        project_time_filter["$project"]["max"] = {"$max": label_list}
        project_time_filter["$project"]["min"] = {"$min": label_list}

        pipeline.append(group_time_filter)
        pipeline.append(project_time_filter)
        data = list(collection.aggregate(pipeline))
        return data
    except Exception as e:
        logging.error("Exception get_filter_data_from_mongo_query : {} ".format(e))
        return {}


def get_time_slot_range_from_time(
    start_date,
    end_date,
    start_time,
    end_time,
    day_start,
    violation_label_list,
    camera_id_list,
    user_id,
):
    try:
        night_start_datetime = day_start
        night_end_datetime = getUtcRangeForDay(night_start_datetime)
        morning_end_time = getUtcRangeForDay(night_end_datetime)
        noon_end_time = getUtcRangeForDay(morning_end_time)
        evening_end_time = getUtcRangeForDay(noon_end_time)
        if start_time in range(
            night_start_datetime, night_end_datetime + 1
        ) and end_time in range(noon_end_time + 1, evening_end_time + 1):
            time_slot_dict = {"Night": [], "Morning": [], "Noon": [], "Evening": []}
        else:
            time_list = []
            if "Night" not in time_list:
                if start_time in range(
                    night_start_datetime, night_end_datetime + 1
                ) or end_time in range(night_start_datetime, night_end_datetime + 1):
                    time_list.append("Night")
            if "Morning" not in time_list:
                if morning_end_time < night_end_datetime:
                    if start_time in range(
                        0, morning_end_time + 1
                    ) or end_time in range(0, morning_end_time + 1):
                        time_list.append("Morning")
                else:
                    if start_time in range(
                        night_end_datetime + 1, morning_end_time + 1
                    ) or end_time in range(
                        night_end_datetime + 1, morning_end_time + 1
                    ):
                        time_list.append("Morning")
            if "Noon" not in time_list:
                if noon_end_time < morning_end_time:
                    if start_time in range(0, noon_end_time + 1) or end_time in range(
                        0, noon_end_time + 1
                    ):
                        time_list.append("Noon")
                else:
                    if start_time in range(
                        morning_end_time + 1, noon_end_time + 1
                    ) or end_time in range(morning_end_time + 1, noon_end_time + 1):
                        time_list.append("Noon")
            if "Evening" not in time_list:
                if evening_end_time < noon_end_time:
                    if start_time in range(
                        0, evening_end_time + 1
                    ) or end_time in range(0, evening_end_time + 1):
                        time_list.append("Evening")
                else:
                    if start_time in range(
                        noon_end_time + 1, evening_end_time + 1
                    ) or end_time in range(noon_end_time + 1, evening_end_time + 1):
                        time_list.append("Evening")

            time_slot_dict = {}
            for temp in time_list:
                time_slot_dict[temp] = []
        for temp in time_slot_dict:
            if temp == "Night":
                if night_end_datetime == 24:
                    night_end_datetime = 0
                if night_start_datetime == 24:
                    night_start_datetime = 0
                night_start_epoch = get_ISO_from_date_and_time(
                    start_date, night_start_datetime, 0
                )
                night_end_epoch = get_ISO_from_date_and_time(
                    end_date, night_end_datetime, 0
                )
                time_slot_data_from_query = get_filter_data_from_mongo_query(
                    night_start_epoch,
                    night_end_epoch,
                    violation_label_list,
                    camera_id_list,
                    user_id,
                )
                time_slot_dict["Night"] = time_slot_data_from_query
            elif temp == "Morning":
                if night_end_datetime == 24:
                    night_end_datetime = 0
                if morning_end_time == 24:
                    morning_end_time = 0
                morning_start_epoch = get_ISO_from_date_and_time(
                    end_date, night_end_datetime, 0
                )
                morning_end_epoch = get_ISO_from_date_and_time(
                    end_date, morning_end_time, 0
                )
                time_slot_data_from_query = get_filter_data_from_mongo_query(
                    morning_start_epoch,
                    morning_end_epoch,
                    violation_label_list,
                    camera_id_list,
                    user_id,
                )
                time_slot_dict["Morning"] = time_slot_data_from_query
            elif temp == "Noon":
                if morning_end_time == 24:
                    morning_end_time = 0
                if noon_end_time == 24:
                    noon_end_time = 0
                noon_start_epoch = get_ISO_from_date_and_time(
                    end_date, morning_end_time, 0
                )
                noon_end_epoch = get_ISO_from_date_and_time(end_date, noon_end_time, 0)
                time_slot_data_from_query = get_filter_data_from_mongo_query(
                    noon_start_epoch,
                    noon_end_epoch,
                    violation_label_list,
                    camera_id_list,
                    user_id,
                )
                time_slot_dict["Noon"] = time_slot_data_from_query
            elif temp == "Evening":
                if noon_end_time == 24:
                    noon_end_time = 0
                if evening_end_time == 24:
                    evening_end_time = 0
                evening_start_epoch = get_ISO_from_date_and_time(
                    end_date, noon_end_time, 0
                )
                evening_end_epoch = get_ISO_from_date_and_time(
                    end_date, evening_end_time, 0
                )
                time_slot_data_from_query = get_filter_data_from_mongo_query(
                    evening_start_epoch,
                    evening_end_epoch,
                    violation_label_list,
                    camera_id_list,
                    user_id,
                )
                time_slot_dict["Evening"] = time_slot_data_from_query
        return time_slot_dict
    except Exception as e:
        logging.error("Exception get_time_slot_range_from_time : {} ".format(e))
        return {}


def get_min_max_violation_time(final_response_dict, time_slot_dict):
    try:
        max_key = ""
        min_key = ""
        if final_response_dict:
            time_count_dict = {}
            for temp in time_slot_dict:
                if time_slot_dict[temp]:
                    if time_slot_dict[temp][0]["count"]:
                        time_count_dict[temp] = time_slot_dict[temp][0]["count"]
                else:
                    time_count_dict[temp] = 0
            if max(time_count_dict, key=time_count_dict.get):
                max_key = max(time_count_dict, key=time_count_dict.get)
            if min(time_count_dict, key=time_count_dict.get):
                min_key = min(time_count_dict, key=time_count_dict.get)
        if max_key:
            final_response_dict["Most violation occur in "] = max_key
        if min_key:
            final_response_dict["Least violation occur in "] = min_key
        return final_response_dict
    except Exception as e:
        logging.error("Exception get_min_max_violation_time : {} ".format(e))
        return {}


def get_min_max_violation_label(final_response_dict, violation_label_list):
    try:
        if final_response_dict:
            max_value = final_response_dict["max"]
            min_value = final_response_dict["min"]
            if (max_value or max_value == 0) and (min_value or min_value == 0):
                for temp in final_response_dict.copy():
                    if (
                        final_response_dict[temp] == max_value
                        and temp in violation_label_list
                    ):
                        final_response_dict["Most Violations done by "] = temp
                    if (
                        final_response_dict[temp] == min_value
                        and temp in violation_label_list
                    ):
                        final_response_dict["Least Violations done by "] = temp
                final_response_dict.pop("_id")
                final_response_dict.pop("max")
                final_response_dict.pop("min")
        return final_response_dict
    except Exception as e:
        logging.error("Exception get_min_max_violation_label : {} ".format(e))
        return {}


def get_yesterday_compare_date(
    final_response_dict, final_yesterday_response_dict, violation_label_list
):
    try:
        if final_yesterday_response_dict:
            for key in final_response_dict.copy():
                if key in final_yesterday_response_dict and key in violation_label_list:
                    if final_response_dict[key] > final_yesterday_response_dict[key]:
                        if final_response_dict[key] == 0:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is increased from yesterday by"
                            ] = (
                                str(int((1 / final_yesterday_response_dict[key]) * 100))
                                + "%"
                            )
                        elif final_yesterday_response_dict[key] == 0:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is increased from yesterday by"
                            ] = (str(int((1 / final_response_dict[key]) * 100)) + "%")
                        else:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is increased from yesterday by"
                            ] = (
                                str(
                                    int(
                                        (
                                            final_yesterday_response_dict[key]
                                            / final_response_dict[key]
                                        )
                                        * 100
                                    )
                                )
                                + "%"
                            )
                    elif final_response_dict[key] == final_yesterday_response_dict[key]:
                        final_response_dict[
                            "compliance of " + key + " is same as yesterday"
                        ] = (str(int(final_yesterday_response_dict[key])) + "%")
                    else:
                        if final_yesterday_response_dict[key] == 0:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is decreased from yesterday by"
                            ] = (str(int((1 / final_response_dict[key]) * 100)) + "%")
                        elif final_response_dict[key] == 0:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is decreased from yesterday by"
                            ] = (
                                str(int((1 / final_yesterday_response_dict[key]) * 100))
                                + "%"
                            )
                        else:
                            final_response_dict[
                                "compliance of "
                                + key
                                + " is decreased from yesterday by"
                            ] = (
                                str(
                                    int(
                                        (
                                            final_response_dict[key]
                                            / final_yesterday_response_dict[key]
                                        )
                                        * 100
                                    )
                                )
                                + "%"
                            )
        else:
            for key in final_response_dict.copy():
                if key in violation_label_list:
                    if final_response_dict[key] == 0:
                        final_response_dict[
                            "compliance of " + key + " is same as yesterday"
                        ] = (str(int(final_response_dict[key])) + "%")
                    else:
                        final_response_dict[
                            "compliance of " + key + " is increased from yesterday by"
                        ] = (str(int((1 / final_response_dict[key]) * 100)) + "%")
        return final_response_dict
    except Exception as e:
        logging.error("Exception get_yesterday_compare_date : {} ".format(e))
        return {}


def get_violation_by_aggregate_time_from_mongo(
    utcStartDate,
    utcEndDate,
    labels,
    camera_id_list,
    aggregate_time,
    page_number,
    user_id,
):
    try:
        skip_number = PAGE_SIZE * (page_number - 1)
        my_list = []
        for label in labels:
            my_list.append({"lables.k": label})

        pipeline = [
            {
                "$project": {
                    "_id": 1,
                    "created_date": 1,
                    "counts": 1,
                    "result": 1,
                    "image_url": 1,
                    "camera_id": 1,
                    "user_id": 1,
                    "is_hide": 1,
                    "lables": {"$objectToArray": "$counts"},
                    "year": {"$year": "$created_date"},
                    "month": {"$month": "$created_date"},
                    "day": {"$dayOfMonth": "$created_date"},
                    "hour": {"$hour": "$created_date"},
                    "minutes": {"$minute": "$created_date"},
                    "seconds": {"$second": "$created_date"},
                    "epoch": {
                        "$floor": {"$divide": [{"$toLong": "$created_date"}, 1000]}
                    },
                }
            },
            {"$unwind": "$lables"},
            {
                "$match": {
                    "$and": [
                        {"is_hide": False},
                        {"result.detection.0": {"$exists": True}},
                        {"$or": my_list},
                        {"camera_id": {"$in": camera_id_list}},
                        {"created_date": {"$gte": utcStartDate, "$lt": utcEndDate}},
                        {"user_id": str(user_id)},
                    ]
                }
            },
            {
                "$group": {
                    "_id": {
                        "label": "$lables.k",
                        "hour": {"$hour": "$created_date"},
                        "interval": {
                            "$subtract": [
                                {"$minute": "$created_date"},
                                {
                                    "$mod": [
                                        {"$minute": "$created_date"},
                                        aggregate_time,
                                    ]
                                },
                            ]
                        },
                    },
                    "data": {"$first": "$$ROOT"},
                }
            },
            {"$sort": {"_id.hour": 1, "_id.interval": 1}},
            {"$replaceRoot": {"newRoot": "$data"}},
            {"$project": {"lables": 0}},
            {"$group": {"_id": "$_id", "data": {"$first": "$$ROOT"}}},
            {"$replaceRoot": {"newRoot": "$data"}},
            {"$sort": {"created_date": -1}},
            {"$skip": skip_number},
            {"$limit": PAGE_SIZE},
        ]
        connection_cursor = collection.aggregate(pipeline)
        data = json.loads(dumps(connection_cursor))
        return data
    except Exception as e:
        logging.error(
            "Exception get_violation_by_aggregate_time_from_mongo : {} ".format(e)
        )
        return {}


def get_initial_info_for_violation_report(
    utcStartDate,
    utcEndDate,
    labels,
    camera_id_list,
    aggregate_time,
    user_id,
):
    try:
        my_list = []
        for label in labels:
            my_list.append({"lables.k": label})

        connection_cursor = collection.aggregate(
            [
                {
                    "$project": {
                        "_id": 1,
                        "created_date": 1,
                        "counts": 1,
                        "result": 1,
                        "image_url": 1,
                        "camera_id": 1,
                        "user_id": 1,
                        "is_hide": 1,
                        "lables": {"$objectToArray": "$counts"},
                        "year": {"$year": "$created_date"},
                        "month": {"$month": "$created_date"},
                        "day": {"$dayOfMonth": "$created_date"},
                        "hour": {"$hour": "$created_date"},
                        "minutes": {"$minute": "$created_date"},
                        "seconds": {"$second": "$created_date"},
                        "epoch": {
                            "$floor": {"$divide": [{"$toLong": "$created_date"}, 1000]}
                        },
                    }
                },
                {"$unwind": "$lables"},
                {
                    "$match": {
                        "$and": [
                            {"is_hide": False},
                            {"result.detection.0": {"$exists": True}},
                            {"$or": my_list},
                            {"camera_id": {"$in": camera_id_list}},
                            {"created_date": {"$gte": utcStartDate, "$lt": utcEndDate}},
                            {"user_id": str(user_id)},
                        ]
                    }
                },
                {
                    "$group": {
                        "_id": {
                            "label": "$lables.k",
                            "hour": {"$hour": "$created_date"},
                            "interval": {
                                "$subtract": [
                                    {"$minute": "$created_date"},
                                    {
                                        "$mod": [
                                            {"$minute": "$created_date"},
                                            aggregate_time,
                                        ]
                                    },
                                ]
                            },
                        },
                        "data": {"$first": "$$ROOT"},
                    }
                },
                {"$sort": {"_id.hour": 1, "_id.interval": 1}},
                {"$replaceRoot": {"newRoot": "$data"}},
                {"$project": {"lables": 0}},
                {"$group": {"_id": "$_id", "data": {"$first": "$$ROOT"}}},
                {"$replaceRoot": {"newRoot": "$data"}},
                {"$sort": {"created_date": -1}},
                {"$count": "total_count"},
            ]
        )
        data = json.loads(dumps(connection_cursor))

        if len(data) > 0:
            total_count = data[0]["total_count"]
            total_pages = math.ceil(total_count / PAGE_SIZE)
            return {"page_size": PAGE_SIZE, "total_pages": total_pages}
        else:
            return {"page_size": PAGE_SIZE, "total_pages": 0}

    except Exception as e:
        logging.error("Exception get_initial_info_for_violation_report : {} ".format(e))
        return {"page_size": PAGE_SIZE, "total_pages": 0}
