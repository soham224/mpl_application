import json
from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import crud
import models
from api import deps
from core.result_utils import (
    get_initial_info,
    get_paginated_result,
    update_status_record,
    get_initial_info_admin,
    get_paginated_result_admin,
    get_paginated_datetime_result_admin,
    get_datetime_initial_info_admin,
    get_datetime_initial_info,
    get_paginated_datetime_result,
    get_paginated_result_resultmanager,
    get_datetime_initial_info_resultmanager,
    get_data_of_last_graph_step,
    add_updated_result_in_mongo_database,
    remove_result_in_mongo_database,
    get_camera_id_list_for_supervisor,
    get_result_popup_data,
)
from typing import Optional
from applogging.applogger import MyLogger
from schemas import AnprVmsDetailsRead, VehicleDetailsRead
from schemas.filter import ResultPopUpFilter

router = APIRouter()
logging = MyLogger().get_logger("result_handler")


@router.post("/get_result_metadata")
def get_result_metadata(
    page_size: Optional[int] = None,
    location_id_list: Optional[list] = None,
    camera_id_list: Optional[list] = None,
    label_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = None
    if crud.user.is_supervisor(current_user) or crud.user.is_reporter(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []

        if not location_id_list or "-1" in location_id_list:
            location_list = []
            if crud.user.is_reporter(current_user):
                location_obj = crud.location_crud_obj.get_all_company_location(
                    db, current_user.company_id
                )
                location_list = [location.id for location in location_obj]
            else:
                if current_user.locations:
                    for location_obj in current_user.locations:
                        location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
        else:
            location_list = location_id_list

        if not camera_id_list or "-1" in camera_id_list:
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)

        if not label_list or "-1" in label_list:
            labels_obj = (
                crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                    db, camera_id_list
                )
            )
            label_list = [
                label
                for label_obj in labels_obj
                for label in label_obj.labels.split(",")
            ]

        return get_initial_info(
            user_id, camera_id_list, label_list, start_date, end_date, page_size
        )
    else:
        user_id = current_user.id

        if not location_id_list or "-1" in location_id_list:
            location_list = []
            location_id_list = crud.location_crud_obj.get_all_company_enabled_location(
                db, current_user.company_id
            )
            for location_obj in location_id_list:
                location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
        else:
            location_list = location_id_list

        if not camera_id_list or "-1" in camera_id_list:
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)

        if not label_list or "-1" in label_list:
            labels_obj = (
                crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                    db, camera_id_list
                )
            )
            label_list = [
                label
                for label_obj in labels_obj
                for label in label_obj.labels.split(",")
            ]

        return get_initial_info(
            user_id, camera_id_list, label_list, start_date, end_date, page_size
        )


