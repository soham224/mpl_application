import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("result_feedback")


@router.post("/add_result_feedback")
def add_result_feedback(
    rating: int = Form(...),
    model_id: int = Form(...),
    infer_job_id: int = Form(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    created_date = datetime.datetime.utcnow().replace(microsecond=0)
    updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    user_id = current_user.id

    result_feedback_details = schemas.ResultFeedbackCreate(
        rating=rating,
        model_id=model_id,
        infer_job_id=infer_job_id,
        user_id=user_id,
        status=True,
        created_date=created_date,
        updated_date=updated_date,
    )

    if isinstance(result_feedback_details, dict):
        in_obj = result_feedback_details
    else:
        in_obj = result_feedback_details.dict(exclude_unset=True)

    result_feedback = crud.result_feedback.create(db=db, obj_in=in_obj)
    if not result_feedback:
        logging.error("Data Not Recorded")
        raise HTTPException(status_code=500, detail="Data Not Recorded")
    return "Data Recorded Successfully"


@router.get("/get_all_result_feedback", response_model=List[schemas.ResultFeedbackRead])
def get_all_result_feedback(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    result_feedback_list = crud.result_feedback.get_all(db)
    if not result_feedback_list:
        logging.info("No Result Feedback Data Found")
        raise HTTPException(status_code=404, detail="No Result Feedback Data Found")
    return result_feedback_list
