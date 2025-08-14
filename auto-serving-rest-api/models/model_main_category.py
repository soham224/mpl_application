from sqlalchemy import Column, Integer, String, DateTime, Boolean

from db.base_class import Base


class ModelMainCategory(Base):
    __tablename__ = "model_categories"
    id = Column(Integer, primary_key=True, index=True)
    model_category_name = Column(String(255), nullable=False)
    model_category_description = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
