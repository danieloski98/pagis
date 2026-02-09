import config from "@/utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosRequestConfig, isAxiosError } from "axios";
import { Toast } from "toastify-react-native";

export const TOKEN_KEY = "authToken";

const API_BASE_URL = config.baseApiUrl || "/api/proxy";

interface RequestConfig {
  method?: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  headers?: Record<string, string>;
  body?: any;
}

export class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async setToken(token: string) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private async getHeaders(
    config?: RequestConfig,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config?.headers,
    };

    let token = this.token;
    if (!token) {
      token = await AsyncStorage.getItem(TOKEN_KEY);
      if (token) this.token = token;
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("[v0] API Request:", url);

    const headers = await this.getHeaders(config);

    const axiosConfig: AxiosRequestConfig = {
      method: config?.method || "GET",
      url: url,
      headers: headers,
      data: config?.body,
    };

    try {
      const response = await axios(axiosConfig);
      console.log(" API Response Status:", response.status);
      console.log(" API Response:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(" API Request failed:", endpoint, error);

      let errorMessage = "An unexpected error occurred";

      if (isAxiosError(error)) {
        const errorData = error.response?.data;
        errorMessage =
          errorData?.message ||
          errorData?.error ||
          `API Error: ${error.response?.status || "Unknown"}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      console.error(" API Error:", errorMessage);
      Toast.error(errorMessage);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async patch<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = "file",
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("[v0] API Upload Request:", url);

    const formData = new FormData();
    formData.append(fieldName, file);

    const headers: Record<string, string> = {};
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      console.log(" API Upload Response Status:", response.status);

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        const errorMessage =
          errorData?.message ||
          errorData?.error ||
          `API Error: ${response.status}`;
        console.error(" API Upload Error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(" API Upload Response:", data);
      return data;
    } catch (error) {
      console.error(" API Upload failed:", endpoint, error);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
