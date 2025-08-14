from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


class DepartmentBase(BaseModel):
    department_name: str
    department_desc: str
    organisation_id: int


class DepartmentCreate(DepartmentBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool = True


class DepartmentRead(DepartmentBase):
    id: int
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    status: bool = True

    class Config:
        orm_mode = True


class DepartmentUpdate(DepartmentBase):
    updated_date: Optional[datetime]
