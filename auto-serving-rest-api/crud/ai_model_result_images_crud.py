from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model import AIModelResultImages
from schemas.ai_model import *


class CRUDDevice(
    CRUDBase[AIModelResultImages, AIModelResultImagesCreate, AIModelResultImagesUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


ai_model_result_images = CRUDDevice(AIModelResultImages)
