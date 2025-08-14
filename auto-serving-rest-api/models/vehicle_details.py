from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from db.base_class import Base


class VehicleDetails(Base):
    __tablename__ = "vehicle_details"
    id = Column(Integer, primary_key=True, index=True)
    number_plate = Column(String(255), nullable=True)
    vehicle_type = Column(String(255), nullable=True)
    owner_name = Column(String(255), nullable=True)
    father_name = Column(String(255), nullable=True)
    rc_date = Column(String(255), nullable=True)
    vehicle_year = Column(Integer, nullable=True)
    image_name = Column(String(255), nullable=True)
    image_path = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True)
    company_id = Column(Integer, ForeignKey("company.id"))
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
