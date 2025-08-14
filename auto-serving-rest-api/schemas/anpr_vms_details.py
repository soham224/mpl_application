from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from schemas.pagination import PaginationResponse


class CameraNameRead(BaseModel):
    camera_name: str

    class Config:
        orm_mode = True


# Shared properties
class AnprVmsDetailsRead(BaseModel):
    id: int
    vehicle_brand: Optional[str]
    confidence: Optional[float]
    direction: Optional[str]
    plate: Optional[str]
    plate_color: Optional[str]
    speed: Optional[int]
    time_msec: Optional[datetime]
    type: Optional[str]
    vehicle_color: Optional[str]
    vehicle_type: Optional[str]
    full_image_url: Optional[str]
    plate_image_url: Optional[str]
    camera_id: Optional[int]
    camera_details: Optional[CameraNameRead]

    class Config:
        orm_mode = True


class AnprVmsDetailsPaginateResponse(BaseModel):
    items: List[AnprVmsDetailsRead]
    page_info: PaginationResponse


class AnprVmsDetailsRequest(BaseModel):
    page_number: int = 1
    page_size: int = 10
    search: str = ""
    camera_id_list: List[int] = []
    speed: str
    start_date: datetime
    end_date: datetime

    class Config:
        orm_mode = True
