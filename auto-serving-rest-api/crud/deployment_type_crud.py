from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.deployment_type import DeploymentType
from schemas.deployment_type import *


class CRUDDeploymentType(
    CRUDBase[DeploymentType, DeploymentTypeCreate, DeploymentTypeUpdate]
):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


deployment_type = CRUDDeploymentType(DeploymentType)
