from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class VehicleDetailsBase(BaseModel):
    number_plate: str
    vehicle_type: str
    image_url: Optional[str]
    owner_name: Optional[str]
    father_name: Optional[str]
    rc_date: Optional[str]
    vehicle_year: Optional[int]


class VehicleDetailsCreate(VehicleDetailsBase):
    company_id: int
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool = True


class VehicleDetailsUpdate(VehicleDetailsBase):
    updated_date: Optional[datetime]


class VehicleDetailsRead(VehicleDetailsBase):
    id: int
    status: bool
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
