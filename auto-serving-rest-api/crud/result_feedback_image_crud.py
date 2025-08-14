from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.result_feedback_image import ResultFeedbackImage
from schemas.result_feedback_image import *


class CRUDResultFeedbackImage(
    CRUDBase[ResultFeedbackImage, ResultFeedbackImageCreate, ResultFeedbackImageCreate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


result_feedback_image = CRUDResultFeedbackImage(ResultFeedbackImage)
