from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.deployment_job_rtsp import CameraLabelMapping
from schemas.deployment_job_rtsp import *
from models.deployment_job_rtsp import DeploymentJobRTSPManager
from models.deployment_job_rtsp import DeploymentJobRTSP
from sqlalchemy import func, distinct


class CRUDCameraLabelMapping(
    CRUDBase[CameraLabelMapping, CameraLabelMappingCreate, CameraLabelMappingUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_camera__id(self, db: Session, camera_id: int):
        return (
            db.query(CameraLabelMapping)
            .filter(CameraLabelMapping.camera_id == camera_id)
            .all()
        )

    def get_labels_by_list_of_camera_id(self, db: Session, camera_id: list):
        return (
            db.query(CameraLabelMapping)
            .filter(CameraLabelMapping.camera_id.in_(camera_id))
            .all()
        )

    def get_all_labels_by_user_id(self, db: Session, user_id: int):
        return (
            db.query(distinct(CameraLabelMapping.labels))
            .join(DeploymentJobRTSPManager)
            .filter(CameraLabelMapping.camera_id == DeploymentJobRTSPManager.id)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .filter(DeploymentJobRTSPManager.status == True)
            .all()
        )


camera_label_mappping_crud_obj = CRUDCameraLabelMapping(CameraLabelMapping)
