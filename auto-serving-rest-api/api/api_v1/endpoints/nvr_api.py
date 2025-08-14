import math
import requests
from sqlalchemy.orm import Session

import schemas
import xmltodict
import models
import pandas as pd
from io import BytesIO
from typing import Union, List
from fastapi import APIRouter, Depends, HTTPException
from applogging.applogger import MyLogger
from core.config import settings
from requests.auth import HTTPDigestAuth
from api import deps
from datetime import datetime, timedelta
from starlette.responses import StreamingResponse
import crud

router = APIRouter()
logging = MyLogger().get_logger("location_api")
headers = {"Content-Type": "application/xml"}


def call_api(
    api_url=None,
    api_data=None,
    api_headers=None,
    api_type=None,
    nvr_id=None,
) -> dict:
    url = f"http://{settings.NVR_DETAILS[nvr_id]['ip_address']}/{api_url}"
    api_auth = HTTPDigestAuth(
        settings.NVR_DETAILS[nvr_id]["user_name"],
        settings.NVR_DETAILS[nvr_id]["password"],
    )
    if api_type == "post":
        api_response = requests.post(
            url=url,
            data=api_data,
            headers=api_headers,
            auth=api_auth,
        )
    else:
        api_response = requests.get(
            url=url,
            headers=api_headers,
            auth=api_auth,
        )
    if api_response.status_code != 200:
        return {}
    return xmltodict.parse(api_response.text)


def get_combine_data(api_response_1=None, api_response_2=None) -> dict:
    if api_response_1 and api_response_2:
        combined_dict = {}
        for key in set(api_response_1.keys()) | set(api_response_2.keys()):
            value1 = api_response_1.get(key, {}).get("InputProxyChnBasicStatus", [])
            value2 = api_response_2.get(key, {}).get("InputProxyChnBasicStatus", [])
            combined_list = value1 + value2
            combined_dict[key] = {"InputProxyChnBasicStatus": combined_list}
        return combined_dict
    elif api_response_1:
        return api_response_1
    elif api_response_2:
        return api_response_2


def get_xml_data(
    search_id,
    language_id,
    channel_id,
    log_type,
    start_time,
    end_time,
    search_result_postion,
    max_results,
    nvr_id,
) -> dict:
    start_time += timedelta(hours=5, minutes=30)
    end_time += timedelta(hours=5, minutes=30)
    xml_filter_data = f"""
        <CMSearchDescription>
            <searchID>{search_id}</searchID>
            <languageID>{language_id}</languageID>
            <channelID>{channel_id}</channelID>
            <LogTypeList>
                <logType>{log_type}</logType>
            </LogTypeList>
            <timeSpan>
                <startTime>{start_time}</startTime>
                <endTime>{end_time}</endTime>
            </timeSpan>
            <searchResultPostion>{search_result_postion}</searchResultPostion>
            <maxResults>{max_results}</maxResults>
        </CMSearchDescription>
        """
    return call_api(
        api_url="ISAPI/ContentMgmt/logSearch",
        api_data=xml_filter_data,
        api_type="post",
        api_headers=headers,
        nvr_id=nvr_id,
    )


