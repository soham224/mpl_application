from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model_infer_job import AIInferJobs
from schemas.ai_model_infer_job import *


class CRUDAIInferJobs(CRUDBase[AIInferJobs, AIInferJobCreate, AIInferJobCreate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


ai_infer_job = CRUDAIInferJobs(AIInferJobs)
