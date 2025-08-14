import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.result_utils import *

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_violation_setting", response_model=schemas.ViolationSettingRead)
def add_violation_setting(
    violation_setting_details: schemas.ViolationSettingCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    violation_setting_details.created_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    violation_setting_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    if isinstance(violation_setting_details, dict):
        violation_setting_obj = violation_setting_details
    else:
        violation_setting_obj = violation_setting_details.dict(exclude_unset=True)

    obj_out = crud.violation_setting_obj.create(db=db, obj_in=violation_setting_obj)
    if not obj_out:
        raise HTTPException(status_code=500, detail="Device Not Added")
    return obj_out


@router.post("/update_violation_setting", response_model=schemas.ViolationSettingRead)
def update_violation_setting(
    violation_setting_details: schemas.ViolationSettingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    violation_setting = crud.violation_setting_obj.get_by_company_id(
        db, violation_setting_details.company_id
    )
    if not violation_setting:
        raise HTTPException(status_code=404, detail="Label Setting Not Found")

    violation_setting.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.company_setting_obj.update(
        db=db, db_obj=violation_setting, obj_in=violation_setting_details
    )


@router.get("/get_violation_setting_by_id", response_model=schemas.ViolationSettingRead)
def get_violation_setting_by_id(
    violation_setting_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    violation_setting = crud.violation_setting_obj.get_by_id(db, violation_setting_id)
    if not violation_setting:
        raise HTTPException(status_code=404, detail="No Violation Setting Found")
    return violation_setting


@router.get(
    "/get_violation_setting_by_company_id", response_model=schemas.ViolationSettingRead
)
def get_violation_setting_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    violation_setting = crud.violation_setting_obj.get_by_company_id(
        db, current_user.company_id
    )
    if not violation_setting:
        raise HTTPException(status_code=404, detail="No Violation Setting Found")
    return violation_setting


@router.get("/get_model_labels_of_admin")
def get_model_labels_of_admin(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    model_labels = ""
    deployed_rtsp_jobs = crud.deployed_rtsp_job.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not deployed_rtsp_jobs:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
        if not model_labels:
            model_labels = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
            )
        else:
            model_labels = (
                model_labels
                + ","
                + deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
            )
    return model_labels


@router.get("/get_model_labels_of_supervisor")
def get_model_labels_of_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    model_labels = ""
    company_admin = crud.user.get_company_admin_by_supervisor(
        db, current_user.company_id
    )
    if company_admin:
        deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(
            db=db, user_id=company_admin.id
        )
        deployed_rtsp_jobs = filter_camera_list(current_user.locations, deployed_jobs)
        if not deployed_rtsp_jobs:
            raise HTTPException(
                status_code=404, detail="No Data Found For Requested ID"
            )
        for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
            if not model_labels:
                model_labels = (
                    deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
                )
            else:
                model_labels = (
                    model_labels
                    + ","
                    + deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
                )
    if not model_labels:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return model_labels
