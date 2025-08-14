import { request } from "../../../../../utils/APIRequestService";
import { downloadFile } from "../../../../../utils/FileDownloadService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_RESULT_METADATA_RESULT_MANAGER = "/get_result_metadata_resultmanager";
const GET_RESULTS_RESULT_MANAGER = "/get_result_resultmanager";
const UPDATE_RESULT_STATUS_RESULT_MANAGER =
  "/update_result_status_resultmanager";
const UPDATE_RESULT_RESULT_MANAGER = "/update_result_result_manager";
const GET_ENABLED_LOCATIONS_RESULT_MANAGER =
  "/get_company_enabled_locations_result_manager";
const GET_RESULT_MANAGER_TOTAL_CAMERAS =
  "/get_result_manager_total_cameras_by_location_id";
const GET_RESULT_FOR_RESULT_EXCEL = "/get_result_for_result_excel";

export async function getResultMetadataForResultManager(
  companyId,
  startDate,
  endDate,
  isHide,
  isDetection,
  isViewAll,
  cameraId,
  selectedLabel,
  isLocationSelected
) {
  let URL = GET_RESULT_METADATA_RESULT_MANAGER + `?company_id=${companyId}`;
  if (isHide === true || isHide === false) {
    URL = URL + `&isHide=${isHide}`;
  }
  if (isDetection === true || isDetection === false) {
    URL = URL + `&isDetection=${isDetection}`;
  }
  if (isViewAll === true || isViewAll === false) {
    URL = URL + `&isViewAll=${isViewAll}`;
  }
  if (isLocationSelected === true || isLocationSelected === false) {
    URL = URL + `&isLocationSelected=${isLocationSelected}`;
  }
  if (endDate && startDate) {
    URL = URL + `&from_datetime=${startDate}&to_datetime=${endDate}`;
  }
  return await request({
    endpoint: URL,
    method: "POST",
    body: { camera_id_list: cameraId, label_list: selectedLabel },
  });
}

export async function getResultsForResultManager(
  pageNo,
  companyId,
  startDate,
  endDate,
  isHide,
  isDetection,
  isViewAll,
  cameraId,
  selectedLabel,
  isLocationSelected
) {
  let URL =
    GET_RESULTS_RESULT_MANAGER +
    `?page_number=${pageNo}&company_id=${companyId}`;
  if (isHide === true || isHide === false) {
    URL = URL + `&isHide=${isHide}`;
  }
  if (isDetection === true || isDetection === false) {
    URL = URL + `&isDetection=${isDetection}`;
  }
  if (isViewAll === true || isViewAll === false) {
    URL = URL + `&isViewAll=${isViewAll}`;
  }
  if (isLocationSelected === true || isLocationSelected === false) {
    URL = URL + `&isLocationSelected=${isLocationSelected}`;
  }
  if (endDate && startDate) {
    URL = URL + `&from_datetime=${startDate}&to_datetime=${endDate}`;
  }
  return await request({
    endpoint: URL,
    method: "POST",
    body: { camera_id_list: cameraId, label_list: selectedLabel },
  });
}
export async function updateResultsStatusResultManager(id, status) {
  return await request({
    endpoint:
      UPDATE_RESULT_STATUS_RESULT_MANAGER + `?oid=${id}&status_val=${status}`,
    method: "POST",
  });
}
export async function saveResultManager(data, id) {
  return await request({
    endpoint: UPDATE_RESULT_RESULT_MANAGER + `?data_id=${id}`,
    method: "POST",
    body: data,
  });
}
export async function getEnabledLocationListResultManager(company_id) {
  return await request({
    endpoint:
      GET_ENABLED_LOCATIONS_RESULT_MANAGER + `?company_id=${company_id}`,
    method: HttpRequest.GET,
  });
}
export async function getResultManagerTotalCameras(user_id, data) {
  let URL = GET_RESULT_MANAGER_TOTAL_CAMERAS + `?user_id=${user_id}`;
  return await request({
    endpoint: URL,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function downloadResultExcel(idList) {
  return await downloadFile({
    endpoint: GET_RESULT_FOR_RESULT_EXCEL,
    method: "POST",
    body: { id_list: idList },
    filename: "job_results.xlsx",
  });
}
