from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class CameraNameRead(BaseModel):
    camera_name: str

    class Config:
        orm_mode = True


class RtspDownOditRead(BaseModel):
    camera_id: int
    created_date: datetime
    camera_detail: Optional[CameraNameRead]
    rtsp_status: bool

    class Config:
        orm_mode = True


class RtspDownOditCreate(BaseModel):
    camera_id: int
    created_time: datetime
    camera_detail: Optional[CameraNameRead]
    rtsp_status: bool
