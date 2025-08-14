import logging

from sqlalchemy import asc
from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.ai_model import AIModels
from models.deployment_job_rtsp import DeploymentJobRTSPManager, DeploymentJobRTSP
from models.location import Location
from schemas.deployment_job_rtsp import *


class CRUDDeploymentJobRTSPManager(
    CRUDBase[
        DeploymentJobRTSPManager,
        DeploymentJobRTSPManagerCreate,
        DeploymentJobRTSPManagerUpdate,
    ]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)

    def update_rtsp_status(self, db: Session, status_type, status_val, db_obj):
        if status_type.lower() == "is_active":
            db_obj.is_active = status_val
        elif status_type.lower() == "is_processing":
            db_obj.is_processing = status_val
        elif status_type.lower() == "status":
            db_obj.status = status_val
        else:
            logging.error("Invalid status type")
            return False
        db_obj.updated_date = datetime.utcnow().replace(microsecond=0)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        if db_obj.__dict__.get(status_type) == status_val:
            return True
        else:
            return False

    def get_total_cameras_count_by_location_id(
        self, db: Session, location_id: int, user_id: int
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id == location_id)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_total_active_cameras_count_by_location_id(
        self, db: Session, location_id: int, user_id: int
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id == location_id)
            .filter(DeploymentJobRTSPManager.is_active == True)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_admin_total_active_cameras_count(self, db: Session, user_id):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.is_active == True)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_admin_total_cameras_count(self, db: Session, user_id):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_admin_total_cameras(self, db: Session, user_id):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_admin_total_cameras_by_status(self, db: Session, user_id):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .order_by(asc(DeploymentJobRTSPManager.is_active))
            .all()
        )

    def get_total_active_cameras_by_location(self, db: Session, location_list: list):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.is_active == True)
            .all()
        )

    def get_total_enabled_cameras_by_location(self, db: Session, location_list: list):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.status == True)
            .join(Location)
            .filter(
                DeploymentJobRTSPManager.location_id == Location.id,
                Location.status == True,
            )
            .all()
        )

    def get_total_enabled_cameras_by_location_result_manager(
        self, db: Session, user_id, location_list: list
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_total_enabled_cameras_result_manager(self, db: Session, user_id):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .join(Location)
            .filter(
                DeploymentJobRTSPManager.location_id == Location.id,
                Location.status == True,
            )
            .all()
        )

    def get_total_cameras_count_by_location_list(
        self, db: Session, location_list: list, user_id: int
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    def get_total_active_cameras_count_by_location_list(
        self, db: Session, location_list: list, user_id: int
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.is_active == True)
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .count()
        )

    # def get_total_cameras_details(
    #         self, db: Session, user_id: int, location_list: list,
    #         camera_list: list, model_list: list, page_size: int, page_no: int
    # ):
    #     return (
    #         db.query(DeploymentJobRTSPManager, Location, AIModels)
    #         .join(DeploymentJobRTSP, DeploymentJobRTSPManager.deployment_job_rtsp_id == DeploymentJobRTSP.id)
    #         .join(AIModels, DeploymentJobRTSP.model_id == AIModels.id)
    #         .join(Location, DeploymentJobRTSPManager.location_id == Location.id)
    #         .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
    #         .filter(DeploymentJobRTSPManager.id.in_(camera_list))
    #         .filter(DeploymentJobRTSPManager.status == True)
    #         .filter(DeploymentJobRTSP.model_id.in_(model_list))
    #         .filter(DeploymentJobRTSP.user_id == user_id)
    #         .limit(page_size)
    #         .offset(page_size*page_no)
    #         .all()
    #     )

    # def get_total_cameras_details1(
    #         self, db: Session, user_id: int, location_list: list,
    #         camera_list: list, model_list: list
    # ):
    #     return (
    #         db.query(DeploymentJobRTSPManager)
    #         .join(Location)
    #         .join(DeploymentJobRTSP)
    #         .filter(DeploymentJobRTSPManager.status == True)
    #         .filter(DeploymentJobRTSP.model_id.in_(model_list))
    #         .filter(DeploymentJobRTSP.user_id == user_id)
    #         # .limit(page_size)
    #         # .offset(page_size*page_no)
    #         .all()
    #         )

    def get_total_cameras_details_count(
        self,
        db: Session,
        user_id: int,
        location_list: list,
        camera_list: list,
        model_list: list,
    ):
        return len(
            db.query(DeploymentJobRTSPManager, Location, AIModels)
            .join(
                DeploymentJobRTSP,
                DeploymentJobRTSPManager.deployment_job_rtsp_id == DeploymentJobRTSP.id,
            )
            .join(AIModels, DeploymentJobRTSP.model_id == AIModels.id)
            .join(Location, DeploymentJobRTSPManager.location_id == Location.id)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.id.in_(camera_list))
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.model_id.in_(model_list))
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_total_cameras_by_location_list(
        self, db: Session, location_list: list, user_id: int
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .join(DeploymentJobRTSP)
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_total_cameras_details(
        self,
        db: Session,
        user_id: int,
        model_list: list,
        location_list: list,
        camera_list: list,
    ):
        return (
            db.query(DeploymentJobRTSPManager)
            .join(Location)
            .join(DeploymentJobRTSP)
            .join(AIModels)
            .filter(DeploymentJobRTSPManager.status == True)
            .filter(DeploymentJobRTSP.model_id.in_(model_list))
            .filter(DeploymentJobRTSPManager.location_id.in_(location_list))
            .filter(DeploymentJobRTSPManager.id.in_(camera_list))
            .filter(DeploymentJobRTSP.user_id == user_id)
            .all()
        )

    def get_all_camera_by_company_id(
        self, db: Session, company_id: int, add_filter=True
    ):
        from models.user import User

        queue = (
            db.query(DeploymentJobRTSPManager)
            .join(
                DeploymentJobRTSP,
                DeploymentJobRTSP.id == DeploymentJobRTSPManager.deployment_job_rtsp_id,
            )
            .join(User, User.id == DeploymentJobRTSP.user_id)
            .filter(User.company_id == company_id)
        )
        if add_filter:
            queue = queue.filter(DeploymentJobRTSPManager.status == True).filter(
                DeploymentJobRTSP.status == True
            )
        return queue.all()


deployment_camera = CRUDDeploymentJobRTSPManager(DeploymentJobRTSPManager)
