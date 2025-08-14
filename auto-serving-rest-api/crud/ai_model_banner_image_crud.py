from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model import AIModelBannerImage
from schemas.ai_model import *


class CRUDDevice(
    CRUDBase[AIModelBannerImage, AIModelBannerImageCreate, AIModelBannerImageUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


ai_model_banner_image = CRUDDevice(AIModelBannerImage)
