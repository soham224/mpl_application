import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post(
    "/add_training_setting_details",
    response_model=schemas.AIModelTrainingSettingsUpdate,
)
def add_training_setting_details(
    training_settings: schemas.AIModelTrainingSettingsCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    training_settings.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    training_settings.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(training_settings, dict):
        in_obj = training_settings
    else:
        in_obj = training_settings.dict(exclude_unset=True)

    settings = crud.ai_model_settings.create(db=db, obj_in=in_obj)
    if not settings:
        raise HTTPException(status_code=500, detail="Training Settings Not Added")
    return settings


@router.post(
    "/add_training_setting_details_from_autoDL",
    response_model=schemas.AIModelTrainingSettingsUpdate,
)
def add_training_setting_details(
    training_settings: schemas.AIModelTrainingSettingsCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    training_settings.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    training_settings.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(training_settings, dict):
        in_obj = training_settings
    else:
        in_obj = training_settings.dict(exclude_unset=True)

    settings = crud.ai_model_settings.create(db=db, obj_in=in_obj)
    if not settings:
        raise HTTPException(status_code=500, detail="Training Settings Not Added")
    return settings


@router.post(
    "/update_training_settings_details",
    response_model=schemas.AIModelTrainingSettingsUpdate,
)
def update_training_settings_details(
    training_settings: schemas.AIModelTrainingSettingsUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    training_settings_db = crud.ai_model_settings.get(db, training_settings.id)
    if not training_settings_db:
        raise HTTPException(
            status_code=404, detail="Training Settings Details Not Found"
        )

    training_settings.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.ai_model_settings.update(
        db=db, db_obj=training_settings_db, obj_in=training_settings
    )


@router.get(
    "/get_training_settings_by_id", response_model=schemas.AIModelTrainingSettingsUpdate
)
def get_training_settings_by_id(
    training_settings_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    ai_model_settings_ = crud.ai_model_settings.get_by_id(db, training_settings_id)
    if not ai_model_settings_:
        raise HTTPException(
            status_code=404, detail="No Training Settings Found For Requested ID"
        )
    return ai_model_settings_


@router.get(
    "/get_all_training_settings",
    response_model=List[schemas.AIModelTrainingSettingsUpdate],
)
def get_all_training_settings(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    training_settings_list = crud.ai_model_settings.get_all(db)
    if not training_settings_list:
        raise HTTPException(
            status_code=404, detail="No Training Settings Details Found"
        )
    return training_settings_list
