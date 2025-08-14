import datetime
import shutil
from typing import Any, List
import time
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from sqlalchemy.orm import Session

import crud
import models
import schemas
from api import deps
from core.aws_utils import upload_image_to_s3
from core.config import settings
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("result_feedback_image")


@router.post("/add_result_feedback_image")
def add_result_feedback_image(
    feedback_id: int = Form(...),
    image_list: List[UploadFile] = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    if len(image_list) > settings.FEEDBACK_FILE_LIMIT:
        logging.error(
            "Maximum File Uploaded Limit is {}".format(settings.FEEDBACK_FILE_LIMIT)
        )
        raise HTTPException(
            status_code=500,
            detail="Maximum File Uploaded Limit is {}".format(
                settings.FEEDBACK_FILE_LIMIT
            ),
        )
    # save file
    try:
        for image in image_list:
            with open(image.filename, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

            # upload image

            s3_key = (
                "testing_images/"
                + str(current_user.id)
                + "/{}_".format(str(int(time.time())))
                + image.filename
            )
            image_url = upload_image_to_s3(
                image.filename, s3_key, settings.INTERNAL_BUCKET, True
            )

            if image_url:
                created_date = datetime.datetime.utcnow().replace(microsecond=0)
                updated_date = datetime.datetime.utcnow().replace(microsecond=0)
                user_id = current_user.id

                result_feedback_image_details = schemas.ResultFeedbackImageCreate(
                    feedback_id=feedback_id,
                    user_id=user_id,
                    image_url=image_url,
                    status=True,
                    created_date=created_date,
                    updated_date=updated_date,
                )

                if isinstance(result_feedback_image_details, dict):
                    in_obj = result_feedback_image_details
                else:
                    in_obj = result_feedback_image_details.dict(exclude_unset=True)

                result_feedback_image = crud.result_feedback_image.create(
                    db=db, obj_in=in_obj
                )
                if not result_feedback_image:
                    logging.error("Data Not Recorded")
                    raise HTTPException(status_code=500, detail="Data Not Recorded")

        return "Data Recorded Successfully"
    except Exception as e:
        logging.error("Issue in writing image : {}".format(e))
        raise HTTPException(
            status_code=404, detail="Issue in writing image : {}".format(e)
        )
    finally:
        image.file.close()


@router.get(
    "/get_all_result_feedback_image",
    response_model=List[schemas.ResultFeedbackImageRead],
)
def get_all_result_feedback_image(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    result_feedback__image_list = crud.result_feedback_image.get_all(db)
    if not result_feedback__image_list:
        logging.info("No Result Feedback Image Data Found")
        raise HTTPException(
            status_code=404, detail="No Result Feedback Image Data Found"
        )
    return result_feedback__image_list
