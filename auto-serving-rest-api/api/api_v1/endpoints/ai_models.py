import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from typing import Optional
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("ai_models")


@router.post("/add_ai_model", response_model=schemas.ModelRead)
def add_ai_model(
    ai_model: schemas.ModelCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    ai_model.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    ai_model.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    if isinstance(ai_model, dict):
        device_obj = ai_model
    else:
        device_obj = ai_model.dict(exclude_unset=True)

    device = crud.ai_model.create(db=db, obj_in=device_obj)
    if not device:
        raise HTTPException(status_code=500, detail="Model Not Added")
    return device


@router.post("/add_ai_model_from_autoDL", response_model=schemas.ModelRead)
def add_ai_model(
    ai_model: schemas.ModelCreate,
    db: Session = Depends(deps.get_db),
) -> Any:
    ai_model.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    ai_model.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    ai_model.status = True
    if isinstance(ai_model, dict):
        device_obj = ai_model
    else:
        device_obj = ai_model.dict(exclude_unset=True)

    device = crud.ai_model.create(db=db, obj_in=device_obj)
    if not device:
        raise HTTPException(status_code=500, detail="Model Not Added")
    return device


@router.post("/update_ai_model", response_model=schemas.ModelRead)
def update_ai_model(
    model_details: schemas.ModelUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    ai_model = crud.ai_model.get(db, model_details.id)
    if not ai_model:
        raise HTTPException(status_code=404, detail="Model Not Found")

    model_details.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    return crud.ai_model.update(db=db, db_obj=ai_model, obj_in=model_details)


#
@router.get("/get_model_by_id", response_model=schemas.ModelRead)
def get_model_by_id(
    model_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model = crud.ai_model.get_by_id(db, model_id)
    if not model:
        raise HTTPException(status_code=404, detail="No Model Found")
    return model


@router.get("/get_model_by_model_type_id", response_model=List[schemas.ModelRead])
def get_model_by_id(
    model_type_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model = crud.ai_model.get_by_model_type_id(db, model_type_id)
    if not model:
        raise HTTPException(status_code=404, detail="No Models Found")
    return model


@router.get(
    "/get_enabled_model_by_model_type_id", response_model=List[schemas.ModelRead]
)
def get_enabled_model_by_model_type_id(
    model_type_id: int,
    user_id: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if user_id:
        model = crud.ai_model.get_enabled_by_model_type_id_user_id(
            db, model_type_id, user_id
        )
        if not model:
            raise HTTPException(status_code=404, detail="No Models Found")
        return model
    else:
        model = crud.ai_model.get_enabled_by_model_type_id(db, model_type_id)
        if not model:
            raise HTTPException(status_code=404, detail="No Models Found")
        return model


@router.get("/enabled_model_search", response_model=List[schemas.ModelRead])
def enabled_model_search(
    model_name: str,
    user_id: Optional[int] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if user_id:
        model = crud.ai_model.private_model_catalogue_search(db, model_name, user_id)
        if not model:
            raise HTTPException(status_code=404, detail="No Models Found")
        return model
    else:
        model = crud.ai_model.model_catalogue_search(db, model_name)
        if not model:
            raise HTTPException(status_code=404, detail="No Models Found")
        return model


@router.get("/get_all_models", response_model=List[schemas.ModelRead])
def get_all_models(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    models_list = crud.ai_model.get_all(db)
    if not models_list:
        raise HTTPException(status_code=404, detail="No Models Found")
    return models_list


@router.post("/get_all_models_by_camera_list", response_model=List[schemas.AIModelRead])
def get_all_models(
    camera_id: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("No Admin Found For That User")
            return []

        if not camera_id or -1 in camera_id:
            location_obj = current_user.locations
            location_list = [location.id for location in location_obj]
            camera_obj = crud.deployment_camera.get_total_cameras_by_location_list(
                db, location_list, user_id
            )
            camera_list = [camera.id for camera in camera_obj]
        else:
            camera_list = camera_id
        models_list = crud.ai_model.get_ai_model_by_camera_list(
            db, user_id, camera_list
        )
        if not models_list:
            raise HTTPException(status_code=404, detail="No Models Found")
        return models_list
    except Exception as e:
        logging.info("get_all_camera_location_model {}".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")
