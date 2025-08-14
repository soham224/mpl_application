import { request } from "../../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../../enums/http.methods";

const GET_LABEL_SETTING_BY_JOB_ID = "/get_label_setting_by_job_id";
const UPDATE_LABEL_SETTING = "/update_label_setting";
const UPDATE_RTSP_STATUS = "/update_rtsp_status";

export async function getLabelSettingByJobId(id) {
  return await request({
    endpoint: GET_LABEL_SETTING_BY_JOB_ID + "?job_id=" + id,
    method: HttpRequest.GET
  });
}

export async function updateLabelSetting(data) {
  return await request({
    endpoint: UPDATE_LABEL_SETTING,
    method: HttpRequest.POST,
    body: JSON.stringify(data)
  });
}

export async function updateCameraSettingRTSPStatus(id, status) {
  return await request({
    endpoint:
      UPDATE_RTSP_STATUS +
      "?rtsp_manger_id=" +
      id +
      "&status_type=status&status_value=" +
      status,
    method: HttpRequest.POST
  });
}
