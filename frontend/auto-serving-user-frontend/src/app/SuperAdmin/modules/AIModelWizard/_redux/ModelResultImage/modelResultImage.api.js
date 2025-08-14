import { request } from "../../../../../../utils/APIRequestService";
export const ADD_MODEL_RESULT_IMAGE = "/add_model_result_image";

export async function saveModelResultImage(data) {
  return await request({
    header: "multipart/form-data",
    endpoint: ADD_MODEL_RESULT_IMAGE,
    method: "POST",
    body: data,
  });
}
