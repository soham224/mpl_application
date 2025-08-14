import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_RSTP_URL = "/get_latest_frame_by_rtsp";
const ADD_CAMERA_ROI = "/add_camera_roi";
const UPDATE_CAMERA_ROI = "/update_camera_roi";
const GET_CAMERA_ROI_BY_ID = "/get_camera_roi_by_camera_id";
const UPDATE_DEPLOYMENT_CAMERA = "/update_deployment_cameras";

export async function loadImageFromRtspURL(param) {
  return await request({
    endpoint:
      GET_RSTP_URL +
      "?rtsp_link=" +
      param.rtsp_url.replace(/&/g, "%26") +
      "&camera_id=" +
      param.id +
      "&camera_name=" +
      param.camera_name,
    method: HttpRequest.GET,
  });
}

export async function addCameraRoi(roiData) {
  return await request({
    endpoint: ADD_CAMERA_ROI,
    method: HttpRequest.POST,
    body: roiData,
  });
}

export async function updateCameraRoi(roiData) {
  return await request({
    endpoint: UPDATE_CAMERA_ROI,
    method: HttpRequest.POST,
    body: roiData,
  });
}

export async function getCameraRoiById(id) {
  return await request({
    endpoint: GET_CAMERA_ROI_BY_ID + "?camera_id=" + id,
    method: HttpRequest.GET,
  });
}

export function updateDeploymentCamera(cameraData) {
  return request({
    endpoint: UPDATE_DEPLOYMENT_CAMERA,
    method: HttpRequest.POST,
    body: cameraData,
  });
}
