import { request } from "../../../../../utils/APIRequestService";

export const GET_ALL_AI_MODEL_URL = "/get_all_models";
export const GET_MODEL_BY_ID = "/get_model_by_id";
export const GET_DEVICE_BY_ID = "/get_device_by_id";
export const GET_ALL_DEVICE = "/get_all_devices";
export const ADD_AI_MODEL = "/add_ai_model";
export const UPDATE_AI_MODEL = "/update_ai_model";

export function getAllAIModel() {
  return request({
    endpoint: GET_ALL_AI_MODEL_URL,
    method: "GET"
  });
}

export function getAIModelById(id) {
  return request({
    endpoint: GET_MODEL_BY_ID + "?model_id=" + id,
    method: "GET"
  });
}

export async function getDeviceById(id) {
  return await request({
    endpoint: GET_DEVICE_BY_ID + "?device_id=" + id,
    method: "GET"
  });
}

export async function getAllDevice() {
  return await request({
    endpoint: GET_ALL_DEVICE,
    method: "GET"
  });
}

export async function saveAIModel(data) {
  return await request({
    endpoint: ADD_AI_MODEL,
    method: "POST",
    body: JSON.stringify(data)
  });
}

export async function updateAIModel(data) {
  return await request({
    endpoint: UPDATE_AI_MODEL,
    method: "POST",
    body: JSON.stringify(data)
  });
}
