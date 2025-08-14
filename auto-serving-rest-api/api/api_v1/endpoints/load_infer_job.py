from typing import Any

import ffmpeg
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session

import models
from api import deps
from core.aws_utils import *
from core.config import Settings
from core.result_utils import *
from applogging.applogger import MyLogger

router = APIRouter()
logging = MyLogger().get_logger("load_infer_job")


@router.post("/load_infer_job")
async def load_infer_job(
    job_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    settings = Settings()
    infer_job = crud.ai_infer_job.get_by_id(db, job_id)
    if image:
        logging.info("before file :: ")
        image_key = upload_test_file_on_s3(current_user.id, image)
        logging.info("after file :: {} ".format(image_key))
    if not infer_job:
        raise HTTPException(status_code=404, detail="No Job Found For Requested ID")

    model_data = crud.ai_model.get_by_id(db, infer_job.model_id)

    if not model_data:
        raise HTTPException(status_code=404, detail="No Model Found for Inference")

    try:
        response = get_infer_response(model_data, image_key)
        if response.reason == "Service Unavailable":
            for iteration in range(4):
                response = get_infer_response(model_data, image_key)

        return response.json()

    except Exception as e:
        logging.error("Exception : load_infer_job {}".format(e))
        exception_msg = "Exception : {}".format(e)
        raise HTTPException(status_code=404, detail=exception_msg)


@router.post("/load_video_infer_job")
async def load_video_infer_job(
    job_id: int,
    video: UploadFile = File(...),
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    dirname = os.path.abspath(__file__)
    file_path = dirname.rsplit("/", 4)
    file_location = f"{file_path[0]}/files/{video.filename}"
    with open(file_location, "wb+") as file_object:
        file_object.write(video.file.read())
    file_size = check_file_size(file_location, 50.00)
    if not file_size:
        os.remove(file_location)
        raise HTTPException(status_code=400, detail="Video Limit Was 50 MB")
    video_duration = check_video_duration(file_location)
    if not video_duration:
        os.remove(file_location)
        raise HTTPException(status_code=400, detail="Video Limit Was 20 Second")
    in_file = ffmpeg.input(file_location)
    img_destination = file_path[0] + "/files/" + video.filename + "_%04d.png"
    subprocess.call(["ffmpeg", "-i", file_location, "-r", "1", img_destination])
    os.remove(file_location)
    settings = Settings()
    infer_job = crud.ai_infer_job.get_by_id(db, job_id)

    if not infer_job:
        raise HTTPException(status_code=404, detail="No Job Found For Requested ID")

    model_data = crud.ai_model.get_by_id(db, infer_job.model_id)

    if not model_data:
        raise HTTPException(status_code=404, detail="No Model Found for Inference")

    image_name_list = []
    try:
        image_name_list = get_image_name_list(
            video.filename + "_00", ".png", image_name_list, file_path[0] + "/files/"
        )
        image_coordinate_response = get_image_coordinate(
            current_user.id, file_path[0] + "/files/", image_name_list, model_data
        )
        if image_coordinate_response:
            return image_coordinate_response
        else:
            raise HTTPException(status_code=404, detail="No Detection Found")

    except Exception as e:
        logging.error("Exception : load_infer_job {}".format(e))
        exception_msg = "Exception : {}".format(e)
        raise HTTPException(status_code=404, detail=exception_msg)


#
# @router.post("/unload_infer_job")
# async def unload_infer_job(
#         db: Session = Depends(deps.get_db),
#         current_user: models.User = Depends(deps.get_current_active_user)
# ) -> Any:
#     settings = Settings()
#     cont_name = settings.CONTAINER_GENERIC_NAME + str(current_user.id)
#     try:
#         old_container = get_container(container_name=cont_name)
#
#         if not old_container:
#             logging.info("container is not running")
#         else:
#             old_container.stop()
#             logging.info("""container running already..
#                                 stopping now""")
#             logging.info("old_container : {}".format(old_container))
#             logging.info("container stopped")
#         return "Cleanup Successful"
#     except Exception as e:
#         logging.error("Exception unload_infer_job : {}".format(e))
#         exception_msg = "Exception : {}".format(e)
#         raise HTTPException(status_code=404, detail=exception_msg)
