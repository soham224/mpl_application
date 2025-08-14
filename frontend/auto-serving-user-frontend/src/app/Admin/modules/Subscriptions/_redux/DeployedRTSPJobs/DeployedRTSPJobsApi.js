import { request } from "../../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../../enums/http.methods";
import {ADMIN_ROLE, REPORTER_MANAGER_ROLE, SUPERVISOR_ROLE} from "../../../../../../enums/constant";

const GET_ALL_DEPLOYED_RTSP_JOBS = "/get_rtsp_deployed_jobs_for_current_user";
const GET_ALL_DEPLOYED_RTSP_JOBS_FOR_RESULT_MANAGER =
  "/get_all_deployed_rtsp_jobs_for_result_manager";
const GET_ALL_LABELS_FROM_CAMERA_ID = "/get_camera_label_mapping_by_camera_id";
const GET_ALL_CAMERA_LABELS_BY_USER_ID =
  "/get_all_camera_labels_by_user_id_result_manager";
const GET_ALL_LABELS_FROM_CAMERA_ID_RESULT_MANAGER =
  "/get_camera_label_mapping_by_camera_id_result_manager";
const GET_ALL_LABELS_FROM_CAMERA_ID_SUPERVISOR =
  "/get_camera_label_mapping_by_camera_id_supervisor";
const GET_ALL_LABELS_FROM_LIST_OF_CAMERA_ID =
  "/get_camera_label_mapping_by_list_of_camera_id";
const GET_ALL_LABELS_FROM_LIST_OF_CAMERA_ID_SUPERVISOR =
  "/get_camera_label_mapping_by_list_of_camera_id_supervisor";
const GET_ADMIN_TOTAL_CAMERAS = "/get_admin_total_cameras";
const GET_SUPERVISOR_TOTAL_CAMERAS = "/get_supervisor_total_cameras";
const GET_REPORTER_TOTAL_CAMERAS="/get_reporter_total_cameras"
const GET_ALL_CAMERA_LABELS_OF_CURRENT_USER =
  "/get_all_camera_labels_of_current_user";
const GET_SUPERVISOR_LABELS = "/get_supervisor_all_labels_from_cameras";

export async function getAllDeployedRTSPJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_RTSP_JOBS,
    method: HttpRequest.GET,
  });
}
export async function getAllLabelsFromListOfCameraId(body, userRole) {
  if (userRole === ADMIN_ROLE) {
    return await request({
      endpoint:
        GET_ALL_LABELS_FROM_LIST_OF_CAMERA_ID,
      method: HttpRequest.POST,
      body: JSON.stringify(body),
    });
  } else {
    return await request({
      endpoint:
        GET_ALL_LABELS_FROM_LIST_OF_CAMERA_ID_SUPERVISOR ,
      method: HttpRequest.POST,
      body: JSON.stringify(body),
    });
  }
}
export async function getAllLabelsFromCameraId(camera_id, userRole) {
  if (userRole === ADMIN_ROLE) {
    return await request({
      endpoint: GET_ALL_LABELS_FROM_CAMERA_ID + "?camera_id=" + camera_id,
      method: HttpRequest.GET,
    });
  } else if (userRole === SUPERVISOR_ROLE) {
    return await request({
      endpoint:
        GET_ALL_LABELS_FROM_CAMERA_ID_SUPERVISOR + "?camera_id=" + camera_id,
      method: HttpRequest.GET,
    });
  } else {
    return await request({
      endpoint:
        GET_ALL_LABELS_FROM_CAMERA_ID_RESULT_MANAGER +
        "?camera_id=" +
        camera_id,
      method: HttpRequest.GET,
    });
  }
}
export async function getAllLabelsFromUserId(user_id, userRole) {
  if (userRole === ADMIN_ROLE) {
    return await request({
      endpoint: GET_ALL_CAMERA_LABELS_BY_USER_ID + "?user_id=" + user_id,
      method: HttpRequest.GET,
    });
  } else if (userRole === SUPERVISOR_ROLE) {
    return await request({
      endpoint: GET_ALL_CAMERA_LABELS_BY_USER_ID + "?user_id=" + user_id,
      method: HttpRequest.GET,
    });
  } else {
    return await request({
      endpoint: GET_ALL_CAMERA_LABELS_BY_USER_ID + "?user_id=" + user_id,
      method: HttpRequest.GET,
    });
  }
}
export async function getAllDeployedRTSPJobsDetailsForResultManager() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_RTSP_JOBS_FOR_RESULT_MANAGER,
    method: HttpRequest.GET,
  });
}
export async function getAdminTotalCameras(userRole) {
  if (userRole === ADMIN_ROLE) {
    return await request({
      endpoint: GET_ADMIN_TOTAL_CAMERAS,
      method: HttpRequest.GET,
    });
  } else if (userRole === SUPERVISOR_ROLE) {
    return await request({
      endpoint: GET_SUPERVISOR_TOTAL_CAMERAS,
      method: HttpRequest.GET,
    });
  }
  else if (userRole === REPORTER_MANAGER_ROLE){
    return await request({
      endpoint: GET_REPORTER_TOTAL_CAMERAS,
      method: HttpRequest.GET,
    });
  }
}

export async function getLabels(userRole) {
  let DATA_URL = "";
  DATA_URL = GET_ALL_CAMERA_LABELS_OF_CURRENT_USER;
  if (userRole === ADMIN_ROLE) {
    return await request({
      endpoint: DATA_URL,
      method: HttpRequest.GET,
    });
  } else if (userRole === SUPERVISOR_ROLE) {
    return await request({
      endpoint: GET_SUPERVISOR_LABELS,
      method: HttpRequest.GET,
    });
  }
}
