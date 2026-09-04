'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  type: 'finding_submitted' | 'approval_required' | 'finding_approved' | 'finding_rejected' | 'deadline_reminder';
  title: string;
  message: string;
  findingId?: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  toasts: Toast[];

  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;

  addToast: (type: Toast['type'], message: string, duration?: number) => string;
  removeToast: (id: string) => void;

  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const POLL_INTERVAL_MS = 30_000; // 30 detik
const DEADLINE_INTERVAL_MS = 5 * 60_000; // 5 menit

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('smk3_token');
}

/** Fetch langsung ke NestJS backend, silent fail, tidak redirect */
async function backendFetch<T>(endpoint: string): Promise<T | null> {
  const token = getToken();
  if (!token) return null;
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deadlineRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shownDeadlines = useRef<Set<string>>(new Set());

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // ── Core fetch ───────────────────────────────────────────────────────────

  const refreshNotifications = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const data = await backendFetch<Notification[]>('/notifications');
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Deadline toast check ─────────────────────────────────────────────────

  const showWarningRef = useRef<(msg: string, duration?: number) => string>(
    () => ''
  );

  const checkDeadlines = useCallback(async () => {
    const reminders = await backendFetch<any[]>(
      '/smk3-data/deadline-reminders?daysAhead=3'
    );
    if (!reminders) return;

    for (const r of reminders) {
      if (shownDeadlines.current.has(r.id)) continue;
      shownDeadlines.current.add(r.id);

      if (r.isOverdue) {
        showWarningRef.current(
          `⚠️ DEADLINE LEWAT: "${r.title}" sudah melewati batas ${Math.abs(r.daysLeft)} hari lalu!`,
          8000
        );
      } else if (r.isSoon) {
        showWarningRef.current(
          `🕐 DEADLINE MENDEKAT: "${r.title}" — sisa ${r.daysLeft} hari.`,
          6000
        );
      }
    }
  }, []);

  // ── Polling: mulai/stop berdasarkan ada tidaknya token ──────────────────
  // Cek token setiap 1 detik (hanya baca localStorage, bukan network).
  // Begitu token ada, mulai interval polling notifikasi dan deadline.
  // Begitu token hilang (logout), hentikan polling tapi JANGAN hapus state —
  // state akan di-clear oleh clearNotifications() yang dipanggil dari luar
  // (AuthContext saat logout).

  useEffect(() => {
    let hasToken = !!getToken();

    const startPolling = () => {
      if (pollingRef.current) return; // sudah jalan

      // Fetch langsung saat token pertama kali terdeteksi
      refreshNotifications();

      pollingRef.current = setInterval(refreshNotifications, POLL_INTERVAL_MS);

      // Delay sedikit sebelum cek deadline pertama kali
      setTimeout(() => {
        checkDeadlines();
        deadlineRef.current = setInterval(checkDeadlines, DEADLINE_INTERVAL_MS);
      }, 5000);
    };

    const stopPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      if (deadlineRef.current) {
        clearInterval(deadlineRef.current);
        deadlineRef.current = null;
      }
    };

    // Jika sudah punya token saat mount, langsung mulai
    if (hasToken) startPolling();

    // Watch setiap 1 detik untuk mendeteksi login/logout
    const watcher = setInterval(() => {
      const currentlyHasToken = !!getToken();

      if (currentlyHasToken && !hasToken) {
        // Login event
        hasToken = true;
        startPolling();
      } else if (!currentlyHasToken && hasToken) {
        // Logout event
        hasToken = false;
        stopPolling();
        setNotifications([]);
        shownDeadlines.current.clear();
      }
    }, 1000);

    return () => {
      clearInterval(watcher);
      stopPolling();
    };
  }, [refreshNotifications, checkDeadlines]);

  // ── Notification state methods ────────────────────────────────────────────

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // ── Toast methods ─────────────────────────────────────────────────────────

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: Toast['type'], message: string, duration = 4000): string => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts((prev) => [...prev, { id, type, message, duration }]);
      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
      return id;
    },
    []
  );

  const showSuccess = useCallback(
    (msg: string, duration?: number) => addToast('success', msg, duration),
    [addToast]
  );
  const showError = useCallback(
    (msg: string, duration?: number) => addToast('error', msg, duration ?? 5000),
    [addToast]
  );
  const showInfo = useCallback(
    (msg: string, duration?: number) => addToast('info', msg, duration),
    [addToast]
  );
  const showWarning = useCallback(
    (msg: string, duration?: number) => addToast('warning', msg, duration ?? 5000),
    [addToast]
  );

  // Sync showWarning ke ref agar checkDeadlines bisa pakai versi terbaru
  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  // ── Value ─────────────────────────────────────────────────────────────────

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isLoading,
    toasts,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refreshNotifications,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
