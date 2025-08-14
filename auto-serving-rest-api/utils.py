from datetime import datetime, timedelta
from typing import Optional

import ffmpeg
from ffmpeg import probe
from jose import jwt
import time
from core.config import settings
import logging
import os
from starlette.responses import FileResponse
from starlette.responses import StreamingResponse
from io import BytesIO
from core.aws_utils import upload_image_to_s3


def generate_password_reset_token(email: str) -> str:
    delta = timedelta(hours=settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS)
    now = datetime.utcnow()
    expires = now + delta
    exp = expires.timestamp()
    encoded_jwt = jwt.encode(
        {"exp": exp, "nbf": now, "sub": email},
        settings.SECRET_KEY,
        algorithm="HS256",
    )
    return encoded_jwt


def verify_password_reset_token(token: str) -> Optional[str]:
    try:
        decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        logging.info("decoded_token :: {}".format(decoded_token))
        return decoded_token["sub"]
    except jwt.JWTError:
        return None


def check_rtsp(rtsp: str):
    try:
        logging.info("Checking status for : {} ".format(rtsp))
        if rtsp:
            metadata = probe(rtsp, rtsp_transport="tcp")["format"]["probe_score"]
            if metadata:
                return True
            else:
                return False
        else:
            return False
    except Exception as e:
        logging.error("Exception check_rtsp : {}".format(e))
        return False


def check_rtsp_new(rtsp: str):
    try:
        file_name = "{}.png".format(str(int(time.time())))
        logging.info("Checking status for : {} || {}".format(rtsp, file_name))

        if rtsp:
            # fetch and the first frame from rtsp
            out, _ = (
                ffmpeg.input(rtsp, rtsp_transport="tcp")
                .output(file_name, vframes=1)
                .run(quiet=True)
            )

            # check if frame is stored or not
            if os.path.isfile(file_name):
                os.remove(file_name)
                return True
            else:
                return False
        else:
            return False
    except Exception as e:
        logging.error("Exception check_rtsp : {}".format(e))
        return False


def check_rtsp_for_frame(rtsp: str, camera_id, camera_name, user_id):
    try:
        file_name = "{}.png".format(str(int(time.time())))
        logging.info("Checking status for : {} || {}".format(rtsp, file_name))

        if rtsp:
            # fetch and the first frame from rtsp
            out, _ = (
                ffmpeg.input(rtsp, rtsp_transport="tcp")
                .output(file_name, vframes=1)
                .run(quiet=True)
            )

            # check if frame is stored or not
            if os.path.isfile(file_name):
                s3_key = (
                    "as/"
                    + str(user_id)
                    + "/"
                    + "ROI"
                    + "/"
                    + str(camera_id)
                    + "/"
                    + camera_name
                    + ".png"
                )
                image_url = upload_image_to_s3(
                    file_name, s3_key, settings.TEST_IMG_STORAGE_BUCKET, True
                )
                return image_url
            else:
                return None
        else:
            return None
    except Exception as e:
        logging.error("Exception check_rtsp : {}".format(e))
        return None
