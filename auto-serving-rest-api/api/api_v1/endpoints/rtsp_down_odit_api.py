from datetime import datetime, timedelta
from typing import Any, Optional

import pandas as pd
from fastapi import Depends, APIRouter, Body, HTTPException
from fastapi_pagination import paginate, Page
from sqlalchemy.orm import Session
from starlette.responses import StreamingResponse

import crud
import models
import schemas
from api import deps
import logging
from fastapi.responses import FileResponse
from io import BytesIO


router = APIRouter()


@router.post("/get_rtsp_down_data", response_model=Page[schemas.RtspDownOditRead])
def get_rtsp_down_data(
    search: str = Body(""),
    start_date: Optional[datetime] = Body(None),
    end_date: Optional[datetime] = Body(None),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    add_db_obj = crud.rtsp_down_odit_crud_obj.get_filter_data(
        db=db, search=search, start_date=start_date, end_date=end_date
    )
    if add_db_obj:
        return paginate(add_db_obj)
    else:
        logging.info("Rtsp data not found")
        return paginate([])


@router.post("/download_rtsp_down_data")
async def download_rtsp_down_data(
    search: str = Body(""),
    start_date: Optional[datetime] = Body(None),
    end_date: Optional[datetime] = Body(None),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    add_db_obj = crud.rtsp_down_odit_crud_obj.get_filter_data_for_excle(
        db=db, search=search, start_date=start_date, end_date=end_date
    )
    data_dict = {
        "camera_name": [],
        "date_time": [],
        "rtsp_status": [],
    }
    if not add_db_obj:
        raise HTTPException(status_code=404, detail="No data found")

    for data in add_db_obj:
        data_dict["camera_name"].append(data[1].camera_name)
        data_dict["rtsp_status"].append(str(data[0].rtsp_status))
        data_dict["date_time"].append(data[0].created_date)

    df = pd.DataFrame(data_dict)
    buffer = BytesIO()
    with pd.ExcelWriter(buffer) as writer:
        df.to_excel(writer, index=False)
    return StreamingResponse(
        BytesIO(buffer.getvalue()),
        headers={"Content-Disposition": f"attachment; filename=tusker.xlsx"},
    )
