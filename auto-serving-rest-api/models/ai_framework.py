from sqlalchemy import Column, Integer, String, DateTime, Boolean

from db.base_class import Base


class FrameWorkDetails(Base):
    __tablename__ = "ai_framework_details"
    id = Column(Integer, primary_key=True, index=True)
    framework_name = Column(String(255), nullable=False)
    framework_version_number = Column(String(255), nullable=False)
    is_deprecated = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
