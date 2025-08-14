from typing import Any, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from api import deps
from core.result_utils import *
from typing import Optional
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("filter_api")


@router.get("/get_filter_data_of_current_user")
def get_filter_data_of_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    filter_data_list = []
    deployed_rtsp_jobs = crud.deployed_rtsp_job.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not deployed_rtsp_jobs:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
        deployed_rtsp_job_id = deployed_rtsp_jobs_obj.id
        model_name = (
            deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_name
        )
        model_id = deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.id
        model_labels_list = (
            deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
        )
        camera_settings_list = (
            deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings
        )
        if camera_settings_list:
            location_list = []
            for camera_settings_obj in camera_settings_list:
                location_id = camera_settings_obj.location_id
                camera_id = camera_settings_obj.id
                location = None
                location = crud.location_crud_obj.get_by_id(db, location_id)
                location_dict = {}
                location_dict["location_name"] = (
                    camera_settings_obj.camera_name + "_" + location.location_name
                )
                location_dict["camera_id"] = camera_id
                location_list.append(location_dict)
            filter_data_response_json = {
                "deployed_rtsp_job_id": deployed_rtsp_job_id,
                "model_name": model_name,
                "model_id": model_id,
                "model_labels_list": model_labels_list,
                "location": location_list,
            }
        filter_data_list.append(filter_data_response_json)
    return filter_data_list


@router.get("/get_filter_data_of_supervisor")
def get_filter_data_of_supervisor(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    filter_data_list = []
    company_admin = crud.user.get_company_admin_by_supervisor(
        db, current_user.company_id
    )
    if company_admin:
        deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(
            db=db, user_id=company_admin.id
        )
        deployed_rtsp_jobs = filter_camera_list(current_user.locations, deployed_jobs)
        if not deployed_rtsp_jobs:
            raise HTTPException(
                status_code=404, detail="No Data Found For Requested ID"
            )
        for deployed_rtsp_jobs_obj in deployed_rtsp_jobs:
            deployed_rtsp_job_id = deployed_rtsp_jobs_obj.id
            model_name = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_name
            )
            model_id = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.id
            )
            model_labels_list = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.model_details.model_training_settings.model_labels_list
            )
            camera_settings_list = (
                deployed_rtsp_jobs_obj.deployment_job_rtsp_details.camera_settings
            )
            if camera_settings_list:
                location_list = []
                for camera_settings_obj in camera_settings_list:
                    location_id = camera_settings_obj.location_id
                    camera_id = camera_settings_obj.id
                    location = None
                    location = crud.location_crud_obj.get_by_id(db, location_id)
                    location_dict = {}
                    location_dict["location_name"] = (
                        camera_settings_obj.camera_name + "_" + location.location_name
                    )
                    location_dict["camera_id"] = camera_id
                    location_list.append(location_dict)
                filter_data_response_json = {
                    "deployed_rtsp_job_id": deployed_rtsp_job_id,
                    "model_name": model_name,
                    "model_id": model_id,
                    "model_labels_list": model_labels_list,
                    "location": location_list,
                }
            filter_data_list.append(filter_data_response_json)
    return filter_data_list


