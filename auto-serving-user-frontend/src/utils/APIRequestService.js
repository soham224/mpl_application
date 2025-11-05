// eslint-disable-next-line
import React from "react";
import Cookies from "universal-cookie";
import { ACCESS_TOKEN, TOKEN_TYPE } from "../enums/auth.enums";
import { warningToast } from "./ToastMessage";
import { appConfigs } from "./AppConfigs";
const axios = require("axios");

export function request(options) {
  let isStatus = false;
  let isSuccess = false;
  let failureStatus = false;
  // eslint-disable-next-line
  let unAthorizedStatus = false;

  const config = {
    headers: options["headers"]
      ? options["headers"]
      : { "Content-Type": "application/json" },
    url: options["url"] || appConfigs.API_HOST + options["endpoint"],
    method: options["method"],
    data: options["body"],
  };

  const cookies = new Cookies();
  if (cookies.get("access_token") && cookies.get("token_type")) {
    config["headers"]["Authorization"] =
      cookies.get("token_type", { httpOnly: false }) +
      " " +
      cookies.get("access_token", { httpOnly: false });
  }
  return axios
    .request(config)
    .then((response) => {
      let data;
      if (response.request.status === 200) {
        isSuccess = true;
        data = response.data;
      } else {
        isSuccess = false;
        data = null;
      }
      return { data, isStatus, isSuccess, failureStatus };
    })
    .catch((error) => {
      if (error.response) {
        const { status, data: errorData } = error.response;
        if (status === 401 || status === 403) {
          warningToast("Access Denied!");
          cookies.remove(ACCESS_TOKEN, { httpOnly: false });
          cookies.remove(TOKEN_TYPE, { httpOnly: false });
          unAthorizedStatus = true;
          window.location.href = "#/auth/login";
        }
        throw errorData ? errorData : error;
      }
      throw error;
    });
}
