from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("notification_config_api")


@router.get("/get_email")
def get_email(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> list:
    response = crud.notification_config_crud_object.get_one_data_by_company_id(
        db, current_user.company_id
    )
    if not response or not response.meta_data["to_email"]:
        raise HTTPException(status_code=404, detail="Notification Config Not Found")
    return response.meta_data["to_email"]


@router.get("/get_email_by_id")
def get_email_by_id(
    email_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> dict:
    return crud.notification_config_crud_object.get_email_by_id(
        db, current_user.company_id, email_id
    )


@router.post("/add_email")
def add_email(
    notification_details: schemas.NotificationConfigBase,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> list:
    response = crud.notification_config_crud_object.add_new_email(
        db, current_user, notification_details
    )
    return response


@router.post("/update_email")
def update_email(
    notification_details: schemas.NotificationConfigUpdateEmailBase,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    response = crud.notification_config_crud_object.update_notification_email(
        db, current_user, notification_details
    )
    return response


@router.post("/update_email_status")
def update_email_status(
    notification_details: schemas.NotificationConfigUpdateStatusBase,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    response = crud.notification_config_crud_object.update_notification_email_status(
        db, current_user, notification_details
    )
    return response
