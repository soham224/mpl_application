from datetime import date, datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
from api import deps
from core.aws_utils import *

router = APIRouter()


@router.get("/generate_violation_report")
def generate_violation_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    attendance_report = register_and_run_task_for_violation_report(current_user)
    if not attendance_report:
        raise HTTPException(
            status_code=404, detail="No Data Found For generate violation report"
        )
    return attendance_report


@router.get("/check_for_today_violation_report")
def check_for_today_violation_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    today_report_details = (
        crud.employee_violation_crud_obj.get_today_report_by_company_id(
            db, current_user.id
        )
    )
    if len(today_report_details) > 0:
        return False
    else:
        return True


@router.get("/get_violation_report_by_employee")
def get_violation_report_by_employee(
    emp_ext_name: str,
    current_month: int,
    current_year: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    emp_data = crud.employee_violation_crud_obj.get_counts_by_employee(
        db, emp_ext_name, current_month, current_year
    )
    if not emp_data:
        raise HTTPException(status_code=404, detail="Data not found.")
    return emp_data


@router.get("/get_violation_report_by_date")
def get_violation_report_by_date(
    report_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    detections_data_by_date = crud.employee_violation_crud_obj.get_report_by_date(
        db, current_user.company_id, report_date
    )
    if not detections_data_by_date:
        raise HTTPException(status_code=404, detail="Data not found.")
    return detections_data_by_date


@router.get("/get_violation_report_by_camera_and_label")
def get_violation_report_by_camera_and_label(
    camera_id: int,
    label: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    label_list = label.split(",")
    detections_data_by_camera_and_label = (
        crud.employee_violation_crud_obj.get_report_by_camera_and_label(
            db, current_user.company_id, camera_id, label_list
        )
    )
    if not detections_data_by_camera_and_label:
        raise HTTPException(status_code=404, detail="Data not found.")
    return detections_data_by_camera_and_label


@router.get("/supervisor_get_violation_report_by_employee")
def supervisor_get_violation_report_by_employee(
    emp_ext_name: str,
    current_month: int,
    current_year: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    emp_data = crud.employee_violation_crud_obj.get_counts_by_employee(
        db, emp_ext_name, current_month, current_year
    )
    if not emp_data:
        raise HTTPException(status_code=404, detail="Data not found.")
    return emp_data


@router.get("/supervisor_get_violation_report_by_date")
def supervisor_get_violation_report_by_date(
    start_date: datetime,
    end_date: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    deployment_camera_id_list = []
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        return []
    deployment_camera_list = (
        crud.deployment_camera.get_total_active_cameras_by_location(db, location_list)
    )
    if deployment_camera_list:
        for deployment_camera_obj in deployment_camera_list:
            deployment_camera_id_list.append(deployment_camera_obj.__dict__["id"])
    if not deployment_camera_id_list:
        return []
    detections_data_by_date = (
        crud.employee_violation_crud_obj.get_report_by_date_supervisor(
            db, current_user.company_id, start_date, end_date, deployment_camera_id_list
        )
    )
    if not detections_data_by_date:
        return []
    return detections_data_by_date


@router.post("/supervisor_get_violation_report_by_camera_and_label")
def supervisor_get_violation_report_by_camera_and_label(
    camera_id: List[int],
    label: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    deployment_camera_id_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        return []
    deployment_camera_list = (
        crud.deployment_camera.get_total_active_cameras_by_location(db, location_list)
    )
    if deployment_camera_list:
        for deployment_camera_obj in deployment_camera_list:
            deployment_camera_id_list.append(deployment_camera_obj.__dict__["id"])
    if not deployment_camera_id_list:
        return []

    if not camera_id or -1 in camera_id:
        camera_list = deployment_camera_id_list
    else:
        camera_list = camera_id

    if not label or "-1" in label:
        labels_obj = (
            crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                db, camera_list
            )
        )
        label_list = [
            label for label_obj in labels_obj for label in label_obj.labels.split(",")
        ]
    else:
        label_list = label

    detections_data_by_camera_and_label = (
        crud.employee_violation_crud_obj.get_report_by_camera_and_label_list(
            db, current_user.company_id, camera_list, label_list
        )
    )

    if not detections_data_by_camera_and_label:
        return []
    return detections_data_by_camera_and_label


@router.get("/get_unknown_violation_report_by_date")
def get_unknown_violation_report_by_date(
    report_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    detections_data_by_date = (
        crud.employee_violation_crud_obj.get_unknown_report_by_date(
            db, current_user.company_id, report_date
        )
    )
    if not detections_data_by_date:
        raise HTTPException(status_code=404, detail="Data not found.")
    return detections_data_by_date


@router.get("/get_supervisor_unknown_violation_report_by_date")
def get_supervisor_unknown_violation_report_by_date(
    report_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    deployment_camera_id_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        raise HTTPException(status_code=404, detail="Data not found.")
    deployment_camera_list = (
        crud.deployment_camera.get_total_active_cameras_by_location(db, location_list)
    )
    if deployment_camera_list:
        for deployment_camera_obj in deployment_camera_list:
            deployment_camera_id_list.append(deployment_camera_obj.__dict__["id"])
    if not deployment_camera_id_list:
        raise HTTPException(status_code=404, detail="Data not found.")
    detections_data_by_date = (
        crud.employee_violation_crud_obj.get_supervisor_unknown_report_by_date(
            db, current_user.company_id, report_date, deployment_camera_id_list
        )
    )
    if not detections_data_by_date:
        raise HTTPException(status_code=404, detail="Data not found.")
    return detections_data_by_date
