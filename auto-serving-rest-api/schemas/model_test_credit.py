from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class ModelTestCreditBase(BaseModel):
    total_credits: float


class ModelTestCreditCreate(ModelTestCreditBase):
    created_date: Optional[datetime]
    updated_date: Optional[datetime]
    user_id: int
    status: bool = True


class ModelTestCreditUpdate(ModelTestCreditBase):
    id: int
    updated_date: Optional[datetime]


class ModelTestCreditRead(ModelTestCreditBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class ModelTestCreditSuperAdminRead(ModelTestCreditBase):
    id: int
    created_date: datetime
    updated_date: datetime
    user_id: int

    class Config:
        orm_mode = True
