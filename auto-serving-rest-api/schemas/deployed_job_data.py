from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.deployment_job import DeploymentJobRead


# Shared properties
class DeployedJobBase(BaseModel):
    instance_id: str
    instance_status: str
    api_endpoint: str
    deployment_job_id: int
    status: bool = True


class DeployedJobCreate(DeployedJobBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class DeployedJobUpdate(DeployedJobBase):
    updated_date: Optional[datetime] = None


class DeployedJobRead(DeployedJobBase):
    id: int
    created_date: datetime
    updated_date: datetime
    deployment_job_details: DeploymentJobRead

    # user_details: User

    class Config:
        orm_mode = True
