import json
import os

import boto3
from botocore.exceptions import ClientError
import time

from core.config import settings
from applogging.applogger import MyLogger

logging = MyLogger().get_logger("aws_utils")

S3_BASE_URL = "https://{}.s3.{}.amazonaws.com".format(
    settings.TEST_IMG_STORAGE_BUCKET, settings.AWS_DEFAULT_REGION
)
S3_MAIN_BUCKET_URL = "https://{}.s3.{}.amazonaws.com".format(
    settings.TEST_IMG_STORAGE_BUCKET, settings.AWS_DEFAULT_REGION
)


def upload_image_to_s3(file_name, object_name, bucket_name, delete_local):
    """Upload a file to an S3 bucket

    :param delete_local: delete from local or not
    :param bucket_name: name of the bucket
    :param file_name: File to upload
    :param object_name: S3 object name. If not specified then file_name is used
    :return: uploaded image URL
    """
    s3_client = boto3.client("s3")
    try:
        s3_client.upload_file(file_name, bucket_name, object_name)
        image_url = S3_BASE_URL + "/" + object_name
        return image_url
    except ClientError as e:
        logging.error("Exception in S3 upload : {} ".format(e))
        return False
    finally:
        # remove image from local
        if delete_local:
            os.remove(file_name)


def upload_image_to_s3_main_bucket(file_name, object_name, bucket_name, delete_local):
    """Upload a file to an S3 bucket

    :param delete_local: delete from local or not
    :param bucket_name: name of the bucket
    :param file_name: File to upload
    :param object_name: S3 object name. If not specified then file_name is used
    :return: uploaded image URL
    """
    s3_client = boto3.client("s3")
    try:
        s3_client.upload_file(
            file_name,
            bucket_name,
            object_name,
            ExtraArgs={"ACL": "bucket-owner-full-control"},
        )
        image_url = S3_MAIN_BUCKET_URL + "/" + object_name
        return image_url
    except ClientError as e:
        logging.error("Exception in S3 upload : {} ".format(e))
        return False
    finally:
        # remove image from local
        if delete_local:
            os.remove(file_name)


def upload_complaint_file_on_s3(user_id, file):
    try:
        dirname = os.path.abspath(__file__)
        file_path = dirname.rsplit("/", 2)
        file_location = f"{file_path[0]}/files/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        s3_key = (
            "as_complaints/"
            + str(user_id)
            + "/"
            + "complaint_image/"
            + str(int(time.time()))
            + "/"
            + file.filename
        )
        image_url = upload_image_to_s3_main_bucket(
            file_location, s3_key, settings.TEST_IMG_STORAGE_BUCKET, True
        )
        return image_url
    except Exception as e:
        logging.error("Exception upload_file_on_s3 : {} ".format(e))
        return ""


