from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model import AIModelS3Data
from schemas.ai_model import *


class CRUDDevice(CRUDBase[AIModelS3Data, AIModelS3DataCreate, AIModelS3DataUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


ai_model_s3_data = CRUDDevice(AIModelS3Data)
