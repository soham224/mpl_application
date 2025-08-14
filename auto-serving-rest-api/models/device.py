from sqlalchemy import Column, Integer, String, DateTime, Boolean

from db.base_class import Base


class Device(Base):
    __tablename__ = "ai_device"
    id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String(255), nullable=False)
    device_description = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
