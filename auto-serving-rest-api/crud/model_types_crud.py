from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.model_type import ModelType
from schemas.model_type import *


class CRUDDevice(CRUDBase[ModelType, ModelTypeCreate, ModelTypeUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


model_types = CRUDDevice(ModelType)
