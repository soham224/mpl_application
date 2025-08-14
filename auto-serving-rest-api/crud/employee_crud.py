from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.employee import Employee
from schemas.employee import *


class CRUDEmployee(CRUDBase[Employee, EmployeeCreate, EmployeeUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_employee_by_company_id(self, db: Session, company_id: int):
        return db.query(Employee).filter(Employee.company_id == company_id).all()

    def get_enabled_employee_by_company_id(self, db: Session, company_id: int):
        return (
            db.query(Employee)
            .filter(Employee.company_id == company_id)
            .filter(Employee.status == True)
            .all()
        )

    def get_trained_employee_by_company_id(self, db: Session, company_id: int):
        return (
            db.query(Employee)
            .filter(
                Employee.company_id == company_id,
                Employee.status == 1,
                Employee.trained_status == 1,
            )
            .all()
        )

    def get_supervisor_trained_employee_by_company_id(
        self, db: Session, company_id: int, location_list: list
    ):
        return (
            db.query(Employee)
            .filter(
                Employee.company_id == company_id,
                Employee.status == 1,
                Employee.location_id.in_(location_list),
                Employee.trained_status == 1,
            )
            .all()
        )


employee_crud_obj = CRUDEmployee(Employee)
