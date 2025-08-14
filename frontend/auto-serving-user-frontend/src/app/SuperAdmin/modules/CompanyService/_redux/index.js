import { HttpRequest } from "../../../../../enums/http.methods";
import { request } from "../../../../../utils/APIRequestService";

const GET_ALL_COMPANY_LIST  = "/get_all_companies";
const GET_USER_BY_COMPANY_ID  = "/get_user_by_company_id";
const GET_ALL_USER  = "/get_all_users";
const GET_ALL_ROLES  = "/get_all_roles";
const GET_ALL_USER_BY_STATUS  = "/get_all_users_by_status";
const GET_ALL_USER_BY_ROLE  = "/get_all_users_by_role";
const GET_ALL_NOTIFICATION_SERVICE_BY_USER_ID  = "/get_all_notification_service_by_user_id";
const ADD_NOTIFICATION_SERVICE_USER_SUBSCRIBE  = "/add_notification_service_user_subscribe";
const UPDATE_NOTIFICATION_SERVICE_USER_SUBSCRIBE_STATUS  = "/update_notification_service_user_subscribe_status";
const GET_NOTIFICATION_SERVICE_SUBSCRIBE_BY_USER_ID  = "/get_notification_service_subscribe_by_user";
const ADD_NOTIFICATION_SERVICE_USER_CONFIG  = "/add_notification_service_user_config";
const UPDATE_NOTIFICATION_SERVICE_USER_CONFIG  = "/update_notification_service_user_config";
const UPDATE_NOTIFICATION_SERVICE_USER_CONFIG_STATUS  = "/update_notification_service_user_config_status";
const GET_ALL_NOTIFICATION_SERVICE_CONFIG_BY_USER_ID  = "/get_all_notification_service_config_by_user_vendor_id";


export async function getAllCompany() {
  return await request({
    endpoint: GET_ALL_COMPANY_LIST,
    method: HttpRequest.GET,
  });
}
export async function getUserByCompanyId(id,pageNo,pageSize) {
  return await request({
    endpoint: GET_USER_BY_COMPANY_ID + "?company_id=" + id + "&page=" + pageNo + "&size=" + pageSize,
    method: HttpRequest.POST,
  });
}

export async function getAllUser(pageNo ,pageSize) {
  return await request({
    endpoint: GET_ALL_USER  + `?page=${pageNo}&size=${pageSize}`,
    method: HttpRequest.POST,
  });
}

export async function getAllUserByStatus(status,pageNo, pageSize) {
  return await request({
    endpoint: GET_ALL_USER_BY_STATUS + "?user_status=" + status  + "&page=" + pageNo + "&size=" + pageSize  ,
    method: HttpRequest.GET,
  });
}

export async function getAllUserByRoldId(roleId,pageNo,pageSize) {
  return await request({
    endpoint: GET_ALL_USER_BY_ROLE + "?role_id=" + roleId + "&page=" + pageNo + "&size=" + pageSize ,
    method: HttpRequest.GET,
  });
}


export async function getAllRoles() {
  return await request({
    endpoint: GET_ALL_ROLES,
    method: HttpRequest.GET,
  });
}


export async function getAllServiceForNotificationByUserId(id) {
  return await request({
    endpoint: GET_ALL_NOTIFICATION_SERVICE_BY_USER_ID + "?user_id=" + id,
    method: HttpRequest.GET,
  });
}

export async function addNotificationServiceUserSubscribe(data,id) {
  return await request({
    endpoint: ADD_NOTIFICATION_SERVICE_USER_SUBSCRIBE + "?service_time_month=" + id,
    method: HttpRequest.POST,
    body: JSON.stringify(data),
  });
}

export async function updateNotificationServiceUserSubscribeStatus(id,status) {
  return await request({
    endpoint: UPDATE_NOTIFICATION_SERVICE_USER_SUBSCRIBE_STATUS + "?update_id=" + id + "&status="+ status,
    method: HttpRequest.POST,
  });
}


export async function getNotificationServiceSubscribeByUserId(id,pageNo,pageSize) {
  return await request({
    endpoint: GET_NOTIFICATION_SERVICE_SUBSCRIBE_BY_USER_ID + '?user_id=' + id +"&page=" + pageNo +"&size=" + pageSize,
    method: HttpRequest.GET,
  });
}

export async function addNotificationServiceUserConfig(data) {
  return await request({
    endpoint: ADD_NOTIFICATION_SERVICE_USER_CONFIG ,
    method: HttpRequest.POST,
    body: JSON.stringify(data),
  });
}
export async function updateNotificationServiceUserConfig(data) {
  return await request({
    endpoint: UPDATE_NOTIFICATION_SERVICE_USER_CONFIG ,
    method: HttpRequest.POST,
    body: JSON.stringify(data),
  });
}


export async function updateNotificationServiceUserConfigStatus(id,status) {
  return await request({
    endpoint: UPDATE_NOTIFICATION_SERVICE_USER_CONFIG_STATUS + "?update_id=" + id + "&status="+ status,
    method: HttpRequest.POST,
  });
}

export async function getAllNotificationServiceConfigByUserID(id,pageNo,pageSize) {
  return await request({
    endpoint: GET_ALL_NOTIFICATION_SERVICE_CONFIG_BY_USER_ID + '?user_vendor_id=' + id +"&page=" + pageNo +"&size=" + pageSize,
    method: HttpRequest.GET,
  });
}
