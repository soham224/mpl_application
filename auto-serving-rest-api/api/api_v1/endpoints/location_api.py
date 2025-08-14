from typing import Any, List
from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from datetime import datetime
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("location_api")


@router.post("/add_location", response_model=schemas.LocationRead)
def add_location(
    location_details: schemas.LocationCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    location = crud.location_crud_obj.get_by_name(
        db, name=location_details.location_name, company_id=current_user.company_id
    )
    if location:
        logging.warning("location name already taken")
        raise HTTPException(
            status_code=400,
            detail="The location name already exists in the system.",
        )
    location_details.created_date = datetime.utcnow()
    location_details.updated_date = datetime.utcnow()
    location_details.company_id = current_user.company_id

    if isinstance(location_details, dict):
        obj_in = location_details
    else:
        obj_in = location_details.dict(exclude_unset=True)

    db_obj = crud.location_crud_obj.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/update_location", response_model=schemas.LocationRead)
def update_location(
    location_details: schemas.LocationUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.location_crud_obj.get(db, location_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    location = crud.location_crud_obj.get_by_name(
        db, name=location_details.location_name, company_id=current_user.company_id
    )
    if location:
        logging.warning("location name already taken")
        raise HTTPException(
            status_code=400,
            detail="The location name already exists in the system.",
        )
    location_details.updated_date = datetime.utcnow()
    return crud.location_crud_obj.update(db=db, db_obj=db_obj, obj_in=location_details)


@router.post("/update_location_status", response_model=schemas.LocationRead)
def update_location(
    location_id: int,
    location_status: bool,
    updated_date: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.location_crud_obj.get_by_id(db, location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    location_details = schemas.LocationUpdate(
        id=db_obj.id,
        location_name=db_obj.location_name,
        company_id=db_obj.company_id,
        status=location_status,
        created_date=db_obj.created_date,
        updated_date=datetime.utcnow(),
    )
    return crud.location_crud_obj.update(db=db, db_obj=db_obj, obj_in=location_details)


@router.get("/get_location_by_id", response_model=schemas.LocationRead)
def get_location_by_id(
    location_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.location_crud_obj.get_by_id(db, location_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_location", response_model=List[schemas.LocationRead])
def get_all_location(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.location_crud_obj.get_all(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_all_enabled_location", response_model=List[schemas.LocationRead])
def get_all_enabled_location(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.location_crud_obj.get_all_enabled(db)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_current_user_locations", response_model=List[schemas.LocationRead])
def get_current_user_locations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return current_user.locations


@router.get("/get_current_company_locations", response_model=List[schemas.LocationRead])
def get_current_company_locations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.location_crud_obj.get_all_company_location(
        db, current_user.company_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get(
    "/get_current_company_enabled_locations", response_model=List[schemas.LocationRead]
)
def get_current_company_enabled_locations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.location_crud_obj.get_all_company_enabled_location(
        db, current_user.company_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get(
    "/get_supervisor_enabled_locations", response_model=List[schemas.LocationRead]
)
def get_supervisor_enabled_locations(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        raise HTTPException(status_code=404, detail="Data not found.")
    supervisor_location_list = crud.location_crud_obj.get_total_enabled_locations_obj(
        db, location_list
    )
    if not supervisor_location_list:
        return []
    return supervisor_location_list


@router.get(
    "/get_company_enabled_locations_result_manager",
    response_model=List[schemas.LocationRead],
)
def get_company_enabled_locations_result_manager(
    company_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    db_obj = crud.location_crud_obj.get_all_company_enabled_location(db, company_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj
