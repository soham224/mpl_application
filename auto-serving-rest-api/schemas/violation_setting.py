from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ViolationSettingBase(BaseModel):
    label: str
    company_id: int
    start_time: str
    end_time: str
    isMailReceived: bool
    status: bool


class ViolationSettingCreate(ViolationSettingBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True


class ViolationSettingUpdate(ViolationSettingBase):
    id: int
    updated_date: Optional[datetime]


class ViolationSettingRead(ViolationSettingBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


# Shared properties
class EmployeeViolationBase(BaseModel):
    face_id: str
    face_image: str
    base_image: str
    company_id: int
    camera_id: int
    violation_time: datetime
    external_image_id: str


class EmployeeViolationCreate(EmployeeViolationBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool


class EmployeeViolationUpdate(EmployeeViolationCreate):
    id: int
    status: bool
    updated_date: Optional[datetime]


class EmployeeViolationRead(EmployeeViolationBase):
    id: int
    created_date: datetime
    updated_date: datetime
    status: bool

    class Config:
        orm_mode = True
