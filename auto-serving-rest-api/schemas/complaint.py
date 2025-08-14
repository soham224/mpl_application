from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ComplaintBase(BaseModel):
    complaint_message: str


class ComplaintCreate(ComplaintBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    user_id: int
    img_url: Optional[str]
    status: bool = True


class ComplaintUpdate(ComplaintCreate):
    id: int
    updated_date: Optional[datetime]


class ComplaintRead(ComplaintUpdate):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class ComplaintSuperAdminRead(ComplaintRead):
    id: int
    created_date: datetime
    updated_date: datetime
    user_id: int

    class Config:
        orm_mode = True
