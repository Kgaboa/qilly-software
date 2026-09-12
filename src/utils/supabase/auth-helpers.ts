/**
 * Supabase Auth Helpers
 * 
 * Helper functions to handle auth operations with proper error handling
 * and lock management to prevent orphaned locks.
 */

import { supabase } from '../supabase';

/**
 * Cleanup any orphaned auth locks on app initialization
 * This prevents the "Lock was not released within 5000ms" warning
 */
export async function cleanupAuthLocks() {
  if (typeof window === 'undefined') return;
  
  try {
    // Get all storage keys that match the lock pattern
    const keys = Object.keys(localStorage);
    const lockKeys = keys.filter(key => key.includes('lock:sb-qilly-') && key.includes('-auth-token'));
    
    if (lockKeys.length > 0) {
      console.log(`🧹 Cleaning up ${lockKeys.length} orphaned auth lock(s)...`);
      lockKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
    }
  } catch (error) {
    // Silently fail - this is just cleanup
    console.debug('Auth lock cleanup skipped:', error);
  }
}

/**
 * Safe sign out that handles errors gracefully
 */
export async function safeSignOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.warn('Sign out error (non-critical):', error.message);
    }
    return { success: true };
  } catch (error) {
    console.warn('Sign out failed (non-critical):', error);
    return { success: false, error };
  }
}

/**
 * Safe get user that handles errors gracefully
 */
export async function safeGetUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Don't log every auth error - only critical ones
      if (!error.message.includes('session_not_found')) {
        console.warn('Get user error:', error.message);
      }
      return { user: null, error };
    }
    return { user: data.user, error: null };
  } catch (error) {
    console.warn('Get user failed:', error);
    return { user: null, error };
  }
}

/**
 * Safe sign in with password that handles errors gracefully
 */
export async function safeSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return { success: false, error: error.message, data: null };
    }
    
    return { success: true, data, error: null };
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to sign in';
    console.error('Sign in error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

/**
 * Safe sign up that handles errors gracefully
 */
export async function safeSignUp(
  email: string, 
  password: string, 
  metadata?: Record<string, any>
) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: metadata ? { data: metadata } : undefined,
    });
    
    if (error) {
      return { success: false, error: error.message, data: null };
    }
    
    return { success: true, data, error: null };
  } catch (error: any) {
    const errorMessage = error?.message || 'Failed to sign up';
    console.error('Sign up error:', errorMessage);
    return { success: false, error: errorMessage, data: null };
  }
}

/**
 * Initialize auth cleanup on app load
 * Call this once when your app starts
 */
export function initAuthCleanup() {
  if (typeof window === 'undefined') return;
  
  // Clean up on load
  cleanupAuthLocks();
  
  // Clean up before page unload
  window.addEventListener('beforeunload', () => {
    cleanupAuthLocks();
  });
  
  // Clean up on visibility change (mobile browsers)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      cleanupAuthLocks();
    }
  });
}
