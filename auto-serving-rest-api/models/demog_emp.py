from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from db.base_class import Base


# company user
class DemogEmp(Base):
    __tablename__ = "demog_emp"
    id = Column(Integer, primary_key=True, index=True)
    emp_name = Column(String(255), nullable=False)
    emp_phone = Column(String(255), nullable=False)
    emp_password = Column(String(255), nullable=False)
    organisation_id = Column(Integer, ForeignKey("demog_organisation.id"))
    shift_id = Column(Integer, ForeignKey("demog_shift.id"))
    department_id = Column(Integer, ForeignKey("demog_department.id"))
    is_reset_password = Column(Boolean, default=False, nullable=False)
    emp_status = Column(Boolean, default=True, nullable=False)
    organisation = relationship("Organisation", uselist=False)
    shift = relationship("Shift", uselist=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    department = relationship("DepartmentDetails", uselist=False)


class Organisation(Base):
    __tablename__ = "demog_organisation"
    id = Column(Integer, primary_key=True, index=True)
    organisation_name = Column(String(255), nullable=False)
    organisation_description = Column(String(255))
    company_id = Column(Integer, ForeignKey("company.id"))
    organisation_status = Column(Boolean, default=True, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    location_id = Column(Integer, ForeignKey("demog_location.id"), nullable=False)
    demog_locations = relationship("LocationDetails", uselist=False)


class Shift(Base):
    __tablename__ = "demog_shift"
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(String(255), nullable=False)
    end_time = Column(String(255), nullable=False)
    organisation_id = Column(Integer, ForeignKey("demog_organisation.id"))
    shift_status = Column(Boolean, default=True, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
