import { request } from "../../../../../utils/APIRequestService";

const GET_ALL_DEPLOYMENT_TYPE = "/get_all_deployment_type";
const GET_DEPLOYMENT_TYPE_BY_ID = "/get_deployment_type_by_id";
const ADD_DEPLOYMENT_TYPE = "/add_deployment_type";
const UPDATE_DEPLOYMENT_TYPE = "/update_deployment_type_details";

export async function getAllDeploymentType() {
  return await request({
    endpoint: GET_ALL_DEPLOYMENT_TYPE,
    method: "GET",
  });
}

export async function getDeploymentTypeById(id) {
  return await request({
    endpoint: GET_DEPLOYMENT_TYPE_BY_ID + "?deployment_type_id=" + id,
    method: "GET",
  });
}

export async function addNewDeploymentType(data) {
  return await request({
    endpoint: ADD_DEPLOYMENT_TYPE,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateDeploymentType(data) {
  return await request({
    endpoint: UPDATE_DEPLOYMENT_TYPE,
    method: "POST",
    body: JSON.stringify(data),
  });
}
