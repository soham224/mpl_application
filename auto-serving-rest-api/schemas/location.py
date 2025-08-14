from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class LocationBase(BaseModel):
    location_name: str
    company_id: Optional[int]
    status: bool


class LocationCreate(LocationBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    pass


class LocationUpdate(LocationBase):
    id: int
    updated_date: Optional[datetime]


class LocationRead(LocationBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class LocationNameRead(BaseModel):
    location_name: str

    class Config:
        orm_mode = True
