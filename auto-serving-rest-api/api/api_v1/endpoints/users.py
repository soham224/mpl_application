import json
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.config import settings
from core.mail_utils import (
    send_activate_mail_to_user,
    send_user_registration_mail,
    send_registration_mail_to_superadmin,
)
import datetime
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("users")


@router.post("/add_user", response_model=schemas.User)
def create_user(
    *, db: Session = Depends(deps.get_db), user_in: schemas.UserCreate
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.user_email)
    if user:
        logging.warning("user already registered")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    if user:
        model_test_credit_details = schemas.ModelTestCreditCreate(
            total_credits=settings.MODEL_TEST_USER_CREDIT,
            created_date=datetime.datetime.utcnow().replace(microsecond=0),
            updated_date=datetime.datetime.utcnow().replace(microsecond=0),
            user_id=user.id,
            status=True,
        )
        if isinstance(model_test_credit_details, dict):
            obj_in = model_test_credit_details
        else:
            obj_in = model_test_credit_details.dict(exclude_unset=True)
        out_obj = crud.model_test_credit_crud_obj.create(db=db, obj_in=obj_in)
        if not out_obj:
            raise HTTPException(status_code=500, detail="Credits Not Recorded!")

    # if user:
    #     send_user_registration_mail(recipient_list=[user.user_email, user.company_email])
    #     send_registration_mail_to_superadmin(company_name=user.company_name,
    #                                          recipient_list=settings.SUPER_ADMIN_MAIL_LIST)

    return user


@router.post("/add_demog_admin", response_model=schemas.User)
def create_demog_admin(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
) -> Any:
    """
    Create new demog_admin.
    """
    user = crud.user.get_by_email(db, email=user_in.user_email)
    if user:
        logging.warning("user already registered")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create_demog_admin(db, obj_in=user_in)
    return user


@router.post("/check_user_from_autoDL", response_model=schemas.User)
def check_user(
    *, db: Session = Depends(deps.get_db), user_in: schemas.UserCreate
) -> Any:
    """
    check already exist user.
    """
    user = crud.user.authenticate(
        db, email=user_in.user_email, password=user_in.user_password
    )
    if user:
        return user
    else:
        logging.warning("user not found")
        raise HTTPException(
            status_code=400,
            detail="Incorrect username and password",
        )
    return user


@router.post("/add_supervisor", response_model=schemas.User)
def create_supervisor(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new supervisor.
    """
    user = crud.user.get_by_email(db, email=user_in.user_email)
    if user:
        logging.warning("user already registered")
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud.user.create_supervisor(
        db, obj_in=user_in, company_id=current_user.company_id
    )

    # if user:
    #     send_user_registration_mail(recipient_list=[user.user_email, user.company_email])
    #     send_registration_mail_to_superadmin(company_name=user.company_name,
    #                                          recipient_list=settings.SUPER_ADMIN_MAIL_LIST)

    return user


@router.post("/update_user_status")
def update_user_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    user = crud.user.update_user_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        # send_activate_mail_to_user(company_name=user.company_name, recipient_list=[user.user_email, user.company_email])
        return "User Status Updated"


@router.post("/update_user_status_from_autoDL")
def update_user_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
) -> Any:
    user = crud.user.update_user_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        return "User Status Updated"


@router.post("/update_supervisor_status")
def update_supervisor_status(
    *,
    db: Session = Depends(deps.get_db),
    user_status: bool,
    user_id: int,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.update_supervisor_status(db, user_id, user_status)

    if not user:
        logging.warning("User not found")
        raise HTTPException(
            status_code=404,
            detail="No User found, User Status Not Updated",
        )
    else:
        return "Supervisor Status Updated"


@router.post("/get_all_users", response_model=List[schemas.User])
def get_all_users(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    users = crud.user.get_all_users(db)
    return users


@router.post("/get_all_users_for_result_manager", response_model=List[schemas.User])
def get_all_users_result_manager(
    *,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    result_manager_companies = []
    user = crud.user.get_result_manager_by_id(db, current_user.id)
    if user:
        logging.info("{} user".format(user[0].roles[0].role))
        for company in user[0].companies:
            user1 = crud.user.get_admin_of_current_user_by_company_id(db, company.id)
            result_manager_companies.append(user1[0])
        logging.info("{} company_list".format(result_manager_companies))
    return result_manager_companies


@router.post("/get_all_company_supervisor", response_model=List[schemas.User])
def get_all_company_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_all_supervisor(db, current_user.company_id)
    return user


@router.post("/get_all_enabled_company_supervisor", response_model=List[schemas.User])
def get_all_company_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return crud.user.get_all_enabled_supervisor(db, current_user.company_id)


@router.post("/assign_locations", response_model=schemas.User)
def get_all_location(
    user_id: int,
    location_id_list: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_by_id(db, user_id=user_id)
    if user and location_id_list:
        for location_id in location_id_list:
            response = crud.user.add_location_mapping(db, user_id, location_id)
        return response

    else:
        raise HTTPException(
            status_code=400,
            detail="User not found to assign the location",
        )


@router.post("/remove_assigned_locations", response_model=schemas.User)
def get_all_location(
    user_id: int,
    location_id_list: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user = crud.user.get_by_id(db, user_id=user_id)
    if user and location_id_list:
        for location_id in location_id_list:
            response = crud.user.remove_location_mapping(db, user_id, location_id)
        return response
    else:
        raise HTTPException(
            status_code=400,
            detail="User not found to assign the location",
        )
