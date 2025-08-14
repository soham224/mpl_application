from typing import Any, List

import models
from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import schemas
import datetime

router = APIRouter()


@router.post("/add_demog_department", response_model=schemas.DepartmentRead)
def add_demog_department(
    department_details: schemas.DepartmentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    department_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    department_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(department_details, dict):
        obj_in = department_details
    else:
        obj_in = department_details.dict(exclude_unset=True)

    db_obj = crud.demog_department_crud_obj.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/update_demog_department", response_model=schemas.DepartmentRead)
def update_demog_department(
    department_id: int,
    department_details: schemas.DepartmentCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_department_crud_obj.get_by_id(db=db, id=department_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")

    department_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.demog_department_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=department_details
    )


@router.get("/get_demog_department_by_id", response_model=schemas.DepartmentRead)
def get_demog_department_by_id(
    department_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_department_crud_obj.get(db, department_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get(
    "/get_all_demog_department_by_organisation_id",
    response_model=List[schemas.DepartmentRead],
)
def get_demog_department_by_id(
    organisation_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_demog_admin),
) -> Any:
    db_obj = crud.demog_department_crud_obj.get_all_demog_department_by_organisation_id(
        db, organisation_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_demog_departments", response_model=List[schemas.DepartmentRead])
def get_all_demog_departments(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    db_obj = crud.demog_department_crud_obj.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
