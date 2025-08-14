from sqlalchemy import Column, Integer, Table, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql.sqltypes import String
from db.base_class import Base
from sqlalchemy.orm import relationship


class DepartmentDetails(Base):
    __tablename__ = "demog_department"
    id = Column(Integer, primary_key=True, index=True)
    department_name = Column(String(255), nullable=False)
    department_desc = Column(String(255), nullable=False)
    status = Column(Boolean, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    organisation_id = Column(Integer, ForeignKey("demog_organisation.id"))
