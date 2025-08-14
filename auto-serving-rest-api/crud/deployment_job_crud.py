from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models import DeployedJobsData
from models.deployment_job import DeploymentJob
from schemas.deployment_job import *


class CRUDDeploymentJob(
    CRUDBase[DeploymentJob, DeploymentJobCreate, DeploymentJobCreate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db, user_id):
        return db.query(DeploymentJob).filter(DeploymentJob.user_id == user_id).all()

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

    def get_schedule_deployment_jobs(self, db):
        return (
            db.query(DeploymentJob, DeployedJobsData)
            .filter(DeploymentJob.id == DeployedJobsData.deployment_job_id)
            .filter(DeployedJobsData.instance_status != "terminated")
            .filter(DeploymentJob.status)
            .filter(DeployedJobsData.status)
            .all()
        )


deployment_job = CRUDDeploymentJob(DeploymentJob)
