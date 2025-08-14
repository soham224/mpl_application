import json
from datetime import datetime
from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.event_utils import (
    add_event_in_mongo_db,
    get_event_initial_info,
    get_paginated_event,
    get_events_type_list_by_user_id,
    get_events_type_list_by_user_camera_id,
    update_event_status,
    get_event_paginated_result_manager,
    get_event_datetime_initial_info_result_manager,
)
from typing import Optional

from core.result_utils import get_camera_id_list_for_supervisor
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("event_handler")


@router.post("/add_event_from_result_manager")
def add_event_from_result_manager(
    event_details: schemas.EventCreate,
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    return add_event_in_mongo_db(
        event_details.company_id,
        event_details.user_id,
        event_details.camera_id,
        event_details.event_name,
        event_details.event_desc,
        event_details.event_type,
        event_details.event_date,
        event_details.created_date,
        event_details.updated_date,
        event_details.status,
        event_details.is_hide,
        event_details.image_list,
    )


@router.post("/get_event_metadata")
def get_event_metadata(
    camera_id_list: Optional[list] = None,
    event_type_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        if not camera_id_list:
            location_list = []
            if current_user.locations:
                for location_obj in current_user.locations:
                    location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        return get_event_initial_info(
            user_id, camera_id_list, event_type_list, start_date, end_date
        )
    else:
        user_id = current_user.id
        return get_event_initial_info(
            user_id, camera_id_list, event_type_list, start_date, end_date
        )


@router.post("/get_event")
def get_event(
    page_number: int,
    camera_id_list: Optional[list] = None,
    event_type_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        if not camera_id_list:
            location_list = []
            if current_user.locations:
                for location_obj in current_user.locations:
                    location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        data_list = json.loads(
            get_paginated_event(
                user_id,
                camera_id_list,
                page_number,
                event_type_list,
                start_date,
                end_date,
            )
        )
    else:
        user_id = current_user.id
        data_list = json.loads(
            get_paginated_event(
                user_id,
                camera_id_list,
                page_number,
                event_type_list,
                start_date,
                end_date,
            )
        )
    return data_list


@router.post("/get_event_metadata_result_manager")
def get_event_metadata_result_manager(
    user_id: int,
    camera_id_list: Optional[list] = None,
    event_type_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    isHide: Optional[bool] = None,
    isViewAll: Optional[bool] = None,
    isLocationSelected: Optional[bool] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    return get_event_datetime_initial_info_result_manager(
        user_id,
        camera_id_list,
        event_type_list,
        start_date,
        end_date,
        isHide,
        isViewAll,
        isLocationSelected,
    )


@router.post("/get_event_result_manager")
def get_event_result_manager(
    page_number: int,
    user_id: int,
    camera_id_list: Optional[list] = None,
    event_type_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    isHide: Optional[bool] = None,
    isViewAll: Optional[bool] = None,
    isLocationSelected: Optional[bool] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    data_list = json.loads(
        get_event_paginated_result_manager(
            user_id,
            camera_id_list,
            page_number,
            event_type_list,
            start_date,
            end_date,
            isHide,
            isViewAll,
            isLocationSelected,
        )
    )
    return data_list


@router.get("/get_all_event_type_by_user_id")
def get_all_event_type_by_user_id(
    user_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
        location_list = []
        if current_user.locations:
            for location_obj in current_user.locations:
                location_list.append(location_obj.__dict__["id"])
        if not location_list:
            raise HTTPException(status_code=404, detail="No Location Found For User")
        camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
        return get_events_type_list_by_user_camera_id(user_id, camera_id_list)
    else:
        user_id = user_id
        return get_events_type_list_by_user_id(user_id)


@router.post("/update_event_status_result_manager")
def update_event_status_result_manager(
    oid: str,
    status_val: bool,
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    return update_event_status(oid, status_val)


@router.post("/get_event_type_by_camera_id")
def get_event_type_by_camera_id(
    camera_id_list: List[str],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []
    else:
        user_id = current_user.id
    return get_events_type_list_by_user_camera_id(user_id, camera_id_list)
