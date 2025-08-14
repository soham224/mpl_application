import { request } from "../../../../../utils/APIRequestService";

export const GET_ALL_LOGO_MODEL_URL = "/get_all_logo_models";
export const GET_FILTER_VIDEO_RESULT = "/get_filter_video_result";
export const GET_VIDEO_RESULT_BY_VIDEO_ID = "/get_video_result_by_video_id";
export const  UPDATE_VIDEO_STATUS="/update_video_status"
export const  UPDATE_VIDEO_DETECTION_DETAILS="/update_video_detection_details"


export function getAllLogoModel() {
  return request({
    endpoint: GET_ALL_LOGO_MODEL_URL,
    method: "GET"
  });
}


export function getFilterVideoResult(data) {
  return request({
    endpoint: GET_FILTER_VIDEO_RESULT ,
    method: "Post",
    body: data,
  });
}

export function getVideoResultByVideoId(data) {
  return request({
    endpoint: GET_VIDEO_RESULT_BY_VIDEO_ID +"?video_id=" + data,
    method: "Get",
  });
}

export function updateVideoStatus(data) {
  return request({
    endpoint: UPDATE_VIDEO_STATUS,
    method: "Post",
    body: data,
    });
}


export function updateVideoDetectionDetail(data) {
  return request({
    endpoint: UPDATE_VIDEO_DETECTION_DETAILS,
    method: "Post",
    body: data,
  });
}

