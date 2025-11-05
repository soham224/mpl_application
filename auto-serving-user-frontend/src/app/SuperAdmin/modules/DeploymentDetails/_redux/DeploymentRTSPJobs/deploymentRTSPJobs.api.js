import { request } from "../../../../../../utils/APIRequestService";

const ADD_NEW_DEPLOYMENT_JOB = "/add_deployment_rtsp_job";
const GET_ONE_DEPLOYMENT_JOB = "/get_deployment_rtsp_job_by_id";
const GET_ALL_DEPLOYMENT_JOBS = "/get_all_rtsp_deployment_jobs";
const START_DEPLOYMENT_RTPS_JOB = "/start_rtsp_deployment";

export async function getAllDeploymentRTSPJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYMENT_JOBS,
    method: "GET",
  });
}

export async function getDeploymentRTSPJobDetailsById(id) {
  return await request({
    endpoint: GET_ONE_DEPLOYMENT_JOB + "?deployment_job_id=" + id,
    method: "GET",
  });
}

export async function addNewDeploymentRTSPJobsDetails(data) {
  return await request({
    endpoint: ADD_NEW_DEPLOYMENT_JOB,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function startDeploymentRTSPJob(id) {
  return await request({
    endpoint: START_DEPLOYMENT_RTPS_JOB + "?deployment_job_rtsp_id=" + id,
    method: "POST",
  });
}
