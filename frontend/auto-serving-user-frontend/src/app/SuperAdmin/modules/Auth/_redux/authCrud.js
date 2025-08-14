import axios from "axios";

export const LOGIN_URL = "http://13.234.76.118:8080/api/v1/login/access-token";
export const REGISTER_URL = "api-superadmin/auth/register";
export const REQUEST_PASSWORD_URL = "api-superadmin/auth/forgot-password";

export const ME_URL = "api-superadmin/me";

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
