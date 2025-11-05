import { request } from "../../../../../../utils/APIRequestService";
export const ADD_MODEL_S3_URL = "/add_model_s3_data";

export async function saveS3DataHandler(data) {
  return await request({
    endpoint: ADD_MODEL_S3_URL,
    method: "POST",
    body: JSON.stringify(data),
  });
}
