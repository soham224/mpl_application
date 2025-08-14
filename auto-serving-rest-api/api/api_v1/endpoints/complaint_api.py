import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from typing import Optional
from core.aws_utils import *

router = APIRouter()


@router.post("/add_complaint", response_model=schemas.ComplaintRead)
def add_complaint(
    complaint_message: str,
    complaint_image: Optional[UploadFile] = File(None),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if complaint_image:
        img_url = upload_complaint_file_on_s3(current_user.id, complaint_image)
    else:
        img_url = ""
    complaint_details = schemas.ComplaintCreate(
        complaint_message=complaint_message,
        img_url=img_url,
        user_id=current_user.id,
        status=True,
        created_date=datetime.datetime.utcnow().replace(microsecond=0),
        updated_date=datetime.datetime.utcnow().replace(microsecond=0),
    )
    if isinstance(complaint_details, dict):
        obj_in = complaint_details
    else:
        obj_in = complaint_details.dict(exclude_unset=True)
    out_obj = crud.complaint_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.get(
    "/get_complaint_of_current_user", response_model=List[schemas.ComplaintRead]
)
def get_complaint_of_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    complaint_list = crud.complaint_crud_obj.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not complaint_list:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return complaint_list


@router.get(
    "/get_all_user_complaint", response_model=List[schemas.ComplaintSuperAdminRead]
)
def get_all_user_complaint(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    complaint_list = crud.complaint_crud_obj.get_all(db)
    if not complaint_list:
        raise HTTPException(status_code=404, detail="No Data Found")
    return complaint_list