def apply_policy_to_bucket(bucket_name, region):
    try:
        s3_client = boto3.client("s3", region_name=region)
        bucket_policy = {
            "Version": "2012-10-17",
            "Id": "http referer policy example",
            "Statement": [
                {
                    "Sid": "Allow get requests originated from www.example.com and example.com",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": "arn:aws:s3:::{}/*".format(bucket_name),
                    "Condition": {
                        "StringLike": {
                            "aws:Referer": [
                                "https://*.tusker.ai/*",
                                "https://tusker.ai/*",
                            ]
                        }
                    },
                }
            ],
        }

        bucket_policy = json.dumps(bucket_policy)

        s3_client.put_bucket_policy(Bucket=bucket_name, Policy=bucket_policy)
        return True
    except Exception as e:
        logging.error("Exception apply_policy_to_bucket : {} ".format(e))
        return False


def check_and_create_bucket(bucket_name, region):
    try:
        s3_client = boto3.client("s3", region_name=region)
        bucket_details = s3_client.create_bucket(
            Bucket=bucket_name, CreateBucketConfiguration={"LocationConstraint": region}
        )
        is_applied = apply_policy_to_bucket(bucket_name, region)
        if is_applied:
            logging.info("Policy is applied to the bucket")
        else:
            logging.info("Policy is not applied to the bucket")
        return bucket_details
    except s3_client.exceptions.BucketAlreadyOwnedByYou as be:
        logging.info("Bucket Exist !")
        return True
    except Exception as e:
        logging.error("Exception check_and_create_bucket : {} ".format(e))
        return False


def upload_test_file_on_s3(user_id, file):
    try:
        dirname = os.path.abspath(__file__)
        logging.info("dirname :: {}".format(dirname))
        file_path = dirname.rsplit("/", 2)
        logging.info("file_path :: {}".format(file_path))
        file_location = f"{file_path[0]}/files/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        s3_key = (
            "as/"
            + str(user_id)
            + "/"
            + "frame"
            + "/"
            + str(int(time.time()))
            + "/"
            + file.filename
        )
        image_url = upload_image_to_s3_main_bucket(
            file_location, s3_key, settings.TEST_IMG_STORAGE_BUCKET, True
        )
        return s3_key
    except Exception as e:
        logging.error("Exception upload_file_on_s3 : {} ".format(e))
        return ""


def setup_ecs_rtsp(deployment_job_rtsp_details, bucket_name):
    try:
        deployment_region = (
            deployment_job_rtsp_details.user_details.company.deployment_region
        )
        company_name = (
            deployment_job_rtsp_details.user_details.company.company_name.split(" ")[0]
        )
        company_id = deployment_job_rtsp_details.user_details.company.id
        ecs_client = boto3.client("ecs", region_name=deployment_region)
        total_cameras = len(deployment_job_rtsp_details.camera_settings)

        container_def = [
            {
                "name": "tusker-frame-extractor-container-{}-{}".format(
                    company_name, company_id
                ),
                "image": settings.FRAME_EXTRACTOR_URI,
                "essential": True,
                "logConfiguration": {
                    "logDriver": "awslogs",
                    "options": {
                        "awslogs-create-group": "true",
                        "awslogs-group": "/ecs/tusker-frame-extractor-logs-{}-{}".format(
                            company_name, company_id
                        ),
                        "awslogs-region": deployment_region,
                        "awslogs-stream-prefix": "ecs",
                    },
                },
                "environment": [
                    {"name": "COMPANY_IMG_STORE_BUCKET", "value": bucket_name},
                    {"name": "DB_HOST", "value": settings.MYSQL_HOSTNAME},
                    {"name": "DB_NAME", "value": settings.MYSQL_DB_NAME},
                    {"name": "DB_PASS", "value": settings.MYSQL_PASS},
                    {"name": "DB_PORT", "value": str(settings.MYSQL_PORT)},
                    {"name": "DB_USERNAME", "value": settings.MYSQL_USERNAME},
                    {
                        "name": "DEPLOYMENT_JOB_RTSP_ID",
                        "value": str(deployment_job_rtsp_details.id),
                    },
                    {"name": "UPLOAD_INTERVAL", "value": "2"},
                ],
            }
        ]

        if 0 < total_cameras < 4:
            # 512 m - 256 c
            memory_limit = "512"
            cpu_limit = "256"
        elif 4 <= total_cameras < 9:
            # 1 m - 0.5 c
            memory_limit = "1024"
            cpu_limit = "512"
        elif total_cameras >= 9:
            # 2 m - 1 c
            memory_limit = "2048"
            cpu_limit = "1024"

        logging.info(
            "total cameras : {} || memory : {} || cpu : {}".format(
                total_cameras, memory_limit, cpu_limit
            )
        )

        register_task_response = ecs_client.register_task_definition(
            containerDefinitions=container_def,
            family="tusker-frame-extractor-{}-{}".format(company_name, company_id),
            networkMode="awsvpc",
            requiresCompatibilities=["FARGATE"],
            memory=memory_limit,
            cpu=cpu_limit,
            taskRoleArn=settings.TD_TASK_ROLE_ARN,
            executionRoleArn=settings.TD_EXECUTION_ROLE_ARN,
        )
        logging.info("register_task_response :: ".format(register_task_response))

        create_service_response = ecs_client.create_service(
            cluster="tusker-external-apps",
            serviceName="tusker-frame-extractor-service-{}-{}-{}".format(
                company_name, company_id, deployment_job_rtsp_details.id
            ),
            launchType="FARGATE",
            taskDefinition="tusker-frame-extractor-{}-{}".format(
                company_name, company_id
            ),
            desiredCount=1,
            clientToken="request_identifier_string",
            networkConfiguration={
                "awsvpcConfiguration": {
                    "subnets": settings.ECS_SERVICE_SUBNETS,
                    "securityGroups": settings.ECS_SERVICE_SG,
                    "assignPublicIp": "ENABLED",
                }
            },
        )
        logging.info("create_service_response :: ".format(create_service_response))
        return True
    except Exception as e:
        logging.info("Exception setup_ecs_rtsp : {} ".format(e))
        return False


def upload_employee_image(user_id, employee_name, file):
    try:
        dirname = os.path.abspath(__file__)
        file_path = dirname.rsplit("/", 2)
        file_location = f"{file_path[0]}/files/{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        s3_key = (
            "as_employee/"
            + str(user_id)
            + "/"
            + "employee"
            + "/"
            + str(int(time.time()))
            + "/"
            + employee_name.split(" ")[0]
            + ".png"
        )
        return s3_key, upload_image_to_s3_main_bucket(
            file_location, s3_key, settings.TEST_IMG_STORAGE_BUCKET, True
        )
    except Exception as e:
        logging.error("Exception upload_employee_image : {} ".format(e))
        return ""


def register_and_run_task_for_attendance_report(user):
    try:
        deployment_region = user.company.deployment_region
        company_name = user.company.company_name.split(" ")[0]
        company_id = str(user.company.id)
        user_id = user.id
        ecs_client = boto3.client("ecs", region_name=deployment_region)
        list_task_definitions_response = ecs_client.list_task_definitions(
            familyPrefix="tusker-attendance-{}".format(str(company_id)),
            status="ACTIVE",
            sort="ASC",
            maxResults=100,
        )
        logging.info(
            "list_task_definitions_response :: {}".format(
                list_task_definitions_response
            )
        )
        if (
            list_task_definitions_response
            and list_task_definitions_response["taskDefinitionArns"]
        ):
            run_task_response = ecs_client.run_task(
                cluster="Tusker-AI",  # name of the cluster
                launchType="FARGATE",
                taskDefinition="tusker-attendance-{}".format(company_id),
                # replace with your task definition name and revision
                count=1,
                platformVersion="LATEST",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": settings.ECS_SERVICE_SUBNETS,
                        "securityGroups": settings.ECS_SERVICE_SG,
                        "assignPublicIp": "DISABLED",
                    }
                },
            )
            logging.info("run_task_response :: {}".format(run_task_response))
            return True
        else:
            container_def = [
                {
                    "name": "attendance_module-{}".format(company_name),
                    "image": settings.ATTENDANCE_REPORT_URI,
                    "essential": True,
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-create-group": "true",
                            "awslogs-group": "/ecs/tusker-{}".format(company_name),
                            "awslogs-region": deployment_region,
                            "awslogs-stream-prefix": "ecs",
                        },
                    },
                    "environment": [
                        {"name": "DB_HOST", "value": settings.MYSQL_HOSTNAME},
                        {"name": "DB_NAME", "value": settings.MYSQL_DB_NAME},
                        {"name": "DB_PASS", "value": settings.MYSQL_PASS},
                        {"name": "DB_USERNAME", "value": settings.MYSQL_USERNAME},
                        {"name": "MONGO_HOST", "value": settings.MONGO_HOST},
                        {"name": "MONGO_PORT", "value": str(settings.MONGO_PORT)},
                        {"name": "MONGO_DB", "value": settings.MONGO_DB},
                        {"name": "MONGO_USER", "value": settings.MONGO_USER},
                        {"name": "MONGO_PASS", "value": settings.MONGO_PASS},
                        {"name": "COMPANY_ID", "value": str(company_id)},
                        {
                            "name": "FACES_STORE_BUCKET",
                            "value": settings.FACES_STORE_BUCKET,
                        },
                        {
                            "name": "FACES_COLLECTION_NAME",
                            "value": "tusker_{}".format(str(company_id)),
                        },
                        {"name": "USER_ID", "value": str(user_id)},
                    ],
                    "mountPoints": [{"containerPath": "/data", "sourceVolume": "data"}],
                }
            ]
            register_task_response = ecs_client.register_task_definition(
                containerDefinitions=container_def,
                family="tusker-attendance-{}".format(company_id),
                networkMode="awsvpc",
                requiresCompatibilities=["FARGATE"],
                memory=settings.ECS_MEMORY_LIMIT,
                cpu=settings.ECS_CPU_LIMIT,
                taskRoleArn=settings.TASK_ROLE_ARN,
                executionRoleArn=settings.EXECUTION_ROLE_ARN,
                volumes=[{"name": "data"}],
            )
            logging.info("register_task_response :: {}".format(register_task_response))
            run_task_response = ecs_client.run_task(
                cluster="Tusker-AI",  # name of the cluster
                launchType="FARGATE",
                taskDefinition="tusker-attendance-{}".format(company_id),
                # replace with your task definition name and revision
                count=1,
                platformVersion="LATEST",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": settings.ECS_SERVICE_SUBNETS,
                        "securityGroups": settings.ECS_SERVICE_SG,
                        "assignPublicIp": "DISABLED",
                    }
                },
            )
            logging.info("run_task_response :: {}".format(run_task_response))
            return True
    except Exception as e:
        logging.error("Exception register_and_run_task : {} ".format(e))
        return False


def register_and_run_task_for_violation_report(user):
    try:
        deployment_region = user.company.deployment_region
        company_name = user.company.company_name.split(" ")[0]
        company_id = str(user.company.id)
        user_id = user.id
        ecs_client = boto3.client("ecs", region_name=deployment_region)
        list_task_definitions_response = ecs_client.list_task_definitions(
            familyPrefix="tusker-violation-{}".format(str(company_id)),
            status="ACTIVE",
            sort="ASC",
            maxResults=100,
        )
        logging.info(
            "list_task_definitions_response :: {}".format(
                list_task_definitions_response
            )
        )
        if (
            list_task_definitions_response
            and list_task_definitions_response["taskDefinitionArns"]
        ):
            run_task_response = ecs_client.run_task(
                cluster="Tusker-AI",  # name of the cluster
                launchType="FARGATE",
                taskDefinition="tusker-violation-{}".format(company_id),
                # replace with your task definition name and revision
                count=1,
                platformVersion="LATEST",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": settings.ECS_SERVICE_SUBNETS,
                        "securityGroups": settings.ECS_SERVICE_SG,
                        "assignPublicIp": "DISABLED",
                    }
                },
            )
            logging.info("run_task_response :: {}".format(run_task_response))
            return True
        else:
            container_def = [
                {
                    "name": "data-fr-module-{}".format(company_name),
                    "image": settings.VIOLATION_REPORT_URI,
                    "essential": True,
                    "logConfiguration": {
                        "logDriver": "awslogs",
                        "options": {
                            "awslogs-create-group": "true",
                            "awslogs-group": "/ecs/tusker-{}".format(company_name),
                            "awslogs-region": deployment_region,
                            "awslogs-stream-prefix": "ecs",
                        },
                    },
                    "environment": [
                        {"name": "DB_HOST", "value": settings.MYSQL_HOSTNAME},
                        {"name": "DB_NAME", "value": settings.MYSQL_DB_NAME},
                        {"name": "DB_PASS", "value": settings.MYSQL_PASS},
                        {"name": "DB_USERNAME", "value": settings.MYSQL_USERNAME},
                        {"name": "MONGO_HOST", "value": settings.MONGO_HOST},
                        {"name": "MONGO_PORT", "value": str(settings.MONGO_PORT)},
                        {"name": "MONGO_DB", "value": settings.MONGO_DB},
                        {"name": "MONGO_USER", "value": settings.MONGO_USER},
                        {"name": "MONGO_PASS", "value": settings.MONGO_PASS},
                        {"name": "COMPANY_ID", "value": str(company_id)},
                        {
                            "name": "FACES_STORE_BUCKET",
                            "value": settings.FACES_STORE_BUCKET,
                        },
                        {
                            "name": "FACES_COLLECTION_NAME",
                            "value": "tusker_{}".format(str(company_id)),
                        },
                        {"name": "USER_ID", "value": str(user_id)},
                        {
                            "name": "AWS_DEFAULT_REGION",
                            "value": settings.AWS_DEFAULT_REGION,
                        },
                    ],
                    "mountPoints": [{"containerPath": "/data", "sourceVolume": "data"}],
                }
            ]
            register_task_response = ecs_client.register_task_definition(
                containerDefinitions=container_def,
                family="tusker-violation-{}".format(company_id),
                networkMode="awsvpc",
                requiresCompatibilities=["FARGATE"],
                memory=settings.ECS_MEMORY_LIMIT,
                cpu=settings.ECS_CPU_LIMIT,
                taskRoleArn=settings.TASK_ROLE_ARN,
                executionRoleArn=settings.EXECUTION_ROLE_ARN,
                volumes=[{"name": "data"}],
            )
            logging.info("register_task_response :: {}".format(register_task_response))
            run_task_response = ecs_client.run_task(
                cluster="Tusker-AI",  # name of the cluster
                launchType="FARGATE",
                taskDefinition="tusker-violation-{}".format(company_id),
                # replace with your task definition name and revision
                count=1,
                platformVersion="LATEST",
                networkConfiguration={
                    "awsvpcConfiguration": {
                        "subnets": settings.ECS_SERVICE_SUBNETS,
                        "securityGroups": settings.ECS_SERVICE_SG,
                        "assignPublicIp": "DISABLED",
                    }
                },
            )
            logging.info("run_task_response :: {}".format(run_task_response))
            return True
    except Exception as e:
        logging.error("Exception register_and_run_task : {} ".format(e))
        return False


def create_collection(company_id):
    try:
        collection_name = settings.GENERIC_COLLECTION_NAME + "_" + str(company_id)
        client = boto3.client("rekognition")
        response = client.create_collection(CollectionId=collection_name)
        logging.info("collection create response : {}".format(response))
        return True
    except Exception as e:
        logging.error("Exception in create_collection : ", e)
        return False


def get_employee_training_response(emp_id, company_id, s3_key, employee_name):
    try:
        employee_training_response = {}
        client = boto3.client("rekognition")
        response = client.index_faces(
            CollectionId=settings.GENERIC_COLLECTION_NAME + "_" + str(company_id),
            Image={
                "S3Object": {"Bucket": settings.TEST_IMG_STORAGE_BUCKET, "Name": s3_key}
            },
            ExternalImageId=str(company_id)
            + "_"
            + str(emp_id)
            + "_"
            + employee_name.split(" ")[0],
            MaxFaces=1,
            QualityFilter="AUTO",
            DetectionAttributes=["ALL"],
        )

        if response:
            # store the details into the trained_faces table
            employee_training_response["face_id"] = response["FaceRecords"][0]["Face"][
                "FaceId"
            ]
            employee_training_response["image_id"] = response["FaceRecords"][0]["Face"][
                "ImageId"
            ]
            employee_training_response["external_image_id"] = response["FaceRecords"][
                0
            ]["Face"]["ExternalImageId"]
            employee_training_response["employee_id"] = emp_id
        return employee_training_response
    except Exception as e:
        logging.error("Exception in get_employee_training_response : ", e)
        return {}


def delete_identities_from_trained_collection(face_id, company_id):
    try:
        client = boto3.client("rekognition")
        response = client.delete_faces(
            CollectionId=settings.GENERIC_COLLECTION_NAME + "_" + str(company_id),
            FaceIds=[face_id],
        )
        if len(response["DeletedFaces"]) > 0:
            return True
        else:
            return False
    except Exception as e:
        logging.error("Exception in delete_identities_from_trained_collection : ", e)
        return {}


def deploy_model(deployment_job_rtsp_details, bucket_name):
    try:
        client = boto3.client("lambda")
        s3_client = boto3.client("s3")

        user_id = deployment_job_rtsp_details.user_details.id
        company_id = deployment_job_rtsp_details.user_details.company.id
        model_s3_key = (
            deployment_job_rtsp_details.model_details.model_s3_data.model_s3_key
        )
        model_id = deployment_job_rtsp_details.model_details.id
        job_id = deployment_job_rtsp_details.id
        env_variables = {
            "ROI_API_ENDPOINT": settings.ROI_API_ENDPOINT,
            "COMPANY_ADMIN_ID": str(user_id),
            "MODEL_LOAD_BUCKET": settings.MODEL_STORAGE_BUCKET,
            "IMAGE_SIZE": settings.DEFAULT_IMG_SIZE,
            "CONFIDENCE_THRESHOLD": settings.DEFAULT_CONF,
            "IOU_THRESHOLD": settings.DEFAULT_IOU,
            "MODEL_S3_KEY": model_s3_key,
            "MONGO_HOST": settings.MONGO_HOST,
            "MONGO_PORT": str(settings.MONGO_PORT),
            "MONGO_USER": settings.MONGO_USER,
            "MONGO_PASS": settings.MONGO_PASS,
            "MONGO_AUTH_DB_NAME": settings.MONGO_AUTH_DB_NAME,
            "MONGO_DB_NAME": settings.MONGO_DB,
            "MONGO_COLL_NAME": settings.MONGO_COLL_NAME,
        }

        response = client.create_function(
            FunctionName="tusker-{}-{}-function".format(company_id, job_id),
            Role=settings.FUNCTION_DEPLOY_ROLE_ARN,
            Code={"ImageUri": settings.FUNCTION_DEPLOY_URI},
            Description="tusker - user : {} || model : {} || job : {}".format(
                user_id, model_id, job_id
            ),
            Timeout=10,
            MemorySize=1024,
            PackageType="Image",
            Environment=dict(Variables=env_variables),
            Tags={"dev": "mihir", "group": "external"},
        )
        logging.info("pod deployed : {}".format(response))

        perm_response = client.add_permission(
            FunctionName=response.get("FunctionName"),
            StatementId=str(model_id),
            Action="lambda:InvokeFunction",
            Principal="s3.amazonaws.com",
            SourceArn="arn:aws:s3:::{}".format(bucket_name),
        )

        logging.info("pod to source response : {}".format(perm_response))
        configurations = []

        while True:
            function_data = client.get_function(
                FunctionName=response.get("FunctionName")
            )
            logging.info(
                "state : {}".format(function_data.get("Configuration").get("State"))
            )
            if function_data.get("Configuration").get("State") == "Active":
                break
            else:
                time.sleep(20)

        for camera_setting in deployment_job_rtsp_details.camera_settings:
            tmp_data = [
                {
                    "Name": "prefix",
                    "Value": "/frames/{}/{}/".format(user_id, camera_setting.id),
                },
                {"Name": "suffix", "Value": ".jpg"},
            ]

            response1 = s3_client.get_bucket_notification_configuration(
                Bucket=bucket_name
            )
            if response1.get("LambdaFunctionConfigurations") is not None:
                for conf in response1.get("LambdaFunctionConfigurations"):
                    configurations.append(conf)

            # New configuration to add
            new_configuration = {
                "Id": str(camera_setting.id),
                "LambdaFunctionArn": response.get("FunctionArn"),
                "Events": ["s3:ObjectCreated:*"],
                "Filter": {"Key": {"FilterRules": tmp_data}},
            }
            configurations.append(new_configuration)
            final_conf_list = list({v["Id"]: v for v in configurations}.values())

            final_response = s3_client.put_bucket_notification_configuration(
                Bucket=bucket_name,
                NotificationConfiguration={
                    "LambdaFunctionConfigurations": final_conf_list
                },
            )

            logging.info(
                "pod mapping : {} || {}".format(camera_setting.id, final_response)
            )
        return True
    except Exception as e:
        logging.error("Exception in deploy_model : ", e)
        return False


def publish_text_message(phone_number, message):
    """
    Publishes a text message directly to a phone number without need for a
    subscription.

    :param phone_number: The phone number that receives the message. This must be
                         in E.164 format. For example, a United States phone
                         number might be +12065550101.
    :param message: The message to send.
    """
    try:
        sns = boto3.client("sns")
        number = phone_number
        sns.publish(PhoneNumber=number, Message=message)
        return True
    except Exception as e:
        logging.error("Exception in publish_text_message : ", e)
        return False
