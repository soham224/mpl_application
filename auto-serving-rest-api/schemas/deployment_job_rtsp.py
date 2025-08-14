from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel

from schemas.ai_model import ModelRead
from schemas.deployment_type import DeploymentTypeRead
from schemas.user import User
from schemas.location import LocationNameRead
from schemas.ai_model import ModelNameRead


# Shared properties
class DeploymentJobRTSPManagerBase(BaseModel):
    rtsp_url: str
    camera_name: str
    camera_resolution: str
    process_fps: int
    location_id: int
    camera_ip: Optional[str]
    is_active: bool
    is_processing: bool
    deployment_job_rtsp_id: int
    is_tcp: Optional[bool]

    class Config:
        orm_mode = True


class DeploymentJobRTSPManagerCreate(DeploymentJobRTSPManagerBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    roi_type: Optional[bool]
    roi_url: Optional[str]
    status: bool = False


class DeploymentJobRTSPManagerUpdate(DeploymentJobRTSPManagerCreate):
    id: int
    updated_date: Optional[datetime]


class DeploymentJobRTSPManagerRead(DeploymentJobRTSPManagerBase):
    id: int
    roi_type: Optional[bool]
    roi_url: Optional[str]
    status: bool

    class Config:
        orm_mode = True


class DeploymentJobRTSPModelNameRead(BaseModel):
    model_details: ModelNameRead

    class Config:
        orm_mode = True


class DeploymentJobRTSPManagerLocationModelNameRead(BaseModel):
    camera_name: str
    location_details: LocationNameRead
    ai_model_details: DeploymentJobRTSPModelNameRead

    class Config:
        orm_mode = True


class DeploymentJobRTSPBase(BaseModel):
    image_size: str
    confidence_threshold: str
    iou_threshold: str
    start_time: Optional[str]
    end_time: Optional[str]
    model_id: int
    deployment_type_id: int
    status: bool = False


class DeploymentJobRTSPCreate(DeploymentJobRTSPBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    user_id: Optional[int]


class DeploymentJobRTSPRead(DeploymentJobRTSPBase):
    id: int
    created_date: datetime
    updated_date: datetime
    camera_settings: Optional[List[DeploymentJobRTSPManagerRead]] = []
    model_details: ModelRead
    user_details: User
    deployment_type: DeploymentTypeRead
    status: bool

    class Config:
        orm_mode = True


class CameraROIBase(BaseModel):
    coordinates: str
    camera_id: int
    status: bool = True


class CameraROICreate(CameraROIBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None


class CameraROIUpdate(CameraROICreate):
    id: int
    updated_date: Optional[datetime]


class CameraROIRead(CameraROICreate):
    id: int
    camera_settings: Optional[DeploymentJobRTSPManagerRead] = None
    status: bool

    class Config:
        orm_mode = True


class CameraLabelMappingBase(BaseModel):
    camera_id: int
    labels: str


class CameraLabelMappingCreate(CameraLabelMappingBase):
    pass


class CameraLabelMappingUpdate(CameraLabelMappingCreate):
    id: int


class CameraLabelMappingRead(CameraLabelMappingCreate):
    id: int

    class Config:
        orm_mode = True


class DeploymentJobRTSPManagerDashboardRead(BaseModel):
    camera_name: str
    is_active: bool
    updated_date: datetime

    class Config:
        orm_mode = True
