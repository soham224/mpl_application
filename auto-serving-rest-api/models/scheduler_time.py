from sqlalchemy import Column, Integer, Boolean, String, JSON, ForeignKey
from db.base_class import Base


class SchedulerTime(Base):
    __tablename__ = "scheduler_time"
    id = Column(Integer, primary_key=True, index=True)
    time_min = Column(Integer, nullable=False)
    scheduler_type = Column(String(20), nullable=False)
    meta_data = Column(JSON, nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    status = Column(Boolean, nullable=False)