@router.post("/get_filter_result_of_current_user")
def get_filter_data_of_current_user(
    filter_details: Optional[schemas.FilterCreate] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if filter_details:
        data_list = json.loads(
            get_filter_mongo_data(
                current_user.id,
                filter_details.camera_id,
                filter_details.start_date,
                filter_details.end_date,
                filter_details.selected_model_labels_list,
            )
        )
        label_setting_lst = crud.label_setting.get_by_job_id(
            db, filter_details.deployed_rtsp_job_id
        )
        if not label_setting_lst:
            filter_data_result = get_filter_response(
                data_list,
                filter_details.selected_model_labels_list,
                filter_details.duration_type,
            )
            return filter_data_result
        else:
            for label_setting in label_setting_lst:
                label_setting_dict = label_setting.__dict__
                for data in data_list:
                    for detections in data.get("result").get("detection"):
                        if (
                            detections.get("label").strip()
                            == label_setting_dict["default_label"].strip()
                        ):
                            detections["label"] = label_setting_dict["new_label"]
        if data_list:
            filter_data_result = get_filter_response(
                data_list,
                filter_details.selected_model_labels_list,
                filter_details.duration_type,
            )
        else:
            return []
    else:
        data_list = json.loads(get_filter_default_mongo_data(current_user.id))
        filter_data_result = get_filter_response(
            data_list, None, filter_details.duration_type
        )
    return filter_data_result


# @router.post("/get_filter_result_of_admin")
# def get_filter_result_of_admin(
#     filter_details: schemas.FilterCreate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_admin),
# ) -> Any:
#     if filter_details:
#         if filter_details.selected_model_labels_list:
#             labels_list = filter_details.selected_model_labels_list
#         else:
#             label_list = get_labels_list_for_admin(current_user.id, db)
#             labels_list = ",".join([str(element) for element in label_list])
#         if labels_list:
#             if filter_details.initial_graph:
#                 data_list = get_supervisor_filter_mongo_data(
#                     current_user.id,
#                     filter_details.camera_id,
#                     filter_details.start_date,
#                     filter_details.end_date,
#                     labels_list,
#                     filter_details.duration_type,
#                     filter_details.initial_graph,
#                     filter_details.current_date,
#                 )
#             else:
#                 data_list = get_supervisor_filter_mongo_data(
#                     current_user.id,
#                     filter_details.camera_id,
#                     filter_details.start_date,
#                     filter_details.end_date,
#                     labels_list,
#                     filter_details.duration_type,
#                 )
#             return data_list
#             # if data_list:
#             #     return data_list
#             # else:
#             #     resource = {}
#             #     for label in labels_list.split(','):
#             #         resource[label] = 0
#             #     return [resource]
#         else:
#             logging.info("No Labels List Found")
#             return []
#     else:
#         logging.info("No Filter Details Found")
#         return []


# @router.post("/get_filter_result_of_supervisor")
# def get_filter_result_of_supervisor(
#     filter_details: schemas.FilterCreate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     if filter_details:
#         company_admin = crud.user.get_company_admin_by_supervisor(
#             db, current_user.company_id
#         )
#         if company_admin:
#             location_list = []
#             if current_user.locations:
#                 for location_obj in current_user.locations:
#                     location_list.append(location_obj.__dict__["id"])
#             if not location_list:
#                 raise HTTPException(
#                     status_code=404, detail="No Location Found For User"
#                 )
#             if filter_details.selected_model_labels_list:
#                 labels_list = filter_details.selected_model_labels_list
#             else:
#                 label_list = get_labels_list_for_supervisor(location_list, db)
#                 labels_list = ",".join([str(element) for element in label_list])
#             if filter_details.camera_id:
#                 camera_id = filter_details.camera_id
#             else:
#                 camera_id = get_camera_id_list_for_supervisor(location_list, db)
#             if labels_list:
#                 if filter_details.initial_graph:
#                     data_list = get_supervisor_filter_mongo_data(
#                         company_admin.id,
#                         camera_id,
#                         filter_details.start_date,
#                         filter_details.end_date,
#                         labels_list,
#                         filter_details.duration_type,
#                         filter_details.initial_graph,
#                         filter_details.current_date,
#                     )
#                 else:
#                     data_list = get_supervisor_filter_mongo_data(
#                         company_admin.id,
#                         camera_id,
#                         filter_details.start_date,
#                         filter_details.end_date,
#                         labels_list,
#                         filter_details.duration_type,
#                     )
#                 return data_list
#                 # if data_list:
#                 #     return data_list
#                 # else:
#                 #     resource = {}
#                 #     for label in labels_list.split(','):
#                 #         resource[label] = 0
#                 #     return [resource]
#             else:
#                 logging.info("No Labels List Found")
#                 return []
#         else:
#             logging.info("No Company Admin Found")
#             return []
#     else:
#         logging.info("No Filter Details Found")
#         return []
#     return filter_data_result


@router.post("/get_filter_result_of_admin")
def get_filter_result_of_admin(
    filter_details: schemas.FilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    try:
        if filter_details:
            if not filter_details.location_id or "-1" in filter_details.location_id:
                location_obj = crud.location_crud_obj.get_all_company_enabled_location(
                    db, current_user.company_id
                )

                location_list = [location.id for location in location_obj]
            else:
                location_list = filter_details.location_id

            if not filter_details.camera_id or "-1" in filter_details.camera_id:
                camera_obj = crud.deployment_camera.get_total_enabled_cameras_by_location_result_manager(
                    db, current_user.id, location_list
                )

                camera_list = [str(camera.id) for camera in camera_obj]
            else:
                camera_list = [str(camera) for camera in filter_details.camera_id]

            if (
                not filter_details.selected_model_labels_list
                or "-1" in filter_details.selected_model_labels_list.split(",")
            ):
                label_obj = get_labels_list_for_admin(current_user.id, db)
                label_list = ",".join([str(element) for element in label_obj])
            else:
                label_list = filter_details.selected_model_labels_list

            if label_list:
                if filter_details.initial_graph:
                    data_list = get_supervisor_filter_mongo_data(
                        current_user.id,
                        camera_list,
                        filter_details.start_date,
                        filter_details.end_date,
                        label_list,
                        filter_details.duration_type,
                        filter_details.initial_graph,
                        filter_details.current_date,
                    )
                else:
                    data_list = get_supervisor_filter_mongo_data(
                        current_user.id,
                        camera_list,
                        filter_details.start_date,
                        filter_details.end_date,
                        label_list,
                        filter_details.duration_type,
                    )
                return data_list
                # if data_list:
                #     return data_list
                # else:
                #     resource = {}
                #     for label in labels_list.split(','):
                #         resource[label] = 0
                #     return [resource]
            else:
                logging.info("No Labels List Found")
                return []
        else:
            logging.info("No Filter Details Found")
            return []
    except Exception as e:
        logging.info("Exception in get_filter_result_of_admin : {} ".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")


@router.post("/get_filter_result_of_supervisor")
def get_filter_result_of_supervisor(
    filter_details: schemas.FilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        if filter_details:
            company_admin = crud.user.get_company_admin_by_supervisor(
                db, current_user.company_id
            )
            if company_admin:
                location_list = []
                if current_user.locations:
                    if (
                        not filter_details.location_id
                        or "-1" in filter_details.location_id
                    ):
                        location_list = [
                            location_obj.id for location_obj in current_user.locations
                        ]
                    else:
                        location_list = filter_details.location_id

                if not location_list:
                    raise HTTPException(
                        status_code=404, detail="No Location Found For User"
                    )

                if not filter_details.camera_id or "-1" in filter_details.camera_id:
                    camera_list = get_camera_id_list_for_supervisor(location_list, db)
                else:
                    camera_list = [str(camera) for camera in filter_details.camera_id]

                if (
                    not filter_details.selected_model_labels_list
                    or "-1" in filter_details.selected_model_labels_list.split(",")
                ):
                    label_obj = get_labels_list_for_supervisor(location_list, db)
                    label_list = ",".join([str(element) for element in label_obj])
                else:
                    label_list = filter_details.selected_model_labels_list
                if label_list:
                    if filter_details.initial_graph:
                        data_list = get_supervisor_filter_mongo_data(
                            company_admin.id,
                            camera_list,
                            filter_details.start_date,
                            filter_details.end_date,
                            label_list,
                            filter_details.duration_type,
                            filter_details.initial_graph,
                            filter_details.current_date,
                        )
                    else:
                        data_list = get_supervisor_filter_mongo_data(
                            company_admin.id,
                            camera_list,
                            filter_details.start_date,
                            filter_details.end_date,
                            label_list,
                            filter_details.duration_type,
                        )
                    return data_list
                    # if data_list:
                    #     return data_list
                    # else:
                    #     resource = {}
                    #     for label in labels_list.split(','):
                    #         resource[label] = 0
                    #     return [resource]
                else:
                    logging.info("No Labels List Found")
                    return []
            else:
                logging.info("No Company Admin Found")
                return []
        else:
            logging.info("No Filter Details Found")
            return []
    except Exception as e:
        logging.info("Exception in get_filter_result_of_supervisor : {} ".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")


@router.post("/get_filter_result_of_last_graph_step")
def get_filter_result_of_last_graph_step(
    data_id: List[str],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    data_list = json.loads(get_data_of_last_graph_step(data_id))
    return data_list
