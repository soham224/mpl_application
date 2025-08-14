from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class DeployedJobsData(Base):
    __tablename__ = "deployed_jobs_data"
    id = Column(Integer, primary_key=True, index=True)
    instance_id = Column(String(255), nullable=False)
    api_endpoint = Column(String(255), nullable=False)
    instance_status = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    deployment_job_id = Column(Integer, ForeignKey("deployment_job.id"))

    deployment_job_details = relationship("DeploymentJob", uselist=False)
