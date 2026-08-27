/**
 * API Client Utility
 * Handles authenticated requests to the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    idKaryawan: string;
    nama: string;
    jabatan?: string;
    role: 'admin' | 'supervisor' | 'user';
    departemen?: string;
    divisi?: string;
    pusat?: string;
    perusahaan?: string;
    approved: boolean;
    supervisorId?: string | null;
    tanggalLahir?: string | null;
    tempatLahir?: string | null;
    agama?: string | null;
    jenisKelamin?: string | null;
    pendidikan?: string | null;
    namaSekolah?: string | null;
    jurusan?: string | null;
    tanggalMulaiKerja?: string | null;
    umur?: number | null;
    masaKerja?: string | null;
    createdAt?: string;
    updatedAt?: string;
  };
  token: string;
}

/**
 * Get stored JWT token from localStorage
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smk3_token');
}

/**
 * Store JWT token in localStorage
 */
export function storeToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('smk3_token', token);
}

/**
 * Clear stored JWT token
 */
export function clearToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('smk3_token');
}

/**
 * Generic fetch wrapper with auth header and error handling
 */
async function fetchWithAuth<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 Unauthorized - token may be expired
  if (response.status === 401) {
    clearToken();
    // Redirect to login if in browser
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error('Unauthorized. Please login again.');
  }

  // Handle 403 Forbidden
  if (response.status === 403) {
    throw new Error('Anda tidak memiliki akses untuk melakukan operasi ini');
  }

  // Handle other errors
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Authentication endpoints
 */
export const authApi = {
  login: async (idKaryawan: string, password: string): Promise<AuthResponse> => {
    return fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ idKaryawan, password }),
    });
  },

  logout: async (): Promise<void> => {
    // Clear token from storage
    clearToken();
    // You can optionally call backend logout endpoint here if needed
    // await fetchWithAuth('/auth/logout', { method: 'POST' }).catch(() => {});
  },
};

/**
 * SMK3 Data (Findings) endpoints
 */
export const findingsApi = {
  getAll: async (filters?: {
    subSubElementId?: string;
    findingStatus?: string;
    createdById?: string;
    department?: string;
  }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    return fetchWithAuth(`/smk3-data?${params.toString()}`);
  },

  getById: async (id: string): Promise<any> => {
    return fetchWithAuth(`/smk3-data/${id}`);
  },

  create: async (data: any): Promise<any> => {
    return fetchWithAuth('/smk3-data', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any): Promise<any> => {
    return fetchWithAuth(`/smk3-data/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (
    id: string,
    findingStatus: string,
    approvalData?: any
  ): Promise<any> => {
    return fetchWithAuth(`/smk3-data/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({
        findingStatus,
        ...approvalData,
      }),
    });
  },

  delete: async (id: string): Promise<any> => {
    return fetchWithAuth(`/smk3-data/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Notifications endpoints
 */
export const notificationsApi = {
  getAll: async (filters?: { isRead?: boolean; limit?: number }): Promise<any[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.isRead !== undefined) params.append('isRead', String(filters.isRead));
      if (filters.limit) params.append('limit', String(filters.limit));
    }
    return fetchWithAuth(`/notifications?${params.toString()}`);
  },

  markAsRead: async (id: string): Promise<any> => {
    return fetchWithAuth(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  markAllAsRead: async (): Promise<any> => {
    return fetchWithAuth(`/notifications/read-all`, {
      method: 'PATCH',
    });
  },
};

/**
 * File upload endpoint
 */
export const uploadsApi = {
  uploadFile: async (file: File, subSubElementId: string): Promise<{ filePath: string; filename: string }> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/uploads`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('subSubElementId', subSubElementId);

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Upload error: ${response.status}`);
    }

    return response.json();
  },
};

/**
 * Records API — dipakai untuk Safety Compliance, Accident Prevention, Safety Competency
 * Menggunakan endpoint /smk3-data yang sama dengan findings,
 * dibedakan oleh field subElementId (kategori record).
 */
export type RecordCategory =
  | 'safety-compliance'
  | 'accident-prevention'
  | 'safety-competency';

export interface SafetyRecord {
  id: string;
  subElementId: string;
  title: string;
  findingStatus: 'INPG' | 'CLSD';
  data: Record<string, any>;
  createdById: string;
  createdByName: string;
  approvedByName?: string;
  createdAt: string;
  updatedAt: string;
}

export const recordsApi = {
  getAll: async (
    category: RecordCategory,
    search?: string
  ): Promise<SafetyRecord[]> => {
    const params = new URLSearchParams({ subElementId: category });
    if (search) params.append('search', search);
    return fetchWithAuth(`/smk3-data?${params.toString()}`);
  },

  getById: async (id: string): Promise<SafetyRecord> => {
    return fetchWithAuth(`/smk3-data/${id}`);
  },

  create: async (
    category: RecordCategory,
    payload: { title: string; data: Record<string, any> }
  ): Promise<SafetyRecord> => {
    return fetchWithAuth('/smk3-data', {
      method: 'POST',
      body: JSON.stringify({
        subElementId: category,
        title: payload.title,
        data: payload.data,
      }),
    });
  },

  update: async (
    id: string,
    payload: { title: string; data: Record<string, any> }
  ): Promise<SafetyRecord> => {
    return fetchWithAuth(`/smk3-data/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchWithAuth(`/smk3-data/${id}`, { method: 'DELETE' });
  },

  // ── Upload with File ──────────────────────────────────────────────────────────

  createWithFile: async (
    category: RecordCategory,
    formData: FormData
  ): Promise<SafetyRecord> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/smk3-data`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Jangan set Content-Type! Browser akan set boundary otomatis untuk FormData

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    // Handle 401
    if (response.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  },

  updateWithFile: async (
    id: string,
    formData: FormData
  ): Promise<SafetyRecord> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/smk3-data/${id}`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      clearToken();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API error: ${response.status}`);
    }

    return response.json();
  },  
};

/**
 * Error handler utility
 */
export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Terjadi kesalahan. Silakan coba lagi.';
}
