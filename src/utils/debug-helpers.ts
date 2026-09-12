/**
 * Debug Helper Functions
 * Utilities for troubleshooting Qilly in development
 */

import { getCurrentEnvironment, setEnvironment, getEnvironmentConfig } from './environment';
import { getSupabaseClient } from './supabase/client';
import { getSupabaseConfig } from './supabase/info';

/**
 * Diagnose Supabase connection issues
 */
export function diagnoseSupabase() {
  console.log('\n🔍 SUPABASE DIAGNOSTICS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // 1. Check current environment
  const currentEnv = getCurrentEnvironment();
  console.log(`📍 Current Environment: ${currentEnv.toUpperCase()}`);
  
  // 2. Check environment config
  const envConfig = getEnvironmentConfig();
  console.log(`🔧 useRealDatabase: ${envConfig.useRealDatabase}`);
  
  // 3. Check Supabase config for current env
  const supabaseConfig = getSupabaseConfig(currentEnv);
  console.log(`\n⚙️ Supabase Config for ${currentEnv}:`);
  console.log(`   Enabled: ${supabaseConfig.enabled ? '✅' : '❌'}`);
  console.log(`   Project URL: ${supabaseConfig.projectUrl}`);
  console.log(`   Project ID: ${supabaseConfig.projectId}`);
  
  // 4. Try to get client
  console.log(`\n🔌 Testing Supabase Client...`);
  const client = getSupabaseClient(currentEnv);
  
  if (client) {
    console.log('✅ Client created successfully!');
    console.log('   URL:', client.supabaseUrl);
  } else {
    console.log('❌ Client creation failed!');
    console.log('💡 SOLUTION: Switch to development environment');
    console.log('   Run: switchToDevEnvironment()');
  }
  
  // 5. Check localStorage
  console.log(`\n💾 localStorage Check:`);
  const localStorageEnv = localStorage.getItem('qilly_environment');
  console.log(`   qilly_environment: ${localStorageEnv || '(not set - using default)'}`);
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Recommendations
  console.log('📋 RECOMMENDATIONS:\n');
  
  if (!supabaseConfig.enabled) {
    console.log('❌ Current environment has Supabase DISABLED');
    console.log('✅ Run: switchToDevEnvironment()');
  } else if (client) {
    console.log('✅ Everything looks good! Supabase is connected.');
  } else {
    console.log('⚠️ Something went wrong. Check console errors above.');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

/**
 * Quick fix: Switch to development environment
 */
export function switchToDevEnvironment() {
  console.log('🔄 Switching to DEVELOPMENT environment...');
  setEnvironment('development');
}

/**
 * Check all environments and their Supabase status
 */
export function checkAllEnvironments() {
  console.log('\n📊 ALL ENVIRONMENTS STATUS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const environments: Array<'development' | 'staging' | 'production' | 'demo'> = 
    ['development', 'staging', 'production', 'demo'];
  
  environments.forEach(env => {
    const config = getSupabaseConfig(env);
    const status = config.enabled ? '✅' : '❌';
    console.log(`${status} ${env.toUpperCase().padEnd(15)} - ${config.enabled ? 'Enabled' : 'Disabled'}`);
    if (config.enabled) {
      console.log(`   └─ ${config.projectUrl}`);
    }
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('💡 TIP: Only DEVELOPMENT is currently configured\n');
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...\n');
  
  const env = getCurrentEnvironment();
  const client = getSupabaseClient(env);
  
  if (!client) {
    console.log('❌ No client available');
    console.log('💡 Run: switchToDevEnvironment()');
    return;
  }
  
  try {
    // Try a simple query
    const { data, error } = await client
      .from('suppliers')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.log('⚠️ Connection OK, but table doesn\'t exist yet');
        console.log('💡 You may need to run database setup SQL');
      } else {
        console.log('❌ Connection error:', error.message);
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Database is ready to use');
    }
  } catch (error) {
    console.log('❌ Connection failed:', error);
  }
}

// Make functions available globally in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  (window as any).diagnoseSupabase = diagnoseSupabase;
  (window as any).switchToDevEnvironment = switchToDevEnvironment;
  (window as any).checkAllEnvironments = checkAllEnvironments;
  (window as any).testSupabaseConnection = testSupabaseConnection;
  
  console.log('🛠️ Debug helpers loaded! Available commands:');
  console.log('   diagnoseSupabase() - Full diagnostic report');
  console.log('   switchToDevEnvironment() - Fix environment issues');
  console.log('   checkAllEnvironments() - View all env configs');
  console.log('   testSupabaseConnection() - Test database connection');
}
