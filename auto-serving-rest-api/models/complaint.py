from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import String

from db.base_class import Base


class Complaint(Base):
    __tablename__ = "complaint"
    id = Column(Integer, primary_key=True, index=True)
    complaint_message = Column(String(255), nullable=False)
    img_url = Column(String(255), nullable=True)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    user_id = Column(Integer, ForeignKey("user.id"))
