from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ModelMainCategoryBase(BaseModel):
    model_category_name: str
    model_category_description: str


class ModelMainCategoryCreate(ModelMainCategoryBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime]
    status: bool = True
    pass


class ModelMainCategoryUpdate(ModelMainCategoryBase):
    id: int
    updated_date: Optional[datetime]


class ModelMainCategoryRead(ModelMainCategoryBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
