'use client';

import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

/**
 * Hook that sets up automatic notification polling every 30 seconds.
 * This hook fetches new notifications and updates the unread count badge
 * without requiring a page refresh.
 * 
 * Usage:
 * ```tsx
 * export function AuthenticatedLayout({ children }) {
 *   useNotificationPolling();
 *   return <div>{children}</div>;
 * }
 * ```
 * 
 * The hook:
 * - Fetches notifications immediately on mount
 * - Sets up polling interval every 30 seconds
 * - Automatically updates the notification badge count
 * - Cleans up interval on unmount
 * - Handles errors gracefully
 */
export function useNotificationPolling(intervalMs = 30000) {
  const { refreshNotifications } = useNotifications();

  useEffect(() => {
    // Initial fetch on mount
    refreshNotifications();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      refreshNotifications();
    }, intervalMs);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [refreshNotifications, intervalMs]);
}
