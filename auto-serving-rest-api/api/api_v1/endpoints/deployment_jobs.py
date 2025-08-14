import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.config import settings
from core.mail_utils import (
    send_deployment_job_mail_user,
    send_deployment_job_mail_admin,
)

router = APIRouter()


@router.post("/add_deployment_job", response_model=schemas.DeploymentJobRead)
def add_deployment_job(
    deployment_job: schemas.DeploymentJobCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_job.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    deployment_job.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    deployment_job.user_id = current_user.id
    deployment_job.status = False
    if isinstance(deployment_job, dict):
        device_obj = deployment_job
    else:
        device_obj = deployment_job.dict(exclude_unset=True)

    device = crud.deployment_job.create(db=db, obj_in=device_obj)
    if not device:
        raise HTTPException(status_code=500, detail="Deployment Job Not Added")

    # send_deployment_job_mail_user(device.model_details.model_name, recipient_list=[device.user_details.user_email])
    # send_deployment_job_mail_admin(device.model_details.model_name, recipient_list=settings.SUPER_ADMIN_MAIL_LIST)
    return device


@router.get("/get_deployment_job_by_id", response_model=schemas.DeploymentJobRead)
def get_deployment_job_by_id(
    deployment_job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_job = crud.deployment_job.get_by_id(db, deployment_job_id)
    if not deployment_job:
        raise HTTPException(status_code=404, detail="No Deployment Job Found")
    return deployment_job


@router.get("/get_all_deployment_jobs", response_model=List[schemas.DeploymentJobRead])
def get_all_deployment_jobs(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_job_list = crud.deployment_job.get_all(db)
    if not deployment_job_list:
        raise HTTPException(status_code=404, detail="No Deployment Jobs Found")
    return deployment_job_list


@router.get(
    "/get_deployment_jobs_for_current_user",
    response_model=List[schemas.DeploymentJobRead],
)
def get_deployment_jobs_for_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_jobs = crud.deployment_job.get_by_user_id(db=db, user_id=current_user.id)
    if not deployment_jobs:
        raise HTTPException(
            status_code=404, detail="No Deployed Jobs Found For the Requested User ID"
        )
    return deployment_jobs
