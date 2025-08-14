from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ResultFeedbackBase(BaseModel):
    infer_job_id: int
    model_id: int
    user_id: int
    rating: int


class ResultFeedbackCreate(ResultFeedbackBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True


class ResultFeedbackRead(ResultFeedbackBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
