import datetime
import shutil
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.aws_utils import upload_image_to_s3
from core.config import settings

router = APIRouter()


@router.post("/add_model_result_image")
def add_model_banner_image(
    image: UploadFile = File(...),
    model_id: int = Form(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    # save file
    try:
        with open(image.filename, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=404, detail="Issue in writing image : {}".format(e)
        )
    finally:
        image.file.close()

    # upload image
    s3_key = (
        "as/model-result-img/" + str(model_id) + "/" + "results" + "/" + image.filename
    )
    image_url = upload_image_to_s3(
        image.filename, s3_key, settings.TEST_IMG_STORAGE_BUCKET, True
    )
    if image_url:
        created_date = datetime.datetime.utcnow().replace(microsecond=0)
        updated_date = datetime.datetime.utcnow().replace(microsecond=0)

        img_details = schemas.AIModelResultImagesCreate(
            model_id=model_id,
            image_name=image.filename,
            image_url=image_url,
            status=True,
            created_date=created_date,
            updated_date=updated_date,
        )

        if isinstance(img_details, dict):
            in_obj = img_details
        else:
            in_obj = img_details.dict(exclude_unset=True)

        banner_img = crud.ai_model_result_images.create(db=db, obj_in=in_obj)
        if not banner_img:
            raise HTTPException(status_code=500, detail="Banner Image Not Added")
        return "Result Image Added Successfully"
