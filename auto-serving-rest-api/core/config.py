import secrets
from typing import List, Optional
import os
import json
from pydantic import AnyHttpUrl, BaseSettings, HttpUrl


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 8 * 1
    SERVER_NAME: str = "server"
    SERVER_HOST: AnyHttpUrl = "http://localhost"
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []
    FEEDBACK_FILE_LIMIT = 10

    PROJECT_NAME: str = "Auto Serving REST"

    MODEL_TEST_USER_CREDIT: int = 100
    SENTRY_DSN: Optional[HttpUrl] = None

    # email settings
    MAIL_USER = "pythondemodonotreply@gmail.com"
    MAIL_PASS = "qazwsxedcrfvtgb1234567890"

    ENABLE_USER_SUBJECT = "Account Activated"
    USER_REGISTRATION_SUBJECT = "Welcome to the AUTO-AI-serving"
    USER_REGISTRATION_SUBJECT_ADMIN = "User On-board"
    USER_ADD_JOB_SUBJECT = "Deployment Request Processing"
    HOSTED_SITE_URL = "www.login.com"

    SUPER_ADMIN_MAIL_LIST: list = ["mihir.softvan@gmail.com"]

    # Rekognition
    GENERIC_COLLECTION_NAME = "tusker-fr-coll"
    FACES_STORE_BUCKET = ""

    MYSQL_HOSTNAME = os.environ["MYSQL_HOSTNAME"]
    MYSQL_USERNAME = os.environ["MYSQL_USERNAME"]
    MYSQL_PASS = os.environ["MYSQL_PASS"]
    MYSQL_PORT: int = os.environ["MYSQL_PORT"]
    MYSQL_DB_NAME = os.environ["MYSQL_DB_NAME"]

    # for result db storage
    MONGO_HOST = os.environ["MONGO_HOST"]
    MONGO_USER = os.environ["MONGO_USER"]
    MONGO_PASS = os.environ["MONGO_PASS"]
    MONGO_DB = os.environ["MONGO_DB_NAME"]
    MONGO_PORT: int = os.environ["MONGO_PORT"]
    MONGO_AUTH_DB_NAME = os.environ["MONGO_AUTH_DB_NAME"]
    MONGO_COLL_NAME = os.environ["MONGO_COLL_NAME"]

    ROI_API_ENDPOINT = os.environ["ROI_API_ENDPOINT"]
    MODEL_TEST_API_URL: str = (
        "https://k9hyxica2b.execute-api.ap-south-1.amazonaws.com/prod/infer"
    )

    TEST_IMG_STORAGE_BUCKET: str = "tusker-testing-images-storage"
    MODEL_STORAGE_BUCKET: str = "tusker-model-storage"

    AWS_DEFAULT_REGION = "ap-south-1"
    DEFAULT_IMG_SIZE = "640"
    DEFAULT_CONF = "0.3"
    DEFAULT_IOU = "0.5"

    FRAME_EXTRACTOR_URI = (
        "437476783934.dkr.ecr.ap-south-1.amazonaws.com/tusker-rtsp-handler:latest"
    )
    FUNCTION_DEPLOY_URI = (
        "437476783934.dkr.ecr.ap-south-1.amazonaws.com/gen-model-deploy:latest"
    )

    API_EXAMPLE_URL = ""
    FRAME_GENERATOR_URI = ""
    ATTENDANCE_REPORT_URI = ""
    VIOLATION_REPORT_URI = ""

    TD_TASK_ROLE_ARN = "arn:aws:iam::437476783934:role/ecs-tasks-s3"
    TD_EXECUTION_ROLE_ARN = "arn:aws:iam::437476783934:role/ecsTaskExecutionRole"
    FUNCTION_DEPLOY_ROLE_ARN = "arn:aws:iam::437476783934:role/lambda-s3-access"

    ECS_SERVICE_SUBNETS = [
        "subnet-04349012ac0de00ed",
        "subnet-021156d84a94b17e1",
        "subnet-066b4ea1fdae152eb",
    ]

    ECS_SERVICE_SG = ["sg-008d9a78f8be2117c"]

    CAMERA_SCHEDULER_TIME = 1
    NVR_DETAILS = json.loads(os.environ["NVR_DETAILS"])

    API_MAX_RESULT_COUNT = 2239
    DOWNLOAD_FILE_BASE_DIR = os.environ["DOWNLOAD_FILE_BASE_DIR"]
    IMAGE_BASE_URL = os.environ["IMAGE_BASE_URL"]

    NOTIFICATION_SEND_PASS = "ufqrxlfacxbaxgdx"
    NOTIFICATION_SEND_EMAIL = "tuskerai.noreply@gmail.com"

    class Config:
        case_sensitive = True


settings = Settings()
