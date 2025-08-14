from typing import Any, List

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_model_type", response_model=schemas.ModelTypeRead)
def add_model_type(
    model_type_details: schemas.ModelTypeCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_type_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    model_type_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(model_type_details, dict):
        in_obj = model_type_details
    else:
        in_obj = model_type_details.dict(exclude_unset=True)

    device = crud.model_types.create(db=db, obj_in=in_obj)
    if not device:
        raise HTTPException(status_code=500, detail="Model Type Not Added")
    return device


@router.post("/update_model_type", response_model=schemas.ModelTypeRead)
def update_model_type(
    model_type_details: schemas.ModelTypeUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_type = crud.model_types.get(db, model_type_details.id)
    if not model_type:
        raise HTTPException(status_code=404, detail="Model Type Not Found")

    model_type.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.model_types.update(db=db, db_obj=model_type, obj_in=model_type_details)


@router.get("/get_model_type_by_id", response_model=schemas.ModelTypeRead)
def get_model_type_by_id(
    model_type_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_type = crud.model_types.get_by_id(db, model_type_id)
    if not model_type:
        raise HTTPException(
            status_code=404, detail="No Model Type Found For Requested ID"
        )
    return model_type


@router.get("/get_all_model_types", response_model=List[schemas.ModelTypeRead])
def get_all_model_types(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_types_list = crud.model_types.get_all(db)
    if not model_types_list:
        raise HTTPException(status_code=404, detail="No Model Types Found")
    return model_types_list


@router.get("/get_all_enabled_model_types", response_model=List[schemas.ModelTypeRead])
def get_all_enabled_model_types(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_types_list = crud.model_types.get_all_enabled(db)
    if not model_types_list:
        raise HTTPException(status_code=404, detail="No Model Types Found")
    return model_types_list
