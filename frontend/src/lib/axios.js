
import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL || "";
const apiBaseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000/api"
    : configuredApiUrl.endsWith("/api")
      ? configuredApiUrl
      : `${configuredApiUrl}/api`;

export const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, "");
