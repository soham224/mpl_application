from datetime import date

from sqlalchemy import Date, cast, func, extract
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.violation_setting import EmployeeViolation
from models.notification import Notification
from models.violation_setting import EmployeeViolationUnknown
from schemas.violation_setting import *


class CRUDEmployee(
    CRUDBase[EmployeeViolation, EmployeeViolationCreate, EmployeeViolationUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_employee_by_company_id_date(
        self, db: Session, company_id: int, start_date: datetime, end_date: datetime
    ):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.company_id == company_id)
            .filter(
                EmployeeViolation.created_date >= start_date,
                EmployeeViolation.created_date <= end_date,
            )
            .all()
        )

    def get_employee_by_external_image_id(self, db: Session, external_image_id: str):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.external_image_id == external_image_id)
            .all()
        )

    def get_today_report_by_company_id(self, db: Session, user_id: int):
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .filter(Notification.type_of_notification == "Data FR Report")
            .filter(cast(Notification.created_date, Date) == date.today())
            .all()
        )

    def get_counts_by_employee(
        self, db: Session, ext_name, current_month, current_year
    ):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.external_image_id == ext_name)
            .filter(extract("month", EmployeeViolation.violation_time) == current_month)
            .filter(extract("year", EmployeeViolation.violation_time) == current_year)
            .all()
        )

    def get_report_by_date(self, db: Session, company_id, report_date):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.company_id == company_id)
            .filter(cast(EmployeeViolation.violation_time, Date) == report_date)
            .all()
        )

    def get_report_by_date_supervisor(
        self, db: Session, company_id, start_date, end_date, camera_id_list
    ):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.company_id == company_id)
            .filter(EmployeeViolation.violation_time.between(start_date, end_date))
            .filter(EmployeeViolation.camera_id.in_(camera_id_list))
            .all()
        )

    def get_report_by_camera_and_label(
        self, db: Session, company_id, camera_id, label_list
    ):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.company_id == company_id)
            .filter(EmployeeViolation.camera_id == camera_id)
            .filter(EmployeeViolation.violation_type.in_(label_list))
            .all()
        )

    def get_report_by_camera_and_label_list(
        self, db: Session, company_id, camera_list, label_list
    ):
        return (
            db.query(EmployeeViolation)
            .filter(EmployeeViolation.company_id == company_id)
            .filter(EmployeeViolation.camera_id.in_(camera_list))
            .filter(EmployeeViolation.violation_type.in_(label_list))
            .all()
        )

    def get_unknown_report_by_date(self, db: Session, company_id, report_date):
        return (
            db.query(EmployeeViolationUnknown)
            .filter(EmployeeViolationUnknown.company_id == company_id)
            .filter(cast(EmployeeViolationUnknown.violation_time, Date) == report_date)
            .all()
        )

    def get_supervisor_unknown_report_by_date(
        self, db: Session, company_id, report_date, deployment_camera_id_list
    ):
        return (
            db.query(EmployeeViolationUnknown)
            .filter(EmployeeViolationUnknown.company_id == company_id)
            .filter(cast(EmployeeViolationUnknown.violation_time, Date) == report_date)
            .filter(EmployeeViolationUnknown.camera_id.in_(deployment_camera_id_list))
            .all()
        )


employee_violation_crud_obj = CRUDEmployee(EmployeeViolation)
