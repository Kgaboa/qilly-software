import { useState } from 'react';
import { getCurrentEnvironment, getEnvironmentConfig, getEnvironmentDisplay } from '@/utils/environment';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, X, ChevronDown, ChevronUp, Database, Settings, Info } from 'lucide-react';

/**
 * Environment Debug Banner
 * 
 * Shows environment detection info at the top of the page.
 * Useful for debugging environment issues in deployed apps.
 * 
 * Usage: Add to App.tsx: <EnvironmentDebugBanner />
 */
export function EnvironmentDebugBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  
  const env = getCurrentEnvironment();
  const config = getEnvironmentConfig();
  const display = getEnvironmentDisplay();
  
  // Get environment variables for debugging
  const viteEnv = import.meta.env.VITE_ENVIRONMENT;
  const mode = import.meta.env.MODE;
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const localStorageEnv = localStorage.getItem('qilly_environment');
  
  // Determine if there's an environment mismatch
  const hasMismatch = 
    (viteEnv && viteEnv !== env) || 
    (localStorageEnv && localStorageEnv !== env) ||
    (!viteEnv && mode === 'production' && env !== 'production');
  
  if (isDismissed) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 shadow-lg">
      <Card className={`rounded-none border-b-4 ${
        hasMismatch 
          ? 'bg-red-50 border-red-500' 
          : config.environment === 'development'
            ? 'bg-blue-50 border-blue-500'
            : config.environment === 'sit'
              ? 'bg-gray-50 border-gray-500'
              : config.environment === 'uat'
                ? 'bg-orange-50 border-orange-500'
                : config.environment === 'preprod'
                  ? 'bg-cyan-50 border-cyan-500'
                  : 'bg-green-50 border-green-500'
      }`}>
        <CardContent className="py-3 px-4">
          {/* Compact View */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {hasMismatch && <AlertTriangle className="w-5 h-5 text-red-600" />}
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {display.icon} Environment:
                </span>
                <Badge className={`${
                  config.environment === 'development' ? 'bg-blue-600' :
                  config.environment === 'sit' ? 'bg-gray-600' :
                  config.environment === 'uat' ? 'bg-orange-600' :
                  config.environment === 'preprod' ? 'bg-cyan-600' :
                  'bg-green-600'
                } text-white`}>
                  {display.name}
                </Badge>
              </div>
              
              {/* Quick Info */}
              <div className="hidden md:flex items-center gap-4 text-xs text-gray-700">
                <div className="flex items-center gap-1">
                  <Database className="w-3 h-3" />
                  <span>
                    {supabaseUrl?.includes('kcptusoevqapcvptlgkd') ? 'SIT DB' :
                     supabaseUrl?.includes('zzdzrlglivtpawtitvgu') ? 'DEV DB' :
                     'Unknown DB'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  <span>MODE: {mode}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-7 px-2 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-3 h-3 mr-1" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3 h-3 mr-1" />
                    Show Details
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDismissed(true)}
                className="h-7 w-7 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Expanded View */}
          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-gray-300 space-y-3">
              {/* Warning if mismatch */}
              {hasMismatch && (
                <div className="bg-red-100 border border-red-300 rounded p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900 mb-1">
                        Environment Mismatch Detected!
                      </div>
                      <div className="text-red-800 space-y-1">
                        {!viteEnv && mode === 'production' && (
                          <div>
                            • VITE_ENVIRONMENT is not set in Vercel. Set it to <code className="bg-red-200 px-1 rounded">sit</code> in environment variables.
                          </div>
                        )}
                        {localStorageEnv && localStorageEnv !== env && (
                          <div>
                            • localStorage override detected: <code className="bg-red-200 px-1 rounded">{localStorageEnv}</code>
                            <br />
                            <button 
                              onClick={() => {
                                localStorage.removeItem('qilly_environment');
                                window.location.reload();
                              }}
                              className="mt-1 text-xs underline hover:no-underline"
                            >
                              Click here to clear and reload
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Environment Detection Details */}
              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-semibold mb-2 flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Environment Detection
                  </div>
                  <div className="space-y-1 pl-5">
                    <div className="flex justify-between">
                      <span className="text-gray-600">VITE_ENVIRONMENT:</span>
                      <code className={`${viteEnv ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-0.5 rounded`}>
                        {viteEnv || 'undefined'}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Build MODE:</span>
                      <code className="bg-gray-100 px-2 py-0.5 rounded">{mode}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">localStorage:</span>
                      <code className={`${localStorageEnv ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'} px-2 py-0.5 rounded`}>
                        {localStorageEnv || 'none'}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Detected as:</span>
                      <code className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                        {env}
                      </code>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="font-semibold mb-2 flex items-center gap-1">
                    <Database className="w-4 h-4" />
                    Database Connection
                  </div>
                  <div className="space-y-1 pl-5">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Supabase URL:</span>
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                        {supabaseUrl?.split('.')[0].replace('https://', '') || 'undefined'}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database:</span>
                      <code className={`px-2 py-0.5 rounded ${
                        supabaseUrl?.includes('kcptusoevqapcvptlgkd') ? 'bg-green-100 text-green-800' :
                        supabaseUrl?.includes('zzdzrlglivtpawtitvgu') ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {supabaseUrl?.includes('kcptusoevqapcvptlgkd') ? 'SIT' :
                         supabaseUrl?.includes('zzdzrlglivtpawtitvgu') ? 'DEV' :
                         'Unknown'}
                      </code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">API URL:</span>
                      <code className="bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                        {config.apiUrl || 'localStorage'}
                      </code>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Feature Flags */}
              <div>
                <div className="font-semibold mb-2 text-xs flex items-center gap-1">
                  <Settings className="w-4 h-4" />
                  Feature Flags
                </div>
                <div className="flex flex-wrap gap-2 pl-5">
                  <Badge variant={config.showDevTools ? 'default' : 'outline'} className="text-xs">
                    Dev Tools: {config.showDevTools ? 'Visible' : 'Hidden'}
                  </Badge>
                  <Badge variant={config.showTestingTabs ? 'default' : 'outline'} className="text-xs">
                    Testing Tabs: {config.showTestingTabs ? 'Visible' : 'Hidden'}
                  </Badge>
                  <Badge variant={config.enableDebugMode ? 'default' : 'outline'} className="text-xs">
                    Debug Mode: {config.enableDebugMode ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 pt-2 border-t border-gray-300">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('🔍 ENVIRONMENT DEBUG INFO');
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                    console.log('Environment:', env);
                    console.log('VITE_ENVIRONMENT:', viteEnv);
                    console.log('MODE:', mode);
                    console.log('Supabase URL:', supabaseUrl);
                    console.log('localStorage:', localStorageEnv);
                    console.log('Config:', config);
                    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                  }}
                  className="text-xs h-7"
                >
                  Log to Console
                </Button>
                
                {localStorageEnv && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (confirm('Clear localStorage environment override and reload?')) {
                        localStorage.removeItem('qilly_environment');
                        window.location.reload();
                      }
                    }}
                    className="text-xs h-7"
                  >
                    Clear localStorage Override
                  </Button>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
