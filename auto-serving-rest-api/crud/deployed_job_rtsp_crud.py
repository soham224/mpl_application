from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.deployed_job_rtsp_data import DeployedRTSPJobsData
from models.deployment_job_rtsp import DeploymentJobRTSP, DeploymentJobRTSPManager
from schemas.deployed_job_rtsp_data import *


class CRUDDeployedRTSPJobs(
    CRUDBase[DeployedRTSPJobsData, DeployedJobRTSPCreate, DeployedJobRTSPUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db, user_id):
        return (
            db.query(DeployedRTSPJobsData)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_by_deployment_job_rtsp_id(self, db, user_id, deployment_job_rtsp_id):
        if (
            len(
                db.query(DeployedRTSPJobsData)
                .filter(
                    DeployedRTSPJobsData.deployment_job_rtsp_id
                    == deployment_job_rtsp_id
                )
                .join(DeploymentJobRTSP)
                .filter(DeploymentJobRTSP.user_id == user_id)
                .all()
            )
            > 0
        ):
            return (
                db.query(DeployedRTSPJobsData)
                .filter(
                    DeployedRTSPJobsData.deployment_job_rtsp_id
                    == deployment_job_rtsp_id
                )
                .join(DeploymentJobRTSP)
                .filter(DeploymentJobRTSP.user_id == user_id)
                .one()
            )

    def get_current_user_model_count(self, db, user_id):
        return (
            db.query(DeployedRTSPJobsData)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_current_user_model_count_by_location_list(self, db, user_id, location_list):
        return (
            db.query(DeployedRTSPJobsData)
            .join(DeploymentJobRTSP)
            .join(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .count()
        )


deployed_rtsp_job = CRUDDeployedRTSPJobs(DeployedRTSPJobsData)
