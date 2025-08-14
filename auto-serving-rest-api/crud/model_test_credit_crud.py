from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.model_test_credit import ModelTestCredit
from schemas.model_test_credit import *


class CRUDModelTestCredit(
    CRUDBase[ModelTestCredit, ModelTestCreditCreate, ModelTestCreditUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db: Session, user_id: int):
        return (
            db.query(ModelTestCredit).filter(ModelTestCredit.user_id == user_id).all()
        )


model_test_credit_crud_obj = CRUDModelTestCredit(ModelTestCredit)
