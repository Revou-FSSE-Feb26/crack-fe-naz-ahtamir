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

  // Handle 401 Unauthorized
  if (response.status === 401) {
    clearToken();
    // Hanya redirect jika ini bukan background polling (ada token saat request)
    // dan user sedang di halaman authenticated
    if (typeof window !== 'undefined' && token) {
      const path = window.location.pathname;
      const isAuthPage = path === '/login' || path === '/';
      if (!isAuthPage) {
        window.location.href = '/login';
      }
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
    approvalData?: {
      approvalStatus?: 'ACC' | 'TACC';
      approvalNote?: string;
      picId?: string;
      followUpNote?: string;
      followUpDeadline?: string;
    }
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
    category: RecordCategory | string,
    search?: string,
    createdById?: string,
  ): Promise<SafetyRecord[]> => {
    const params = new URLSearchParams({ subElementId: category });
    if (search) params.append('search', search);
    if (createdById) params.append('createdById', createdById);
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
    category: RecordCategory | string,
    formData: FormData
  ): Promise<SafetyRecord> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/smk3-data`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    // Pastikan subElementId ada di FormData — backend wajib menerimanya
    if (!formData.get('subElementId')) {
      formData.append('subElementId', category);
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
 * K3 Policy API — dedicated endpoint for K3 Policy records
 */
export const k3PolicyApi = {
  getAll: async (): Promise<any[]> => {
    return fetchWithAuth('/k3-policy');
  },

  getById: async (id: string): Promise<any> => {
    return fetchWithAuth(`/k3-policy/${id}`);
  },

  createWithFile: async (formData: FormData): Promise<any> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/k3-policy/with-file`;

    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
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

  updateWithFile: async (id: string, formData: FormData): Promise<any> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/k3-policy/with-file/${id}`;

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

  delete: async (id: string): Promise<void> => {
    return fetchWithAuth(`/k3-policy/${id}`, { method: 'DELETE' });
  },
};

/**
 * Deadline reminders — INPG findings yang sudah/hampir melewati deadline
 */
export const deadlineRemindersApi = {
  getAll: async (daysAhead = 3): Promise<any[]> => {
    return fetchWithAuth(`/smk3-data/deadline-reminders?daysAhead=${daysAhead}`);
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

// ─────────────────────────────────────────────────────────────────────────────
// Master List Documents
// ─────────────────────────────────────────────────────────────────────────────

export interface Department {
  id: string;
  name: string;
  code: string;
}

export type JenisDokumen = 'MANUAL' | 'SOP' | 'INSTRUKSI_KERJA' | 'FORMULIR';
export type StatusDokumen = 'ASLI' | 'SALINAN' | 'ASLI-REVISI' | 'SALINAN-REVISI';
export type StatusDistribusi = 'TERKENDALI' | 'TIDAK_TERKENDALI';
export type StatusValidasi = 'BERLAKU' | 'TIDAK_BERLAKU' | 'PEMUSNAHAN';

export interface Document {
  id: string;
  departemenId: string;
  departemen: Department;
  jenisDokumen: JenisDokumen;
  namaDokumen: string;
  nomorDokumen: string;
  revisi?: string | null;
  tanggalTerbit: string;
  statusDokumen: StatusDokumen;
  statusDistribusi: StatusDistribusi;
  statusValidasi: StatusValidasi;
  parentId?: string | null;
  parent?: Pick<Document, 'id' | 'namaDokumen' | 'nomorDokumen' | 'jenisDokumen'> | null;
  children?: Document[];
  fileUrl?: string | null;
  createdById: string;
  createdBy: { id: string; nama: string };
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentDto {
  departemenId: string;
  jenisDokumen: JenisDokumen;
  namaDokumen: string;
  nomorDokumen: string;
  revisi?: string;
  tanggalTerbit: string;
  statusDokumen: StatusDokumen;
  statusDistribusi: StatusDistribusi;
  statusValidasi: StatusValidasi;
  parentId?: string | null;
}

/** Departments API */
export const departmentsApi = {
  getAll: async (): Promise<Department[]> => {
    return fetchWithAuth('/departments');
  },
};

/** Documents API */
export const documentsApi = {
  /** Semua dokumen (flat list) */
  getAll: async (params?: { departemenId?: string; jenisDokumen?: string }): Promise<Document[]> => {
    const qs = new URLSearchParams();
    if (params?.departemenId) qs.append('departemenId', params.departemenId);
    if (params?.jenisDokumen) qs.append('jenisDokumen', params.jenisDokumen);
    return fetchWithAuth(`/documents?${qs.toString()}`);
  },

  /** Dokumen yang bisa jadi parent, filter by jenisDokumen + departemenId */
  getParentCandidates: async (jenisDokumen: JenisDokumen, departemenId: string): Promise<Document[]> => {
    const parentJenis: Record<JenisDokumen, JenisDokumen | null> = {
      MANUAL: null,
      SOP: 'MANUAL',
      INSTRUKSI_KERJA: 'SOP',
      FORMULIR: 'INSTRUKSI_KERJA',
    };
    const pj = parentJenis[jenisDokumen];
    if (!pj) return [];
    const qs = new URLSearchParams({ jenisDokumen: pj, departemenId });
    return fetchWithAuth(`/documents?${qs.toString()}`);
  },

  getById: async (id: string): Promise<Document> => {
    return fetchWithAuth(`/documents/${id}`);
  },

  create: async (dto: CreateDocumentDto): Promise<Document> => {
    return fetchWithAuth('/documents', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  createWithFile: async (formData: FormData): Promise<Document> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/documents/with-file`;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', headers, body: formData });
    if (res.status === 401) { clearToken(); window.location.href = '/login'; throw new Error('Unauthorized'); }
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `API error: ${res.status}`); }
    return res.json();
  },

  update: async (id: string, dto: Partial<CreateDocumentDto>): Promise<Document> => {
    return fetchWithAuth(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  updateWithFile: async (id: string, formData: FormData): Promise<Document> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/documents/with-file/${id}`;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'PUT', headers, body: formData });
    if (res.status === 401) { clearToken(); window.location.href = '/login'; throw new Error('Unauthorized'); }
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `API error: ${res.status}`); }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    return fetchWithAuth(`/documents/${id}`, { method: 'DELETE' });
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Emergency Drill API
// ─────────────────────────────────────────────────────────────────────────────

export type DrillType =
  | 'FIRE'
  | 'EARTHQUAKE'
  | 'CHEMICAL_SPILL'
  | 'EVACUATION'
  | 'FIRST_AID'
  | 'OTHER';

export type DrillStatus = 'COMPLETED' | 'NOT_COMPLETED';

export interface EmergencyDrill {
  id: string;
  // Plan
  planDate: string;
  drillType: DrillType;
  scenario: string;
  departmentId: string;
  department: { id: string; name: string; code: string };
  division: string;
  picPlan: string;
  notesPlan?: string | null;
  // Actual
  actualDate?: string | null;
  location?: string | null;
  totalTKA?: number | null;
  totalTKI?: number | null;
  totalStaff?: number | null;
  participationRate?: number | null;
  duration?: string | null;
  picActual?: string | null;
  notesActual?: string | null;
  // Files
  photoDocumentation?: string | null;
  attendanceList?: string | null;
  drillReport?: string | null;
  // Auto
  status: DrillStatus;
  // Audit
  createdById: string;
  createdBy: { id: string; nama: string };
  createdAt: string;
  updatedById?: string | null;
  updatedBy?: { id: string; nama: string } | null;
  updatedAt: string;
}

export const emergencyDrillApi = {
  getAll: async (params?: {
    status?: DrillStatus;
    drillType?: DrillType;
    departmentId?: string;
    search?: string;
  }): Promise<EmergencyDrill[]> => {
    const qs = new URLSearchParams();
    if (params?.status)       qs.append('status',       params.status);
    if (params?.drillType)    qs.append('drillType',    params.drillType);
    if (params?.departmentId) qs.append('departmentId', params.departmentId);
    if (params?.search)       qs.append('search',       params.search);
    return fetchWithAuth(`/emergency-drill?${qs.toString()}`);
  },

  getById: async (id: string): Promise<EmergencyDrill> => {
    return fetchWithAuth(`/emergency-drill/${id}`);
  },

  create: async (formData: FormData): Promise<EmergencyDrill> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/emergency-drill`;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'POST', headers, body: formData });
    if (res.status === 401) { clearToken(); if (typeof window !== 'undefined') window.location.href = '/login'; throw new Error('Unauthorized'); }
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `API error: ${res.status}`); }
    return res.json();
  },

  update: async (id: string, formData: FormData): Promise<EmergencyDrill> => {
    const token = getStoredToken();
    const url = `${API_BASE_URL}/emergency-drill/${id}`;
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(url, { method: 'PUT', headers, body: formData });
    if (res.status === 401) { clearToken(); if (typeof window !== 'undefined') window.location.href = '/login'; throw new Error('Unauthorized'); }
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.message || `API error: ${res.status}`); }
    return res.json();
  },

  delete: async (id: string): Promise<void> => {
    return fetchWithAuth(`/emergency-drill/${id}`, { method: 'DELETE' });
  },
};
