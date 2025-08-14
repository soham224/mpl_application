from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.label_setting import LabelSetting
from models.deployed_job_rtsp_data import DeployedRTSPJobsData
from models.deployment_job_rtsp import DeploymentJobRTSP
from schemas.label_setting import *


class CRUDLabelSetting(CRUDBase[LabelSetting, LabelSettingCreate, LabelSettingUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_job_id(self, db: Session, job_id: int):
        return (
            db.query(LabelSetting)
            .filter(LabelSetting.deployed_rtsp_job_id == job_id)
            .all()
        )

    def get_labels_setting_by_user_id(self, db: Session, user_id: int):
        return (
            db.query(LabelSetting)
            .join(DeployedRTSPJobsData)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )


label_setting = CRUDLabelSetting(LabelSetting)
