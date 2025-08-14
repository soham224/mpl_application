import { request } from "../../../../../utils/APIRequestService";

const GET_ALL_FRAMEWORK = "/get_all_framework_details";
const GET_FRAMEWORK_DETAILS_BY_ID = "/get_framework_details_by_id";
const ADD_FRAMEWORK_DETAILS = "/add_framework_details";
const UPDATE_FRAMEWORK_DETAILS = "/update_framework_details";

export async function getAllFrameworkDetails() {
  return await request({
    endpoint: GET_ALL_FRAMEWORK,
    method: "GET",
  });
}

export async function getFrameworkDetailsById(id) {
  return await request({
    endpoint: GET_FRAMEWORK_DETAILS_BY_ID + "?framework_id=" + id,
    method: "GET",
  });
}

export async function addNewFrameworkDetails(data) {
  return await request({
    endpoint: ADD_FRAMEWORK_DETAILS,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFrameworkDetails(data) {
  return await request({
    endpoint: UPDATE_FRAMEWORK_DETAILS,
    method: "POST",
    body: JSON.stringify(data),
  });
}
