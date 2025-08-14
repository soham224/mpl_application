import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_framework_details", response_model=schemas.FrameWorkRead)
def add_framework_details(
    framework_details: schemas.FrameWorkCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    framework_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    framework_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(framework_details, dict):
        in_obj = framework_details
    else:
        in_obj = framework_details.dict(exclude_unset=True)

    framework = crud.framework.create(db=db, obj_in=in_obj)
    if not framework:
        raise HTTPException(status_code=500, detail="Framework Not Added")
    return framework


@router.post("/update_framework_details", response_model=schemas.FrameWorkRead)
def update_framework_details(
    framework_details: schemas.FrameWorkUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    framework_detail_db = crud.framework.get(db, framework_details.id)
    if not framework_detail_db:
        raise HTTPException(status_code=404, detail="Framework Details Not Found")

    framework_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.framework.update(
        db=db, db_obj=framework_detail_db, obj_in=framework_details
    )


@router.get("/get_framework_details_by_id", response_model=schemas.FrameWorkRead)
def get_framework_details_by_id(
    framework_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    framework_ = crud.framework.get_by_id(db, framework_id)
    if not framework_:
        raise HTTPException(
            status_code=404, detail="No Framework Found For Requested ID"
        )
    return framework_


@router.get("/get_all_framework_details", response_model=List[schemas.FrameWorkRead])
def get_all_framework_details(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    framework_details_list = crud.framework.get_all(db)
    if not framework_details_list:
        raise HTTPException(status_code=404, detail="No Framework Details Found")
    return framework_details_list
