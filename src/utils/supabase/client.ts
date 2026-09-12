/**
 * Supabase Client
 * 
 * Environment-aware Supabase client that switches based on the current environment.
 * This is the SINGLE source of truth for Supabase clients - all other files should import from here.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './info';
import type { Environment } from '@/utils/environment';

// SINGLETON: Only one client instance per environment
let currentClient: SupabaseClient | null = null;
let currentEnvironment: Environment | null = null;
let hasLoggedEnvironmentSwitch = false; // Track if we've already logged the switch

/**
 * Get or create a Supabase client for the current environment
 * This function ensures only ONE client instance exists at a time
 */
export function getSupabaseClient(environment: Environment): SupabaseClient | null {
  const config = getSupabaseConfig(environment);
  
  // Don't create a client if the environment is not enabled
  if (!config.enabled) {
    // Auto-switch to development if current environment is not enabled
    const devConfig = getSupabaseConfig('development');
    if (devConfig.enabled) {
      // Only log once to avoid console spam
      if (!hasLoggedEnvironmentSwitch) {
        console.log(`🚀 Using DEVELOPMENT environment`);
        hasLoggedEnvironmentSwitch = true;
      }
      currentEnvironment = 'development';
      return getSupabaseClient('development');
    }
    
    return null;
  }
  
  // Return cached client if environment hasn't changed
  if (currentClient && currentEnvironment === environment) {
    return currentClient;
  }
  
  // Dispose of old client before creating new one to avoid multiple instances warning
  if (currentClient && currentEnvironment !== environment) {
    // Clear the old client's auth session
    try {
      currentClient.auth.stopAutoRefresh?.();
    } catch (e) {
      // Ignore errors during cleanup
    }
    currentClient = null;
  }
  
  // Create new client for the environment (only log on actual creation)
  try {
    currentClient = createClient(config.projectUrl, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        storageKey: `sb-qilly-${config.projectId}-auth-token`, // Unique key per project ID to avoid multiple instance warnings
        detectSessionInUrl: true,
        flowType: 'pkce', // Use PKCE flow for better security
      },
      global: {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        fetch: (url, options = {}) => {
          // Add timeout and retry logic for fetch requests
          return fetch(url, {
            ...options,
            signal: AbortSignal.timeout(15000), // 15 second timeout
          }).catch((error) => {
            // Log fetch errors but don't crash the app
            if (error.name === 'AbortError') {
              console.warn('Supabase request timed out:', url);
            } else if (error.message === 'Failed to fetch') {
              console.warn('Supabase network error - check internet connection');
            } else {
              console.warn('Supabase fetch error:', error.message);
            }
            throw error;
          });
        },
      },
    });
    currentEnvironment = environment;
    
    return currentClient;
  } catch (error) {
    console.error('Failed to create Supabase client:', error);
    return null;
  }
}

/**
 * Execute a raw SQL query (requires service role key or appropriate permissions)
 */
export async function executeSQL(client: SupabaseClient, sql: string) {
  try {
    // Note: This requires the user to have appropriate database permissions
    // For setup scripts, it's better to run them directly in the Supabase SQL Editor
    const { data, error } = await client.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      throw error;
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('SQL execution error:', error);
    return { success: false, error };
  }
}

/**
 * Test the database connection
 */
export async function testConnection(client: SupabaseClient) {
  try {
    // Try to fetch from a simple query
    const { data, error } = await client
      .from('users')
      .select('count')
      .limit(1);
    
    // Check for "table doesn't exist" errors - this means connection works but DB needs setup
    if (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      const errorCode = error.code;
      
      // These are all variations of "table doesn't exist"
      if (
        errorCode === 'PGRST116' || 
        errorMessage.includes('could not find') ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('relation') ||
        errorMessage.includes('schema cache')
      ) {
        return { 
          success: true, 
          message: 'Connection successful! Database needs setup.',
          needsSetup: true 
        };
      }
      
      // Other errors mean actual connection problems
      throw error;
    }
    
    // If we get here, connection works and table exists
    return { success: true, message: 'Connection successful! Database is ready.' };
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Connection failed',
      error 
    };
  }
}

/**
 * Check if database tables exist
 */
export async function checkDatabaseSetup(client: SupabaseClient) {
  try {
    const tables = ['users', 'bills', 'bill_items', 'suppliers', 'subscriptions'];
    const results: Record<string, boolean> = {};
    
    for (const table of tables) {
      try {
        const { error } = await client
          .from(table)
          .select('count')
          .limit(1);
        
        // Table exists if there's no error OR the error is not "table doesn't exist"
        if (!error) {
          results[table] = true;
        } else {
          const errorMessage = error.message?.toLowerCase() || '';
          const errorCode = error.code;
          
          // Check if error is "table doesn't exist"
          const tableNotFound = 
            errorCode === 'PGRST116' || 
            errorMessage.includes('could not find') ||
            errorMessage.includes('does not exist') ||
            errorMessage.includes('relation') ||
            errorMessage.includes('schema cache');
          
          results[table] = !tableNotFound;
        }
      } catch {
        results[table] = false;
      }
    }
    
    const allTablesExist = Object.values(results).every(exists => exists);
    
    return {
      success: true,
      isSetup: allTablesExist,
      tables: results
    };
  } catch (error) {
    return {
      success: false,
      isSetup: false,
      error
    };
  }
}