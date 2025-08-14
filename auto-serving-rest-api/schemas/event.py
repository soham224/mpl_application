from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


# Shared properties
class EventFilterCreate(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    current_date: Optional[datetime]
    camera_id: Optional[list]
    selected_event_list: Optional[str]
    duration_type: str
    initial_graph: Optional[bool]


class EventCreate(BaseModel):
    company_id: str
    user_id: str
    camera_id: str
    event_name: str
    event_desc: str
    event_type: str
    event_date: datetime
    created_date: datetime
    updated_date: datetime
    status: bool
    is_hide: bool
    image_list: List[str]
