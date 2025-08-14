import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps

router = APIRouter()


@router.post("/add_model_test_credit", response_model=schemas.ModelTestCreditRead)
def add_model_test_credit(
    model_test_credit_details: schemas.ModelTestCreditCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    model_test_credit_details.created_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    model_test_credit_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    if isinstance(model_test_credit_details, dict):
        obj_in = model_test_credit_details
    else:
        obj_in = model_test_credit_details.dict(exclude_unset=True)
    out_obj = crud.model_test_credit_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.post("/update_model_test_credit", response_model=schemas.ModelTestCreditRead)
def update_model_test_credit(
    model_test_credit_details: schemas.ModelTestCreditUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.model_test_credit_crud_obj.get(db, model_test_credit_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For Update")

    model_test_credit_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    return crud.model_test_credit_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=model_test_credit_details
    )


# @router.get("/get_user_hyper_params_by_id", response_model=schemas.ModelTestCreditRead)
# def get_user_dataset_by_id(
#         user_hyper_params_id: int,
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_user)
# ) -> Any:
#     user_hyper_params = crud.model_test_credit_crud_obj.get_by_id(db, user_hyper_params_id)
#     if not user_hyper_params:
#         raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
#     return user_hyper_params
#


@router.get(
    "/get_model_test_credit_for_current_user",
    response_model=List[schemas.ModelTestCreditRead],
)
def get_model_test_credit_for_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_test_credit_list = crud.model_test_credit_crud_obj.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not model_test_credit_list:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return model_test_credit_list


@router.get(
    "/get_all_user_model_test_credit",
    response_model=List[schemas.ModelTestCreditSuperAdminRead],
)
def get_all_user_model_test_credit(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    model_test_credit_list = crud.model_test_credit_crud_obj.get_all(db)
    if not model_test_credit_list:
        raise HTTPException(status_code=404, detail="No Data Found")
    return model_test_credit_list
