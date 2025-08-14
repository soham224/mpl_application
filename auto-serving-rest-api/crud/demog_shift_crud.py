from sqlalchemy.orm import Session

from crud import demog_organisation
from crud.base import CRUDBase
from models.demog_emp import Shift
from schemas import ShiftCreate, ShiftUpdate


class CRUDShift(CRUDBase[Shift, ShiftCreate, ShiftUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_all_demog_shift_by_organisation_id(self, db: Session, organisation_id: int):
        return db.query(Shift).filter(Shift.organisation_id == organisation_id).all()

    def get_all_enabled_organisation_enabled_shift(
        self, db: Session, organisation_id: int
    ):
        return (
            db.query(Shift)
            .filter(Shift.organisation_id == organisation_id)
            .filter(Shift.shift_status == True)
            .all()
        )


demog_shift = CRUDShift(Shift)
