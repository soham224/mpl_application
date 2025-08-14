from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey

from db.base_class import Base


class ResultFeedback(Base):
    __tablename__ = "result_feedback"
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    infer_job_id = Column(Integer, ForeignKey("ai_model_infer_jobs.id"))
    model_id = Column(Integer, ForeignKey("ai_models.id"))
    user_id = Column(Integer, ForeignKey("user.id"))
