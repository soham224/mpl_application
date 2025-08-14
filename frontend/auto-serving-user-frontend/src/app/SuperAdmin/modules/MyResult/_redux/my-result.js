import { request } from "../../../../../utils/APIRequestService";

const GET_RESULT_METADATA_ADMIN = "/get_result_metadata_admin";
const GET_RESULTS = "/get_result_admin";
const UPDATE_RESULT_STATUS = "/update_status";

export async function getResultMetadataForAdmin(cameraId, companyId) {
  return await request({
    endpoint:
      GET_RESULT_METADATA_ADMIN +
      `?camera_id=${cameraId}&company_id=${companyId}`,
    method: "POST",
  });
}

export async function getResultsForAdmin(companyId, jobId, cameraId, pageNo) {
  return await request({
    endpoint:
      GET_RESULTS +
      `?camera_id=${cameraId}&company_id=${companyId}&job_id=${jobId}&page_number=${pageNo}`,
    method: "POST",
  });
}

export async function updateResultsStatus(id, status) {
  return await request({
    endpoint: UPDATE_RESULT_STATUS + `?oid=${id}&status_val=${status}`,
    method: "POST",
  });
}
