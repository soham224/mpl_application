from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.ai_model import ModelRead
from schemas.deployment_type import DeploymentTypeRead
from schemas.user import User


# Shared properties
class DeploymentJobBase(BaseModel):
    image_size: str
    confidence_threshold: str
    iou_threshold: str
    start_time: Optional[str]
    end_time: Optional[str]
    model_id: int
    deployment_type_id: int
    status: bool = False


class DeploymentJobCreate(DeploymentJobBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    user_id: Optional[int]


class DeploymentJobRead(DeploymentJobBase):
    id: int
    created_date: datetime
    updated_date: datetime
    model_details: ModelRead
    user_details: User
    deployment_type: DeploymentTypeRead

    class Config:
        orm_mode = True
