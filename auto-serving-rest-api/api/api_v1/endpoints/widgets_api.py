import threading
from typing import Any

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import models
from api import deps
from core.result_utils import *

router = APIRouter()
logging = MyLogger().get_logger("widgets_api")

# # this is old function
# @router.get("/get_admin_widgets")
# def get_admin_widgets(
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_admin),
# ) -> Any:
#     total_cameras = 0
#     total_active_cameras = 0
#     total_cameras = crud.deployment_camera.get_admin_total_cameras_count(
#         db, current_user.id
#     )
#     total_active_cameras = crud.deployment_camera.get_admin_total_active_cameras_count(
#         db, current_user.id
#     )
#     total_models = crud.deployed_rtsp_job.get_current_user_model_count(
#         db, current_user.id
#     )
#     today_processed_images = get_today_processed_images(current_user.id)
#     today_total_detection = get_today_total_detection(current_user.id)
#     total_detection = get_total_detection(current_user.id)
#     widgets_result = {
#         "total_cameras": total_cameras,
#         "total_active_cameras": total_active_cameras,
#         "total_models": total_models,
#         "processed_images": today_processed_images,
#         "today_total_detection": today_total_detection,
#         "total_detection": total_detection,
#     }
#     return widgets_result


# this is with thread function
@router.post("/get_admin_widgets")
def get_admin_widgets(
    filter_details: schemas.FilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    try:
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

        widgets_result = {
            "total_cameras": 0,
            "total_active_cameras": 0,
            "total_models": 0,
            "today_total_violation": 0,
            "total_violation": 0,
            "processed_images": 0,
        }

        def sql_data_get_admin(db, location_id, user_id):
            widgets_result["total_cameras"] = (
                crud.deployment_camera.get_total_cameras_count_by_location_list(
                    db, location_id, user_id
                )
            )
            widgets_result["total_active_cameras"] = (
                crud.deployment_camera.get_total_active_cameras_count_by_location_list(
                    db, location_id, user_id
                )
            )
            widgets_result["total_models"] = data = (
                crud.ai_model.get_ai_model_by_location_list(db, user_id, location_list)
            )

        def process_images_get(user_id, camera_id, start_date, end_date, label_list):
            widgets_result["processed_images"] = get_processed_images(
                user_id, camera_id, start_date, end_date, label_list
            )

        def today_total_detection_get(user_id, camera_id, label_list):
            widgets_result["today_total_violation"] = get_today_total_detection(
                user_id, camera_id, label_list
            )

        def total_detection_get(user_id, camera_id, start_date, end_date, label_list):
            widgets_result["total_violation"] = get_total_detection(
                user_id, camera_id, start_date, end_date, label_list
            )

        thread_process_images = threading.Thread(
            target=process_images_get,
            args=(
                current_user.id,
                camera_list,
                filter_details.start_date,
                filter_details.end_date,
                filter_details.selected_model_labels_list,
            ),
        )
        thread_process_images.start()

        thread_today_total_detection = threading.Thread(
            target=today_total_detection_get,
            args=(
                current_user.id,
                camera_list,
                filter_details.selected_model_labels_list,
            ),
        )
        thread_today_total_detection.start()

        thread_total_detection = threading.Thread(
            target=total_detection_get,
            args=(
                current_user.id,
                camera_list,
                filter_details.start_date,
                filter_details.end_date,
                filter_details.selected_model_labels_list,
            ),
        )
        thread_total_detection.start()

        thread_for_sql = threading.Thread(
            target=sql_data_get_admin, args=(db, location_list, current_user.id)
        )
        thread_for_sql.start()

        thread_process_images.join()
        thread_today_total_detection.join()
        thread_total_detection.join()
        thread_for_sql.join()

        return widgets_result
    except Exception as e:
        logging.info("Exception in get_admin_widgets : {} ".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")


# this is without thread function
# @router.post("/get_admin_widgets")
# def get_admin_widgets(
#     filter_details: schemas.FilterCreate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_admin),
# ) -> Any:
#     total_cameras = 0
#     total_active_cameras = 0
#     if filter_details.location_id:
#         total_cameras = crud.deployment_camera.get_total_cameras_count_by_location_list(
#             db, filter_details.location_id, current_user.id
#         )
#         total_active_cameras = crud.deployment_camera.get_total_active_cameras_count_by_location_list(
#             db, filter_details.location_id, current_user.id
#         )
#         total_models = crud.deployed_rtsp_job.get_current_user_model_count_by_location_list(
#             db, current_user.id, filter_details.location_id
#         )
#     else:
#         total_cameras = crud.deployment_camera.get_admin_total_cameras_count(
#             db, current_user.id
#         )
#         total_active_cameras = crud.deployment_camera.get_admin_total_active_cameras_count(
#             db, current_user.id
#         )
#         total_models = crud.deployed_rtsp_job.get_current_user_model_count(
#             db, current_user.id
#         )
#     if filter_details.location_id and not filter_details.camera_id:
#         camera_list = crud.deployment_camera\
#             .get_total_enabled_cameras_by_location_result_manager(
#                 db, current_user.id, filter_details.location_id
#             )
#         filter_details.camera_id = [str(camera.id) for camera in camera_list]
#     processed_images = get_processed_images(
#         current_user.id,
#         filter_details.camera_id,
#         filter_details.start_date,
#         filter_details.end_date,
#         filter_details.selected_model_labels_list
#     )
#     today_total_detection = get_today_total_detection(
#         current_user.id,
#         filter_details.camera_id,
#         filter_details.selected_model_labels_list
#     )
#     total_detection = get_total_detection(
#         current_user.id,
#         filter_details.camera_id,
#         filter_details.start_date,
#         filter_details.end_date,
#         filter_details.selected_model_labels_list
#     )
#     widgets_result = {
#         "total_cameras": total_cameras,
#         "total_active_cameras": total_active_cameras,
#         "total_models": total_models,
#         "processed_images": processed_images,
#         "today_total_detection": today_total_detection,
#         "total_detection": total_detection,
#     }
#     return widgets_result


# @router.get("/get_supervisor_widgets")
# def get_supervisor_widgets(
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     company_admin = crud.user.get_company_admin_by_supervisor(
#         db, current_user.company_id
#     )
#     total_cameras = 0
#     total_active_cameras = 0
#     total_models = 0
#     today_processed_images = 0
#     today_total_detection = 0
#     total_detection = 0
#     if company_admin:
#         for location_obj in current_user.locations:
#             if total_cameras == 0:
#                 total_cameras = (
#                     crud.deployment_camera.get_total_cameras_count_by_location_id(
#                         db, location_obj.__dict__["id"], company_admin.id
#                     )
#                 )
#             else:
#                 total_cameras = (
#                     total_cameras
#                     + crud.deployment_camera.get_total_cameras_count_by_location_id(
#                         db, location_obj.__dict__["id"], company_admin.id
#                     )
#                 )
#             if total_active_cameras == 0:
#                 total_active_cameras = crud.deployment_camera.get_total_active_cameras_count_by_location_id(
#                     db, location_obj.__dict__["id"], company_admin.id
#                 )
#             else:
#                 total_active_cameras = (
#                     total_active_cameras
#                     + crud.deployment_camera.get_total_active_cameras_count_by_location_id(
#                         db, location_obj.__dict__["id"], company_admin.id
#                     )
#                 )
#         deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(
#             db=db, user_id=company_admin.id
#         )
#         deployed_rtsp_jobs = filter_camera_list(current_user.locations, deployed_jobs)
#         total_models = len(deployed_rtsp_jobs)
#         location_list = []
#         if current_user.locations:
#             for location_obj in current_user.locations:
#                 location_list.append(location_obj.__dict__["id"])
#         if not location_list:
#             raise HTTPException(status_code=404, detail="No Location Found For User")
#         camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
#         if camera_id_list:
#             for camera_id in camera_id_list:
#                 if today_processed_images == 0:
#                     today_processed_images = get_supervisor_today_processed_images(
#                         company_admin.id, camera_id
#                     )
#                 else:
#                     today_processed_images = (
#                         today_processed_images
#                         + get_supervisor_today_processed_images(
#                             company_admin.id, camera_id
#                         )
#                     )
#                 if today_total_detection == 0:
#                     today_total_detection = get_supervisor_today_total_detection(
#                         company_admin.id, camera_id
#                     )
#                 else:
#                     today_total_detection = (
#                         today_total_detection
#                         + get_supervisor_today_total_detection(
#                             company_admin.id, camera_id
#                         )
#                     )
#                 if total_detection == 0:
#                     total_detection = get_supervisor_total_detection(
#                         company_admin.id, camera_id
#                     )
#                 else:
#                     total_detection = total_detection + get_supervisor_total_detection(
#                         company_admin.id, camera_id
#                     )
#         else:
#             pass
#     widgets_result = {
#         "total_cameras": total_cameras,
#         "total_active_cameras": total_active_cameras,
#         "total_models": total_models,
#         "today_processed_images": today_processed_images,
#         "today_total_detection": today_total_detection,
#         "total_detection": total_detection,
#     }
#     return widgets_result


# @router.post("/get_supervisor_widgets")
# def get_supervisor_widgets(
#     filter_details: schemas.FilterCreate,
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_user),
# ) -> Any:
#     company_admin = crud.user.get_company_admin_by_supervisor(
#         db, current_user.company_id
#     )
#     total_cameras = 0
#     total_active_cameras = 0
#     total_models = 0
#     processed_images = 0
#     today_total_detection = 0
#     total_detection = 0
#     if company_admin:
#         if filter_details.location_id:
#             location_list = filter_details.location_id
#         else:
#             location_list = [location_obj.__dict__["id"] for location_obj in
#                            current_user.locations]
#
#         if not location_list:
#             raise HTTPException(status_code=404, detail="No Location Found For User")
#
#         total_cameras = crud.deployment_camera.get_total_cameras_count_by_location_list(
#             db, location_list, company_admin.id
#         )
#         total_active_cameras = crud.deployment_camera.get_total_active_cameras_count_by_location_list(
#             db, location_list, company_admin.id
#         )
#
#         deployed_jobs = crud.deployed_rtsp_job.get_by_user_id(
#             db=db, user_id=company_admin.id
#         )
#         deployed_rtsp_jobs = filter_camera_list(current_user.locations,
#                                                 deployed_jobs)
#         total_models = len(deployed_rtsp_jobs)
#
#         if filter_details.camera_id:
#             camera_id_list = filter_details.camera_id
#         else:
#             camera_id_list = get_camera_id_list_for_supervisor(location_list, db)
#
#         processed_images = get_processed_images(
#             company_admin.id,
#             camera_id_list,
#             filter_details.start_date,
#             filter_details.end_date,
#             filter_details.selected_model_labels_list
#         )
#
#         today_total_detection = get_today_total_detection(
#             company_admin.id,
#             camera_id_list,
#             filter_details.selected_model_labels_list
#         )
#
#         total_detection = get_total_detection(
#             company_admin.id,
#             camera_id_list,
#             filter_details.start_date,
#             filter_details.end_date,
#             filter_details.selected_model_labels_list
#         )
#
#     widgets_result = {
#         "total_cameras": total_cameras,
#         "total_active_cameras": total_active_cameras,
#         "total_models": total_models,
#         "processed_images": processed_images,
#         "today_total_detection": today_total_detection,
#         "total_detection": total_detection
#     }
#     return widgets_result


@router.post("/get_supervisor_widgets")
def get_supervisor_widgets(
    filter_details: schemas.FilterCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )

        widgets_result = {
            "total_cameras": 0,
            "total_active_cameras": 0,
            "total_models": 0,
            "today_total_violation": 0,
            "total_violation": 0,
            "processed_images": 0,
        }

        if company_admin:
            location_list = []
            if current_user.locations:
                if not filter_details.location_id or "-1" in filter_details.location_id:
                    location_list = [
                        location_obj.id for location_obj in current_user.locations
                    ]
                else:
                    location_list = filter_details.location_id

            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )

            def sql_data_get_supervisor(db, user_id, location_id):
                widgets_result["total_cameras"] = (
                    crud.deployment_camera.get_total_cameras_count_by_location_list(
                        db, location_id, user_id
                    )
                )
                widgets_result["total_active_cameras"] = (
                    crud.deployment_camera.get_total_active_cameras_count_by_location_list(
                        db, location_id, user_id
                    )
                )
                widgets_result["total_models"] = data = (
                    crud.ai_model.get_ai_model_by_location_list(
                        db, user_id, location_list
                    )
                )

            if not filter_details.camera_id or "-1" in filter_details.camera_id:
                camera_list = get_camera_id_list_for_supervisor(location_list, db)
            else:
                camera_list = [str(camera) for camera in filter_details.camera_id]

            def process_images_get(
                user_id, camara_id, start_data, end_date, labels_list
            ):
                widgets_result["processed_images"] = get_processed_images(
                    user_id, camara_id, start_data, end_date, labels_list
                )

            def today_total_detection_get(user_id, camara_id, labels_list):
                widgets_result["today_total_violation"] = get_today_total_detection(
                    user_id, camara_id, labels_list
                )

            def total_detection_get(
                user_id, camara_id, start_data, end_date, labels_list
            ):
                widgets_result["total_violation"] = get_total_detection(
                    user_id, camara_id, start_data, end_date, labels_list
                )

            thread_process_images = threading.Thread(
                target=process_images_get,
                args=(
                    company_admin.id,
                    camera_list,
                    filter_details.start_date,
                    filter_details.end_date,
                    filter_details.selected_model_labels_list,
                ),
            )
            thread_process_images.start()

            thread_today_total_detection = threading.Thread(
                target=today_total_detection_get,
                args=(
                    company_admin.id,
                    camera_list,
                    filter_details.selected_model_labels_list,
                ),
            )
            thread_today_total_detection.start()

            thread_total_detection = threading.Thread(
                target=total_detection_get,
                args=(
                    company_admin.id,
                    camera_list,
                    filter_details.start_date,
                    filter_details.end_date,
                    filter_details.selected_model_labels_list,
                ),
            )
            thread_total_detection.start()

            thread_for_sql = threading.Thread(
                target=sql_data_get_supervisor,
                args=(db, company_admin.id, location_list),
            )
            thread_for_sql.start()

            thread_process_images.join()
            thread_today_total_detection.join()
            thread_total_detection.join()
            thread_for_sql.join()

        return widgets_result
    except Exception as e:
        logging.info("Exception in get_supervisor_widgets : {} ".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")


@router.get("/get_reporter_widgets")
def get_reporter_widgets(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    try:
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        total_active_camera_count = (
            crud.deployment_camera.get_admin_total_active_cameras_count(
                db=db, user_id=company_admin.id
            )
        )
        total_camera_count = crud.deployment_camera.get_admin_total_cameras_count(
            db=db, user_id=company_admin.id
        )
        return {
            "total_active_camera_count": total_active_camera_count,
            "total_camera_count": total_camera_count,
            "total_deactive_camera_count": total_camera_count
            - total_active_camera_count,
        }
    except Exception as e:
        logging.info("Exception in get_supervisor_widgets : {} ".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")
