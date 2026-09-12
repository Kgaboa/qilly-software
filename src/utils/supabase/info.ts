/**
 * Supabase Configuration
 * 
 * This file contains the Supabase project credentials for different environments.
 * The configuration automatically switches based on the selected environment.
 */

export type Environment = 'demo' | 'development' | 'sit' | 'uat' | 'preprod' | 'production';

// Environment-specific Supabase configurations
export const supabaseConfigs = {
  demo: {
    projectUrl: 'demo-placeholder',
    projectId: 'demo-placeholder',
    anonKey: 'demo-placeholder-key',
    enabled: false // No real connection in demo mode
  },
  development: {
    projectUrl: 'https://zzdzrlglivtpawtitvgu.supabase.co',
    projectId: 'zzdzrlglivtpawtitvgu',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6ZHpybGdsaXZ0cGF3dGl0dmd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5MTQwMjcsImV4cCI6MjA4NjQ5MDAyN30.UL45C5S7SDnjk--WxGrERukNEldPkAxQKavGRkI65yc',
    enabled: true
  },
  sit: {
    projectUrl: 'https://kcptusoevqapcvptlgkd.supabase.co',
    projectId: 'kcptusoevqapcvptlgkd',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjcHR1c29ldnFhcGN2cHRsZ2tkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIwMTA4NTAsImV4cCI6MjA4NzU4Njg1MH0.VCSkMR_EIvqFHjGzqkSiH_ANrzRiyFWvPEI3--T2YwY',
    enabled: true // ✅ SIT environment with direct database access
  },
  uat: {
    projectUrl: 'uat-placeholder',
    projectId: 'uat-placeholder',
    anonKey: 'uat-placeholder-key',
    enabled: false // Configure when UAT environment is ready
  },
  preprod: {
    projectUrl: 'preprod-placeholder',
    projectId: 'preprod-placeholder',
    anonKey: 'preprod-placeholder-key',
    enabled: false // Configure when preprod environment is ready
  },
  production: {
    projectUrl: 'production-placeholder',
    projectId: 'production-placeholder',
    anonKey: 'production-placeholder-key',
    enabled: false // Configure when production environment is ready
  }
};

/**
 * Get Supabase configuration for the current environment
 */
export function getSupabaseConfig(environment: Environment) {
  return supabaseConfigs[environment];
}

// Get current environment's config dynamically
import { getCurrentEnvironment } from '../environment';

/**
 * Get current project ID based on environment
 */
export function getProjectId(): string {
  const env = getCurrentEnvironment();
  return supabaseConfigs[env].projectId;
}

/**
 * Get current anon key based on environment
 */
export function getAnonKey(): string {
  const env = getCurrentEnvironment();
  return supabaseConfigs[env].anonKey;
}

// Legacy exports for backward compatibility
// These now use functions to get environment-aware values
export const projectId = getProjectId();
export const publicAnonKey = getAnonKey();