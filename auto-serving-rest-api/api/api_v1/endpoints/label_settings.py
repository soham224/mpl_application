import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_label_setting", response_model=schemas.LabelSettingRead)
def add_device(
    label_details: schemas.LabelSettingCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    label_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    label_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(label_details, dict):
        label_obj = label_details
    else:
        label_obj = label_details.dict(exclude_unset=True)

    label_setting_obj = crud.label_setting.create(db=db, obj_in=label_obj)
    if not label_setting_obj:
        raise HTTPException(status_code=500, detail="Device Not Added")
    return label_setting_obj


@router.post("/update_label_setting", response_model=schemas.LabelSettingRead)
def update_label_setting(
    label_details: schemas.LabelSettingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    label_setting = crud.label_setting.get(db, label_details.id)
    if not label_setting:
        raise HTTPException(status_code=404, detail="Label Setting Not Found")

    label_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.label_setting.update(db=db, db_obj=label_setting, obj_in=label_details)


@router.get("/get_label_setting_by_id", response_model=schemas.LabelSettingRead)
def get_label_setting_by_id(
    label_setting_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    label_setting = crud.label_setting.get_by_id(db, label_setting_id)
    if not label_setting:
        raise HTTPException(status_code=404, detail="No Label Setting Found")
    return label_setting


@router.get(
    "/get_label_setting_by_job_id", response_model=List[schemas.LabelSettingRead]
)
def get_label_setting_by_id(
    job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    label_setting = crud.label_setting.get_by_job_id(db, job_id)
    if not label_setting:
        raise HTTPException(
            status_code=404, detail="No Label Setting Found for Requested Job ID"
        )
    return label_setting


@router.get("/get_all_label_settings", response_model=List[schemas.LabelSettingRead])
def get_all_label_settings(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    label_settings = crud.label_setting.get_all(db)
    if not label_settings:
        raise HTTPException(status_code=404, detail="No Label Setting Found")
    return label_settings
