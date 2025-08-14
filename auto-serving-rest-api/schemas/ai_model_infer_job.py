from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from schemas.ai_model import ModelRead
from schemas.user import User


# Shared properties
class AIInferJobBase(BaseModel):
    image_size: str
    confidence_threshold: str
    iou_threshold: str
    model_id: int
    status: bool = True


class AIInferJobCreate(AIInferJobBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    user_id: Optional[int]


class AIInferJobRead(AIInferJobBase):
    id: int
    created_date: datetime
    updated_date: datetime
    user_details: User
    model_details: ModelRead

    class Config:
        orm_mode = True
