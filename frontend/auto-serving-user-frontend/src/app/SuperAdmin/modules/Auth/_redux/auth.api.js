import { request } from "../../../../../utils/APIRequestService";
import { appConfigs } from "../../../../../utils/AppConfigs";
export const LOGIN_URL = "/login/access-token";
export const LOGIN_TEST_URL = "/login/test-token";
const BASE_URL = appConfigs.API_HOST;

export function getToken(data) {
  return request({
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    endpoint: LOGIN_URL,
    method: "post",
    body: data,
  });
}

export function tokenTest() {
  return request({
    endpoint: LOGIN_TEST_URL,
    method: "post",
  });
}
