import pymongo
import json
from core.config import settings
from bson.json_util import dumps
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("label_utils")

mongo_client = pymongo.MongoClient(
    host=settings.MONGO_HOST,
    port=int(settings.MONGO_PORT),
    username=settings.MONGO_USER,
    password=settings.MONGO_PASS,
    authSource=settings.MONGO_AUTH_DB_NAME,
)

db = mongo_client[settings.MONGO_DB]
collection = db[settings.MONGO_COLL_NAME]


def get_labels_of_user_from_mongo(user_id):
    try:
        pipeline = [
            {
                "$project": {
                    "user_id": 1,
                    "counts": 1,
                    "labels": {"$objectToArray": "$counts"},
                }
            },
            {"$unwind": "$labels"},
            {"$match": {"user_id": str(user_id)}},
            {"$group": {"_id": "$user_id", "labels": {"$addToSet": "$labels.k"}}},
        ]
        connection_cursor = collection.aggregate(pipeline)
        data = json.loads(dumps(connection_cursor))
        return data
    except Exception as e:
        logging.error(
            "Exception get_violation_by_aggregate_time_from_mongo : {} ".format(e)
        )
        return {}
