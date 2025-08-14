from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class FrameWorkBase(BaseModel):
    framework_name: str
    framework_version_number: str
    is_deprecated: bool
    status: bool


class FrameWorkCreate(FrameWorkBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime]
    status: bool = True
    pass


class FrameWorkUpdate(FrameWorkBase):
    id: int
    updated_date: Optional[datetime]


class FrameWorkRead(FrameWorkBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
