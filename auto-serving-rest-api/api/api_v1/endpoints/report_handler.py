from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud

import models
from api import deps
from core.report_utils import (
    get_violation_report_by_date_utils,
    get_violation_by_aggregate_time_from_mongo,
    get_initial_info_for_violation_report,
)
from core.result_utils import (
    get_camera_id_list_for_admin,
    get_camera_id_list_for_supervisor,
    get_labels_list_for_supervisor,
)
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("report_handler")


@router.post("/get_violation_report_by_date")
def get_violation_report_by_date(
    utcStartDate: datetime,
    utcEndDate: datetime,
    start_time: int,
    end_time: int,
    start_min: int,
    end_min: int,
    day_start: int,
    labels: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        location_list = []
        if current_user.locations:
            for location_obj in current_user.locations:
                location_list.append(location_obj.__dict__["id"])
        if not location_list:
            raise HTTPException(status_code=404, detail="No Location Found For User")
        camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        labels_list = get_labels_list_for_supervisor(location_list, db)
        label_list = []
        violation_setting_labels = labels.split(",")
        for label in labels_list:
            if label in violation_setting_labels and label not in label_list:
                label_list.append(label)
        if not label_list:
            return []
        violation_settings_label = label_list
    else:
        user_id = current_user.id
        camera_id_list = get_camera_id_list_for_admin(user_id, db)
        violation_settings_label = labels.split(",")
    return get_violation_report_by_date_utils(
        utcStartDate,
        utcEndDate,
        start_time,
        end_time,
        start_min,
        end_min,
        day_start,
        violation_settings_label,
        camera_id_list,
        user_id,
    )


@router.get("/get_violation_by_aggregate_time")
def get_violation_by_aggregate_time(
    utcStartDate: datetime,
    utcEndDate: datetime,
    labels: str,
    aggregate_time: int,
    page_number: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        location_list = []
        if current_user.locations:
            for location_obj in current_user.locations:
                location_list.append(location_obj.__dict__["id"])
        if not location_list:
            raise HTTPException(status_code=404, detail="No Location Found For User")
        camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        labels_list = get_labels_list_for_supervisor(location_list, db)
        label_list = []
        violation_setting_labels = labels.split(",")
        for label in labels_list:
            if label in violation_setting_labels and label not in label_list:
                label_list.append(label)
        if not label_list:
            return []
        violation_settings_label = label_list
    else:
        user_id = current_user.id
        camera_id_list = get_camera_id_list_for_admin(user_id, db)
        violation_settings_label = labels.split(",")
    return get_violation_by_aggregate_time_from_mongo(
        utcStartDate,
        utcEndDate,
        violation_settings_label,
        camera_id_list,
        aggregate_time,
        page_number,
        user_id,
    )


@router.get("/get_report_metadata")
def get_result_metadata(
    utcStartDate: datetime,
    utcEndDate: datetime,
    labels: str,
    aggregate_time: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        location_list = []
        if current_user.locations:
            for location_obj in current_user.locations:
                location_list.append(location_obj.__dict__["id"])
        if not location_list:
            raise HTTPException(status_code=404, detail="No Location Found For User")
        camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        labels_list = get_labels_list_for_supervisor(location_list, db)
        label_list = []
        violation_setting_labels = labels.split(",")
        for label in labels_list:
            if label in violation_setting_labels and label not in label_list:
                label_list.append(label)
        if not label_list:
            return []
        violation_settings_label = label_list
    else:
        user_id = current_user.id
        camera_id_list = get_camera_id_list_for_admin(user_id, db)
        violation_settings_label = labels.split(",")
    return get_initial_info_for_violation_report(
        utcStartDate,
        utcEndDate,
        violation_settings_label,
        camera_id_list,
        aggregate_time,
        user_id,
    )
