import { request } from "../../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../../enums/http.methods";

const GET_ONE_DEPLOYMENT_JOB = "/get_deployment_job_by_id";
const GET_ALL_DEPLOYMENT_JOBS = "/get_deployment_jobs_for_current_user";

export async function getAllDeploymentJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYMENT_JOBS,
    method: HttpRequest.GET
  });
}

export async function getDeploymentJobDetailsById(id) {
  return await request({
    endpoint: GET_ONE_DEPLOYMENT_JOB + "?deployment_job_id=" + id,
    method: HttpRequest.GET
  });
}
