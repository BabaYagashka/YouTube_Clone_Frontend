import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  withCredentials: true,
});

// request interceptor - attach access token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// response interceptor - refresh token if access token expires
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/users/refresh-token",
          {},
          { withCredentials: true },
        );
        const newAccessToken = response.data.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (error) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
