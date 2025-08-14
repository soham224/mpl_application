import { request } from "../../../../../utils/APIRequestService";

const GET_ALL_MODEL_TYPE = "/get_all_model_types";
const GET_MODEL_TYPE_BY_ID = "/get_model_type_by_id";
const ADD_MODEL_TYPE = "/add_model_type";
const UPDATE_MODEL_TYPE = "/update_model_type";

export async function getModelTypeById(id) {
  return await request({
    endpoint: GET_MODEL_TYPE_BY_ID + "?model_type_id=" + id,
    method: "GET",
  });
}

export async function addNewModelType(data) {
  return await request({
    endpoint: ADD_MODEL_TYPE,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateModelType(data) {
  return await request({
    endpoint: UPDATE_MODEL_TYPE,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllModelType() {
  return await request({
    endpoint: GET_ALL_MODEL_TYPE,
    method: "GET",
  });
}
