from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models import DeployedRTSPJobsData, DeploymentJobRTSPManager
from models.deployment_job_rtsp import DeploymentJobRTSP
from schemas.deployment_job_rtsp import *


class CRUDDeploymentJobRTSP(
    CRUDBase[DeploymentJobRTSP, DeploymentJobRTSPCreate, DeploymentJobRTSPCreate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db, user_id):
        return (
            db.query(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def update_status(self, db: Session, status, job_obj):
        job_obj.status = status
        job_obj.updated_date = datetime.utcnow().replace(microsecond=0)
        db.add(job_obj)
        db.commit()
        db.refresh(job_obj)
        if job_obj.status == status:
            return True
        else:
            return False

    def get_schedule_deployment_jobs_rtsp(self, db):
        return (
            db.query(DeploymentJobRTSP)
            .join(DeploymentJobRTSPManager)
            .join(DeployedRTSPJobsData)
            .filter(
                DeploymentJobRTSPManager.deployment_job_rtsp_id
                == DeployedRTSPJobsData.deployment_job_rtsp_id,
                DeployedRTSPJobsData.status == True,
                DeployedRTSPJobsData.instance_status == True,
                DeploymentJobRTSP.start_time != None,
                DeploymentJobRTSP.end_time != None,
            )
            .all()
        )


deployment_job_rtsp = CRUDDeploymentJobRTSP(DeploymentJobRTSP)
