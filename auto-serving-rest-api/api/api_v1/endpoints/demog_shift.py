from typing import Any, List

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_demog_shift", response_model=schemas.ShiftRead)
def add_demog_shift(
    shift_details: schemas.ShiftCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    shift_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    shift_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(shift_details, dict):
        obj_in = shift_details
    else:
        obj_in = shift_details.dict(exclude_unset=True)
    db_obj = crud.demog_shift.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/update_demog_shift", response_model=schemas.ShiftRead)
def update_demog_shift(
    shift_id: int,
    shift_details: schemas.ShiftCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_shift.get(db=db, id=shift_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")

    shift_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.demog_shift.update(db=db, db_obj=db_obj, obj_in=shift_details)


@router.get("/get_demog_shift_by_id", response_model=schemas.ShiftRead)
def get_demog_shift_by_id(
    shift_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_shift.get_by_id(db, shift_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_demog_shift", response_model=List[schemas.ShiftRead])
def get_all_demog_shift(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.demog_shift.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get(
    "/get_all_demog_shift_by_organisation_id", response_model=List[schemas.ShiftRead]
)
def get_all_demog_shift_by_organisation_id(
    organisation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_shift.get_all_demog_shift_by_organisation_id(
        db, organisation_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
