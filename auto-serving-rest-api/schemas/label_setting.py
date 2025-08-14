from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class LabelSettingBase(BaseModel):
    default_label: str
    new_label: str
    status: bool


class LabelSettingCreate(LabelSettingBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True
    deployed_rtsp_job_id: int


class LabelSettingUpdate(LabelSettingBase):
    id: int
    updated_date: Optional[datetime]


class LabelSettingRead(LabelSettingBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True
