from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import String
from db.base_class import Base
from sqlalchemy.orm import relationship


class LocationDetails(Base):
    __tablename__ = "demog_location"
    id = Column(Integer, primary_key=True, index=True)
    location_name = Column(String(255), nullable=False)
    status = Column(Boolean, nullable=False)
    meta_data = Column(String(255), nullable=False)
    latitude = Column(String(255), nullable=False)
    longitude = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
