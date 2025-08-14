from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.employee import EmployeeAWSData
from schemas.employee import *


class CRUDEmployeeAWSData(
    CRUDBase[EmployeeAWSData, EmployeeAWSCreate, EmployeeAWSUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_employee_id(self, db: Session, employee_id: int):
        return (
            db.query(EmployeeAWSData)
            .filter(EmployeeAWSData.employee_id == employee_id)
            .filter(EmployeeAWSData.status == True)
            .first()
        )


employee_aws_data_crud_obj = CRUDEmployeeAWSData(EmployeeAWSData)
