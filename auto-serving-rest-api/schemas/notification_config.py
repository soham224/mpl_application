from pydantic import BaseModel


# Shared properties
class NotificationConfigBase(BaseModel):
    email: str


class NotificationConfigUpdateBase(BaseModel):
    id: str


class NotificationConfigUpdateEmailBase(NotificationConfigUpdateBase):
    email: str


class NotificationConfigUpdateStatusBase(NotificationConfigUpdateBase):
    status: bool
