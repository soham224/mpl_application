from sqlalchemy import desc
from crud.base import CRUDBase
from models.rtsp_down_odit import RtspDownOdit
from schemas.rtsp_down_odit import RtspDownOditCreate
from models.deployment_job_rtsp import DeploymentJobRTSPManager
from sqlalchemy.orm import Session


class CRUDRtspDownOdit(CRUDBase[RtspDownOdit, RtspDownOditCreate, RtspDownOditCreate]):
    def get_filter_data(self, db: Session, search: str, start_date, end_date):
        query = (
            db.query(RtspDownOdit)
            .join(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.camera_name.ilike("%" + search + "%"))
        )
        if start_date and end_date:
            query = query.filter(
                RtspDownOdit.created_date.between(start_date, end_date)
            )
        return query.order_by(desc(RtspDownOdit.id)).all()

    def get_filter_data_for_excle(self, db: Session, search: str, start_date, end_date):
        query = (
            db.query(RtspDownOdit, DeploymentJobRTSPManager)
            .join(DeploymentJobRTSPManager)
            .filter(DeploymentJobRTSPManager.camera_name.ilike("%" + search + "%"))
        )
        if start_date and end_date:
            query = query.filter(
                RtspDownOdit.created_date.between(start_date, end_date)
            )
        return query.order_by(desc(RtspDownOdit.id)).all()


rtsp_down_odit_crud_obj = CRUDRtspDownOdit(RtspDownOdit)
