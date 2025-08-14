from typing import Any
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
import models
from api import deps
from core.result_utils import *
from datetime import datetime
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("graph_api")


@router.get("/get_result_of_graph_data_for_admin")
def get_result_of_graph_data_for_admin(
    user_datetime: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    # testing datetime
    # str_datetime = "2021-04-03 10:00:00"
    # user_datetime = datetime.strptime(str_datetime, '%Y-%m-%d %H:%M:%S')
    deployed_rtsp_jobs = crud.deployed_rtsp_job.get_by_user_id(
        db=db, user_id=current_user.id
    )
    datetime_slot_list = get_datetime_slot(user_datetime)
    model_list = get_model_list_for_graph(deployed_rtsp_jobs)
    if model_list and datetime_slot_list:
        graph_result_list = get_graph_with_rate_data(
            model_list, current_user.id, datetime_slot_list
        )
        return graph_result_list
    else:
        return []


@router.get("/get_result_of_graph_data_for_supervisor")
def get_result_of_graph_data_for_supervisor(
    user_datetime: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    # testing datetime
    # str_datetime = "2021-04-03 10:00:00"
    # user_datetime = datetime.strptime(str_datetime, '%Y-%m-%d %H:%M:%S')
    current_user_company_id = current_user.company_id
    company_admin_details = crud.user.get_company_admin_by_supervisor(
        db=db, company_id=current_user_company_id
    )
    if company_admin_details:
        user_id = company_admin_details.id
        deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(db=db, user_id=user_id)
        if deployed_jobs:
            deployed_rtsp_jobs = filter_camera_list(
                current_user.locations, deployed_jobs
            )
            if deployed_rtsp_jobs:
                datetime_slot_list = get_datetime_slot(user_datetime)
                model_list = get_model_list_for_graph(deployed_rtsp_jobs)
                if model_list and datetime_slot_list:
                    location_list = []
                    if current_user.locations:
                        for location_obj in current_user.locations:
                            location_list.append(location_obj.__dict__["id"])
                    if not location_list:
                        raise HTTPException(
                            status_code=404, detail="No Location Found For User"
                        )
                    deployment_camera_list = (
                        crud.deployment_camera.get_total_enabled_cameras_by_location(
                            db, location_list
                        )
                    )
                    if not deployment_camera_list:
                        return []
                    camera_list = []
                    for camera in deployment_camera_list:
                        camera_list.append(camera.id)
                    db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                        db, camera_list
                    )
                    if not db_obj:
                        return []
                    label_list = []
                    for labels in db_obj:
                        for label in labels.__dict__["labels"].split(","):
                            label_list.append(label)
                    if not label_list:
                        return []
                    new_model_list = []
                    for model in model_list:
                        for label in model["labels_list"].split(","):
                            if label in label_list and model not in new_model_list:
                                new_model_list.append(model)
                    graph_result_list = get_graph_with_rate_data(
                        new_model_list, user_id, datetime_slot_list
                    )
                    return graph_result_list
                else:
                    return []
            else:
                logging.info("No Deployed RTSP Job Details For Found Supervisor")
                return []
        else:
            logging.info("No Deployed RTSP Job Details For Found Company Admin")
            return []
    else:
        logging.info("No Company Admin Detail Found")
        return []
