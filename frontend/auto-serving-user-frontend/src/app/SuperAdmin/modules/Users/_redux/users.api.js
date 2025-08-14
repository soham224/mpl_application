import { request } from "../../../../../utils/APIRequestService";
export const ADD_USER = "/add_user";
export const GET_ALL_USERS = "/get_all_users";
export const GET_ALL_USERS_FOR_RESULT_MANAGER =
  "/get_all_users_for_result_manager";
export const UPDATE_USER_STATUS = "/update_user_status";

export const ADD_COMPANY = "/add_company";

export async function addCompany(data) {
  return await request({
    endpoint: ADD_COMPANY,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function saveUser(data) {
  return await request({
    endpoint: ADD_USER,
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAllUsersResultManager() {
  return await request({
    endpoint: GET_ALL_USERS_FOR_RESULT_MANAGER,
    method: "POST",
  });
}
export async function getAllUsers() {
  return await request({
    endpoint: GET_ALL_USERS,
    method: "POST",
  });
}

export async function updateUserStatus(userStatus, userId) {
  return await request({
    endpoint:
      UPDATE_USER_STATUS + "?user_status=" + userStatus + "&user_id=" + userId,
    method: "POST",
    body: JSON.stringify(userStatus, userId),
  });
}
