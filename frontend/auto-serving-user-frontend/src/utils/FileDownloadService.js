import Cookies from "universal-cookie";
import { ACCESS_TOKEN, TOKEN_TYPE } from "../enums/auth.enums";
import { warningToast } from "./ToastMessage";
import { appConfigs } from "./AppConfigs";

export function downloadFile(options) {
  const config = {
    headers: options["headers"] || {},
    url: options["url"] || appConfigs.API_HOST + options["endpoint"],
    method: options["method"] || "POST",
    data: options["body"],
    responseType: "blob", // Important for file downloads
  };

  const cookies = new Cookies();
  if (cookies.get("access_token") && cookies.get("token_type")) {
    config["headers"]["Authorization"] =
      cookies.get("token_type", { httpOnly: false }) +
      " " +
      cookies.get("access_token", { httpOnly: false });
  }

  return fetch(config.url, {
    method: config.method,
    headers: config.headers,
    body: config.data ? JSON.stringify(config.data) : undefined,
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          warningToast("Access Denied!");
          cookies.remove(ACCESS_TOKEN, { httpOnly: false });
          cookies.remove(TOKEN_TYPE, { httpOnly: false });
          window.location.href = "#/auth/login";
          throw new Error("Unauthorized");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.blob();
    })
    .then((blob) => {
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = options.filename || "download.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return { success: true, message: "File downloaded successfully" };
    })
    .catch((error) => {
      console.error("Download error:", error);
      warningToast("Download failed. Please try again.");
      throw error;
    });
} 