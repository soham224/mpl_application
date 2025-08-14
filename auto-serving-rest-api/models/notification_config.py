from sqlalchemy import Column, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.sql.sqltypes import String

from db.base_class import Base


class NotificationConfig(Base):
    __tablename__ = "notification_config"
    id = Column(Integer, primary_key=True, index=True)
    notification_type = Column(String(255), nullable=False)
    meta_data = Column(JSON, nullable=True)
    status = Column(Boolean, nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
