import { request } from "../../../../../utils/APIRequestService";

const ADD_NEW_INFER_JOB = "/add_infer_job";
const GET_ONE_INFER_JOB = "/get_infer_job_by_id";
const GET_ALL_INFER_JOBS = "/get_all_infer_jobs";

export async function getAllInferJobsDetails() {
  return await request({
    endpoint: GET_ALL_INFER_JOBS,
    method: "GET",
  });
}

export async function getInferJobDetailsById(id) {
  return await request({
    endpoint: GET_ONE_INFER_JOB + "?infer_job_id=" + id,
    method: "GET",
  });
}

export async function addNewInferJobsDetails(data) {
  return await request({
    endpoint: ADD_NEW_INFER_JOB,
    method: "POST",
    body: JSON.stringify(data),
  });
}
