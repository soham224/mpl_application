from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from db.base_class import Base


class Employee(Base):
    __tablename__ = "employee"
    id = Column(Integer, primary_key=True, index=True)
    employee_name = Column(String(255), nullable=False)
    employee_description = Column(String(255), nullable=False)
    employee_profession = Column(String(255), nullable=False)
    employee_contact_number = Column(String(255), nullable=False)
    employee_id = Column(String(255), nullable=False)
    trained_status = Column(Boolean, nullable=False)
    external_name = Column(String(255), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    location_id = Column(Integer, ForeignKey("location.id"))
    status = Column(Boolean, nullable=False)
    employee_s3_image_key = Column(String(255), nullable=False)
    employee_s3_image_url = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    company_details = relationship("Company", uselist=False)
    location_details = relationship("Location", uselist=False)


class EmployeeAWSData(Base):
    __tablename__ = "employee_aws_data"
    id = Column(Integer, primary_key=True, index=True)
    face_id = Column(String(255), nullable=False)
    image_id = Column(String(255), nullable=False)
    external_image_id = Column(String(255), nullable=False)
    employee_id = Column(Integer, ForeignKey("employee.id"))
    status = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    employee_details = relationship("Employee", uselist=False)


class EmployeeAttendance(Base):
    __tablename__ = "employee_attendance"
    id = Column(Integer, primary_key=True, index=True)
    face_id = Column(String(255), nullable=False)
    external_image_id = Column(String(255), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"))
    status = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
