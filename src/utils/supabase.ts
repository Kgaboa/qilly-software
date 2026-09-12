/**
 * Supabase Client Configuration
 * 
 * DEPRECATED: This file is kept for backwards compatibility.
 * All new code should import from './supabase/client' instead.
 * 
 * This re-exports the environment-aware client to prevent multiple instances.
 */

import { getSupabaseClient } from './supabase/client';
import { getCurrentEnvironment } from './environment';

// Cache the client to avoid recreating on every property access
let cachedClient: any = null;
let cachedEnvironment: string | null = null;

/**
 * Get the Supabase client for the current environment
 * This ensures we only have ONE client instance across the entire app
 */
function getClient() {
  const environment = getCurrentEnvironment();
  
  // Return cached client if environment hasn't changed
  if (cachedClient && cachedEnvironment === environment) {
    return cachedClient;
  }
  
  const client = getSupabaseClient(environment);
  
  if (!client) {
    console.warn('Supabase client not available. Using placeholder.');
    // Return a minimal placeholder to prevent crashes
    // But operations will fail gracefully
  } else {
    // Cache the client
    cachedClient = client;
    cachedEnvironment = environment;
  }
  
  return client;
}

// Export a getter instead of a static instance to ensure environment changes are respected
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    const client = getClient();
    if (!client) {
      // Return a function that throws a helpful error
      if (typeof prop === 'string' && ['from', 'auth', 'storage', 'functions', 'rpc'].includes(prop)) {
        return () => {
          throw new Error('Supabase client not configured. Please set up your environment in Admin Dashboard.');
        };
      }
      return undefined;
    }
    // @ts-ignore
    return client[prop];
  }
});

// Also export the function directly for explicit usage
export { getSupabaseClient } from './supabase/client';