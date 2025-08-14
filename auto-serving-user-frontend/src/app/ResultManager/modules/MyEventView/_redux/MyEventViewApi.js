import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_EVENT_METADATA_EVENT_MANAGER = "/get_event_metadata_result_manager";
const GET_EVENT_RESULT_MANAGER = "/get_event_result_manager";
const UPDATE_EVENT_STATUS_RESULT_MANAGER =
  "/update_event_status_result_manager";
const GET_ENABLED_LOCATIONS_EVENT_MANAGER =
  "/get_company_enabled_locations_result_manager";
const GET_EVENT_MANAGER_TOTAL_CAMERAS =
  "/get_result_manager_total_cameras_by_location_id";

export async function getEventMetadataForEventManager(
  userId,
  startDate,
  endDate,
  isHide,
  isViewAll,
  cameraId,
  selectedType,
  isLocationSelected
) {
  let URL = GET_EVENT_METADATA_EVENT_MANAGER + `?user_id=${userId}`;
  if (isHide === true || isHide === false) {
    URL = URL + `&isHide=${isHide}`;
  }
  if (isViewAll === true || isViewAll === false) {
    URL = URL + `&isViewAll=${isViewAll}`;
  }
  if (endDate && startDate) {
    URL = URL + `&from_datetime=${startDate}&to_datetime=${endDate}`;
  }
  if (isLocationSelected === true || isLocationSelected === false) {
    URL = URL + `&isLocationSelected=${isLocationSelected}`;
  }
  return await request({
    endpoint: URL,
    method: "POST",
    body: { camera_id_list: cameraId, event_type_list: selectedType }
  });
}

export async function getEventForstEventManager(
  userId,
  pageNo,
  cameraId,
  eventType,
  startDate,
  endDate,
  isViewAll,
  isHide,
  isLocationSelected
) {
  let URL =
    GET_EVENT_RESULT_MANAGER + `?user_id=${userId}&page_number=${pageNo}`;
  if (endDate && startDate) {
    URL = URL + `&start_date=${startDate}&end_date=${endDate}`;
  }
  if (isViewAll === true || isViewAll === false) {
    URL = URL + `&isViewAll=${isViewAll}`;
  }
  if (isHide === true || isHide === false) {
    URL = URL + `&isHide=${isHide}`;
  }
  if (isLocationSelected === true || isLocationSelected === false) {
    URL = URL + `&isLocationSelected=${isLocationSelected}`;
  }
  return await request({
    endpoint: URL,
    method: "POST",
    body: { camera_id_list: cameraId, event_type_list: eventType }
  });
}

export async function updateEventsStatusResultManager(id, status) {
  return await request({
    endpoint:
      UPDATE_EVENT_STATUS_RESULT_MANAGER + `?oid=${id}&status_val=${status}`,
    method: "POST"
  });
}
export async function getEnabledLocationListResultManager(company_id) {
  return await request({
    endpoint: GET_ENABLED_LOCATIONS_EVENT_MANAGER + `?company_id=${company_id}`,
    method: HttpRequest.GET
  });
}
export async function getResultManagerTotalCameras(user_id, data) {
  let URL = GET_EVENT_MANAGER_TOTAL_CAMERAS + `?user_id=${user_id}`;
  return await request({
    endpoint: URL,
    method: "POST",
    body: JSON.stringify(data)
  });
}
