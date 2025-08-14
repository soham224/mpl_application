from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.deployment_job_rtsp import DeploymentJobRTSPRead


# Shared properties
class DeployedJobRTSPBase(BaseModel):
    instance_id: str
    instance_status: str
    api_endpoint: str
    deployment_job_rtsp_id: int
    status: bool = True


class DeployedJobRTSPCreate(DeployedJobRTSPBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class DeployedJobRTSPUpdate(DeployedJobRTSPBase):
    updated_date: Optional[datetime] = None


class DeployedJobRTSPRead(DeployedJobRTSPBase):
    id: int
    created_date: datetime
    updated_date: datetime
    deployment_job_rtsp_details: DeploymentJobRTSPRead

    class Config:
        orm_mode = True
