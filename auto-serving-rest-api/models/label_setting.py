from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from db.base_class import Base


class LabelSetting(Base):
    __tablename__ = "label_setting"
    id = Column(Integer, primary_key=True, index=True)
    default_label = Column(String(255), nullable=False)
    new_label = Column(String(255), nullable=False)

    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    deployed_rtsp_job_id = Column(Integer, ForeignKey("deployed_rtsp_jobs_data.id"))
