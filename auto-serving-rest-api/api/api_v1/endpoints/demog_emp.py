from typing import Any, List

from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
import random
import string
from fastapi import APIRouter, Depends, HTTPException

from core.aws_utils import publish_text_message
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("demog_emp")


def password_generator():
    lower = string.ascii_lowercase
    upper = string.ascii_uppercase
    num = string.digits
    symbols = string.punctuation
    combine = lower + upper + num + symbols
    temp = random.sample(combine, 8)
    password = "".join(temp)
    logging.info("password : {}".format(password))
    return password


@router.post("/add_demog_emp", response_model=schemas.Emp)
def create_demog_emp(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.EmpCreate,
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    employee = crud.demog_emp.get_by_phone_number(db, phone=user_in.emp_phone)
    if employee:
        logging.warning("Employee already registered")
        raise HTTPException(
            status_code=400,
            detail="The Employee with this number already exists in the system.",
        )
    first_time_password = password_generator()
    send_sms = publish_text_message(
        user_in.emp_phone, "Your Login password is {}".format(first_time_password)
    )
    if not send_sms:
        raise HTTPException(
            status_code=400,
            detail="Can not send sms on phone number",
        )
    user = crud.demog_emp.create_demog_emp(
        db, obj_in=user_in, password=first_time_password
    )
    return user


@router.post("/get_all_demog_emp", response_model=List[schemas.Emp])
def get_all_demog_emp(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    emps = crud.demog_emp.get_all_emps(db)
    return emps


@router.get("/get_all_demog_emp_by_organisation_id", response_model=List[schemas.Emp])
def get_all_demog_emp_by_organisation_id(
    organisation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_emp.get_all_emps_by_organisation_id(db, organisation_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
