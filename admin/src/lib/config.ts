import type { AxiosInstance, AxiosResponse } from "axios";
import axios from "axios";

interface AdminApiConfig {
  baseURL: string;
  isProduction: boolean;
}

export const getAdminApiConfig = (): AdminApiConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error("VITE_API_URL environment variable is not defined");
  }

  const isProduction =
    import.meta.env.VITE_APP_ENV === "production" || import.meta.env.PROD === true;

  return {
    baseURL: `${apiUrl}/api`,
    isProduction,
  };
};

const createApiInstance = (): AxiosInstance => {
  const { baseURL } = getAdminApiConfig();
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
    timeout: 90000,
  });

  instance.interceptors.request.use(
    (config) => {
      const authData = localStorage.getItem("auth-storage");
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          const token = parsedData.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing auth data:", error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.code === "ERR_NETWORK") {
        console.error(
          "Network Error: unable to connect to the server. Please check if the server is running"
        );
      }

      if (error.response?.status === 401) {
        localStorage.removeItem("auth-storage");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const adminApi = createApiInstance ();

export const ADMIN_API_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
} as const;

export const buildAdminQueryParams = (
  params: Record<string, string | number | boolean | undefined> = {}
): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

export default adminApi;