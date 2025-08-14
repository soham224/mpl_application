import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.result_utils import get_camera_id_list_by_user_id, get_camera_coordinates

router = APIRouter()


@router.post("/add_camera_roi", response_model=schemas.CameraROIRead)
def add_camera_roi(
    camera_roi_details: schemas.CameraROICreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    camera_roi_details.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    camera_roi_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(camera_roi_details, dict):
        obj_in = camera_roi_details
    else:
        obj_in = camera_roi_details.dict(exclude_unset=True)
    out_obj = crud.camera_roi_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.post("/update_camera_roi", response_model=schemas.CameraROIRead)
def update_camera_roi(
    camera_roi_details: schemas.CameraROIUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_roi_crud_obj.get(db, camera_roi_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For Update")

    camera_roi_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.camera_roi_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=camera_roi_details
    )


@router.get("/get_camera_roi_by_id", response_model=schemas.CameraROIRead)
def get_camera_roi_by_id(
    camera_roi_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_roi_crud_obj.get(db, camera_roi_id)
    if not db_obj:
        return []
    return db_obj


@router.get("/get_camera_roi_by_camera_id", response_model=List[schemas.CameraROIRead])
def get_camera_roi_by_camera_id(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_roi_crud_obj.get_by_camera__id(db, camera_id)
    if not db_obj:
        return []
    return db_obj


@router.get("/get_camera_roi_by_user_id")
def get_camera_roi_by_user_id(user_id: int, db: Session = Depends(deps.get_db)) -> Any:
    camera_id_list = get_camera_id_list_by_user_id(user_id, db)
    if not camera_id_list:
        return None
        # raise HTTPException(status_code=404, detail="No Camera Found For Requested ID")
    else:
        camera_coordinates = get_camera_coordinates(camera_id_list, db)
    if not camera_coordinates:
        return None
        # raise HTTPException(status_code=404, detail="No Camera Coordinates Found For Requested ID")
    return camera_coordinates
