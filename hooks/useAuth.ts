// hooks/useAuth.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import { getCurrentUserInfo } from '@/lib/getCurrentUserInfo';
import { enhancedSignOut } from '@/lib/authEvents';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const userInfo = await getCurrentUserInfo();
      setUser(userInfo);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Set up storage event listener for cross-tab auth changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'amplify-auth-signout') {
        setUser(null);
        setLoading(false);
        localStorage.removeItem('amplify-auth-signout');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [checkAuth]);

  const signOutAndNotify = async () => {
    await enhancedSignOut();
    setUser(null);
  };

  return { 
    user, 
    loading, 
    signOut: signOutAndNotify, 
    refreshAuth: checkAuth 
  };
}