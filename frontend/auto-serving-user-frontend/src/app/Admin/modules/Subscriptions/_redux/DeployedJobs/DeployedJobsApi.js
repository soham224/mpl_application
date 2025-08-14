import { request } from "../../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../../enums/http.methods";

const GET_ALL_DEPLOYED_JOBS = "/get_deployed_jobs_for_current_user";

export async function getAllDeployedJobsDetails() {
  return await request({
    endpoint: GET_ALL_DEPLOYED_JOBS,
    method: HttpRequest.GET
  });
}
