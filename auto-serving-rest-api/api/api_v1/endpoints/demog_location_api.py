from typing import Any, List

import models
from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
import datetime

router = APIRouter()


@router.post("/add_demog_location", response_model=schemas.DemogLocationRead)
def add_demog_location(
    location_details: schemas.DemogLocationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    location_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    location_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(location_details, dict):
        obj_in = location_details
    else:
        obj_in = location_details.dict(exclude_unset=True)

    db_obj = crud.demog_location_crud_obj.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/update_demog_location", response_model=schemas.DemogLocationRead)
def update_demog_location(
    location_id: int,
    location_details: schemas.DemogLocationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_location_crud_obj.get_by_id(db=db, id=location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")

    location_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.demog_location_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=location_details
    )


@router.get("/get_demog_location_by_id", response_model=schemas.DemogLocationRead)
def get_demog_location_by_id(
    location_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_location_crud_obj.get(db, location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_demog_locations", response_model=List[schemas.DemogLocationRead])
def get_all_demog_locations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.demog_location_crud_obj.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
