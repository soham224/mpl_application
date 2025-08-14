import os
from typing import Any, List

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_demog_organisation", response_model=schemas.OrganisationRead)
def add_demog_organisation(
    organisation_details: schemas.OrganisationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    organisation_details.created_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    organisation_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    if isinstance(organisation_details, dict):
        obj_in = organisation_details
    else:
        obj_in = organisation_details.dict(exclude_unset=True)
    db_obj = crud.demog_organisation.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/update_demog_organisation", response_model=schemas.OrganisationRead)
def update_demog_organisation(
    organisation_id: int,
    organisation_details: schemas.OrganisationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_organisation.get(db=db, id=organisation_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")

    organisation_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    return crud.demog_organisation.update(
        db=db, db_obj=db_obj, obj_in=organisation_details
    )


@router.get("/get_demog_organisation_by_id", response_model=schemas.OrganisationRead)
def get_demog_organisation_by_id(
    organisation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_organisation.get_by_id(db, organisation_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_organisations", response_model=List[schemas.OrganisationRead])
def get_all_organisations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.demog_organisation.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