@router.post("/get_result_metadata_admin")
def get_result_metadata_admin(
    camera_id: int,
    company_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    return get_initial_info_admin(company_id, camera_id)


@router.post("/get_result")
def get_result(
    page_number: int,
    job_id: int,
    page_size: Optional[int] = 10,
    camera_id_list: Optional[list] = None,
    label_list: Optional[list] = None,
    location_id_list: Optional[list] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if crud.user.is_supervisor(current_user) or crud.user.is_reporter(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        if company_admin:
            user_id = company_admin.id
        else:
            logging.info("no admin found for that user")
            return []

        if not location_id_list or "-1" in location_id_list:
            location_list = []
            if crud.user.is_reporter(current_user):
                location_obj = crud.location_crud_obj.get_all_company_location(
                    db, current_user.company_id
                )
                location_list = [location.id for location in location_obj]
            else:
                if current_user.locations:
                    for location_obj in current_user.locations:
                        location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
        else:
            location_list = location_id_list

        if not camera_id_list or "-1" in camera_id_list:
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)

        if not label_list or "-1" in label_list:
            labels_obj = (
                crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                    db, camera_id_list
                )
            )
            label_list = [
                label
                for label_obj in labels_obj
                for label in label_obj.labels.split(",")
            ]

        data_list = json.loads(
            get_paginated_result(
                user_id=user_id,
                camera_id_list=camera_id_list,
                page_number=page_number,
                label_list=label_list,
                start_date=start_date,
                end_date=end_date,
                page_size=page_size,
            )
        )
        return data_list
    else:
        user_id = current_user.id

        if not location_id_list or "-1" in location_id_list:
            location_list = []
            location_id_list = crud.location_crud_obj.get_all_company_enabled_location(
                db, current_user.company_id
            )
            for location_obj in location_id_list:
                location_list.append(location_obj.__dict__["id"])
            if not location_list:
                raise HTTPException(
                    status_code=404, detail="No Location Found For User"
                )
        else:
            location_list = location_id_list

        if not camera_id_list or "-1" in camera_id_list:
            camera_id_list = get_camera_id_list_for_supervisor(location_list, db)

        if not label_list or "-1" in label_list:
            labels_obj = (
                crud.camera_label_mappping_crud_obj.get_labels_by_list_of_camera_id(
                    db, camera_id_list
                )
            )
            label_list = [
                label
                for label_obj in labels_obj
                for label in label_obj.labels.split(",")
            ]

        data_list = json.loads(
            get_paginated_result(
                user_id=user_id,
                camera_id_list=camera_id_list,
                page_number=page_number,
                label_list=label_list,
                start_date=start_date,
                end_date=end_date,
                page_size=page_size,
            )
        )
        return data_list


@router.post("/get_result_admin")
def get_result_admin(
    page_number: int,
    camera_id: int,
    job_id: int,
    company_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    data_list = json.loads(
        get_paginated_result_admin(company_id, camera_id, page_number)
    )
    label_setting_lst = crud.label_setting.get_by_job_id(db, job_id)
    if not label_setting_lst:
        return data_list
    else:
        for label_setting in label_setting_lst:
            label_setting_dict = label_setting.__dict__
            for data in data_list:
                for detections in data.get("result").get("detection"):
                    if (
                        detections.get("label").strip()
                        == label_setting_dict["default_label"].strip()
                    ):
                        detections["label"] = label_setting_dict["new_label"]
        return data_list


@router.post("/update_result_status_resultmanager")
def update_status(
    oid: str,
    status_val: bool,
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    return update_status_record(oid, status_val)


@router.post("/get_result_metadata_resultmanager")
def get_result_metadata_resultmanager(
    company_id: int,
    camera_id_list: Optional[list] = None,
    label_list: Optional[list] = None,
    from_datetime: Optional[datetime] = None,
    to_datetime: Optional[datetime] = None,
    isHide: Optional[bool] = None,
    isDetection: Optional[bool] = None,
    isViewAll: Optional[bool] = None,
    isLocationSelected: Optional[bool] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return get_datetime_initial_info_resultmanager(
        company_id,
        camera_id_list,
        label_list,
        from_datetime,
        to_datetime,
        isHide,
        isDetection,
        isViewAll,
        isLocationSelected,
    )


@router.post("/get_result_resultmanager")
def get_result_resultmanager(
    page_number: int,
    company_id: int,
    camera_id_list: Optional[list] = None,
    label_list: Optional[list] = None,
    from_datetime: Optional[datetime] = None,
    to_datetime: Optional[datetime] = None,
    isHide: Optional[bool] = None,
    isDetection: Optional[bool] = None,
    isViewAll: Optional[bool] = None,
    isLocationSelected: Optional[bool] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_resultmanager),
) -> Any:
    data_list = json.loads(
        get_paginated_result_resultmanager(
            company_id,
            camera_id_list,
            label_list,
            from_datetime,
            to_datetime,
            page_number,
            isHide,
            isDetection,
            isViewAll,
            isLocationSelected,
        )
    )
    return data_list


@router.post("/update_status")
def update_status(
    oid: str,
    status_val: bool,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return update_status_record(oid, status_val)


@router.post("/get_admin_result_metadata_datetime")
def get_admin_result_metadata_datetime(
    company_id: int,
    camera_id: int,
    from_datetime: datetime,
    to_datetime: datetime,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    return get_datetime_initial_info_admin(
        company_id, camera_id, from_datetime, to_datetime
    )


@router.post("/get_result_metadata_datetime")
def get_result_metadata_datetime(
    camera_id: int,
    from_datetime: datetime,
    to_datetime: datetime,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    return get_datetime_initial_info(
        current_user.id, camera_id, from_datetime, to_datetime
    )


@router.post("/get_admin_result_datetime")
def get_admin_result_datetime(
    company_id: int,
    camera_id: int,
    job_id: int,
    page_number: int,
    from_datetime: datetime,
    to_datetime: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    logging.info("from_datetime {}".format(from_datetime))
    logging.info("to_datetime {}".format(to_datetime))
    data_list = json.loads(
        get_paginated_datetime_result_admin(
            company_id, camera_id, page_number, from_datetime, to_datetime
        )
    )
    label_setting_lst = crud.label_setting.get_by_job_id(db, job_id)
    if not label_setting_lst:
        return data_list
    else:
        for label_setting in label_setting_lst:
            label_setting_dict = label_setting.__dict__
            for data in data_list:
                for detections in data.get("result").get("detection"):
                    if (
                        detections.get("label").strip()
                        == label_setting_dict["default_label"].strip()
                    ):
                        detections["label"] = label_setting_dict["new_label"]
        return data_list


@router.post("/get_result_datetime")
def get_result_datetime(
    camera_id: int,
    job_id: int,
    page_number: int,
    from_datetime: datetime,
    to_datetime: datetime,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    logging.info("from_datetime {}".format(from_datetime))
    logging.info("to_datetime {}".format(to_datetime))
    data_list = json.loads(
        get_paginated_datetime_result(
            current_user.id, camera_id, page_number, from_datetime, to_datetime
        )
    )
    label_setting_lst = crud.label_setting.get_by_job_id(db, job_id)
    if not label_setting_lst:
        return data_list
    else:
        for label_setting in label_setting_lst:
            label_setting_dict = label_setting.__dict__
            for data in data_list:
                for detections in data.get("result").get("detection"):
                    if (
                        detections.get("label").strip()
                        == label_setting_dict["default_label"].strip()
                    ):
                        detections["label"] = label_setting_dict["new_label"]
        return data_list


@router.post("/update_result_result_manager")
def update_result_result_manager(
    data_id: str,
    result_data: dict,
    count_data: dict,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    data_list = json.loads(get_data_of_last_graph_step([data_id]))
    if data_list:
        return add_updated_result_in_mongo_database(data_id, result_data, count_data)
    else:
        return []


@router.post("/remove_result_result_manager")
def remove_result_result_manager(
    data_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    data_list = json.loads(get_data_of_last_graph_step(data_id))
    if data_list:
        return remove_result_in_mongo_database(data_id)
    else:
        return []


@router.post("/get_popup_data")
def get_popup_data(
    result_filter: ResultPopUpFilter,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    user_id = current_user.id
    if crud.user.is_supervisor(current_user):
        company_admin = crud.user.get_company_admin_by_supervisor(
            db, current_user.company_id
        )
        user_id = company_admin.id

    end_data = datetime.utcnow()
    start_date = end_data - timedelta(minutes=result_filter.time_period)
    final_result = json.loads(
        get_result_popup_data(
            user_id=user_id,
            start_date=start_date,
            end_date=end_data,
            label_list=result_filter.label_list,
        )
    )
    for result in final_result:
        result_count = {}
        for detection in result["result"]:
            result_count[detection["label"]] = (
                result_count.get(detection["label"], 0) + 1
            )
        result["counts"] = result_count
        result["result"] = {"detection": result["result"]}
    start_date += timedelta(hours=5, minutes=30)
    end_data += timedelta(hours=5, minutes=30)
    anpr_details = crud.anpr_vms_details_crud_obj.get_anpr_details_pop_up(
        db=db, start_date=start_date, end_date=end_data, speed=31
    )
    anpr_details_list = []

    for data in anpr_details:
        data.camera_details
        number_plate_data = crud.vehicle_details_crud_obj.get_by_number_plate(
            db=db, number_plate=data.plate, company_id=current_user.company_id
        )
        if number_plate_data:
            vehicle_data = VehicleDetailsRead(**number_plate_data.__dict__).__dict__
        else:
            vehicle_data = {}
        dict_data = AnprVmsDetailsRead(**data.__dict__).__dict__
        dict_data.update({"notification_type": "anpr", "vehicle_data": vehicle_data})
        anpr_details_list.append(dict_data)
    for data in final_result:
        data.update({"notification_type": "tusker"})
    final_result_combine = final_result + anpr_details_list
    return anpr_details_list
