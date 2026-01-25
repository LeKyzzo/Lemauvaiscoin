'use client';

import { useEffect, useState } from 'react';
import { messagesAPI } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';

export function MessageBadge() {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadUnreadCount = async () => {
      try {
        const data = await messagesAPI.getUnreadCount();
        setUnreadCount(data.count);
      } catch (error) {
        // Silently fail
      }
    };

    loadUnreadCount();
    const interval = setInterval(loadUnreadCount, 10000); // Vérifier toutes les 10 secondes

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  if (!isAuthenticated || unreadCount === 0) return null;

  return (
    <span
      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
      style={{ background: 'var(--orange)' }}
    >
      {unreadCount > 9 ? '9+' : unreadCount}
    </span>
  );
}
