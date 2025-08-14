from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel
from .demog_location import DemogLocationRead
from .demog_department import DepartmentRead


# Shift
class ShiftBase(BaseModel):
    start_time: str
    end_time: str
    organisation_id: Optional[int]


class ShiftCreate(ShiftBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    shift_status: bool = True


class ShiftUpdate(ShiftBase):
    id: int
    updated_date: Optional[datetime]


class ShiftRead(ShiftBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


# Organisation
class OrganisationBase(BaseModel):
    organisation_name: str
    organisation_description: str
    company_id: Optional[int]
    location_id: Optional[int]


class OrganisationCreate(OrganisationBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    organisation_status: bool = True


class OrganisationUpdate(OrganisationBase):
    id: int
    updated_date: Optional[datetime]


class OrganisationRead(OrganisationBase):
    id: int
    demog_locations: DemogLocationRead = None
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


# Employee
# Shared properties
class EmpBase(BaseModel):
    emp_name: str = None
    emp_phone: str = None
    emp_status: bool
    organisation_id: Optional[int]
    department_id: Optional[int]
    shift_id: Optional[int]


# Properties to receive via API on creation
class EmpCreate(EmpBase):
    class Config:
        orm_mode = True


# Properties to receive via API on update
class EmpUpdate(EmpBase):
    password: Optional[str] = None


class EmpInDBBase(EmpBase):
    id: Optional[int] = None
    emp_phone: Optional[str] = None
    organisation: OrganisationRead = None
    department: DepartmentRead = None
    shift: ShiftRead = None

    class Config:
        orm_mode = True


# Additional properties to return via API
class Emp(EmpInDBBase):
    created_date: datetime
    updated_date: datetime


# Additional properties stored in DB
class EmpInDB(EmpInDBBase):
    hashed_password: str
