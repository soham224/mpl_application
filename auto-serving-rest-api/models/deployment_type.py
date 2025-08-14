from sqlalchemy import Column, Integer, String, DateTime, Boolean

from db.base_class import Base


class DeploymentType(Base):
    __tablename__ = "deployment_type"
    id = Column(Integer, primary_key=True, index=True)
    deployment_type_name = Column(String(255), nullable=False)
    deployment_type_description = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
