import { request } from "../../../../../../utils/APIRequestService";
export const ADD_TRAINING_SETTING_DETAILS = "/add_training_setting_details";

export async function saveTrainingSettings(data) {
  return await request({
    endpoint: ADD_TRAINING_SETTING_DETAILS,
    method: "POST",
    body: JSON.stringify(data),
  });
}
