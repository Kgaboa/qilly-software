/**
 * Environment Configuration
 * Controls which features/tabs are available in different environments
 * 
 * ⚡ FIGMA MAKE DEFAULT: This app defaults to DEVELOPMENT environment
 * 
 * Environment Priority Order:
 * 1. localStorage override (manual switch via Environment Switcher)
 * 2. URL parameter (?env=sit)
 * 3. VITE_ENVIRONMENT variable (set in Vercel/deployment)
 * 4. Build mode (vite --mode sit)
 * 5. Vite DEV mode (localhost)
 * 6. **DEFAULT: 'development'** ← Figma Make starts here
 * 
 * To switch to SIT before deployment:
 * - Use the Environment Switcher in Admin Dashboard → Dev Tools tab
 * - Or add ?env=sit to the URL
 * - Or set localStorage: localStorage.setItem('qilly_environment', 'sit')
 */

export type Environment = 'development' | 'sit' | 'uat' | 'preprod' | 'production' | 'demo';

export interface EnvironmentConfig {
  environment: Environment;
  isDevelopment: boolean;
  isSIT: boolean;
  isUAT: boolean;
  isPreprod: boolean;
  isProduction: boolean;
  isDemo: boolean;
  showDevTools: boolean;
  showTestingTabs: boolean;
  useRealDatabase: boolean;
  enableDebugMode: boolean;
  apiUrl: string;
}

// Track if we've already logged the environment
let hasLoggedEnvironment = false;

/**
 * Get current environment from various sources
 * Priority: localStorage override > URL param > environment variable > build mode > default
 */
