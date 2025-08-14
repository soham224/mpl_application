from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.deployed_job_data import DeployedJobsData
from models.deployment_job import DeploymentJob
from schemas.deployed_job_data import *


class CRUDDeployedJobs(
    CRUDBase[DeployedJobsData, DeployedJobCreate, DeployedJobUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db, user_id):
        return (
            db.query(DeployedJobsData)
            .join(DeploymentJob)
            .filter(DeploymentJob.user_id == user_id)
            .all()
        )


deployed_job = CRUDDeployedJobs(DeployedJobsData)
