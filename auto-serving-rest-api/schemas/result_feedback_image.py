from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ResultFeedbackImageBase(BaseModel):
    image_url: str
    feedback_id: int
    user_id: int


class ResultFeedbackImageCreate(ResultFeedbackImageBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True


class ResultFeedbackImageRead(ResultFeedbackImageBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
