# import datetime
# import logging
# import time
# from typing import Any, List
#
# from boto3 import client, resource
# from fastapi import APIRouter, Depends, HTTPException
# from sqlalchemy.orm import Session
#
# import core.aws_utils as aws
# import crud
# import models
# import schemas
# from api import deps
# from core.config import settings
# from core.mail_utils import send_deployed_job_mail_user, send_deployed_job_mail_admin, \
#     send_stop_deployed_job_mail_admin, send_stop_deployed_job_mail_user
#
# router = APIRouter()
#
#
# @router.post("/start_deployment")
# def start_deployment(
#         deployment_job_id: int,
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_superuser)
# ) -> Any:
#     logging.info("API deployment started")
#     deployment_job = crud.deployment_job.get_by_id(db, deployment_job_id)
#     if not deployment_job:
#         raise HTTPException(status_code=404, detail="No Deployment Job Found")
#
#     epoch = str(int(time.time()))
#
#     security_groups = [settings.SECURITY_GROUP]
#
#     docker_command = "docker run -dit --restart unless-stopped -e AWS_ACCESS_KEY_ID={} -e AWS_SECRET_ACCESS_KEY={} -e AWS_DEFAULT_REGION={} -e _INFERENCE_DEVICE={} -e _COMPANY_NAME={} -e _MODEL_S3_PATH={} -e _MODEL_S3_KEY={} -e _MODEL_S3_NAME={} -e _MODEL_VERSION={} -e _IMAGE_SIZE={} -e _CONFIDENCE_THRESHOLD={} -e _IOU_THRESHOLD={} -m 400M -p 8080:8080 --name {} {}".format(
#         settings.AWS_ACCESS_KEY_ID, settings.AWS_SECRET_ACCESS_KEY, settings.AWS_DEFAULT_REGION,
#         deployment_job.model_details.device_details.device_name,
#         deployment_job.user_details.company_name.replace(" ", ""),
#         deployment_job.model_details.model_s3_data.model_s3_url,
#         deployment_job.model_details.model_s3_data.model_s3_key,
#         deployment_job.model_details.model_s3_data.model_s3_name,
#         deployment_job.model_details.model_s3_data.model_version, deployment_job.image_size,
#         deployment_job.confidence_threshold,
#         deployment_job.iou_threshold, deployment_job.user_details.company_name.replace(" ", ""),
#         deployment_job.model_details.model_framework_details.framework_name
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
# "
#     """.format(docker_command, docker_command)
#
#     logging.info("user_data_script :: {}".format(user_data_script))
#
#     ec2 = client('ec2', aws_access_key_id=settings.ACCESS_KEY,
#                  aws_secret_access_key=settings.SECRET_KEY,
#                  region_name='ap-south-1')
#
#     try:
#         new_reservation = ec2.run_instances(
#             ImageId=settings.AWS_IMAGE_ID,
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
#         instance_name = "auto_serving_" + epoch
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
#         deployed_job_details = schemas.DeployedJobCreate(instance_id=instance_id,
#                                                          instance_status=my_instance.state.get("Name"),
#                                                          deployment_job_id=deployment_job_id,
#                                                          created_date=created_date,
#                                                          updated_date=updated_date,
#                                                          status=True,
#                                                          api_endpoint=api_end_point)
#
#         if isinstance(deployed_job_details, dict):
#             in_obj = deployed_job_details
#         else:
#             in_obj = deployed_job_details.dict(exclude_unset=True)
#
#         deployed_job = crud.deployed_job.create(db=db, obj_in=in_obj)
#         if not deployed_job:
#             logging.warning("Deployed Job Details Not Added into the DB")
#         logging.info("Deployed Job Details Added Successfully")
#
#         is_updated = crud.deployment_job.update_status(db=db, status=1, job_obj=deployment_job)
#         if is_updated:
#             logging.info("Deployment Job Status Updated Successfully")
#         else:
#             logging.warning("Deployment Job Status Not Updated")
#
#         # send email
#         send_deployed_job_mail_user(deployment_job.model_details.model_name, api_end_point, api_docs,
#                                     [deployment_job.user_details.user_email])
#
#         send_deployed_job_mail_admin(deployment_job.model_details.model_name, api_end_point,
#                                      deployment_job.user_details.company_name, settings.SUPER_ADMIN_MAIL_LIST)
#
#         logging.info("API deployment completed")
#
#         return {"API-endpoint": api_end_point, "API-documentation": api_docs}
#     except Exception as e:
#         logging.error("Exception In API Deployment: {} ".format(e))
#         raise HTTPException(status_code=500, detail="Exception In API Deployment: {} ".format(e))
#
#
# @router.get("/get_deployed_jobs_for_current_user", response_model=List[schemas.DeployedJobRead])
# def get_device_by_id(
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_user)
# ) -> Any:
#     deployed_jobs = crud.deployed_job.get_by_user_id(db=db, user_id=current_user.id)
#     if not deployed_jobs:
#         raise HTTPException(status_code=404, detail="No Deployed Jobs Found For the Requested ID")
#     return deployed_jobs
#
#
# @router.get("/get_all_deployed_jobs", response_model=List[schemas.DeployedJobRead])
# def get_all_deployed_jobs(
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_superuser)
# ) -> Any:
#     deployed_jobs = crud.deployed_job.get_all(db)
#     if not deployed_jobs:
#         raise HTTPException(status_code=404, detail="No Deployed Jobs Found")
#     return deployed_jobs
#
#
# @router.post("/terminate_running_job")
# def terminate_running_job(
#         deployed_job_id: int,
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_superuser)
# ) -> Any:
#     logging.info("terminating API deployment started, deployed_job_id : {}".format(deployed_job_id))
#     deployed_job = crud.deployed_job.get_by_id(db, deployed_job_id)
#     if not deployed_job:
#         raise HTTPException(status_code=404, detail="No Deployed Job Found For the Requested ID")
#
#     deployment_job = crud.deployment_job.get_by_id(db, deployed_job.deployment_job_id)
#     if not deployment_job:
#         raise HTTPException(status_code=404, detail="No Deployment Job Found")
#
#     ec2_r = resource('ec2', aws_access_key_id=settings.ACCESS_KEY,
#                      aws_secret_access_key=settings.SECRET_KEY,
#                      region_name=settings.AWS_DEFAULT_REGION)
#
#     try:
#         ec2_r.instances.filter(InstanceIds=[deployed_job.instance_id]).terminate()
#
#         is_updated = crud.deployment_job.update_status(db=db, status=0, job_obj=deployment_job)
#         if is_updated:
#             logging.info("Deployment Job Status Updated Successfully")
#         else:
#             logging.warning("Deployment Job Status Not Updated")
#
#         deployed_job_new = schemas.DeployedJobCreate(instance_status="terminated",
#                                                      status=0,
#                                                      updated_date=datetime.datetime.utcnow().replace(microsecond=0),
#                                                      api_endpoint=deployed_job.api_endpoint,
#                                                      instance_id=deployed_job.instance_id,
#                                                      deployment_job_id=deployed_job.deployment_job_id,
#                                                      created_date=deployed_job.created_date)
#
#         crud.deployed_job.update(db=db, db_obj=deployed_job, obj_in=deployed_job_new)
#
#         send_stop_deployed_job_mail_user(deployment_job.model_details.model_name,
#                                          [deployment_job.user_details.user_email])
#
#         send_stop_deployed_job_mail_admin(deployment_job.model_details.model_name,
#                                           deployment_job.user_details.company_name, settings.SUPER_ADMIN_MAIL_LIST)
#         logging.info("termination completed")
#         return "Job Terminated Successfully"
#     except Exception as e:
#         logging.error("Exception in terminating the job : {}".format(e))
#         raise HTTPException(status_code=500, detail="Exception In API Deployment Termination: {} ".format(e))
