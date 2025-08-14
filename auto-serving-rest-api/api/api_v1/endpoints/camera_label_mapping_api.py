import datetime
from re import split
from typing import Any, List, Optional
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("camera_label_mapping_api")


@router.post("/add_camera_label_mapping", response_model=schemas.CameraLabelMappingRead)
def add_camera_label_mapping(
    camera_label_mapping_details: schemas.CameraLabelMappingCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    obj_in = camera_label_mapping_details
    out_obj = crud.camera_label_mappping_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.post(
    "/update_camera_update_mapping", response_model=schemas.CameraLabelMappingRead
)
def update_camera_label_mapping(
    camera_label_mapping_details: schemas.CameraLabelMappingUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_label_mappping_crud_obj.get(
        db, camera_label_mapping_details.id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found For Update")
    return crud.camera_roi_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=camera_label_mapping_details
    )


@router.get(
    "/get_camera_label_mapping_by_id", response_model=schemas.CameraLabelMappingRead
)
def get_camera_label_mapping_by_id(
    camera_label_mapping_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_label_mappping_crud_obj.get(db, camera_label_mapping_id)
    if not db_obj:
        return []
    return db_obj


@router.get(
    "/get_camera_label_mapping_by_camera_id",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_camera_id(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.camera_label_mappping_crud_obj.get_by_camera__id(db, camera_id)
    if not db_obj:
        return []
    return db_obj


@router.post(
    "/get_camera_label_mapping_by_list_of_camera_id",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_list_of_camera_id(
    camera_id: List[int],
    location_id: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    try:
        if not camera_id or -1 in camera_id:
            if not location_id or -1 in location_id:
                location_obj = crud.location_crud_obj.get_all_company_enabled_location(
                    db, current_user.company_id
                )
                location_list = [location.id for location in location_obj]
            else:
                location_list = location_id

            camera_obj = crud.deployment_camera.get_total_enabled_cameras_by_location(
                db, location_list
            )
            camera_list = [camera.id for camera in camera_obj]
        else:
            camera_list = camera_id

        db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
            db, camera_list
        )
        if not db_obj:
            logging.info("No label found for camera")
            return []
        return db_obj
    except Exception as e:
        logging.error(
            "Exception in get_camera_label_mapping_by_list_of_camera_id: {}".format(e)
        )
        return HTTPException(status_code=500, detail="No label found for camera")


@router.post(
    "/get_camera_label_mapping_by_list_of_camera_id_supervisor",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_list_of_camera_id_supervisor(
    camera_id: List[int],
    location_id: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
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

        if not location_id or -1 in location_id:
            if crud.user.is_reporter(current_user):
                location_obj = crud.location_crud_obj.get_all_company_location(
                    db, current_user.company_id
                )
                location_list = [location.id for location in location_obj]
            else:
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

        db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
            db, camera_list
        )
        if not db_obj:
            return []
        return db_obj
    except Exception as e:
        logging.info(
            "Exception in get_camera_label_mapping_by_list_of_camera_id_supervisor : {} ".format(
                e
            )
        )
        raise HTTPException(status_code=500, detail="No Data Found")


@router.post(
    "/get_camera_label_mapping_by_list_of_camera_id_admin",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_list_of_camera_id_admin(
    camera_id: List[int],
    location_id: List[int],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    try:
        user_id = current_user.id

        if not location_id or -1 in location_id:
            location_obj = crud.location_crud_obj.get_all_company_enabled_location(
                db, current_user.company_id
            )
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
        db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
            db, camera_list
        )
        if not db_obj:
            return []
        return db_obj
    except Exception as e:
        logging.info(
            "Exception in get_camera_label_mapping_by_list_of_camera_id_admin : {} ".format(
                e
            )
        )
        raise HTTPException(status_code=500, detail="No Data Found")


@router.get(
    "/get_camera_label_mapping_by_camera_id_supervisor",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_camera_id_supervisor(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    company_admin = crud.user.get_company_admin_by_supervisor(
        db, current_user.company_id
    )
    if company_admin:
        user_id = company_admin.id
    else:
        logging.info("No Admin Found For That User")
        return []
    if camera_id == -1:
        location_list = [location.id for location in current_user.locations]
        camera_obj = crud.deployment_camera.get_total_cameras_by_location_list(
            db, location_list, user_id
        )
        camera_list = [camera.id for camera in camera_obj]
        db_obj = crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
            db, camera_list
        )
    else:
        db_obj = crud.camera_label_mappping_crud_obj.get_by_camera__id(db, camera_id)
    if not db_obj:
        return []
    return db_obj


@router.get(
    "/get_camera_label_mapping_by_camera_id_result_manager",
    response_model=List[schemas.CameraLabelMappingRead],
)
def get_camera_label_mapping_by_camera_id_result_manager(
    camera_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    db_obj = crud.camera_label_mappping_crud_obj.get_by_camera__id(db, camera_id)
    if not db_obj:
        return []
    return db_obj


@router.get("/get_all_camera_labels_of_current_user")
def get_labels_of_user(
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
    label_list = crud.camera_label_mappping_crud_obj.get_all_labels_by_user_id(
        db, user_id
    )
    if not label_list:
        raise HTTPException(status_code=404, detail="No Labels Found")
    label_list = [item for sub_list in label_list for item in sub_list]
    if not label_list:
        return []
    new_label_list = [label for labels in label_list for label in labels.split(",")]
    return list(set(new_label_list))


@router.get("/get_all_camera_labels_by_user_id_result_manager")
def get_labels_of_user(
    user_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    label_list = crud.camera_label_mappping_crud_obj.get_all_labels_by_user_id(
        db, user_id
    )
    if not label_list:
        raise HTTPException(status_code=404, detail="No Labels Found")
    label_list = [item for sub_list in label_list for item in sub_list]
    if not label_list:
        return []
    new_label_list = [label for labels in label_list for label in labels.split(",")]
    return list(set(new_label_list))


@router.get(
    "/get_admin_total_cameras",
    response_model=List[schemas.DeploymentJobRTSPManagerRead],
)
def get_admin_total_cameras(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.deployment_camera.get_admin_total_cameras(db, current_user.id)
    if not db_obj:
        return []
    return db_obj


@router.get(
    "/get_supervisor_total_cameras",
    response_model=List[schemas.DeploymentJobRTSPManagerRead],
)
def get_supervisor_total_cameras(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        raise HTTPException(status_code=404, detail="Data not found.")
    deployment_camera_list = (
        crud.deployment_camera.get_total_enabled_cameras_by_location(db, location_list)
    )
    return deployment_camera_list


@router.get(
    "/get_reporter_total_cameras",
    response_model=List[schemas.DeploymentJobRTSPManagerRead],
)
def get_reporter_total_cameras(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    location_list = []
    location_obj_list = crud.location_crud_obj.get_all_company_enabled_location(
        db, current_user.company_id
    )
    if location_obj_list:
        for location_obj in location_obj_list:
            location_list.append(location_obj.__dict__["id"])

    if not location_list:
        raise HTTPException(status_code=404, detail="Data not found.")

    deployment_camera_list = (
        crud.deployment_camera.get_total_enabled_cameras_by_location(db, location_list)
    )
    return deployment_camera_list


@router.get(
    "/get_supervisor_all_labels_from_cameras",
)
def get_supervisor_all_labels_from_cameras(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    if not location_list:
        raise HTTPException(status_code=404, detail="Data not found.")
    deployment_camera_list = (
        crud.deployment_camera.get_total_enabled_cameras_by_location(db, location_list)
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
    new_label_list = [
        label for labels in db_obj for label in labels.__dict__["labels"].split(",")
    ]
    return list(set(new_label_list))


@router.post(
    "/get_result_manager_total_cameras_by_location_id",
    response_model=List[schemas.DeploymentJobRTSPManagerRead],
)
def get_result_manager_total_cameras_by_location_id(
    user_id: int,
    location_list: List[str],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    if location_list:
        deployment_camera_list = (
            crud.deployment_camera.get_total_enabled_cameras_by_location_result_manager(
                db, user_id, location_list
            )
        )
    else:
        deployment_camera_list = (
            crud.deployment_camera.get_total_enabled_cameras_result_manager(db, user_id)
        )
    return deployment_camera_list


@router.post(
    "/get_current_user_total_cameras_by_location_id",
    response_model=List[schemas.DeploymentJobRTSPManagerRead],
)
def get_current_user_total_cameras_by_location_id(
    location_list: List[str],
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
    elif crud.user.is_reporter(current_user):
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

    if "-1" in location_list:
        deployment_camera_list = crud.deployment_camera.get_admin_total_cameras(
            db, user_id
        )
        # deployment_camera_list.append({
        #
        #     "rtsp_url": "",
        #     "camera_resolution": "",
        #     "process_fps": 0,
        #     "location_id": 0,
        #     "camera_ip": "",
        #     "is_active": True,
        #     "is_processing": True,
        #     "deployment_job_rtsp_id": 0,
        #     "is_tcp": True,
        #     "roi_type": True,
        #     "roi_url": "",
        #     "status": True,
        #     "camera_name": "All Camera",
        #     "id": -1
        # })
    else:
        deployment_camera_list = (
            crud.deployment_camera.get_total_enabled_cameras_by_location_result_manager(
                db, user_id, location_list
            )
        )
    return deployment_camera_list
