from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class FeedbackBase(BaseModel):
    feedback_message: str
    ratings: int


class FeedbackCreate(FeedbackBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    user_id: int
    status: bool = True


class FeedbackUpdate(FeedbackCreate):
    id: int
    updated_date: Optional[datetime]


class FeedbackRead(FeedbackUpdate):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class FeedbackSuperAdminRead(FeedbackRead):
    id: int
    created_date: datetime
    updated_date: datetime
    user_id: int

    class Config:
        orm_mode = True
