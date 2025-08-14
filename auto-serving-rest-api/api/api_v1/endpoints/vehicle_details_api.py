import io
import os
import time
from typing import Any, List, Optional
from openpyxl import load_workbook


import pandas as pd

import models
from api import deps
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session

import crud
import schemas
from datetime import datetime
from core.config import settings
from applogging.applogger import MyLogger
from PIL import Image

router = APIRouter()
logging = MyLogger().get_logger("vehicle_details_api")


@router.post("/add_vehicle_details", response_model=schemas.VehicleDetailsRead)
async def add_vehicle_details(
    number_plate: str = File(...),
    vehicle_type: str = File(...),
    owner_name: str = File(None),
    father_name: str = File(None),
    rc_date: str = File(None),
    vehicle_year: int = File(None),
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    vehicle_details_obj = crud.vehicle_details_crud_obj.get_by_number_plate(
        db, number_plate=number_plate.upper(), company_id=current_user.company_id
    )
    if vehicle_details_obj:
        logging.warning("Vehicle details already exists.")
        raise HTTPException(
            status_code=400,
            detail="The vehicle details already exists in the system.",
        )
    obj_in = {
        "number_plate": number_plate.upper(),
        "vehicle_type": vehicle_type,
        "owner_name": owner_name,
        "father_name": father_name,
        "rc_date": rc_date,
        "vehicle_year": vehicle_year,
        "company_id": current_user.company_id,
        "created_date": datetime.utcnow().replace(microsecond=0),
        "updated_date": datetime.utcnow().replace(microsecond=0),
        "status": True,
    }
    if file:
        file_name = f"{time.time()}_{file.filename}"
        file_path = f"{settings.DOWNLOAD_FILE_BASE_DIR}/{file_name}"
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        obj_in.update(
            {
                "image_name": file_name,
                "image_path": file_path,
                "image_url": f"{settings.IMAGE_BASE_URL}/images/{file_name}",
            }
        )
    db_obj = crud.vehicle_details_crud_obj.create(db=db, obj_in=obj_in)
    if not db_obj:
        raise HTTPException(status_code=500, detail="Data Not Added")
    return db_obj


@router.post("/upload_vehicle_details", response_model=str)
def upload_vehicle_details(
    file: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    image_list = []
    try:
        if not file.filename.split(".")[-1] in ["xlsx", "xls"]:
            raise HTTPException(status_code=422, detail="Invalid file type")

        excel_data = io.BytesIO(file.file.read())
        wb = load_workbook(excel_data)
        sheet = wb.active

        images_dict = {img.anchor._from.row: img._data() for img in sheet._images}
        df = pd.read_excel(excel_data)

        extracted_data = []
        for index, row in df.iterrows():
            row_number = index + 1
            image_name = None
            image_path = None
            image_url = None
            if row_number in images_dict:
                try:
                    img_data = images_dict[row_number]
                    img = Image.open(io.BytesIO(img_data))
                    image_name = f"{time.time()}.png"
                    image_path = f"{settings.DOWNLOAD_FILE_BASE_DIR}/{image_name}"
                    img.save(image_path)
                    image_list.append(image_path)
                    image_url = f"{settings.IMAGE_BASE_URL}/{image_path}"
                except Exception as e:
                    logging.warning("image not found")

            extracted_data.append(
                {
                    "number_plate": row["number_plate"].upper(),
                    "vehicle_type": "-" if type(row.get("vehicle_type")) != str else row.get("vehicle_type"),
                    "owner_name": "NA" if type(row.get("owner_name")) != str else row.get("owner_name"),
                    "father_name": "" if type(row.get("father_name")) != str else row.get("father_name"),
                    "rc_date": "" if type(row.get("rc_date")) != str else row.get("rc_date"),
                    "vehicle_year": "-" if type(row.get("vehicle_year")) != int else row.get("vehicle_year"),
                    "image_name": image_name if image_name else "-",
                    "image_path": image_path if image_path else "-",
                    "image_url": image_url if image_url else "-",
                    "company_id": current_user.company_id,
                    "created_date": datetime.utcnow().replace(microsecond=0),
                    "updated_date": datetime.utcnow().replace(microsecond=0),
                    "status": True,
                }
            )
        for obj_in in extracted_data:
            vehicle_details_obj = crud.vehicle_details_crud_obj.get_by_number_plate(
                db,
                number_plate=obj_in["number_plate"],
                company_id=current_user.company_id,
            )
            if not vehicle_details_obj:
                crud.vehicle_details_crud_obj.create(db=db, obj_in=obj_in)
            else:
                if obj_in.get("image_path"):
                    if os.path.exists(obj_in["image_path"]):
                        os.remove(obj_in["image_path"])
        return "Details added successfully."
    except Exception as e:
        for image in image_list:
            if os.path.exists(image):
                os.remove(image)
        raise HTTPException(
            status_code=400, detail="Details not added. Please try again."
        )


@router.post("/update_vehicle_details", response_model=schemas.VehicleDetailsRead)
def update_vehicle_details(
    vehicle_id: int,
    number_plate: str = File(...),
    vehicle_type: str = File(...),
    owner_name: str = File(None),
    father_name: str = File(None),
    rc_date: str = File(None),
    vehicle_year: int = File(None),
    file: Optional[UploadFile] = None,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    vehicle_details_obj = crud.vehicle_details_crud_obj.get_by_number_plate_and_id(
        db,
        number_plate=number_plate.upper(),
        company_id=current_user.company_id,
        vehicle_id=vehicle_id,
    )
    if vehicle_details_obj:
        logging.warning("Vehicle details already exists.")
        raise HTTPException(
            status_code=400,
            detail="The vehicle details already exists in the system.",
        )
    db_obj = crud.vehicle_details_crud_obj.get(db=db, id=vehicle_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    update_values = {
        "number_plate": number_plate.upper(),
        "vehicle_type": vehicle_type,
        "owner_name": owner_name,
        "father_name": father_name,
        "rc_date": rc_date,
        "vehicle_year": vehicle_year,
        "updated_date": datetime.utcnow().replace(microsecond=0),
    }
    if file:
        old_file_path = db_obj.image_path
        file_name = f"{time.time()}_{file.filename}"
        file_path = f"{settings.DOWNLOAD_FILE_BASE_DIR}/{file_name}"
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        update_values.update(
            {
                "image_name": file_name,
                "image_path": file_path,
                "image_url": f"{settings.IMAGE_BASE_URL}/{file_path}",
            }
        )
        if os.path.exists(old_file_path):
            os.remove(old_file_path)
    vehicle_details_obj = crud.vehicle_details_crud_obj.update(
        db=db, db_obj=db_obj, obj_in=update_values
    )
    return vehicle_details_obj


@router.get("/get_all_vehicle_details", response_model=List[schemas.VehicleDetailsRead])
def get_all_vehicle_details(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.vehicle_details_crud_obj.get_vehicle_details(
        db=db, company_id=current_user.company_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get("/get_vehicle_details_by_id", response_model=schemas.VehicleDetailsRead)
def get_vehicle_details_by_id(
    vehicle_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Any:
    db_obj = crud.vehicle_details_crud_obj.get_by_id(db=db, _id=vehicle_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.get(
    "/get_vehicle_details_by_number_plate",
    response_model=schemas.VehicleDetailsRead,
)
def get_vehicle_details_by_number_plate(
    number_plate: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.vehicle_details_crud_obj.get_by_number_plate(
        db=db, number_plate=number_plate, company_id=current_user.company_id
    )
    if not db_obj:
        raise HTTPException(status_code=404, detail="No Data Found")
    return db_obj


@router.delete("/delete_vehicle_details")
def delete_vehicle_details(
    vehicle_details_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> str:
    db_obj = crud.vehicle_details_crud_obj.get_by_id(db=db, _id=vehicle_details_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Details not found.")
    if os.path.exists(db_obj.image_path):
        os.remove(db_obj.image_path)
    crud.vehicle_details_crud_obj.update(
        db=db,
        db_obj=db_obj,
        obj_in={
            "status": False,
            "updated_date": datetime.utcnow().replace(microsecond=0),
        },
    )
    return "Vehicle details deleted successfully."


@router.post("/update_vehicle_status", response_model=schemas.VehicleDetailsRead)
def update_vehicle_details_status(
    vehicle_details_id: int,
    vehicle_details_status: bool,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    db_obj = crud.vehicle_details_crud_obj.get_by_id(db=db, _id=vehicle_details_id)
    if not db_obj:
        raise HTTPException(status_code=404, detail="Data Not Found")
    return crud.location_crud_obj.update(
        db=db,
        db_obj=db_obj,
        obj_in={
            "status": vehicle_details_status,
            "updated_date": datetime.utcnow().replace(microsecond=0),
        },
    )
