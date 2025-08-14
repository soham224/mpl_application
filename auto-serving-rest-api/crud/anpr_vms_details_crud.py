from datetime import datetime
from backports.zoneinfo import ZoneInfo

from sqlalchemy import desc
from sqlalchemy.orm import Session

import schemas
from crud.base import CRUDBase
from core.pagination_utils import get_page_info
from models import VehicleDetails
from models.anpr_vms_details import AnprVmsDetails


class CRUDAnprVmsDetails(CRUDBase[AnprVmsDetails, AnprVmsDetails, AnprVmsDetails]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_anpr_details(self, db: Session, nvr_details: schemas.AnprVmsDetailsRequest):
        query = db.query(AnprVmsDetails)

        if nvr_details.camera_id_list and -1 not in nvr_details.camera_id_list:
            query = query.filter(
                AnprVmsDetails.camera_id.in_(nvr_details.camera_id_list)
            )

        if nvr_details.search:
            query = query.filter(AnprVmsDetails.plate.ilike(f"%{nvr_details.search}%"))

        if nvr_details.speed == "below_30":
            query = query.filter(AnprVmsDetails.speed < 30)
        elif nvr_details.speed == "above_30":
            query = query.filter(AnprVmsDetails.speed >= 30)
        if nvr_details.start_date and nvr_details.end_date:
            query = query.filter(
                AnprVmsDetails.time_msec.between(
                    nvr_details.start_date.astimezone(ZoneInfo("Asia/Kolkata")),
                    nvr_details.end_date.astimezone(ZoneInfo("Asia/Kolkata")),
                )
            )

        total_count = query.count()
        items = []
        if total_count != 0:
            query = (
                query.order_by(desc(AnprVmsDetails.time_msec))
                .offset((nvr_details.page_number - 1) * nvr_details.page_size)
                .limit(nvr_details.page_size)
            )
            items = query.all()

        return {
            "items": items,
            "page_info": get_page_info(
                total_count=total_count,
                page=nvr_details.page_number,
                page_size=nvr_details.page_size,
            ),
        }

    def get_anpr_details_pop_up(
        self, db: Session, start_date: datetime, end_date: datetime, speed: int
    ):
        return (
            db.query(AnprVmsDetails)
            .filter(AnprVmsDetails.time_msec.between(start_date, end_date))
            .filter(AnprVmsDetails.speed >= speed)
            .order_by(desc(AnprVmsDetails.time_msec))
            .all()
        )

    def get_anpr_details_pdf(self, db: Session, speed: int, check_id: int):
        return (
            db.query(AnprVmsDetails)
            .filter(AnprVmsDetails.speed >= speed)
            .filter(AnprVmsDetails.id > check_id)
            .all()
        )

    def get_one_anpr_details_pdf(self, db: Session, speed: int):
        return (
            db.query(AnprVmsDetails)
            .filter(AnprVmsDetails.speed >= speed)
            .order_by(desc(AnprVmsDetails.id))
            .first()
        )

    def get_user_name_by_company_and_vehicle_db(self, db: Session, company_id: int, number_plate: str):
        return (
            db.query(VehicleDetails)
            .filter(VehicleDetails.company_id == company_id)
            .filter(VehicleDetails.number_plate == number_plate)
            .first()
        )

anpr_vms_details_crud_obj = CRUDAnprVmsDetails(AnprVmsDetails)
