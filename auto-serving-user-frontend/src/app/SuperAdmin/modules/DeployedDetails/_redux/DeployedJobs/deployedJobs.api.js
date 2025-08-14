import { request } from "../../../../../../utils/APIRequestService";

const GET_ALL_DEPLOYED_JOBS = "/get_all_deployed_jobs";
const TERMINATE_DEPLOYED_JOB = "/terminate_running_job";

export async function getAllDeployedJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_JOBS,
    method: "GET",
  });
}

export async function terminateDeployedJob(id) {
  return await request({
    endpoint: TERMINATE_DEPLOYED_JOB + "?deployed_job_id=" + id,
    method: "POST",
  });
}
