import datetime
import logging
from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from core.security import get_password_hash, verify_password
from crud.base import CRUDBase
from models.demog_emp import DemogEmp
from models.user import Role
from schemas.demog_emp import EmpCreate, EmpUpdate, Emp


class CRUDDemogEmp(CRUDBase[DemogEmp, EmpCreate, EmpUpdate]):
    def get_by_phone_number(self, db: Session, *, phone: str) -> Optional[DemogEmp]:
        return db.query(DemogEmp).filter(DemogEmp.emp_phone == phone).first()

    def get_by_id(self, db: Session, *, emp_id: int) -> Optional[DemogEmp]:
        return db.query(DemogEmp).filter(DemogEmp.id == emp_id).first()

    def get_role_by_id(self, db: Session, role_id: int) -> Optional[Role]:
        return db.query(Role).filter(Role.id == role_id).first()

    def create_demog_emp(self, db: Session, password, *, obj_in: EmpCreate) -> DemogEmp:
        db_obj = DemogEmp(
            emp_name=obj_in.emp_name,
            emp_phone=obj_in.emp_phone,
            organisation_id=obj_in.organisation_id,
            shift_id=obj_in.shift_id,
            department_id=obj_in.department_id,
            emp_password=get_password_hash(password),
            is_reset_password=False,
            emp_status=obj_in.emp_status,
            created_date=datetime.datetime.utcnow(),
            updated_date=datetime.datetime.utcnow(),
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_all_emps(self, db: Session):
        return db.query(DemogEmp).all()

    def get_all_emps_by_organisation_id(
        self, db: Session, organisation_id: int
    ) -> Optional[DemogEmp]:
        return (
            db.query(DemogEmp).filter(DemogEmp.organisation_id == organisation_id).all()
        )

    def authenticate(
        self, db: Session, *, phone: str, password: str
    ) -> Optional[DemogEmp]:
        employee = self.get_by_phone_number(db, phone=phone)
        if not employee:
            return None
        if not verify_password(password, employee.emp_password):
            return None
        return employee

    def is_active(self, emp: DemogEmp) -> bool:
        return emp.emp_status

    def update(
        self, db: Session, *, db_obj: DemogEmp, obj_in: Union[EmpUpdate, Dict[str, Any]]
    ) -> DemogEmp:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if update_data["password"]:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)


demog_emp = CRUDDemogEmp(DemogEmp)
