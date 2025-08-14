import datetime
import os
from typing import Any, List

import ffmpeg
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud
import models
import schemas
from api import deps
from utils import check_rtsp_for_frame
from time import time
import base64
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("depoyment_job_rtsp_api")


@router.post("/add_deployment_rtsp_job", response_model=schemas.DeploymentJobRTSPRead)
def add_deployment_rtsp_job(
    deployment_job_rtsp: schemas.DeploymentJobRTSPCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_job_rtsp.created_date = datetime.datetime.utcnow().replace(microsecond=0)
    deployment_job_rtsp.updated_date = datetime.datetime.utcnow().replace(microsecond=0)
    deployment_job_rtsp.user_id = current_user.id
    deployment_job_rtsp.status = False
    if isinstance(deployment_job_rtsp, dict):
        obj_in = deployment_job_rtsp
    else:
        obj_in = deployment_job_rtsp.dict(exclude_unset=True)

    deployment_job_rtsp_out = crud.deployment_job_rtsp.create(db=db, obj_in=obj_in)
    if not deployment_job_rtsp_out:
        raise HTTPException(status_code=500, detail="RTSP Deployment Job Not Added")
    return deployment_job_rtsp_out


@router.get(
    "/get_deployment_rtsp_job_by_id", response_model=schemas.DeploymentJobRTSPRead
)
def get_deployment_rtsp_job_by_id(
    deployment_job_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_job_rtsp = crud.deployment_job_rtsp.get_by_id(db, deployment_job_id)
    if not deployment_job_rtsp:
        raise HTTPException(status_code=404, detail="No RTSP Deployment Job Found")
    return deployment_job_rtsp


@router.get(
    "/get_all_rtsp_deployment_jobs", response_model=List[schemas.DeploymentJobRTSPRead]
)
def get_all_rtsp_deployment_jobs(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    deployment_job_list = crud.deployment_job_rtsp.get_all(db)
    if not deployment_job_list:
        raise HTTPException(status_code=404, detail="No RTSP Deployment Jobs Found")
    return deployment_job_list


@router.get(
    "/get_rtsp_deployment_jobs_for_current_user",
    response_model=List[schemas.DeploymentJobRTSPRead],
)
def get_rtsp_deployment_jobs_for_current_user(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    deployment_rtsp_jobs = crud.deployment_job_rtsp.get_by_user_id(
        db=db, user_id=current_user.id
    )
    if not deployment_rtsp_jobs:
        raise HTTPException(
            status_code=404,
            detail="No Deployed RTSP Jobs Found For the Requested User ID",
        )
    return deployment_rtsp_jobs


@router.get("/get_latest_frame_by_rtsp")
def get_latest_frame_by_rtsp(
    rtsp_link: str,
    camera_id: int,
    camera_name: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    latest_frame_by_rtsp = check_rtsp_for_frame(
        rtsp_link, camera_id, camera_name, current_user.id
    )
    if not latest_frame_by_rtsp:
        raise HTTPException(status_code=404, detail="RTSP frame fetching failed.")
    get_latest_frame_by_rtsp_response = {"file": str(latest_frame_by_rtsp)}
    db_obj = crud.deployment_camera.get(db, camera_id)
    if db_obj:
        deployment_camera_details = schemas.DeploymentJobRTSPManagerUpdate(
            id=db_obj.id,
            rtsp_url=db_obj.rtsp_url,
            camera_name=db_obj.camera_name,
            camera_resolution=db_obj.camera_resolution,
            process_fps=db_obj.process_fps,
            location_id=db_obj.location_id,
            camera_ip=db_obj.camera_ip,
            is_active=db_obj.is_active,
            is_processing=db_obj.is_processing,
            deployment_job_rtsp_id=db_obj.deployment_job_rtsp_id,
            is_tcp=db_obj.is_tcp,
            roi_type=db_obj.roi_type,
            roi_url=latest_frame_by_rtsp,
            status=db_obj.status,
            created_date=db_obj.created_date,
            updated_date=datetime.datetime.utcnow().replace(microsecond=0),
        )

        crud.deployment_camera.update(
            db=db, db_obj=db_obj, obj_in=deployment_camera_details
        )
    return get_latest_frame_by_rtsp_response


@router.get("/get_latest_frame_by_rtsp_for_live_cameras")
def get_latest_frame_by_rtsp_for_live_cameras(
    rtsp_link: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    try:
        file_name = "{}.png".format(str(int(time())))
        if rtsp_link:
            # fetch and the first frame from rtsp
            try:
                out, _ = (
                    ffmpeg.input(rtsp_link, rtsp_transport="tcp")
                    .output(file_name, vframes=1)
                    .run(quiet=True)
                )
            except Exception as e:
                logging.error(
                    "Exception get_latest_frame_by_rtsp_for_live_cameras : {}".format(e)
                )
                return ""
            # check if frame is stored or not
            if os.path.isfile(file_name):
                with open(file_name, "rb") as img_file:
                    my_string = base64.b64encode(img_file.read())
                os.remove(file_name)
                return my_string
        else:
            return None
    except Exception as e:
        logging.error(
            "Exception get_latest_frame_by_rtsp_for_live_cameras : {}".format(e)
        )
        return ""
