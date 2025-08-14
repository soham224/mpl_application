from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class RtspDownOdit(Base):
    __tablename__ = "rtsp_down_odit"
    id = Column(Integer, primary_key=True, index=True)
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    created_time = Column(DateTime, nullable=False)
    created_date = Column(DateTime, nullable=False)
    camera_detail = relationship("DeploymentJobRTSPManager", uselist=False)
    rtsp_status = Column(Boolean, nullable=False)
