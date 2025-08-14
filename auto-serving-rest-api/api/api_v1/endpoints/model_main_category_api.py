from typing import Any, List, Optional

from api import deps
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
import datetime

router = APIRouter()


@router.post("/add_model_main_category", response_model=schemas.ModelMainCategoryRead)
def add_model_main_category(
    model_category_details: schemas.ModelMainCategoryCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_category_details.created_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    model_category_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    if isinstance(model_category_details, dict):
        model_main_category_obj = model_category_details
    else:
        model_main_category_obj = model_category_details.dict(exclude_unset=True)

    model_main_category = crud.model_main_category_crud_obj.create(
        db=db, obj_in=model_main_category_obj
    )
    if not model_main_category:
        raise HTTPException(status_code=500, detail="Model Main Category Not Added")
    return model_main_category


@router.post(
    "/update_model_main_category", response_model=schemas.ModelMainCategoryRead
)
def update_model_main_category(
    model_category_details: schemas.ModelMainCategoryUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_category_obj = crud.model_main_category_crud_obj.get(
        db, model_category_details.id
    )
    if not model_category_obj:
        raise HTTPException(status_code=404, detail="ModelMainCategory Not Found")

    model_category_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    return crud.model_main_category_crud_obj.update(
        db=db, db_obj=model_category_obj, obj_in=model_category_details
    )


@router.get(
    "/get_model_main_category_by_id", response_model=schemas.ModelMainCategoryRead
)
def get_model_main_category_by_id(
    model_category_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_category_obj = crud.model_main_category_crud_obj.get_by_id(
        db, model_category_id
    )
    if not model_category_obj:
        raise HTTPException(status_code=404, detail="No ModelMainCategory Found")
    return model_category_obj


@router.get(
    "/get_all_model_main_category", response_model=List[schemas.ModelMainCategoryRead]
)
def get_all_model_main_category(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model_category_obj = crud.model_main_category_crud_obj.get_all(db)
    if not model_category_obj:
        raise HTTPException(status_code=404, detail="No ModelMainCategory Found")
    return model_category_obj


@router.get("/get_model_by_model_category_id", response_model=List[schemas.ModelRead])
def get_model_by_id(
    model_category_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model = crud.model_main_category_crud_obj.get_by_model_category_id(
        db, model_category_id
    )
    if not model:
        raise HTTPException(status_code=404, detail="No Models Found")
    return model


@router.get(
    "/get_enabled_model_by_model_category_id", response_model=List[schemas.ModelRead]
)
def get_enabled_model_by_model_category_id(
    model_category_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model = crud.model_main_category_crud_obj.get_enabled_by_model_category_id(
        db, model_category_id
    )
    if not model:
        raise HTTPException(status_code=404, detail="No Models Found")
    return model


@router.post(
    "/get_models_by_list_of_model_category_id", response_model=List[schemas.ModelRead]
)
def get_models_by_list_of_model_category_id(
    model_category_id: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    model = crud.model_main_category_crud_obj.get_models_by_list_of_model_category_id(
        db, model_category_id
    )
    if not model:
        raise HTTPException(status_code=404, detail="No Models Found")
    return model
