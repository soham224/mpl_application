from typing import Any
from datetime import timedelta

from sqlalchemy.orm import Session

import crud
import schemas
from api import deps
from core.config import settings
from core import security
from fastapi import APIRouter, Body, Depends, HTTPException, Form

from core.security import get_password_hash
from utils import verify_password_reset_token
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("demog_emp_login")


@router.post("/demog_emp/login/access-token", response_model=schemas.Token)
def login_access_token(
    phone_number: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    logging.info("login request : {}".format(phone_number))
    employee = crud.demog_emp.authenticate(db, phone=phone_number, password=password)
    if not employee:
        logging.info("Incorrect phone number or password")
        raise HTTPException(
            status_code=400, detail="Incorrect phone number or password"
        )
    elif not crud.demog_emp.is_active(employee):
        logging.info("Inactive Employee")
        raise HTTPException(status_code=400, detail="Inactive Employee")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    logging.info("login success : {}".format(phone_number))
    return {
        "access_token": security.create_access_token(
            employee.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/demog_emp/login/test-token", response_model=schemas.Emp)
def test_token(
    phone_number: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Test access token
    """
    employee = crud.demog_emp.authenticate(db, phone=phone_number, password=password)
    if not employee:
        logging.info("Incorrect phone number or password")
        raise HTTPException(
            status_code=400, detail="Incorrect phone number or password"
        )
    return employee


@router.post("/demog_emp/reset-password/", response_model=schemas.Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    confirm_password: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Reset password
    """
    emp_id = verify_password_reset_token(token)
    if not emp_id:
        logging.info("Invalid token")
        raise HTTPException(status_code=400, detail="Invalid token")
    if not new_password == confirm_password:
        raise HTTPException(
            status_code=400, detail="New Password and Confirm Password Not Match"
        )
    employee = crud.demog_emp.get_by_id(db, emp_id=emp_id)
    if not employee:
        logging.info("The Employee does not exist in the system.")
        raise HTTPException(
            status_code=404,
            detail="The Employee does not exist in the system.",
        )
    elif not crud.demog_emp.is_active(employee):
        logging.info("Inactive Employee")
        raise HTTPException(status_code=400, detail="Inactive Employee")
    hashed_password = get_password_hash(new_password)
    employee.emp_password = hashed_password
    employee.is_reset_password = True
    db.add(employee)
    db.commit()
    logging.info("Password updated successfully")
    return {"msg": "Password updated successfully"}
