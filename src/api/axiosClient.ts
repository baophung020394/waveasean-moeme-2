import axios, { AxiosHeaders, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  getAccessToken,
  getLocalRefreshToken,
  updateLocalAccessToken,
} from "services/TokenService";

const axiosClient = axios.create({
  baseURL: "https://moeme-web-dev.aveapp.com/moa",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    Authorization: "value1",
  },
});

axiosClient.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    // Do something before request is sent
    const token = getAccessToken();

    if (token) {
      (config.headers as AxiosHeaders).set("Authorization", `MOA ${token}`);
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response: AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // const originalConfig = error.config;
    // if (originalConfig.url !== "/" && error.code === "ERR_NETWORK") {
    //   // Access Token was expired
    //   if (!originalConfig.validateStatus()) {
    //     try {
    //       const refreshToken = getLocalRefreshToken();

    //       updateLocalAccessToken(refreshToken);

    //       return axiosClient(originalConfig);
    //     } catch (_error) {
    //       return Promise.reject(_error);
    //     }
    //   }
    // }

    return Promise.reject(error);
  }
);

export default axiosClient;
