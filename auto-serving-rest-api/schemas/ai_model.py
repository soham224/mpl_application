from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel
from schemas.model_main_category import ModelMainCategoryRead
from schemas.user import User


# Shared properties
class AIModelResultImagesBase(BaseModel):
    image_name: str
    image_url: str
    image_description: Optional[str] = None
    status: bool
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None

    class Config:
        orm_mode = True


class AIModelS3DataBase(BaseModel):
    model_s3_url: str
    model_s3_key: str
    model_s3_name: str
    model_version: str
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool

    class Config:
        orm_mode = True


class AIModelBannerImageBase(BaseModel):
    model_banner_image: str
    model_id: str
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool

    class Config:
        orm_mode = True


class AIModelTrainingSettingsBase(BaseModel):
    image_size: str
    model_training_batch_size: str
    batch_size: str
    model_epochs: str
    model_labels_list: str
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime] = None
    status: bool = True

    class Config:
        orm_mode = True


class ModelBase(BaseModel):
    model_name: str
    model_description: str
    model_cpu_infer_speed: str
    model_gpu_infer_speed: str
    model_version_id: str
    model_accuracy: str
    model_size: str
    model_depth: str
    framework_version_number: str

    model_type_id: int
    model_device_id: int
    model_framework_id: int
    model_category_id: int

    status: bool


class ModelCreate(ModelBase):
    created_date: Optional[datetime] = None
    updated_date: Optional[datetime]
    status: bool = True
    user_id: Optional[int]
    pass


class ModelUpdate(ModelBase):
    id: int
    updated_date: Optional[datetime]


class ModelRead(ModelBase):
    id: int
    created_date: datetime
    updated_date: datetime
    model_result_img: Optional[List[AIModelResultImagesBase]] = []
    model_s3_data: Optional[AIModelS3DataBase] = None
    model_training_settings: Optional[AIModelTrainingSettingsBase] = None
    model_banner_image: Optional[AIModelBannerImageBase] = None
    model_category_details: Optional[ModelMainCategoryRead] = None
    user_id: Optional[int]

    class Config:
        orm_mode = True


class AIModelResultImagesCreate(AIModelResultImagesBase):
    model_id: int


class AIModelS3DataCreate(AIModelS3DataBase):
    model_id: int


class AIModelTrainingSettingsCreate(AIModelTrainingSettingsBase):
    model_id: int


class AIModelBannerImageCreate(AIModelBannerImageBase):
    model_id: int


class AIModelResultImagesUpdate(AIModelResultImagesBase):
    id: int
    model_id: int


class AIModelS3DataUpdate(AIModelS3DataBase):
    id: int
    model_id: int


class AIModelTrainingSettingsUpdate(AIModelTrainingSettingsBase):
    id: int
    model_id: int


class AIModelBannerImageUpdate(AIModelBannerImageBase):
    id: int
    model_id: int


class AIModelRead(ModelBase):
    id: int
    created_date: datetime
    updated_date: datetime

    class Config:
        orm_mode = True


class ModelNameRead(BaseModel):
    model_name: str

    class Config:
        orm_mode = True
