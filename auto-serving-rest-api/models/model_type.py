from sqlalchemy import Column, Integer, String, DateTime, Boolean

from db.base_class import Base


class ModelType(Base):
    __tablename__ = "ai_model_type"
    id = Column(Integer, primary_key=True, index=True)
    model_type_name = Column(String(255), nullable=False)
    model_type_description = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
