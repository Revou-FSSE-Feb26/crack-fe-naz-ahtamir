'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { NotificationDropdown } from './NotificationDropdown';
import { useNotifications } from '@/contexts/NotificationContext';

interface TopHeaderProps {
  user?: {
    name: string;
    role: string;
    email: string;
  } | null;
}

export function TopHeader({ user: propsUser }: TopHeaderProps) {
  const { user: authUser } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  // Use provided user or fallback to auth user
  const displayUser = propsUser || authUser || {
    name: '',
    role: 'user',
    email: '',
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] bg-[#231f20] border-b border-[#3a3535] px-4 py-3 z-40">
      <div className="flex items-center justify-between">
        <div className="flex-1" />
        
        {/* Right side - Notifications and User Info */}
        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationDropdown
            notifications={notifications}
            unreadCount={unreadCount}
          />

          {/* User Info */}
          {displayUser && (
            <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-[#3a3535]">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{displayUser.name}</p>
                <p className="text-xs text-[#6b6560] capitalize">{displayUser.role}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
