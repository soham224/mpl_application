import { request } from "../../../../../../utils/APIRequestService";

const GET_ALL_DEPLOYED_RTSP_JOBS = "/get_all_deployed_rtsp_jobs";
const TERMINATE_DEPLOYED_RTSP_JOB = "/terminate_running_rtsp_job";

export async function getAllDeployedRTSPJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_RTSP_JOBS,
    method: "GET",
  });
}

export async function terminateDeployedRTSPJob(id) {
  return await request({
    endpoint: TERMINATE_DEPLOYED_RTSP_JOB + "?deployed_rtsp_job_id=" + id,
    method: "POST",
  });
}

