from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel


# Shared properties
class FilterCreate(BaseModel):
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    current_date: Optional[datetime]
    deployed_rtsp_job_id: Optional[int]
    camera_id: Optional[list]
    selected_model_labels_list: Optional[str]
    duration_type: Optional[str]
    initial_graph: Optional[bool]
    location_id: Optional[list]


class ResultPopUpFilter(BaseModel):
    time_period: int
    label_list: List[str]
