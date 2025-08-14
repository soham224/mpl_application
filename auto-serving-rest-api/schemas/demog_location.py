from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class DemogLocationBase(BaseModel):
    location_name: str
    meta_data: str
    latitude: str
    longitude: str


class DemogLocationCreate(DemogLocationBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool = True


class DemogLocationRead(DemogLocationBase):
    id: int
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool = True

    class Config:
        orm_mode = True


class DemogLocationUpdate(DemogLocationBase):
    updated_date: Optional[datetime]
