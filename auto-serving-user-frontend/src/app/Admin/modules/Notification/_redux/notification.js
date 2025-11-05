import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";
const ADD_NOTIFICATION = "/add_notification";
const GET_ALL_NOTIFICATION = "/get_all_notification_of_current_user";
const GET_ALL_NOTIFICATION_BY_TYPE =
  "/get_all_notification_of_current_user_by_type";
const UPDATE_NOTIFICATION = "/update_is_unread_by_id";
const GET_NOTIFICATION_TYPE_OF_CURRENT_USER_BY_DATE =
  "/get_notification_type_of_current_user_by_date";
const GET_NOTIFICATION_DATA_OF_CURRENT_USER_BY_DATE_TYPE =
  "/get_notification_data_of_current_user_by_date_type";

export async function getCameraNotification(notiData) {
  return await request({
    endpoint: GET_ALL_NOTIFICATION,
    method: HttpRequest.GET,
    body: notiData,
  });
}

export async function getAllNotificationByType(notiData) {
  return await request({
    endpoint: GET_ALL_NOTIFICATION_BY_TYPE,
    method: HttpRequest.GET,
    body: notiData,
  });
}

export async function updateCameraNotification(notiData) {
  return await request({
    endpoint: UPDATE_NOTIFICATION,
    method: HttpRequest.POST,
    body: notiData,
  });
}

export async function addNotification(notiData) {
  return await request({
    endpoint: ADD_NOTIFICATION,
    method: HttpRequest.POST,
    body: notiData,
  });
}
export async function getAllNotificationOfDate(date) {
  return await request({
    endpoint:
      GET_NOTIFICATION_TYPE_OF_CURRENT_USER_BY_DATE + "?user_date=" + date,
    method: HttpRequest.GET,
  });
}
export async function getAllNotificationOfDateAndType(date, type) {
  return await request({
    endpoint:
      GET_NOTIFICATION_DATA_OF_CURRENT_USER_BY_DATE_TYPE +
      "?user_date=" +
      date +
      "&user_notification_type=" +
      type,
    method: HttpRequest.GET,
  });
}
