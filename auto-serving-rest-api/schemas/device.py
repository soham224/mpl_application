from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class DeviceBase(BaseModel):
    device_name: str
    device_description: str
    status: bool


class DeviceCreate(DeviceBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime]
    status: bool = True
    pass


class DeviceUpdate(DeviceBase):
    id: int
    updated_date: Optional[datetime]


class DeviceRead(DeviceBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
