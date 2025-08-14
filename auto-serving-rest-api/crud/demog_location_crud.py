from sqlalchemy.orm import Session
from crud.base import CRUDBase
from models import LocationDetails
from schemas import DemogLocationCreate, DemogLocationUpdate
from typing import Optional


class CRUDDepartment(
    CRUDBase[LocationDetails, DemogLocationCreate, DemogLocationUpdate]
):
    def get_by_id(self, db: Session, *, id: int) -> Optional[LocationDetails]:
        return db.query(LocationDetails).filter(LocationDetails.id == id).first()


demog_location_crud_obj = CRUDDepartment(LocationDetails)
