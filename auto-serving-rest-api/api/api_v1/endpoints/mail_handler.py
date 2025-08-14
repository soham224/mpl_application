from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
from api import deps
from core.mail_utils import send_rtsp_down_mail_user
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("mail_handler")


@router.post("/rtsp_down_mail")
def add_model_type(
    deployment_job_rtsp_id: int, rtsp_url: str, db: Session = Depends(deps.get_db)
) -> Any:
    deployment_rtsp_job = crud.deployment_job_rtsp.get_by_id(db, deployment_job_rtsp_id)
    if not deployment_rtsp_job:
        raise HTTPException(status_code=404, detail="No Deployment RTSP Job Found")
    logging.info(
        "sending rtsp down email to : {}".format(
            deployment_rtsp_job.user_details.user_email
        )
    )

    send_rtsp_down_mail_user(
        rtsp_url,
        deployment_rtsp_job.model_details.model_name,
        [deployment_rtsp_job.user_details.user_email],
    )
    logging.info("Mail sent successfully")
    return "Mail sent successfully"
