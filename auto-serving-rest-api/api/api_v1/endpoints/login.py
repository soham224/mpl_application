from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core import security
from core.config import settings
from core.security import get_password_hash
from utils import verify_password_reset_token

# import logging
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("login")


@router.post("/login/access-token", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    logging.info("login request : {}".format(form_data.username))
    user = crud.user.authenticate(
        db, email=form_data.username.lower(), password=form_data.password
    )
    if not user:
        logging.info("Incorrect email or password")
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not crud.user.is_active(user):
        logging.info("Inactive user")
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    logging.info("login success : {}".format(form_data.username))
    logging.info("user.id : {}".format(user.id))
    logging.info("access_token_expires : {}".format(access_token_expires))
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }


@router.post("/login/test-token", response_model=schemas.User)
def test_token(current_user: models.User = Depends(deps.get_current_user)) -> Any:
    """
    Test access token
    """
    return current_user


@router.post("/reset-password/", response_model=schemas.Msg)
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Reset password
    """
    user_id = verify_password_reset_token(token)
    if not user_id:
        logging.info("Invalid token")
        raise HTTPException(status_code=400, detail="Invalid token")
    user = crud.user.get_by_id(db, user_id=user_id)
    if not user:
        logging.info("The user does not exist in the system.")
        raise HTTPException(
            status_code=404,
            detail="The user does not exist in the system.",
        )
    elif not crud.user.is_active(user):
        logging.info("Inactive user")
        raise HTTPException(status_code=400, detail="Inactive user")
    hashed_password = get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.add(user)
    db.commit()
    logging.info("Password updated successfully")
    return {"msg": "Password updated successfully"}
