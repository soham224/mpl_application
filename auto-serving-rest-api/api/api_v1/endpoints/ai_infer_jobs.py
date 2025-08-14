import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_infer_job", response_model=schemas.AIInferJobRead)
def add_infer_job(
    infer_job_details: schemas.AIInferJobCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    infer_job_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    infer_job_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    infer_job_details.user_id = current_user.id
    if isinstance(infer_job_details, dict):
        in_obj = infer_job_details
    else:
        in_obj = infer_job_details.dict(exclude_unset=True)

    framework = crud.ai_infer_job.create(db=db, obj_in=in_obj)
    if not framework:
        raise HTTPException(status_code=500, detail="Infer Job Not Added")
    return framework


@router.get("/get_infer_job_by_id", response_model=schemas.AIInferJobRead)
def get_infer_job_by_id(
    infer_job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    infer_job = crud.ai_infer_job.get_by_id(db, infer_job_id)
    if not infer_job:
        raise HTTPException(
            status_code=404, detail="No Infer Job Found For Requested ID"
        )
    return infer_job


@router.get("/get_all_infer_jobs", response_model=List[schemas.AIInferJobRead])
def get_all_framework_details(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    infer_job_list = crud.ai_infer_job.get_all(db)
    if not infer_job_list:
        raise HTTPException(status_code=404, detail="No Infer Job Details Found")
    return infer_job_list
