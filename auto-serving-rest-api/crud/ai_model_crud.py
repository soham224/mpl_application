from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model import AIModels
from models.model_type import ModelType
from models.deployment_job_rtsp import DeploymentJobRTSPManager, DeploymentJobRTSP
from schemas.ai_model import *


class CRUDDevice(CRUDBase[AIModels, ModelCreate, ModelUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def get_by_model_type_id(self, db: Session, deployment_type_id: int):
        return (
            db.query(AIModels)
            .join(ModelType)
            .filter(ModelType.id == deployment_type_id)
            .all()
        )

    def get_enabled_by_model_type_id(self, db: Session, deployment_type_id: int):
        return (
            db.query(AIModels)
            .filter(AIModels.status == True)
            .filter(AIModels.user_id == None)
            .join(ModelType)
            .filter(ModelType.id == deployment_type_id)
            .all()
        )

    def get_enabled_by_model_type_id_user_id(
        self, db: Session, deployment_type_id: int, user_id: int
    ):
        return (
            db.query(AIModels)
            .filter(AIModels.status == True)
            .filter(AIModels.user_id == user_id)
            .join(ModelType)
            .filter(ModelType.id == deployment_type_id)
            .all()
        )

    def model_catalogue_search(self, db: Session, model_name: str):
        search = "%{}%".format(model_name)
        return (
            db.query(AIModels)
            .filter(AIModels.status == True)
            .filter(AIModels.model_name.like(search))
            .join(ModelType)
            .all()
        )

    def private_model_catalogue_search(
        self, db: Session, model_name: str, user_id: int
    ):
        search = "%{}%".format(model_name)
        return (
            db.query(AIModels)
            .filter(AIModels.status == True)
            .filter(AIModels.user_id == user_id)
            .filter(AIModels.model_name.like(search))
            .join(ModelType)
            .all()
        )

    def get_ai_model_by_location_list(self, db: Session, user_id, location_list):
        ai_model_obj = (
            db.query(AIModels)
            .join(DeploymentJobRTSP)
            .join(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSP.model_id == AIModels.id)
            .filter(
                DeploymentJobRTSPManager.deployment_job_rtsp_id == DeploymentJobRTSP.id
            )
            .filter(AIModels.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .all()
        )
        return len(ai_model_obj)

    def get_ai_model_by_camera_list(self, db: Session, user_id, camera_list):
        ai_model_obj = (
            db.query(AIModels)
            .join(DeploymentJobRTSP)
            .join(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSP.model_id == AIModels.id)
            .filter(
                DeploymentJobRTSPManager.deployment_job_rtsp_id == DeploymentJobRTSP.id
            )
            .filter(AIModels.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .filter(DeploymentJobRTSPManager.id.in_(camera_list))
            .all()
        )
        return ai_model_obj


ai_model = CRUDDevice(AIModels)
