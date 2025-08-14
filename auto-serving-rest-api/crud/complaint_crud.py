from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.complaint import Complaint
from schemas.complaint import *


class CRUDComplain(CRUDBase[Complaint, ComplaintCreate, ComplaintUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_user_id(self, db: Session, user_id: int):
        return db.query(Complaint).filter(Complaint.user_id == user_id).all()


complaint_crud_obj = CRUDComplain(Complaint)
