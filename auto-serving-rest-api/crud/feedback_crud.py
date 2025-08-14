from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.feedback import Feedback
from schemas.feedback import *


class CRUDFeedback(CRUDBase[Feedback, FeedbackCreate, FeedbackUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db: Session, user_id: int):
        return db.query(Feedback).filter(Feedback.user_id == user_id).all()


feedback_crud_obj = CRUDFeedback(Feedback)
