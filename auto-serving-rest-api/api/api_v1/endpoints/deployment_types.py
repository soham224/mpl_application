from typing import Any, List

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_deployment_type", response_model=schemas.DeploymentTypeRead)
def add_deployment_type(
    deployment_type_details: schemas.DeploymentTypeCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    deployment_type_details.created_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    deployment_type_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    if isinstance(deployment_type_details, dict):
        device_obj = deployment_type_details
    else:
        device_obj = deployment_type_details.dict(exclude_unset=True)

    deployment_type = crud.deployment_type.create(db=db, obj_in=device_obj)
    if not deployment_type:
        raise HTTPException(status_code=500, detail="Deployment Type Not Added")
    return deployment_type


@router.post(
    "/update_deployment_type_details", response_model=schemas.DeploymentTypeRead
)
def update_deployment_type_details(
    deployment_type_details: schemas.DeploymentTypeUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    deployment_type = crud.deployment_type.get(db, deployment_type_details.id)
    if not deployment_type:
        raise HTTPException(status_code=404, detail="Deployment Type Not Found")

    deployment_type_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    return crud.deployment_type.update(
        db=db, db_obj=deployment_type, obj_in=deployment_type_details
    )


@router.get("/get_deployment_type_by_id", response_model=schemas.DeploymentTypeRead)
def get_deployment_type_by_id(
    deployment_type_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_type = crud.deployment_type.get_by_id(db, deployment_type_id)
    if not deployment_type:
        raise HTTPException(status_code=404, detail="No Deployment Type Found")
    return deployment_type


@router.get("/get_all_deployment_type", response_model=List[schemas.DeploymentTypeRead])
def get_all_deployment_type(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_type_list = crud.deployment_type.get_all(db)
    if not deployment_type_list:
        raise HTTPException(status_code=404, detail="No Deployment Type Found")
    return deployment_type_list
