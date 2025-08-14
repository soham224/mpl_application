from datetime import date

from sqlalchemy import Date, cast, func, extract
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.employee import EmployeeAttendance
from models.notification import Notification
from schemas.employee import *


class CRUDEmployee(
    CRUDBase[EmployeeAttendance, EmployeeAttendanceCreate, EmployeeAttendanceUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_employee_by_company_id_date(
        self, db: Session, company_id: int, start_date: datetime, end_date: datetime
    ):
        return (
            db.query(EmployeeAttendance)
            .filter(EmployeeAttendance.company_id == company_id)
            .filter(
                EmployeeAttendance.created_date >= start_date,
                EmployeeAttendance.created_date <= end_date,
            )
            .all()
        )

    def get_employee_by_external_image_id(self, db: Session, external_image_id: str):
        return (
            db.query(EmployeeAttendance)
            .filter(EmployeeAttendance.external_image_id == external_image_id)
            .all()
        )

    def get_today_report_by_company_id(self, db: Session, user_id: int):
        return (
            db.query(Notification)
            .filter(Notification.user_id == user_id)
            .filter(Notification.type_of_notification == "Attendance Report")
            .filter(cast(Notification.created_date, Date) == date.today())
            .all()
        )

    def get_today_attendance_report(self, db: Session, company_id: int):
        return (
            db.query(EmployeeAttendance)
            .filter(EmployeeAttendance.company_id == company_id)
            .filter(cast(EmployeeAttendance.created_date, Date) == date.today())
            .all()
        )

    def get_counts_by_employee(
        self, db: Session, ext_name, current_month, current_year
    ):
        return (
            db.query(cast(EmployeeAttendance.created_date, Date))
            .filter(EmployeeAttendance.external_image_id == ext_name)
            .filter(extract("month", EmployeeAttendance.created_date) == current_month)
            .filter(extract("year", EmployeeAttendance.created_date) == current_year)
            .group_by(func.day(EmployeeAttendance.created_date))
            .all()
        )

    def get_attendance_report_by_date(self, db: Session, company_id, report_date):
        return (
            db.query(EmployeeAttendance)
            .filter(EmployeeAttendance.company_id == company_id)
            .filter(cast(EmployeeAttendance.created_date, Date) == report_date)
            .all()
        )


employee_attendance_crud_obj = CRUDEmployee(EmployeeAttendance)
