import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";
import * as moment from "moment";
import { getCurrentDateAndTimeInUtc } from "../../../../../utils/TimeZone";

const GET_EVENT_METADATA_RESULT_MANAGER = "/get_result_metadata_resultmanager";
const GET_EVENTS_RESULT_MANAGER = "/get_result_resultmanager";
const UPDATE_EVENT_STATUS_RESULT_MANAGER =
  "/update_result_status_resultmanager";
const UPDATE_EVENT_RESULT_MANAGER = "/update_result_result_manager";
const GET_ENABLED_LOCATIONS_RESULT_MANAGER =
  "/get_company_enabled_locations_result_manager";
const GET_EVENT_MANAGER_TOTAL_CAMERAS =
  "/get_result_manager_total_cameras_by_location_id";
const GET_EVENT_MODAL_TYPE = "/get_all_event_type_by_user_id";
const SAVE_ADD_EVENT_FROM_RESULT_MANAGER = "/add_event_from_result_manager";

export async function getEventMetadataForResultManager(
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
  let URL = GET_EVENT_METADATA_RESULT_MANAGER + `?company_id=${companyId}`;
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
    body: { camera_id_list: cameraId, label_list: selectedLabel }
  });
}

export async function getEventsForResultManager(
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
    GET_EVENTS_RESULT_MANAGER +
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
    body: { camera_id_list: cameraId, label_list: selectedLabel }
  });
}
export async function getEnabledLocationListEventManager(company_id) {
  return await request({
    endpoint:
      GET_ENABLED_LOCATIONS_RESULT_MANAGER + `?company_id=${company_id}`,
    method: HttpRequest.GET
  });
}
export async function getEventManagerTotalCameras(user_id, data) {
  let URL = GET_EVENT_MANAGER_TOTAL_CAMERAS + `?user_id=${user_id}`;
  return await request({
    endpoint: URL,
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function getEventModalType(user_id) {
  let URL = GET_EVENT_MODAL_TYPE + `?user_id=${user_id}`;
  return await request({
    endpoint: URL,
    method: "GET"
  });
}

export async function SaveCreatedEvent(data) {
  let URL = SAVE_ADD_EVENT_FROM_RESULT_MANAGER;
  return await request({
    endpoint: URL,
    method: "POST",
    body: JSON.stringify(data)
  });
}
