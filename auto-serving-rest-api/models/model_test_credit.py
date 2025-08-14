from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey, Float

from db.base_class import Base


class ModelTestCredit(Base):
    __tablename__ = "model_test_credits"
    id = Column(Integer, primary_key=True, index=True)
    total_credits = Column(Float, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)

    user_id = Column(Integer, ForeignKey("user.id"))
