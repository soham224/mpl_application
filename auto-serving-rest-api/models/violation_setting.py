from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from db.base_class import Base


class ViolationSetting(Base):
    __tablename__ = "violation_setting"
    id = Column(Integer, primary_key=True, index=True)
    label = Column(String(255), nullable=False)
    status = Column(Boolean, nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    start_time = Column(String(255), nullable=False)
    end_time = Column(String(255), nullable=False)
    isMailReceived = Column(Boolean)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)


class EmployeeViolation(Base):
    __tablename__ = "employee_violation"
    id = Column(Integer, primary_key=True, index=True)
    face_id = Column(String(255), nullable=False)
    face_image = Column(String(255), nullable=False)
    base_image = Column(String(255), nullable=False)
    external_image_id = Column(String(255), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    violation_type = Column(String(255), nullable=False)
    violation_time = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)


class EmployeeViolationUnknown(Base):
    __tablename__ = "employee_violation_unknown"
    id = Column(Integer, primary_key=True, index=True)
    face_id = Column(String(255), nullable=True)
    face_image = Column(String(255), nullable=True)
    base_image = Column(String(255), nullable=True)
    external_image_id = Column(String(255), nullable=True)
    company_id = Column(Integer, ForeignKey("company.id"))
    camera_id = Column(Integer, ForeignKey("deployment_job_rtsp_manager.id"))
    violation_type = Column(String(255), nullable=True)
    violation_time = Column(DateTime, nullable=True)
    status = Column(Boolean, nullable=True)
    created_date = Column(DateTime, nullable=True)
    updated_date = Column(DateTime, nullable=True)
