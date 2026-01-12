import config from "@/utils/config";
import * as SecureStore from "expo-secure-store";
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
    this.token = SecureStore.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    SecureStore.setItem(TOKEN_KEY, token);
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  private getHeaders(config?: RequestConfig): Record<string, string> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...config?.headers,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log("[v0] API Request:", url);
    const options: RequestInit = {
      method: config?.method || "GET",
      headers: this.getHeaders(config),
    };

    if (config?.body) {
      options.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, options);
      console.log(" API Response Status:", response.status);

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
        console.error(" API Error:", errorMessage);
        Toast.error(errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(" API Response:", data);
      return data;
    } catch (error) {
      console.error(" API Request failed:", endpoint, error);
      Toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
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
    fieldName: string = "file"
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
