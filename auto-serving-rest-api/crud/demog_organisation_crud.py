from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.demog_emp import Organisation
from models.employee import Employee, EmployeeAttendance
from models.user import Company
from schemas import OrganisationCreate, OrganisationUpdate
from typing import Optional


class CRUDDemogOrganisation(
    CRUDBase[Organisation, OrganisationCreate, OrganisationUpdate]
):
    def get_by_id(self, db: Session, organisation_id: int):
        return super().get(db, organisation_id)

    def department_get_by_id(
        self, db: Session, *, organisation_id: int
    ) -> Optional[Organisation]:
        return db.query(Organisation).filter(Organisation.id == organisation_id).first()

    def get_present_employee_by_organisation_id(
        self, db, organisation_id, start_date, end_date
    ):
        return (
            db.query(Company)
            .filter(Company.id == organisation_id)
            .join(Employee)
            .filter(
                EmployeeAttendance.created_date >= start_date,
                EmployeeAttendance.created_date <= end_date,
            )
            .all()
        )


demog_organisation = CRUDDemogOrganisation(Organisation)
