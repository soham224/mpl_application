import { request } from "../../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../../enums/http.methods";

const GET_ONE_DEPLOYMENT_RTSP_JOB = "/get_deployment_rtsp_job_by_id";
const GET_ALL_DEPLOYMENT_RTSP_JOBS =
  "/get_rtsp_deployment_jobs_for_current_user";

export async function getAllDeploymentRTSPJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYMENT_RTSP_JOBS,
    method: HttpRequest.GET
  });
}

export async function getDeploymentRTSPJobDetailsById(id) {
  return await request({
    endpoint: GET_ONE_DEPLOYMENT_RTSP_JOB + "?deployment_job_id=" + id,
    method: HttpRequest.GET
  });
}
