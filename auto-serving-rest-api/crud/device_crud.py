from sqlalchemy.orm import Session

from crud.base import CRUDBase
from models.device import Device
from schemas.device import *


class CRUDDevice(CRUDBase[Device, DeviceCreate, DeviceUpdate]):
    def get_by_id(self, db: Session, _id: int):
        return super().get(db, _id)


device = CRUDDevice(Device)
