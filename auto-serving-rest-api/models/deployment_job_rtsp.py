from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class DeploymentJobRTSPManager(Base):
    __tablename__ = "deployment_job_rtsp_manager"
    id = Column(Integer, primary_key=True, index=True)
    rtsp_url = Column(String(255), nullable=False)
    process_fps = Column(Integer, nullable=False)
    is_tcp = Column(Boolean, nullable=True)
    camera_name = Column(String(255), nullable=False)
    camera_resolution = Column(String(255), nullable=False)
    location_id = Column(Integer, ForeignKey("location.id"))
    camera_ip = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=False, nullable=False)
    is_processing = Column(Boolean, default=False, nullable=False)
    roi_type = Column(Boolean, default=False, nullable=False)
    roi_url = Column(String(255), default=False, nullable=True)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    deployment_job_rtsp_id = Column(Integer, ForeignKey("deployment_job_rtsp.id"))
    location_details = relationship("Location", uselist=False)
    deployment_job_rtsp_details = relationship("DeploymentJobRTSP", uselist=False)
    ai_model_details = relationship("DeploymentJobRTSP", uselist=False)


class CameraROI(Base):
    __tablename__ = "camera_roi"
    id = Column(Integer, primary_key=True, index=True)
    coordinates = Column(String(255), nullable=False)
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    status = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    camera_settings = relationship("DeploymentJobRTSPManager", uselist=False)


class DeploymentJobRTSP(Base):
    __tablename__ = "deployment_job_rtsp"
    id = Column(Integer, primary_key=True, index=True)
    image_size = Column(String(255), nullable=False)
    confidence_threshold = Column(String(255), nullable=False)
    iou_threshold = Column(String(255), nullable=False)
    start_time = Column(String(255), nullable=True)
    end_time = Column(String(255), nullable=True)

    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    model_id = Column(Integer, ForeignKey("ai_models.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
    deployment_type_id = Column(Integer, ForeignKey("deployment_type.id"))

    model_details = relationship("AIModels", uselist=False)
    user_details = relationship("User", uselist=False)
    deployment_type = relationship("DeploymentType", uselist=False)
    camera_settings = relationship("DeploymentJobRTSPManager")


class CameraLabelMapping(Base):
    __tablename__ = "camera_label_mapping"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    labels = Column(String(255), nullable=False)
