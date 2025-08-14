from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_framework import FrameWorkDetails
from schemas.ai_framework import *


class CRUDDevice(CRUDBase[FrameWorkDetails, FrameWorkCreate, FrameWorkUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


framework = CRUDDevice(FrameWorkDetails)
