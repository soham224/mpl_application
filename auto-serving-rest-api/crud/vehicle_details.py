from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.vehicle_details import VehicleDetails
from schemas.vehicle_details import *


class CRUDDVehicleDetails(
    CRUDBase[
        VehicleDetails,
        VehicleDetailsCreate,
        VehicleDetailsUpdate,
    ]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_vehicle_details(self, db: Session, company_id: int):
        return (
            db.query(VehicleDetails)
            .filter(VehicleDetails.company_id == company_id)
            .order_by(VehicleDetails.created_date.desc())
            .all()
        )

    def get_by_number_plate(self, db: Session, number_plate: str, company_id: int):
        return (
            db.query(VehicleDetails)
            .filter(VehicleDetails.number_plate == number_plate)
            .filter(VehicleDetails.company_id == company_id)
            .filter(VehicleDetails.status == True)
            .first()
        )

    def get_by_number_plate_and_id(
        self, db: Session, number_plate: str, company_id: int, vehicle_id: int
    ):
        return (
            db.query(VehicleDetails)
            .filter(VehicleDetails.number_plate == number_plate)
            .filter(VehicleDetails.company_id == company_id)
            .filter(VehicleDetails.status == True)
            .filter(VehicleDetails.id != vehicle_id)
            .first()
        )


vehicle_details_crud_obj = CRUDDVehicleDetails(VehicleDetails)
