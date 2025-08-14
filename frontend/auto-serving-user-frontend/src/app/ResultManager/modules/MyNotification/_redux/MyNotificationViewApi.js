import { request } from "../../../../../utils/APIRequestService";

const GET_NOTIFICATION_FOR_RESULT_MANAGER = "/get_notification_for_resultmanager";

export async function getNotificationForResultManager(data) {
  return await request({
    endpoint: GET_NOTIFICATION_FOR_RESULT_MANAGER,
    method: "POST",
    body: data
  });
}

