import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { getCurrentEnvironment, getEnvironmentConfig } from '@/utils/environment';
import { getSupabaseConfig } from '@/utils/supabase/info';

/**
 * Environment Debug Component
 * Shows detailed information about environment detection
 */
export function EnvironmentDebug() {
  const currentEnv = getCurrentEnvironment();
  const envConfig = getEnvironmentConfig();
  const supabaseConfig = getSupabaseConfig(currentEnv);

  // Get all Vite environment variables
  const viteVars = import.meta.env;

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          This component helps debug environment detection issues. Use it to verify that Vercel environment variables are working correctly.
        </AlertDescription>
      </Alert>

      {/* Current Environment */}
      <Card>
        <CardHeader>
          <CardTitle>Current Environment Detection</CardTitle>
          <CardDescription>How the system determined the current environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong className="text-lg">Detected Environment:</strong>
            <div className="mt-2">
              <Badge className="text-lg px-4 py-2">
                {currentEnv.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Detection Priority */}
          <div className="bg-blue-50 border border-blue-200 rounded p-4">
            <strong className="text-blue-900">Detection Priority Order:</strong>
            <ol className="mt-2 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold">1.</span>
                <div>
                  <strong>localStorage override:</strong>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                    {localStorage.getItem('qilly_environment') || '(not set)'}
                  </code>
                  {localStorage.getItem('qilly_environment') && (
                    <span className="ml-2 text-orange-600">⚠️ OVERRIDING!</span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold">2.</span>
                <div>
                  <strong>URL parameter (?env=...):</strong>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                    {new URLSearchParams(window.location.search).get('env') || '(not set)'}
                  </code>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold">3.</span>
                <div>
                  <strong>VITE_ENVIRONMENT variable:</strong>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                    {viteVars.VITE_ENVIRONMENT || '(not set)'}
                  </code>
                  {!viteVars.VITE_ENVIRONMENT && (
                    <span className="ml-2 text-red-600">❌ NOT SET IN VERCEL!</span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold">4.</span>
                <div>
                  <strong>Vite MODE (build mode):</strong>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                    {viteVars.MODE}
                  </code>
                  {viteVars.MODE === 'production' && !viteVars.VITE_ENVIRONMENT && (
                    <span className="ml-2 text-orange-600">
                      ⚠️ This is causing the "PRODUCTION" message!
                    </span>
                  )}
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold">5.</span>
                <div>
                  <strong>Default:</strong>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                    development
                  </code>
                </div>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Supabase Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Supabase Configuration</CardTitle>
          <CardDescription>Database connection for {currentEnv}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <strong>Project URL:</strong>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                {supabaseConfig.projectUrl}
              </code>
            </div>
            <div>
              <strong>Project ID:</strong>
              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">
                {supabaseConfig.projectId}
              </code>
            </div>
            <div>
              <strong>Enabled:</strong>
              {supabaseConfig.enabled ? (
                <Badge className="ml-2 bg-green-600">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Yes
                </Badge>
              ) : (
                <Badge className="ml-2 bg-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  No
                </Badge>
              )}
            </div>
          </div>

          {!supabaseConfig.enabled && (
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong className="text-red-900">Supabase not configured for {currentEnv}!</strong>
                <p className="mt-2">
                  This environment's Supabase configuration is not enabled. 
                  Please configure it in <code>/src/utils/supabase/info.ts</code>
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>What's enabled in {currentEnv}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              {envConfig.showDevTools ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Dev Tools: {envConfig.showDevTools ? 'Visible' : 'Hidden'}</span>
            </div>
            <div className="flex items-center gap-2">
              {envConfig.showTestingTabs ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Testing Tabs: {envConfig.showTestingTabs ? 'Visible' : 'Hidden'}</span>
            </div>
            <div className="flex items-center gap-2">
              {envConfig.enableDebugMode ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Debug Mode: {envConfig.enableDebugMode ? 'Enabled' : 'Disabled'}</span>
            </div>
            <div className="flex items-center gap-2">
              {envConfig.useRealDatabase ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span>Database: {envConfig.useRealDatabase ? 'Real (Supabase)' : 'localStorage'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Vite Variables */}
      <Card>
        <CardHeader>
          <CardTitle>All Vite Environment Variables</CardTitle>
          <CardDescription>Complete list of variables Vite can see</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-xs overflow-x-auto">
            <pre>{JSON.stringify(viteVars, null, 2)}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Diagnosis */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle>🔍 Diagnosis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Check 1: localStorage override */}
          {localStorage.getItem('qilly_environment') && (
            <Alert className="bg-orange-50 border-orange-300">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription>
                <strong className="text-orange-900">localStorage Override Detected!</strong>
                <p className="mt-2">
                  Your browser has an environment override set. This takes priority over all other settings.
                </p>
                <p className="mt-2">
                  <strong>Fix:</strong> Go to Settings tab and click "Reset to Default Environment"
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Check 2: VITE_ENVIRONMENT not set */}
          {!localStorage.getItem('qilly_environment') && !viteVars.VITE_ENVIRONMENT && viteVars.MODE === 'production' && (
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong className="text-red-900">VITE_ENVIRONMENT Not Set!</strong>
                <p className="mt-2">
                  The app is built in production mode, but VITE_ENVIRONMENT is not set in Vercel.
                </p>
                <p className="mt-2">
                  <strong>Fix:</strong>
                  <ol className="list-decimal list-inside mt-1 space-y-1">
                    <li>Go to Vercel project settings</li>
                    <li>Navigate to Environment Variables</li>
                    <li>Add: VITE_ENVIRONMENT = sit</li>
                    <li>Check all environments (Production, Preview, Development)</li>
                    <li>Redeploy</li>
                  </ol>
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Check 3: Supabase config not enabled */}
          {!supabaseConfig.enabled && (
            <Alert className="bg-red-50 border-red-300">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription>
                <strong className="text-red-900">Supabase Not Configured for {currentEnv}!</strong>
                <p className="mt-2">
                  The Supabase configuration for {currentEnv} environment is not enabled.
                </p>
                <p className="mt-2">
                  <strong>Fix:</strong> Update <code>/src/utils/supabase/info.ts</code> to enable this environment,
                  or change VITE_ENVIRONMENT to an enabled environment (development or sit).
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Check 4: Everything looks good */}
          {!localStorage.getItem('qilly_environment') && supabaseConfig.enabled && viteVars.VITE_ENVIRONMENT && (
            <Alert className="bg-green-50 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <strong className="text-green-900">✅ Environment Detection Working Correctly!</strong>
                <p className="mt-2">
                  The system is correctly detecting the <strong>{currentEnv}</strong> environment
                  from VITE_ENVIRONMENT and Supabase is properly configured.
                </p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
