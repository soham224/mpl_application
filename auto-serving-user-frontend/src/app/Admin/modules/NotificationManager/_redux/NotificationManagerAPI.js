import { request } from "../../../../../utils/APIRequestService";
import { HttpRequest } from "../../../../../enums/http.methods";

const GET_EMAIL = "/get_email";
const GET_EMAIL_BY_ID = "/get_email_by_id";
const ADD_EMAIL = "/add_email";
const UPDATE_EMAIL = "/update_email";
const UPDATE_EMAIL_STATUS="/update_email_status"
export async function getAllEmail() {
  return await request({
    endpoint: GET_EMAIL,
    method: HttpRequest.GET
  });
}

export async function getEmailById(emailId) {
  return await request({
    endpoint: GET_EMAIL_BY_ID + `?email_id=${emailId}`,
    method: HttpRequest.GET
  });
}


export async function addEmail(notificationData) {
  return await request({
    endpoint: ADD_EMAIL,
    method: HttpRequest.POST,
    body: notificationData
  });
}

export async function updateEmail(notificationData) {
  return await request({
    endpoint: UPDATE_EMAIL,
    method: HttpRequest.POST,
    body: notificationData
  });
}

export async function updateEmailStatus(notificationData) {
  return await request({
    endpoint: UPDATE_EMAIL_STATUS,
    method: HttpRequest.POST,
    body: notificationData
  });
}
