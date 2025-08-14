from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class DeploymentTypeBase(BaseModel):
    deployment_type_name: str
    deployment_type_description: str
    status: bool = True


class DeploymentTypeCreate(DeploymentTypeBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class DeploymentTypeUpdate(DeploymentTypeBase):
    id: int
    updated_date: Optional[datetime]


class DeploymentTypeRead(DeploymentTypeBase):
    id: int
    created_date: datetime
    updated_date: datetime
    status: bool

    class Config:
        orm_mode = True
