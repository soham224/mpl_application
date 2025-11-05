import { request } from "../../../../../utils/APIRequestService";

export const GET_ALL_DEVICE = "/get_all_devices";
export const ADD_DEVICE = "/add_device";
export const GET_DEVICE_BY_ID = "/get_device_by_id";
export const UPDATE_DEVICE = "/update_device";

export function saveDevice(data) {
  return request({
    endpoint: ADD_DEVICE,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getAllDevice() {
  return request({
    endpoint: GET_ALL_DEVICE,
    method: "GET",
  });
}
export function getDeviceById(id) {
  return request({
    endpoint: GET_DEVICE_BY_ID + "?device_id=" + id,
    method: "GET",
  });
}

export function updateDevice(data) {
  return request({
    endpoint: UPDATE_DEVICE,
    method: "POST",
    body: JSON.stringify(data),
  });
}
