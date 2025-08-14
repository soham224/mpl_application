from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class AIModelResultImages(Base):
    __tablename__ = "ai_model_result_images"
    id = Column(Integer, primary_key=True, index=True)
    image_name = Column(String(255), nullable=False)
    image_url = Column(String(255), nullable=False)
    image_description = Column(String(255))
    status = Column(Boolean, nullable=False)
    model_id = Column(Integer, ForeignKey("ai_models.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)


class AIModelBannerImage(Base):
    __tablename__ = "ai_model_banner_images"
    id = Column(Integer, primary_key=True, index=True)
    model_banner_image = Column(String(255), nullable=False)
    model_id = Column(Integer, ForeignKey("ai_models.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)


class AIModelS3Data(Base):
    __tablename__ = "ai_model_s3_data"
    id = Column(Integer, primary_key=True, index=True)
    model_s3_url = Column(String(255), nullable=False)
    model_s3_key = Column(String(255), nullable=False)
    model_s3_name = Column(String(255), nullable=False)
    model_version = Column(String(255), nullable=False)
    model_id = Column(Integer, ForeignKey("ai_models.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)


class AIModelTrainingSettings(Base):
    __tablename__ = "ai_model_training_settings"
    id = Column(Integer, primary_key=True, index=True)
    image_size = Column(String(255), nullable=False)
    model_training_batch_size = Column(String(255), nullable=False)
    batch_size = Column(String(255), nullable=False)
    model_epochs = Column(String(255), nullable=False)
    model_labels_list = Column(String(255), nullable=False)
    model_id = Column(Integer, ForeignKey("ai_models.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)


class AIModels(Base):
    __tablename__ = "ai_models"
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(255), nullable=False)
    model_description = Column(String(255), nullable=False)
    model_cpu_infer_speed = Column(String(255), nullable=False)
    model_gpu_infer_speed = Column(String(255), nullable=False)

    framework_version_number = Column(String(255), nullable=False)
    model_version_id = Column(String(255), nullable=False)
    model_accuracy = Column(String(255), nullable=False)
    model_size = Column(String(255), nullable=False)
    model_depth = Column(String(255), nullable=False)

    model_type_id = Column(Integer, ForeignKey("ai_model_type.id"))
    model_device_id = Column(Integer, ForeignKey("ai_device.id"))
    model_framework_id = Column(Integer, ForeignKey("ai_framework_details.id"))
    model_category_id = Column(Integer, ForeignKey("model_categories.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)

    model_result_img = relationship("AIModelResultImages")
    model_banner_image = relationship("AIModelBannerImage", uselist=False)
    model_s3_data = relationship("AIModelS3Data", uselist=False)
    model_training_settings = relationship("AIModelTrainingSettings", uselist=False)
    device_details = relationship("Device", uselist=False)
    model_type_details = relationship("ModelType", uselist=False)
    model_framework_details = relationship("FrameWorkDetails", uselist=False)
    model_category_details = relationship("ModelMainCategory", uselist=False)
    user_details = relationship("User", uselist=False)
    # settings = relationship("RtspManager", uselist=False, backref="camera")
    # company_id = Column(Integer, ForeignKey('company.id'))
