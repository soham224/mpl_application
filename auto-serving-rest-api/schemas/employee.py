from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class EmployeeBase(BaseModel):
    employee_name: str
    employee_profession: str
    employee_description: str
    employee_contact_number: str
    employee_id: str
    trained_status: bool
    company_id: int
    location_id: int
    external_name: str
    employee_s3_image_key: str
    employee_s3_image_url: str


class EmployeeCreate(EmployeeBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool


class EmployeeUpdate(EmployeeBase):
    id: int
    status: bool
    updated_date: Optional[datetime]


class EmployeeRead(EmployeeBase):
    id: int
    created_date: datetime
    updated_date: datetime
    status: bool

    class Config:
        orm_mode = True


# Shared properties
class EmployeeAWSBase(BaseModel):
    face_id: str
    image_id: str
    external_image_id: str
    employee_id: int


class EmployeeAWSCreate(EmployeeAWSBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool


class EmployeeAWSUpdate(EmployeeAWSCreate):
    id: int
    status: bool
    updated_date: Optional[datetime]


class EmployeeAWSRead(EmployeeAWSUpdate):
    id: int
    created_date: datetime
    updated_date: datetime
    status: bool

    class Config:
        orm_mode = True


# Shared properties
class EmployeeAttendanceBase(BaseModel):
    face_id: str
    company_id: int
    external_image_id: str


class EmployeeAttendanceCreate(EmployeeAttendanceBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool


class EmployeeAttendanceUpdate(EmployeeAttendanceCreate):
    id: int
    status: bool
    updated_date: Optional[datetime]


class EmployeeAttendanceRead(EmployeeAttendanceUpdate):
    id: int
    created_date: datetime
    updated_date: datetime
    status: bool

    class Config:
        orm_mode = True
