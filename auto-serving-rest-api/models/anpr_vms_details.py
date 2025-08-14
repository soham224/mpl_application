from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class AnprVmsDetails(Base):
    __tablename__ = "anpr_vms_details"
    id = Column(Integer, primary_key=True, index=True)
    vehicle_brand = Column(String(255), nullable=True)
    channel_id = Column(String(255), nullable=True)
    confidence = Column(Float, nullable=True)
    coordinate_x1 = Column(Integer, nullable=True)
    coordinate_x2 = Column(Integer, nullable=True)
    coordinate_y1 = Column(Integer, nullable=True)
    coordinate_y2 = Column(Integer, nullable=True)
    detection_region = Column(Integer, nullable=True)
    device_id = Column(String(255), nullable=True)
    direction = Column(String(255), nullable=True)
    plate = Column(String(255), nullable=True)
    plate_color = Column(String(255), nullable=True)
    plate_group_name = Column(String(255), nullable=True)
    plate_type_vms = Column(String(255), nullable=True)
    region = Column(String(255), nullable=True)
    resolution_height = Column(Integer, nullable=True)
    resolution_width = Column(Integer, nullable=True)
    result_from = Column(String(255), nullable=True)
    server_id = Column(String(255), nullable=True)
    speed = Column(Integer, nullable=True)
    system_id = Column(String(255), nullable=True)
    time_msec = Column(DateTime, nullable=True)
    type = Column(String(255), nullable=True)
    vehicle_color = Column(String(255), nullable=True)
    vehicle_type = Column(String(255), nullable=True)
    full_image_url = Column(String(255), nullable=True)
    full_image_path = Column(String(255), nullable=True)
    plate_image_url = Column(String(255), nullable=True)
    plate_image_path = Column(String(255), nullable=True)
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    camera_details = relationship("DeploymentJobRTSPManager", uselist=False)
