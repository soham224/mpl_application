import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_RESULT_METADATA = "/get_result_metadata";
const GET_RESULTS = "/get_result";

export async function getResultMetadata(
    startDate,
    endDate,
    selectedLabel,
    selctedcameraid,
    locationIdList,
    pageSize
) {
  if (startDate && endDate) {
    return await request({
      endpoint:
          GET_RESULT_METADATA +
          `?start_date=${startDate}&end_date=${endDate}&page_size=${pageSize}`,
      method: HttpRequest.POST,
      body: {
        camera_id_list: selctedcameraid,
        label_list: selectedLabel,
        location_id_list: locationIdList
      }
    });
  } else {
    return await request({
      endpoint: GET_RESULT_METADATA,
      method: HttpRequest.POST,
      body: {
        camera_id_list: selctedcameraid,
        label_list: selectedLabel,
        location_id_list: locationIdList
      }
    });
  }
}
export async function getResults(
    pageSize,
    pageNo,
    jobId,
    startDate,
    endDate,
    selctedcameraid,
    selectedLabel,
    locationIdList
) {
  if (startDate && endDate) {
    return await request({
      endpoint:
          GET_RESULTS +
          `?page_number=${pageNo}&job_id=${jobId}&start_date=${startDate}&end_date=${endDate}&page_size=${pageSize}`,
      method: HttpRequest.POST,
      body: {
        camera_id_list: selctedcameraid,
        label_list: selectedLabel,
        location_id_list: locationIdList
      }
    });
  } else {
    return await request({
      endpoint:
          GET_RESULTS +
          `?page_number=${pageNo}&job_id=${jobId}&page_size=${pageSize}`,
      method: HttpRequest.POST,
      body: {
        camera_id_list: selctedcameraid,
        label_list: selectedLabel,
        location_id_list: locationIdList
      }
    });
  }
}
