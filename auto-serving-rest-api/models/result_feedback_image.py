from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from db.base_class import Base


class ResultFeedbackImage(Base):
    __tablename__ = "result_feedback_image"
    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(255), nullable=False)
    created_date = Column(DateTime, nullable=False)
    updated_date = Column(DateTime, nullable=False)
    status = Column(Boolean, nullable=False)
    user_id = Column(Integer, ForeignKey("user.id"))
    feedback_id = Column(Integer, ForeignKey("result_feedback.id"))
