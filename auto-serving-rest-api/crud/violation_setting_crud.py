from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.violation_setting import ViolationSetting
from schemas.violation_setting import *


class CRUDViolationSetting(
    CRUDBase[ViolationSetting, ViolationSettingCreate, ViolationSettingUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_company_id(self, db: Session, company_id: int):
        if (
            len(
                db.query(ViolationSetting)
                .filter(ViolationSetting.company_id == company_id)
                .all()
            )
            > 0
        ):
            return (
                db.query(ViolationSetting)
                .filter(ViolationSetting.company_id == company_id)
                .one()
            )


violation_setting_obj = CRUDViolationSetting(ViolationSetting)
