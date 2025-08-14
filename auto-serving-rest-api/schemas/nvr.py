from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# Shared properties
class NvrBase(BaseModel):
    nvr_id: str
    search_id: Optional[int]
    language_id: Optional[int]
    channel_id: Optional[int]
    log_type: Optional[str]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    max_results: Optional[int]
    page_no: Optional[int]


class NvrDetails(BaseModel):
    value: str
    label: str
