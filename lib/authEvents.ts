// lib/authEvents.ts
"use client";

import { useEffect } from 'react';
import { signOut as amplifySignOut } from './awsAuth';

// Custom event name for cross-tab communication
const AUTH_SIGNOUT_EVENT = 'amplify-auth-signout';

export const useAuthSync = () => {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === AUTH_SIGNOUT_EVENT && event.newValue) {
        // Clear the flag and reload or handle auth state change
        localStorage.removeItem(AUTH_SIGNOUT_EVENT);
        window.location.reload(); // Simple approach
        // Alternatively, you could dispatch a custom event for more granular control
      }
    };

    const handleSignOutEvent = (event: CustomEvent) => {
      // Handle custom signout events if needed
      window.location.reload();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(AUTH_SIGNOUT_EVENT, handleSignOutEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(AUTH_SIGNOUT_EVENT, handleSignOutEvent as EventListener);
    };
  }, []);
};

// Enhanced signOut that notifies other tabs
export const enhancedSignOut = async () => {
  try {
    await amplifySignOut();
  } catch (error) {
    console.error('Error during sign out:', error);
  } finally {
    // Always set the flag to notify other tabs, even if Amplify signOut fails
    localStorage.setItem(AUTH_SIGNOUT_EVENT, Date.now().toString());
    
    // Clear the flag after a short delay
    setTimeout(() => {
      localStorage.removeItem(AUTH_SIGNOUT_EVENT);
    }, 1000);
  }
};