from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.result_feedback import ResultFeedback
from schemas.result_feedback import *


class CRUDResultFeedback(
    CRUDBase[ResultFeedback, ResultFeedbackCreate, ResultFeedbackCreate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


result_feedback = CRUDResultFeedback(ResultFeedback)
