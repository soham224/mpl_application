import uuid

from fastapi import HTTPException

import schemas
from crud.base import CRUDBase
from models.notification_config import NotificationConfig


class CRUDNotificationConfig(
    CRUDBase[NotificationConfig, NotificationConfig, NotificationConfig]
):

    def get_data_by_company_id(self, db, company_id):
        return (
            db.query(NotificationConfig)
            .filter(NotificationConfig.company_id == company_id)
            .filter(NotificationConfig.status == True)
            .all()
        )

    def check_email(self, to_email, new_email):
        for email_data in to_email:
            if new_email == email_data["email"]:
                raise HTTPException(
                    status_code=400, detail="Email already exists in the system."
                )

    def check_id(self, to_email, new_id):
        id_check_list = [data["id"] == new_id for data in to_email]
        if not any(id_check_list):
            raise HTTPException(status_code=400, detail="No data not found.")

    def get_one_data_by_company_id(self, db, company_id):
        return (
            db.query(NotificationConfig)
            .filter(NotificationConfig.company_id == company_id)
            .first()
        )

    def get_email_by_id(self, db, company_id, data_id):
        notification_object = self.get_one_data_by_company_id(db, company_id)
        if not notification_object or not notification_object.meta_data["to_email"]:
            raise HTTPException(status_code=400, detail="No data not found.")
        email_data = {}
        for data in notification_object.meta_data["to_email"]:
            if data["id"] == data_id:
                email_data = data
        if not email_data:
            raise HTTPException(status_code=400, detail="No data not found.")
        return email_data

    def add_new_email(self, db, current_user, notification_details):
        notification_object = self.get_one_data_by_company_id(
            db, current_user.company_id
        )
        if not notification_object:
            notification_object = self.create(
                db=db,
                obj_in={
                    "notification_type": "EMAIL",
                    "meta_data": {
                        "to_email": [
                            {
                                "email": notification_details.email,
                                "status": True,
                                "id": str(uuid.uuid4()),
                            }
                        ]
                    },
                    "status": True,
                    "company_id": current_user.company_id,
                },
            )
        else:
            update_meta_data = notification_object.meta_data
            self.check_email(
                notification_object.meta_data["to_email"], notification_details.email
            )
            update_meta_data["to_email"].append(
                {
                    "email": notification_details.email,
                    "status": True,
                    "id": str(uuid.uuid4()),
                }
            )
            notification_object = self.update(
                db=db,
                db_obj=notification_object,
                obj_in={"meta_data": update_meta_data},
            )
        return notification_object.meta_data["to_email"]

    def update_notification_email(
        self,
        db,
        current_user,
        notification_details: schemas.NotificationConfigUpdateEmailBase,
    ):
        notification_object = self.get_one_data_by_company_id(
            db, current_user.company_id
        )
        update_meta_data = notification_object.meta_data
        self.check_id(
            notification_object.meta_data["to_email"], notification_details.id
        )
        self.check_email(
            [
                data
                for data in notification_object.meta_data["to_email"]
                if data["id"] != notification_details.id
            ],
            notification_details.email,
        )
        for data in notification_object.meta_data["to_email"]:
            if data["id"] == notification_details.id:
                data["email"] = notification_details.email
        notification_object = self.update(
            db=db,
            db_obj=notification_object,
            obj_in={"meta_data": update_meta_data},
        )
        return notification_object.meta_data["to_email"]

    def update_notification_email_status(
        self,
        db,
        current_user,
        notification_details: schemas.NotificationConfigUpdateStatusBase,
    ):
        notification_object = self.get_one_data_by_company_id(
            db, current_user.company_id
        )
        update_meta_data = notification_object.meta_data
        self.check_id(
            notification_object.meta_data["to_email"], notification_details.id
        )
        for data in notification_object.meta_data["to_email"]:
            if data["id"] == notification_details.id:
                data["status"] = notification_details.status
        notification_object = self.update(
            db=db,
            db_obj=notification_object,
            obj_in={"meta_data": update_meta_data},
        )
        return notification_object.meta_data["to_email"]


notification_config_crud_object = CRUDNotificationConfig(NotificationConfig)
