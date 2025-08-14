import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_model_s3_data", response_model=schemas.AIModelS3DataUpdate)
def add_model_s3_data(
    model_s3_data: schemas.AIModelS3DataCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_s3_data.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    model_s3_data.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(model_s3_data, dict):
        in_obj = model_s3_data
    else:
        in_obj = model_s3_data.dict(exclude_unset=True)

    s3_data = crud.ai_model_s3_data.create(db=db, obj_in=in_obj)
    if not s3_data:
        raise HTTPException(status_code=500, detail="Model S3 Data Not Added")
    return s3_data


@router.post(
    "/add_model_s3_data_from_autoDL", response_model=schemas.AIModelS3DataUpdate
)
def add_model_s3_data(
    model_s3_data: schemas.AIModelS3DataCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    model_s3_data.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    model_s3_data.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(model_s3_data, dict):
        in_obj = model_s3_data
    else:
        in_obj = model_s3_data.dict(exclude_unset=True)

    s3_data = crud.ai_model_s3_data.create(db=db, obj_in=in_obj)
    if not s3_data:
        raise HTTPException(status_code=500, detail="Model S3 Data Not Added")
    return s3_data


@router.post("/update_model_s3_data", response_model=schemas.AIModelS3DataUpdate)
def update_model_s3_data(
    model_s3_data: schemas.AIModelS3DataUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_s3_data_db = crud.ai_model_s3_data.get(db, model_s3_data.id)
    if not model_s3_data_db:
        raise HTTPException(status_code=404, detail="Model S3  Details Not Found")

    model_s3_data.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.ai_model_s3_data.update(
        db=db, db_obj=model_s3_data_db, obj_in=model_s3_data
    )


@router.get("/get_model_s3_data_by_id", response_model=schemas.AIModelS3DataUpdate)
def get_model_s3_data_by_id(
    model_s3_data_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_s3_data = crud.ai_model_s3_data.get_by_id(db, model_s3_data_id)
    if not model_s3_data:
        raise HTTPException(
            status_code=404, detail="No Model S3 Data Found For Requested ID"
        )
    return model_s3_data


@router.get("/get_all_model_s3_data", response_model=List[schemas.AIModelS3DataUpdate])
def get_all_model_s3_data(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    model_s3_data_list = crud.ai_model_s3_data.get_all(db)
    if not model_s3_data_list:
        raise HTTPException(status_code=404, detail="No Model S3 Details Found")
    return model_s3_data_list
