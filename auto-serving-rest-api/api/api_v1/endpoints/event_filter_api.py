from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from api import deps
from core.event_utils import (
    get_events_type_list_by_user_id,
    get_supervisor_filter_event_mongo_data,
    get_event_data_of_last_graph_step,
    get_events_type_list_by_user_camera_id,
)
from core.result_utils import *
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("event_filter_api")


@router.post("/get_filter_event_of_admin")
def get_filter_event_of_admin(
    filter_details: schemas.EventFilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    if filter_details:
        if filter_details.selected_event_list:
            event_type_list = filter_details.selected_event_list
        else:
            user_events = get_events_type_list_by_user_id(current_user.id)
            event_type_list = ",".join([str(element) for element in user_events])
        if event_type_list:
            if filter_details.initial_graph:
                data_list = get_supervisor_filter_event_mongo_data(
                    current_user.id,
                    filter_details.camera_id,
                    filter_details.start_date,
                    filter_details.end_date,
                    event_type_list,
                    filter_details.duration_type,
                    filter_details.initial_graph,
                    filter_details.current_date,
                )
            else:
                data_list = get_supervisor_filter_event_mongo_data(
                    current_user.id,
                    filter_details.camera_id,
                    filter_details.start_date,
                    filter_details.end_date,
                    event_type_list,
                    filter_details.duration_type,
                )
            return data_list
        else:
            logging.info("No Event Type List Found")
            return []
    else:
        logging.info("No Filter Details Found")
        return []
    return filter_data_result


@router.post("/get_filter_event_of_supervisor")
def get_filter_event_of_supervisor(
    filter_details: schemas.EventFilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if filter_details:
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            location_list = []
            if current_user.locations:
                for location_obj in current_user.locations:
                    location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
            if filter_details.selected_event_list:
                event_type_list = filter_details.selected_event_list
            else:
                camera_id = get_camera_id_list_for_supervisor(location_list, db)
                user_events = get_events_type_list_by_user_camera_id(
                    company_admin.id, camera_id
                )
                event_type_list = ",".join([str(element) for element in user_events])
            if event_type_list:
                camera_id = filter_details.camera_id
            else:
                camera_id = get_camera_id_list_for_supervisor(location_list, db)
            if event_type_list:
                if filter_details.initial_graph:
                    data_list = get_supervisor_filter_event_mongo_data(
                        company_admin.id,
                        camera_id,
                        filter_details.start_date,
                        filter_details.end_date,
                        event_type_list,
                        filter_details.duration_type,
                        filter_details.initial_graph,
                        filter_details.current_date,
                    )
                else:
                    data_list = get_supervisor_filter_event_mongo_data(
                        company_admin.id,
                        camera_id,
                        filter_details.start_date,
                        filter_details.end_date,
                        event_type_list,
                        filter_details.duration_type,
                    )
                return data_list
            else:
                logging.info("No Event Type List Found")
                return []
        else:
            logging.info("No Company Admin Found")
            return []
    else:
        logging.info("No Filter Details Found")
        return []
    return filter_data_result


@router.get("/get_filter_event_of_last_graph_step")
def get_filter_event_of_last_graph_step(
    data_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    data_list = json.loads(get_event_data_of_last_graph_step(data_id))
    return data_list
