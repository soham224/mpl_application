from sqlalchemy.orm import Session
from crud.base import CRUDBase
from models import DepartmentDetails


from schemas import DepartmentCreate, DepartmentUpdate
from typing import Optional
from .demog_organisation_crud import demog_organisation


class CRUDDepartment(CRUDBase[DepartmentDetails, DepartmentCreate, DepartmentUpdate]):
    def get_by_id(self, db: Session, *, id: int) -> Optional[DepartmentDetails]:
        return db.query(DepartmentDetails).filter(DepartmentDetails.id == id).first()

    def get_all_demog_department_by_organisation_id(
        self, db: Session, organisation_id: int
    ):
        return (
            db.query(DepartmentDetails)
            .filter(DepartmentDetails.organisation_id == organisation_id)
            .all()
        )

    def add_organization_department_mapping(
        self,
        db: Session,
        department_id: int,
        organization_id: int,
    ):
        demog_department_obj = self.get_by_id(db=db, id=department_id)
        organization_db_obj = demog_organisation.department_get_by_id(
            db=db, organisation_id=organization_id
        )
        organization_db_obj.demog_departments.append(demog_department_obj)
        db.add(organization_db_obj)
        db.commit()
        db.refresh(organization_db_obj)
        return organization_db_obj


demog_department_crud_obj = CRUDDepartment(DepartmentDetails)
