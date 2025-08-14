import { request } from "../../../../../../utils/APIRequestService";

export const ADD_MODEL_BANNER_IMAGE = "/add_model_banner_image";

export async function saveModelBannerImage(data) {
  return await request({
    header: "multipart/form-data",
    endpoint: ADD_MODEL_BANNER_IMAGE,
    method: "POST",
    body: data,
  });
}
