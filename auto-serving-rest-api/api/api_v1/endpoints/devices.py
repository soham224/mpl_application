from typing import Any, List

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_device", response_model=schemas.DeviceRead)
def add_device(
    device_details: schemas.DeviceCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    device_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    device_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(device_details, dict):
        device_obj = device_details
    else:
        device_obj = device_details.dict(exclude_unset=True)

    device = crud.device.create(db=db, obj_in=device_obj)
    if not device:
        raise HTTPException(status_code=500, detail="Device Not Added")
    return device


@router.post("/update_device", response_model=schemas.DeviceRead)
def update_device(
    device_details: schemas.DeviceUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    device = crud.device.get(db, device_details.id)
    if not device:
        raise HTTPException(status_code=404, detail="Device Not Found")

    device_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.device.update(db=db, db_obj=device, obj_in=device_details)


@router.get("/get_device_by_id", response_model=schemas.DeviceRead)
def get_device_by_id(
    device_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    device = crud.device.get_by_id(db, device_id)
    if not device:
        raise HTTPException(status_code=404, detail="No Device Found")
    return device


@router.get("/get_all_devices", response_model=List[schemas.DeviceRead])
def get_all_devices(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    devices = crud.device.get_all(db)
    if not devices:
        raise HTTPException(status_code=404, detail="No Devices Found")
    return devices
