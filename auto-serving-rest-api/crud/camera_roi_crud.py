from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.deployment_job_rtsp import CameraROI
from schemas.deployment_job_rtsp import *


class CRUDCameraROI(CRUDBase[CameraROI, CameraROICreate, CameraROIUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_camera__id(self, db: Session, camera_id: int):
        return db.query(CameraROI).filter(CameraROI.camera_id == camera_id).all()


camera_roi_crud_obj = CRUDCameraROI(CameraROI)
