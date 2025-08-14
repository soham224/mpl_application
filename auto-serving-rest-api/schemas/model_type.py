from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ModelTypeBase(BaseModel):
    model_type_name: str
    model_type_description: str
    status: bool


class ModelTypeCreate(ModelTypeBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True
    pass


class ModelTypeUpdate(ModelTypeBase):
    id: int
    updated_date: Optional[datetime]


class ModelTypeRead(ModelTypeBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
