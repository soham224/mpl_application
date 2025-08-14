import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_feedback", response_model=schemas.FeedbackRead)
def add_feedback(
    feedback_details: schemas.FeedbackCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    feedback_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    feedback_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(feedback_details, dict):
        obj_in = feedback_details
    else:
        obj_in = feedback_details.dict(exclude_unset=True)
    out_obj = crud.feedback_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.post("/update_feedback", response_model=schemas.FeedbackRead)
def update_feedback(
    feedback_details: schemas.FeedbackUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.feedback_crud_obj.get(db, feedback_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For Update")

    feedback_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.feedback_crud_obj.update(db=db, db_obj=db_obj, obj_in=feedback_details)


@router.get("/get_feedback_of_current_user", response_model=List[schemas.FeedbackRead])
def get_feedback_of_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    feedback_list = crud.feedback_crud_obj.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not feedback_list:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return feedback_list


@router.get(
    "/get_all_user_feedback", response_model=List[schemas.FeedbackSuperAdminRead]
)
def get_all_user_feedback(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    feedback_list = crud.feedback_crud_obj.get_all(db)
    if not feedback_list:
        raise HTTPException(status_code=404, detail="No Data Found")
    return feedback_list
