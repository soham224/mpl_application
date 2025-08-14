import datetime
from typing import Any, List
import math

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi_pagination import Page, paginate

import crud
import models
import schemas
from api import deps
from utils import check_rtsp_new
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("deployment_cameras")


@router.post("/check_rtsp_status")
def check_rtsp_status(
    rtsp_url: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return check_rtsp_new(rtsp=rtsp_url)


@router.post("/update_rtsp_status")
def update_rtsp_status(
    rtsp_manger_id: int,
    status_type: str,
    status_value: bool,
    db: Session = Depends(deps.get_db),
) -> Any:
    rtsp_man_obj = crud.deployment_camera.get(db=db, id=rtsp_manger_id)

    if not rtsp_man_obj:
        raise HTTPException(status_code=500, detail="RTSP  Not Added")
    return crud.deployment_camera.update_rtsp_status(
        db=db, status_type=status_type, status_val=status_value, db_obj=rtsp_man_obj
    )


@router.post(
    "/add_deployment_cameras", response_model=schemas.DeploymentJobRTSPManagerRead
)
def add_deployment_rtsp_job(
    cam_settings: schemas.DeploymentJobRTSPManagerCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    cam_settings.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    cam_settings.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    cam_settings.status = True
    cam_settings.is_tcp = True
    cam_settings.is_active = True
    cam_settings.is_processing = True
    cam_settings.camera_resolution = "640:640"
    if isinstance(cam_settings, dict):
        obj_in = cam_settings
    else:
        obj_in = cam_settings.dict(exclude_unset=True)

    cam_settings_out = crud.deployment_camera.create(db=db, obj_in=obj_in)
    if not cam_settings_out:
        raise HTTPException(status_code=500, detail="RTSP Camera Not Added")
    return cam_settings_out


@router.post(
    "/update_deployment_cameras", response_model=schemas.DeploymentJobRTSPManagerRead
)
def update_deployment_cameras(
    deployment_cameras_details: schemas.DeploymentJobRTSPManagerUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.deployment_camera.get(db, deployment_cameras_details.id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For Update")

    deployment_cameras_details.updated_date = datetime.datetime.utcnow().replace(
        microsecond=0
    )
    return crud.deployment_camera.update(
        db=db, db_obj=db_obj, obj_in=deployment_cameras_details
    )


@router.get(
    "/get_deployment_camera", response_model=schemas.DeploymentJobRTSPManagerRead
)
def get_camera_roi_by_id(
    deployment_camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.deployment_camera.get(db, deployment_camera_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For ID")
    return db_obj


@router.post("/delete_deployment_cameras")
def delete_deployment_rtsp_job(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    cam_settings_out = crud.deployment_camera.remove(db=db, id=camera_id)
    if not cam_settings_out:
        raise HTTPException(status_code=500, detail="RTSP Camera Not Added")
    return "RTSP Camera Deleted Successfully"


# @router.post("/get_all_camera_location_model")
# def get_all_camera_location_model(
#     page_size: int,
#     page_no: int,
#     location_id: List[int],
#     camera_id: List[int],
#     model_id: List[int],
#     db: Session = Depends(deps.get_db),
#     current_user: models.User = Depends(deps.get_current_active_supervisor),
# ) -> Any:
#     try:
#         company_admin = crud.user.get_company_admin_by_supervisor(
#             db, current_user.company_id
#         )
#         if company_admin:
#             user_id = company_admin.id
#         else:
#             logging.info("No Admin Found For That User")
#             return []
#
#         if not location_id or -1 in location_id:
#             location_obj = current_user.locations
#             location_list = [location.id for location in location_obj]
#         else:
#             location_list = location_id
#
#         if not camera_id or -1 in camera_id:
#             camera_obj = crud.deployment_camera.\
#                 get_total_cameras_by_location_list(
#                 db, location_list, user_id
#             )
#             camera_list = [camera.id for camera in camera_obj]
#         else:
#             camera_list = camera_id
#
#         if not model_id or -1 in model_id:
#             model_obj = crud.ai_model.get_ai_model_by_camera_list(
#                 db, user_id, camera_list
#             )
#             model_list = [model.id for model in model_obj]
#         else:
#             model_list = model_id
#
#         crud_obj = crud.deployment_camera.get_total_cameras_details(
#             db=db,
#             user_id=user_id,
#             location_list=location_list,
#             camera_list=camera_list,
#             model_list=model_list,
#             page_size=page_size,
#             page_no=page_no-1
#         )
#         if not crud_obj:
#             response = {
#                 'data': [],
#                 'count': 0,
#                 'page_size': page_size,
#                 'page_no': page_no,
#                 'total_pages': 0
#             }
#             return response
#
#         data = []
#         for i in crud_obj:
#             data.append({
#                 "camera_details": i[0],
#                 "location_details": i[1],
#                 "model_details": i[2]
#             })
#
#         count = crud.deployment_camera.get_total_cameras_details_count(
#             db, user_id, location_list, camera_list, model_list)
#
#         response = {
#             'data': data,
#             'count': count,
#             'page_size': page_size,
#             'page_no': page_no,
#             'total_pages': math.ceil(count/page_size)
#         }
#         return response
#     except Exception as e:
#         logging.info("get_all_camera_location_model {}".format(e))
#         raise HTTPException(status_code=500, detail="No Data Found")


@router.post(
    "/get_all_camera_location_model",
    response_model=Page[schemas.DeploymentJobRTSPManagerLocationModelNameRead],
)
def get_all_camera_location_model(
    location_id: List[int],
    camera_id: List[int],
    model_id: List[int],
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
            return paginate([])

        if not location_id or -1 in location_id:
            location_obj = current_user.locations
            location_list = [location.id for location in location_obj]
        else:
            location_list = location_id

        if not camera_id or -1 in camera_id:
            camera_obj = crud.deployment_camera.get_total_cameras_by_location_list(
                db, location_list, user_id
            )
            camera_list = [camera.id for camera in camera_obj]
        else:
            camera_list = camera_id

        if not model_id or -1 in model_id:
            model_obj = crud.ai_model.get_ai_model_by_camera_list(
                db, user_id, camera_list
            )
            model_list = [model.id for model in model_obj]
        else:
            model_list = model_id

        crud_obj = crud.deployment_camera.get_total_cameras_details(
            db=db,
            user_id=user_id,
            location_list=location_list,
            camera_list=camera_list,
            model_list=model_list,
        )
        return paginate(crud_obj)
    except Exception as e:
        logging.info("get_all_camera_location_model {}".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")


@router.get(
    "/get_camera_by_status_for_reporter",
    response_model=List[schemas.DeploymentJobRTSPManagerDashboardRead],
)
def get_camera_by_status_for_reporter(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    try:
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if not company_admin:
            logging.info("No Admin Found For That User")
            raise HTTPException(status_code=404, detail="User not found")

        data = crud.deployment_camera.get_admin_total_cameras_by_status(
            db=db, user_id=company_admin.id
        )
        return data

    except Exception as e:
        logging.info("get_all_camera_location_model {}".format(e))
        raise HTTPException(status_code=500, detail="No Data Found")