@router.post("/nvr_camera_log_details")
def nvr_camera_log_details(
    nvr_details: schemas.NvrBase,
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> dict:
    try:
        final_logs_dict = {}
        logs_count_dict = get_xml_data(
            search_id=nvr_details.search_id,
            language_id=nvr_details.language_id,
            channel_id=nvr_details.channel_id,
            log_type=nvr_details.log_type,
            start_time=nvr_details.start_time,
            end_time=nvr_details.end_time,
            search_result_postion=0,
            max_results=0,
            nvr_id=nvr_details.nvr_id,
        )
        if logs_count_dict:
            final_logs_dict["total_data"] = int(
                logs_count_dict["CMSearchResult"]["numOfMatches"]
            )
            final_logs_dict["data"] = {}
            if int(logs_count_dict["CMSearchResult"]["numOfMatches"]):
                logs_dict_details = get_xml_data(
                    search_id=nvr_details.search_id,
                    language_id=nvr_details.language_id,
                    channel_id=nvr_details.channel_id,
                    log_type=nvr_details.log_type,
                    start_time=nvr_details.start_time,
                    end_time=nvr_details.end_time,
                    search_result_postion=(
                        (nvr_details.page_no - 1) * nvr_details.max_results
                    )
                    + 1,
                    max_results=nvr_details.max_results,
                    nvr_id=nvr_details.nvr_id,
                )
                if logs_dict_details:
                    if logs_dict_details["CMSearchResult"]["numOfMatches"] == "1":
                        logs_dict_details["CMSearchResult"]["matchList"][
                            "matchElement"
                        ] = [
                            logs_dict_details["CMSearchResult"]["matchList"][
                                "matchElement"
                            ]
                        ]

                    final_logs_dict["data"] = logs_dict_details["CMSearchResult"]
                    final_logs_dict["page_no"] = nvr_details.page_no
                    final_logs_dict["page_size"] = nvr_details.max_results
        return final_logs_dict
    except Exception as e:
        return {"total_data": 0, "data": {}}


@router.get("/get_all_camera_details")
def get_all_camera_details(
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> dict:
    api_response_1 = call_api(
        api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
        api_type="get",
        api_headers=headers,
        nvr_id=list(settings.NVR_DETAILS.keys())[0],
    )
    api_response_2 = call_api(
        api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
        api_type="get",
        api_headers=headers,
        nvr_id=list(settings.NVR_DETAILS.keys())[1],
    )
    return get_combine_data(api_response_1, api_response_2)


@router.get("/camera_details")
def camera_details(
    nvr_id: str,
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> Union[dict, str]:
    try:
        return call_api(
            api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
            api_type="get",
            api_headers=headers,
            nvr_id=nvr_id,
        )
    except Exception as e:
        return "Give correct NVR Details"


@router.get("/widgets_camera_details")
def widgets_camera_details(
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> dict:
    api_response_1 = call_api(
        api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
        api_type="get",
        api_headers=headers,
        nvr_id=list(settings.NVR_DETAILS.keys())[0],
    )
    api_response_2 = call_api(
        api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
        api_type="get",
        api_headers=headers,
        nvr_id=list(settings.NVR_DETAILS.keys())[1],
    )
    camera_data = get_combine_data(api_response_1, api_response_2)
    on_count = 0
    off_count = 0
    for camera_detail in camera_data["InputProxyChnBasicStatusList"][
        "InputProxyChnBasicStatus"
    ]:
        if camera_detail["online"] == "true":
            on_count += 1
        else:
            off_count += 1
    return {
        "active_camera": on_count,
        "deactive_camera": off_count,
        "total_camera": on_count + off_count,
    }


@router.get("/log_details")
def log_details(
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> list:
    return [
        {"labels": "All Type", "id": "ALL"},
        {"labels": "System", "id": "System"},
        {"labels": "Warning", "id": "Warning"},
        {"labels": "Event", "id": "Alarm"},
        {"labels": "Operation", "id": "Operation"},
        {"labels": "User", "id": "User"},
        {"labels": "Other", "id": "Other"},
    ]


@router.get("/get_nvr_details", response_model=List[schemas.NvrDetails])
def get_nvr_details(
    current_user: models.User = Depends(deps.get_current_active_reporter),
) -> list:
    return list(settings.NVR_DETAILS.values())


@router.post("/download_all_log_data")
def download_all_log_data(
    nvr_details: schemas.NvrBase,
    current_user: models.User = Depends(deps.get_current_active_reporter),
):
    try:
        logs_count_dict = get_xml_data(
            search_id=nvr_details.search_id,
            language_id=nvr_details.language_id,
            channel_id=nvr_details.channel_id,
            log_type=nvr_details.log_type,
            start_time=nvr_details.start_time,
            end_time=nvr_details.end_time,
            search_result_postion=0,
            max_results=0,
            nvr_id=nvr_details.nvr_id,
        )
        if logs_count_dict:
            final_logs_list = []
            if int(logs_count_dict["CMSearchResult"]["numOfMatches"]):
                for data_range in range(
                    math.ceil(
                        int(logs_count_dict["CMSearchResult"]["numOfMatches"])
                        / settings.API_MAX_RESULT_COUNT
                    )
                ):
                    logs_dict_details = get_xml_data(
                        search_id=nvr_details.search_id,
                        language_id=nvr_details.language_id,
                        channel_id=nvr_details.channel_id,
                        log_type=nvr_details.log_type,
                        start_time=nvr_details.start_time,
                        end_time=nvr_details.end_time,
                        search_result_postion=(
                            data_range * settings.API_MAX_RESULT_COUNT
                        )
                        + 1,
                        max_results=settings.API_MAX_RESULT_COUNT,
                        nvr_id=nvr_details.nvr_id,
                    )
                    if logs_dict_details["CMSearchResult"]["numOfMatches"] == "1":
                        final_logs_list.extend(
                            [
                                logs_dict_details["CMSearchResult"]["matchList"][
                                    "matchElement"
                                ]
                            ]
                        )
                    else:
                        final_logs_list.extend(
                            logs_dict_details["CMSearchResult"]["matchList"][
                                "matchElement"
                            ]
                        )
                if final_logs_list:
                    all_camera_details = call_api(
                        api_url="ISAPI/ContentMgmt/InputProxy/channels/basic/status",
                        api_type="get",
                        api_headers=headers,
                        nvr_id=nvr_details.nvr_id,
                    )
                    camera_dict = {
                        data["sourceInputBasicDescriptor"]["channel"]: data[
                            "sourceInputBasicDescriptor"
                        ]["channelName"]
                        for data in all_camera_details["InputProxyChnBasicStatusList"][
                            "InputProxyChnBasicStatus"
                        ]
                    }
                    for camera_detail in final_logs_list:
                        camera_detail["camera name"] = (
                            camera_dict[camera_detail["chanNo"]]
                            if camera_dict.get(camera_detail["chanNo"])
                            else camera_detail["chanNo"]
                        )
                        camera_detail["Time"] = datetime.strptime(
                            camera_detail["Time"], "%Y-%m-%dT%H:%M:%SZ"
                        )
                        del camera_detail["chanNo"]
                        del camera_detail["user"]
                    df = pd.DataFrame(final_logs_list)
                    camera_name_column = df.pop("camera name")
                    df.insert(0, "camera name", camera_name_column)
                    buffer = BytesIO()
                    with pd.ExcelWriter(buffer) as writer:
                        df.to_excel(writer, index=False)
                    return StreamingResponse(
                        BytesIO(buffer.getvalue()),
                        headers={
                            "Content-Disposition": f"attachment; filename=tusker.xlsx"
                        },
                    )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Data Not Found!")


@router.post("/get_speed_details")
def get_speed_details(
    nvr_details: schemas.NvrBase,
    current_user: models.User = Depends(deps.get_current_active_user),
):
    try:
        return [
            {
                "id": index + 1,
                "speed": data[0],
                "number_plate": data[1],
                "vehicle_type": data[2],
                "created_date": datetime.utcnow().replace(microsecond=0),
                "image": "",
            }
            for index, data in enumerate(
                [
                    [65, "GJ27BG0960", "Two-wheelers"],
                    [100, "GJ01LN1960", "Three-wheelers"],
                    [33, "GJ23BG1234", "Four-wheelers"],
                    [45, "GJ27AA0087", "Six-wheelers"],
                    [25.2, "GJ27BG0960", "Eight-wheelers"],
                ]
            )
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail="Data Not Found!")


@router.post(
    "/get_number_plate_details", response_model=schemas.AnprVmsDetailsPaginateResponse
)
def get_number_plate_details(
    nvr_details: schemas.AnprVmsDetailsRequest,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
):
    try:
        return crud.anpr_vms_details_crud_obj.get_anpr_details(
            db=db, nvr_details=nvr_details
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail="Data Not Found!")
