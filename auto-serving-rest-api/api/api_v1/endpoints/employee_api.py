import datetime
from datetime import date
from typing import Any, List
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.aws_utils import *

router = APIRouter()


@router.post("/add_employee", response_model=schemas.EmployeeRead)
def add_employee(
    employee_name: str,
    employee_description: str,
    employee_profession: str,
    employee_contact_number: str,
    employee_id: str,
    trained_status: bool,
    external_name: str,
    company_id: int,
    location_id: int,
    status: bool,
    employee_image: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    if employee_image:
        s3_key, img_url = upload_employee_image(
            str(current_user.id), employee_name, employee_image
        )
    else:
        img_url = ""
    employee_details = schemas.EmployeeCreate(
        employee_name=employee_name,
        employee_profession=employee_profession,
        employee_description=employee_description,
        employee_contact_number=employee_contact_number,
        employee_id=employee_id,
        trained_status=trained_status,
        company_id=company_id,
        location_id=location_id,
        external_name=external_name,
        employee_s3_image_key=s3_key,
        employee_s3_image_url=img_url,
        status=status,
        created_date=datetime.datetime.utcnow().replace(microsecond=0),
        updated_date=datetime.datetime.utcnow().replace(microsecond=0),
    )
    if isinstance(employee_details, dict):
        obj_in = employee_details
    else:
        obj_in = employee_details.dict(exclude_unset=True)
    out_obj = crud.employee_crud_obj.create(db=db, obj_in=obj_in)
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Recorded!")
    return out_obj


@router.post("/update_employee", response_model=schemas.EmployeeRead)
def update_employee(
    id: int,
    employee_name: str,
    employee_description: str,
    employee_profession: str,
    employee_contact_number: str,
    employee_id: str,
    trained_status: bool,
    external_name: str,
    company_id: int,
    location_id: int,
    status: bool,
    s3_key: Optional[str],
    s3_url: Optional[str],
    employee_image: Optional[UploadFile] = File(None),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.employee_crud_obj.get(db, id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    if employee_image:
        s3_key, s3_url = upload_employee_image(
            str(current_user.id), employee_name, employee_image
        )

    employee_details = schemas.EmployeeUpdate(
        id=db_obj.id,
        employee_name=employee_name,
        employee_profession=employee_profession,
        employee_description=employee_description,
        employee_contact_number=employee_contact_number,
        employee_id=employee_id,
        trained_status=trained_status,
        company_id=company_id,
        location_id=location_id,
        external_name=external_name,
        employee_s3_image_key=s3_key,
        employee_s3_image_url=s3_url,
        status=status,
        created_date=datetime.datetime.utcnow().replace(microsecond=0),
        updated_date=datetime.datetime.utcnow().replace(microsecond=0),
    )
    if isinstance(employee_details, dict):
        obj_in = employee_details
    else:
        obj_in = employee_details.dict(exclude_unset=True)
    out_obj = crud.employee_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=employee_details
    )
    if not out_obj:
        raise HTTPException(status_code=500, detail="Data Not Updated!")
    return out_obj


@router.get(
    "/get_all_employee_by_company_id", response_model=List[schemas.EmployeeRead]
)
def get_all_employee_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    employee_list = crud.employee_crud_obj.get_employee_by_company_id(
        db=db, company_id=current_user.company_id
    )
    if not employee_list:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return employee_list


@router.get(
    "/get_all_enabled_employee_by_company_id", response_model=List[schemas.EmployeeRead]
)
def get_all_enabled_employee_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    employee_list = crud.employee_crud_obj.get_enabled_employee_by_company_id(
        db=db, company_id=current_user.company_id
    )
    if not employee_list:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return employee_list


@router.get("/get_employee_by_id", response_model=schemas.EmployeeRead)
def get_employee_by_id(
    id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    employee = crud.employee_crud_obj.get_by_id(db=db, _id=id)
    if not employee:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return employee


@router.get("/get_today_attendance_report")
def get_today_attendance_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    # 1. Get trained employee list by company id
    emp_data = crud.employee_crud_obj.get_trained_employee_by_company_id(
        db, current_user.company_id
    )

    # 2. Compare them with attendance and the today date
    today_detections_data = (
        crud.employee_attendance_crud_obj.get_today_attendance_report(
            db, current_user.company_id
        )
    )
    final_list = []

    for employee in emp_data:
        data = {"name": employee.employee_name, "employee_id": employee.id}
        if len(today_detections_data) > 0:
            for detection in today_detections_data[:]:
                if employee.external_name == detection.external_image_id:
                    data["date"] = detection.created_date
                    data["is_present"] = 1
                    today_detections_data.remove(detection)
                    final_list.append(data)
                    data = {}
                    break
            if len(data.keys()) > 0:
                data["is_present"] = 0
                final_list.append(data)
        else:
            data["is_present"] = 0
            final_list.append(data)

    return final_list


@router.get("/generate_attendance_report")
def generate_attendance_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    attendance_report = register_and_run_task_for_attendance_report(current_user)
    if not attendance_report:
        raise HTTPException(status_code=404, detail="No Data Found For Requested ID")
    return attendance_report


@router.post("/employee_training")
def employee_training(
    employee_id_list: list,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    for employee_id in employee_id_list:
        db_obj = crud.employee_crud_obj.get(db, employee_id)
        if not db_obj:
            raise HTTPException(
                status_code=404, detail="Data Not Found For Id " + str(employee_id)
            )
        employee_training = get_employee_training_response(
            db_obj.id,
            db_obj.company_id,
            db_obj.employee_s3_image_key,
            db_obj.employee_name.replace(" ", ""),
        )
        if employee_training:
            employee_aws_data = schemas.EmployeeAWSCreate(
                face_id=employee_training["face_id"],
                image_id=employee_training["image_id"],
                external_image_id=employee_training["external_image_id"],
                employee_id=int(employee_training["employee_id"]),
                status=True,
                created_date=datetime.datetime.utcnow().replace(microsecond=0),
                updated_date=datetime.datetime.utcnow().replace(microsecond=0),
            )
            if isinstance(employee_aws_data, dict):
                obj_in = employee_aws_data
            else:
                obj_in = employee_aws_data.dict(exclude_unset=True)
            out_obj = crud.employee_aws_data_crud_obj.create(db=db, obj_in=obj_in)
            if not out_obj:
                raise HTTPException(
                    status_code=500,
                    detail="Data Not Added In Employee AWS Data For ID "
                    + str(employee_id),
                )
            employee_details = schemas.EmployeeUpdate(
                id=db_obj.id,
                employee_name=db_obj.employee_name,
                employee_profession=db_obj.employee_profession,
                employee_description=db_obj.employee_description,
                employee_contact_number=db_obj.employee_contact_number,
                employee_id=db_obj.employee_id,
                trained_status=True,
                company_id=db_obj.company_id,
                location_id=db_obj.location_id,
                external_name=employee_training["external_image_id"],
                employee_s3_image_key=db_obj.employee_s3_image_key,
                employee_s3_image_url=db_obj.employee_s3_image_url,
                status=db_obj.status,
                created_date=db_obj.created_date,
                updated_date=datetime.datetime.utcnow().replace(microsecond=0),
            )
            if isinstance(employee_details, dict):
                obj_in = employee_details
            else:
                obj_in = employee_details.dict(exclude_unset=True)
            out_obj = crud.employee_crud_obj.update(db=db, db_obj=db_obj, obj_in=obj_in)
            if not out_obj:
                raise HTTPException(
                    status_code=500, detail="Data Not Updated in Employee Table!"
                )
        else:
            raise HTTPException(status_code=500, detail="Data Not Updated")
    return "Employees face added to the dataset successfully"


@router.post("/delete_employee_from_trained_employee")
def delete_employee_from_trained_employee(
    employee_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    db_obj = crud.employee_crud_obj.get(db, employee_id)
    if not db_obj:
        raise HTTPException(
            status_code=404, detail="Data Not Found For Id " + str(employee_id)
        )
    aws_db_obj = crud.employee_aws_data_crud_obj.get_by_employee_id(db, employee_id)
    if not aws_db_obj:
        raise HTTPException(
            status_code=404, detail="Trained Data Not Found For Id " + str(employee_id)
        )
    employee_training = delete_identities_from_trained_collection(
        aws_db_obj.face_id, db_obj.company_id
    )
    if employee_training:
        employee_aws_data = schemas.EmployeeAWSUpdate(
            id=aws_db_obj.id,
            face_id=aws_db_obj.face_id,
            image_id=aws_db_obj.image_id,
            external_image_id=aws_db_obj.external_image_id,
            employee_id=aws_db_obj.employee_id,
            status=False,
            created_date=aws_db_obj.created_date,
            updated_date=aws_db_obj.updated_date,
        )
        if isinstance(employee_aws_data, dict):
            aws_obj_in = employee_aws_data
        else:
            aws_obj_in = employee_aws_data.dict(exclude_unset=True)
        out_obj = crud.employee_aws_data_crud_obj.update(
            db=db, db_obj=aws_db_obj, obj_in=aws_obj_in
        )
        if not out_obj:
            raise HTTPException(
                status_code=500,
                detail="Data Not Added In Employee AWS Data For ID " + str(employee_id),
            )
        employee_details = schemas.EmployeeUpdate(
            id=db_obj.id,
            employee_name=db_obj.employee_name,
            employee_profession=db_obj.employee_profession,
            employee_description=db_obj.employee_description,
            employee_contact_number=db_obj.employee_contact_number,
            employee_id=db_obj.employee_id,
            trained_status=False,
            company_id=db_obj.company_id,
            location_id=db_obj.location_id,
            external_name=db_obj.external_name,
            employee_s3_image_key=db_obj.employee_s3_image_key,
            employee_s3_image_url=db_obj.employee_s3_image_url,
            status=db_obj.status,
            created_date=db_obj.created_date,
            updated_date=datetime.datetime.utcnow().replace(microsecond=0),
        )
        if isinstance(employee_details, dict):
            obj_in = employee_details
        else:
            obj_in = employee_details.dict(exclude_unset=True)
        out_obj = crud.employee_crud_obj.update(db=db, db_obj=db_obj, obj_in=obj_in)
        if not out_obj:
            raise HTTPException(
                status_code=500, detail="Data Not Updated in Employee Table!"
            )
    else:
        raise HTTPException(status_code=500, detail="Data Not Deleted")
    return "Employees face removed from the dataset successfully"


@router.post("/check_for_today_attendance_report")
def check_for_today_attendance_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    today_report_details = (
        crud.employee_attendance_crud_obj.get_today_report_by_company_id(
            db, current_user.id
        )
    )
    if len(today_report_details) > 0:
        return False
    else:
        return True


@router.get(
    "/get_trained_employee_by_company_id", response_model=List[schemas.EmployeeRead]
)
def get_trained_employee_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    emp_data = crud.employee_crud_obj.get_trained_employee_by_company_id(
        db=db, company_id=current_user.company_id
    )
    if not emp_data:
        raise HTTPException(status_code=400, detail="Data not found.")
    else:
        return emp_data


@router.get("/get_attendance_report_by_employee")
def get_attendance_report_by_employee(
    emp_ext_name: str,
    current_month: int,
    current_year: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    emp_data = crud.employee_attendance_crud_obj.get_counts_by_employee(
        db, emp_ext_name, current_month, current_year
    )
    if not emp_data:
        raise HTTPException(status_code=400, detail="Data not found.")
    else:
        emp_data = [x[0] for x in emp_data]
        tmp_dict = {}
        final_dict = {}
        num_days = datetime.datetime.utcnow().day
        month_dates = [
            datetime.date(current_year, current_month, day)
            for day in range(1, num_days + 1)
        ]
        for date in month_dates:
            if date in emp_data:
                tmp_dict[date] = 1
            else:
                tmp_dict[date] = 0
        final_dict["all"] = tmp_dict
        final_dict["present"] = sum(value == 1 for value in tmp_dict.values())
        final_dict["absent"] = len(month_dates) - len(emp_data)
        return final_dict


@router.get("/get_attendance_report_by_date")
def get_attendance_report_by_date(
    report_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_admin),
) -> Any:
    # 1. Get trained employee list by company id
    emp_data = crud.employee_crud_obj.get_trained_employee_by_company_id(
        db, current_user.company_id
    )

    # 2. Compare them with attendance and the given date
    detections_data_by_date = (
        crud.employee_attendance_crud_obj.get_attendance_report_by_date(
            db, current_user.company_id, report_date
        )
    )
    final_list = []
    present_count = 0
    not_present_count = 0

    for employee in emp_data:
        data = {"name": employee.employee_name, "employee_id": employee.id}
        if len(detections_data_by_date) > 0:
            for detection in detections_data_by_date[:]:
                if employee.external_name == detection.external_image_id:
                    data["date"] = detection.created_date
                    data["is_present"] = 1
                    if present_count == 0:
                        present_count = 1
                    else:
                        present_count = present_count + 1
                    detections_data_by_date.remove(detection)
                    final_list.append(data)
                    data = {}
                    break
            if len(data.keys()) > 0:
                if not_present_count == 0:
                    not_present_count = 1
                else:
                    not_present_count = not_present_count + 1

                data["is_present"] = 0
                final_list.append(data)
        else:
            data["is_present"] = 0
            if not_present_count == 0:
                not_present_count = 1
            else:
                not_present_count = not_present_count + 1

            final_list.append(data)
    date_data = {
        "present": present_count,
        "not_present": not_present_count,
        "data": final_list,
    }
    return date_data


@router.get(
    "/supervisor_get_trained_employee_by_company_id",
    response_model=List[schemas.EmployeeRead],
)
def get_trained_employee_by_company_id(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    emp_data = crud.employee_crud_obj.get_supervisor_trained_employee_by_company_id(
        db=db, company_id=current_user.company_id, location_list=location_list
    )
    if not emp_data:
        return []
    else:
        return emp_data


@router.get("/supervisor_get_attendance_report_by_employee")
def supervisor_get_attendance_report_by_employee(
    emp_ext_name: str,
    current_month: int,
    current_year: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    emp_data = crud.employee_attendance_crud_obj.get_counts_by_employee(
        db, emp_ext_name, current_month, current_year
    )
    if not emp_data:
        raise HTTPException(status_code=400, detail="Data not found.")
    else:
        emp_data = [x[0] for x in emp_data]
        tmp_dict = {}
        final_dict = {}
        num_days = datetime.datetime.utcnow().day
        month_dates = [
            datetime.date(current_year, current_month, day)
            for day in range(1, num_days + 1)
        ]
        for date in month_dates:
            if date in emp_data:
                tmp_dict[date] = 1
            else:
                tmp_dict[date] = 0
        final_dict["all"] = tmp_dict
        final_dict["present"] = sum(value == 1 for value in tmp_dict.values())
        final_dict["absent"] = len(month_dates) - len(emp_data)
        return final_dict


@router.get("/supervisor_get_attendance_report_by_date")
def supervisor_get_attendance_report_by_date(
    report_date: date,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    # 1. Get trained employee list by company id
    emp_data = crud.employee_crud_obj.get_supervisor_trained_employee_by_company_id(
        db=db, company_id=current_user.company_id, location_list=location_list
    )

    # 2. Compare them with attendance and the given date
    detections_data_by_date = (
        crud.employee_attendance_crud_obj.get_attendance_report_by_date(
            db, current_user.company_id, report_date
        )
    )
    final_list = []
    present_count = 0
    not_present_count = 0

    for employee in emp_data:
        data = {"name": employee.employee_name, "employee_id": employee.id}
        if len(detections_data_by_date) > 0:
            for detection in detections_data_by_date[:]:
                if employee.external_name == detection.external_image_id:
                    data["date"] = detection.created_date
                    data["is_present"] = 1
                    if present_count == 0:
                        present_count = 1
                    else:
                        present_count = present_count + 1
                    detections_data_by_date.remove(detection)
                    final_list.append(data)
                    data = {}
                    break
            if len(data.keys()) > 0:
                if not_present_count == 0:
                    not_present_count = 1
                else:
                    not_present_count = not_present_count + 1

                data["is_present"] = 0
                final_list.append(data)
        else:
            data["is_present"] = 0
            if not_present_count == 0:
                not_present_count = 1
            else:
                not_present_count = not_present_count + 1

            final_list.append(data)
    date_data = {
        "present": present_count,
        "not_present": not_present_count,
        "data": final_list,
    }
    return date_data


@router.get("/supervisor_get_today_attendance_report")
def supervisor_get_today_attendance_report(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_supervisor),
) -> Any:
    location_list = []
    if current_user.locations:
        for location_obj in current_user.locations:
            location_list.append(location_obj.__dict__["id"])
    # 1. Get trained employee list by company id
    emp_data = crud.employee_crud_obj.get_supervisor_trained_employee_by_company_id(
        db=db, company_id=current_user.company_id, location_list=location_list
    )

    # 2. Compare them with attendance and the today date
    today_detections_data = (
        crud.employee_attendance_crud_obj.get_today_attendance_report(
            db, current_user.company_id
        )
    )
    final_list = []

    for employee in emp_data:
        data = {"name": employee.employee_name, "employee_id": employee.id}
        if len(today_detections_data) > 0:
            for detection in today_detections_data[:]:
                if employee.external_name == detection.external_image_id:
                    data["date"] = detection.created_date
                    data["is_present"] = 1
                    today_detections_data.remove(detection)
                    final_list.append(data)
                    data = {}
                    break
            if len(data.keys()) > 0:
                data["is_present"] = 0
                final_list.append(data)
        else:
            data["is_present"] = 0
            final_list.append(data)

    return final_list
