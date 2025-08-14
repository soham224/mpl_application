import { request } from "../../../../../../utils/APIRequestService";

const ADD_NEW_DEPLOYMENT_JOB = "/add_deployment_job";
const GET_ONE_DEPLOYMENT_JOB = "/get_deployment_job_by_id";
const GET_ALL_DEPLOYMENT_JOBS = "/get_deployment_jobs";
const START_DEPLOYMENT_JOB = "/start_deployment";
export async function getAllDeploymentJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYMENT_JOBS,
    method: "GET",
  });
}

export async function getDeploymentJobDetailsById(id) {
  return await request({
    endpoint: GET_ONE_DEPLOYMENT_JOB + "?deployment_job_id=" + id,
    method: "GET",
  });
}

export async function addNewDeploymentJobsDetails(data) {
  return await request({
    endpoint: ADD_NEW_DEPLOYMENT_JOB,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function startDeploymentJob(id) {
  return await request({
    endpoint: START_DEPLOYMENT_JOB + "?deployment_job_id=" + id,
    method: "POST",
  });
}
