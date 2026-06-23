/**
 * API Client Utilities
 * Wrapper functions untuk fetch dengan proxy support
 */

import { proxyFetch, getProxyBaseUrl } from "./proxy";

/**
 * API Response type
 */
export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
  status: number;
};

/**
 * API Client class untuk standardisasi API calls
 */
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getProxyBaseUrl("api");
  }

  /**
   * GET request
   */
  async get<T = any>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "GET",
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        status: 500,
      };
    }
  }

  /**
   * POST request
   */
  async post<T = any>(
    path: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        status: 500,
      };
    }
  }

  /**
   * PUT request
   */
  async put<T = any>(
    path: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        status: 500,
      };
    }
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    path: string,
    body?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...options?.headers,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        status: 500,
      };
    }
  }

  /**
   * DELETE request
   */
  async delete<T = any>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "DELETE",
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Request failed",
        status: 500,
      };
    }
  }

  /**
   * Upload file dengan FormData
   */
  async upload<T = any>(
    path: string,
    formData: FormData,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      const response = await proxyFetch(path, {
        ...options,
        method: "POST",
        body: formData,
        // Don't set Content-Type, browser will set it with boundary
      });

      const data = await response.json();

      return {
        data: response.ok ? data : undefined,
        error: !response.ok ? data.error || data.message : undefined,
        status: response.status,
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : "Upload failed",
        status: 500,
      };
    }
  }
}

// Export singleton instance
export const api = new ApiClient();

/**
 * Convenience functions untuk quick usage
 */
export const apiGet = <T = any>(path: string, options?: RequestInit) =>
  api.get<T>(path, options);

export const apiPost = <T = any>(path: string, body?: any, options?: RequestInit) =>
  api.post<T>(path, body, options);

export const apiPut = <T = any>(path: string, body?: any, options?: RequestInit) =>
  api.put<T>(path, body, options);

export const apiPatch = <T = any>(path: string, body?: any, options?: RequestInit) =>
  api.patch<T>(path, body, options);

export const apiDelete = <T = any>(path: string, options?: RequestInit) =>
  api.delete<T>(path, options);

export const apiUpload = <T = any>(
  path: string,
  formData: FormData,
  options?: RequestInit
) => api.upload<T>(path, formData, options);

export default api;