export function getCurrentEnvironment(): Environment {
  // 1. Check localStorage override (for demo/testing purposes)
  const localStorageEnv = localStorage.getItem('qilly_environment') as Environment;
  if (localStorageEnv && ['development', 'sit', 'uat', 'preprod', 'production', 'demo'].includes(localStorageEnv)) {
    if (!hasLoggedEnvironment) {
      console.log(`🔧 Using environment from localStorage: ${localStorageEnv.toUpperCase()}`);
      hasLoggedEnvironment = true;
    }
    return localStorageEnv;
  }

  // 2. Check URL parameter (?env=sit)
  const urlParams = new URLSearchParams(window.location.search);
  const urlEnv = urlParams.get('env') as Environment;
  if (urlEnv && ['development', 'sit', 'uat', 'preprod', 'production', 'demo'].includes(urlEnv)) {
    if (!hasLoggedEnvironment) {
      console.log(`🔧 Using environment from URL: ${urlEnv.toUpperCase()}`);
      hasLoggedEnvironment = true;
    }
    return urlEnv;
  }

  // 3. Check VITE_ENVIRONMENT environment variable (set in Vercel/build)
  // This is the PRIMARY way to set environment in deployed apps
  const viteEnv = import.meta.env.VITE_ENVIRONMENT as Environment;
  
  // Debug logging
  if (!hasLoggedEnvironment) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 QILLY ENVIRONMENT DETECTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  VITE_ENVIRONMENT:', import.meta.env.VITE_ENVIRONMENT || 'undefined');
    console.log('  MODE:', import.meta.env.MODE);
    console.log('  DEV:', import.meta.env.DEV);
    console.log('  PROD:', import.meta.env.PROD);
    console.log('  📌 Using hardcoded Supabase configs from info.ts (not env vars)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }
  
  if (viteEnv && ['development', 'sit', 'uat', 'preprod', 'production', 'demo'].includes(viteEnv)) {
    if (!hasLoggedEnvironment) {
      console.log(`🌍 Using environment from VITE_ENVIRONMENT: ${viteEnv.toUpperCase()}`);
      hasLoggedEnvironment = true;
    }
    return viteEnv;
  }

  // 4. Check build mode ONLY for specific non-production modes
  // DO NOT use MODE=production as it's the default Vite build mode
  const buildEnv = import.meta.env.MODE;
  if (buildEnv === 'sit') {
    if (!hasLoggedEnvironment) {
      console.log('🔍 Using SIT environment from build mode');
      hasLoggedEnvironment = true;
    }
    return 'sit';
  }
  if (buildEnv === 'uat') {
    if (!hasLoggedEnvironment) {
      console.log('🧪 Using UAT environment from build mode');
      hasLoggedEnvironment = true;
    }
    return 'uat';
  }
  if (buildEnv === 'preprod') {
    if (!hasLoggedEnvironment) {
      console.log('🔬 Using PREPROD environment from build mode');
      hasLoggedEnvironment = true;
    }
    return 'preprod';
  }
  if (buildEnv === 'staging') {
    if (!hasLoggedEnvironment) {
      console.log('🚧 Using STAGING environment (legacy - maps to SIT)');
      hasLoggedEnvironment = true;
    }
    return 'sit'; // Map legacy 'staging' to 'sit'
  }
  
  // 5. Check if running in actual Vite dev mode (localhost)
  if (import.meta.env.DEV) {
    if (!hasLoggedEnvironment) {
      console.log('🔧 Using DEVELOPMENT environment (local dev mode)');
      hasLoggedEnvironment = true;
    }
    return 'development';
  }
  
  // 6. Final fallback: default to development (where all real data lives)
  const defaultEnv: Environment = 'development';

  if (!hasLoggedEnvironment) {
    console.log('🔧 Defaulting to DEVELOPMENT environment');
    hasLoggedEnvironment = true;
  }
  return defaultEnv;
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = getCurrentEnvironment();

  const config: EnvironmentConfig = {
    environment,
    isDevelopment: environment === 'development',
    isSIT: environment === 'sit',
    isUAT: environment === 'uat',
    isPreprod: environment === 'preprod',
    isProduction: environment === 'production',
    isDemo: environment === 'demo',
    
    // Feature flags based on environment
    showDevTools: environment === 'development' || environment === 'demo',
    showTestingTabs: environment !== 'production',
    useRealDatabase: environment !== 'demo', // All environments except demo use real DB
    enableDebugMode: environment === 'development' || environment === 'demo',
    
    // API URLs per environment
    apiUrl: getApiUrl(environment),
  };

  return config;
}

function getApiUrl(env: Environment): string {
  switch (env) {
    case 'production':
      return 'https://qilly.co.za/api';
    case 'preprod':
      return 'https://preprod.qilly.co.za/api';
    case 'uat':
      return 'https://uat.qilly.co.za/api';
    case 'sit':
      return 'https://sit.qilly.co.za/api';
    case 'development':
      return 'http://localhost:5173/api';
    case 'demo':
    default:
      return ''; // Uses localStorage in demo mode
  }
}

/**
 * Set environment manually (for testing)
 * Persists to localStorage and reloads page
 */
export function setEnvironment(env: Environment) {
  localStorage.setItem('qilly_environment', env);
  console.log(`🔄 Environment set to: ${env.toUpperCase()}`);
  console.log('Page will reload in 1 second...');
  setTimeout(() => window.location.reload(), 1000);
}

/**
 * Clear environment override (return to default)
 */
export function clearEnvironmentOverride() {
  localStorage.removeItem('qilly_environment');
  console.log('🔄 Environment override cleared');
  console.log('Page will reload in 1 second...');
  setTimeout(() => window.location.reload(), 1000);
}

/**
 * Legacy function for backward compatibility
 * Checks if we should use production mode
 */
export function isLikelyProduction(): boolean {
  const config = getEnvironmentConfig();
  return config.useRealDatabase;
}

/**
 * Check if specific feature is enabled
 */
export function isFeatureEnabled(feature: string): boolean {
  const config = getEnvironmentConfig();
  
  const featureFlags: Record<string, boolean> = {
    'dev-tools': config.showDevTools,
    'testing-tabs': config.showTestingTabs,
    'debug-mode': config.enableDebugMode,
    'real-database': config.useRealDatabase,
    'console-logs': config.isDevelopment || config.isDemo,
    'error-details': config.isDevelopment || config.isDemo,
    'admin-override': config.isDevelopment || config.isDemo,
  };

  return featureFlags[feature] ?? false;
}

/**
 * Get environment display info
 */
export function getEnvironmentDisplay(): {
  environment: Environment;
  name: string;
  color: string;
  icon: string;
  description: string;
} {
  const env = getCurrentEnvironment();
  
  const displays = {
    development: {
      environment: env,
      name: 'Development',
      color: 'bg-blue-500',
      icon: '🔧',
      description: 'Full access to all testing tools',
    },
    sit: {
      environment: env,
      name: 'SIT',
      color: 'bg-gray-500',
      icon: '🔍',
      description: 'System Integration Testing environment',
    },
    uat: {
      environment: env,
      name: 'UAT',
      color: 'bg-orange-500',
      icon: '🧪',
      description: 'User Acceptance Testing environment',
    },
    preprod: {
      environment: env,
      name: 'Preprod',
      color: 'bg-cyan-500',
      icon: '🔬',
      description: 'Pre-production testing environment',
    },
    production: {
      environment: env,
      name: 'Production',
      color: 'bg-green-500',
      icon: '🚀',
      description: 'Live production environment',
    },
    demo: {
      environment: env,
      name: 'Demo',
      color: 'bg-purple-500',
      icon: '🎮',
      description: 'Demo mode with localStorage',
    },
  };

  return displays[env];
}

/**
 * Console helper that only logs in allowed environments
 */
export const envLog = {
  info: (...args: any[]) => {
    if (isFeatureEnabled('console-logs')) {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (isFeatureEnabled('console-logs')) {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args); // Always log errors
  },
  debug: (...args: any[]) => {
    if (isFeatureEnabled('debug-mode')) {
      console.log('[DEBUG]', ...args);
    }
  },
};