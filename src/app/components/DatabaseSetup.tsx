/**
 * Database Setup Component
 * 
 * Allows administrators to set up the Supabase database schema
 * for the Development environment.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import { Database, CheckCircle2, XCircle, AlertTriangle, Copy, ExternalLink, PlayCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getSupabaseClient, testConnection, checkDatabaseSetup } from '@/utils/supabase/client';
import type { Environment } from '@/utils/environment';

interface DatabaseSetupProps {
  environment: Environment;
}

export function DatabaseSetup({ environment }: DatabaseSetupProps) {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [connectionMessage, setConnectionMessage] = useState('');
  const [needsSetup, setNeedsSetup] = useState(false);
  const [setupStatus, setSetupStatus] = useState<any>(null);
  const [isCheckingSetup, setIsCheckingSetup] = useState(false);

  // API endpoint (for database connection)
  const supabaseApiUrl = environment === 'development' 
    ? 'https://zzdzrlglivtpawtitvgu.supabase.co' 
    : 'Not configured';
  
  // Dashboard URL (for opening in browser)
  const supabaseDashboardUrl = environment === 'development'
    ? 'https://supabase.com/dashboard/project/zzdzrlglivtpawtitvgu'
    : 'Not configured';

  // SQL setup script content
  const sqlSetupScript = `-- Run this script in Supabase SQL Editor to set up the database
-- Instructions:
-- 1. Open your Supabase dashboard: ${supabaseDashboardUrl}
-- 2. Navigate to: SQL Editor
-- 3. Create a new query
-- 4. Paste this entire script
-- 5. Click "Run" or press Ctrl+Enter

-- See full script in: /SUPABASE_SETUP_COMPLETE.sql`;

  const testDatabaseConnection = async () => {
    setConnectionStatus('testing');
    setConnectionMessage('Testing connection...');
    
    try {
      const client = getSupabaseClient(environment);
      
      if (!client) {
        setConnectionStatus('error');
        setConnectionMessage('Supabase is not enabled for this environment');
        toast.error('Supabase not enabled');
        return;
      }
      
      const result = await testConnection(client);
      
      if (result.success) {
        setConnectionStatus('success');
        setConnectionMessage(result.message);
        setNeedsSetup(result.needsSetup || false);
        toast.success('Connection successful!');
      } else {
        setConnectionStatus('error');
        setConnectionMessage(result.message);
        toast.error('Connection failed');
      }
    } catch (error: any) {
      setConnectionStatus('error');
      setConnectionMessage(error.message || 'Unknown error');
      toast.error('Connection test failed');
    }
  };

  const checkSetup = async () => {
    setIsCheckingSetup(true);
    
    try {
      const client = getSupabaseClient(environment);
      
      if (!client) {
        toast.error('Supabase not enabled');
        return;
      }
      
      const result = await checkDatabaseSetup(client);
      setSetupStatus(result);
      
      if (result.isSetup) {
        toast.success('Database is fully set up!');
      } else {
        toast.info('Database needs setup');
      }
    } catch (error: any) {
      toast.error('Failed to check setup status');
    } finally {
      setIsCheckingSetup(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const openSupabase = () => {
    window.open(supabaseDashboardUrl, '_blank');
  };

  const openSQLEditor = () => {
    window.open(`${supabaseDashboardUrl}/sql/new`, '_blank');
  };

  useEffect(() => {
    // Auto-test connection when component mounts
    if (environment === 'development') {
      testDatabaseConnection();
    }
  }, [environment]);

  if (environment !== 'development') {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Database Setup Not Available</AlertTitle>
        <AlertDescription>
          Database setup is only available in the Development environment.
          Current environment: <strong>{environment}</strong>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Development Database Setup
          </CardTitle>
          <CardDescription className="text-base">
            Set up the Supabase database schema for the Development environment
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {connectionStatus === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            {connectionStatus === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
            {connectionStatus === 'testing' && <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />}
            Connection Status
          </CardTitle>
          <CardDescription>Supabase database connection for Development environment</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Project URL</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-slate-100 px-3 py-2 rounded border font-mono">
                  {supabaseApiUrl}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(supabaseApiUrl, 'Project URL')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">Project ID</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-slate-100 px-3 py-2 rounded border font-mono">
                  zzdzrlglivtpawtitvgu
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard('zzdzrlglivtpawtitvgu', 'Project ID')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Connection Status Message */}
          {connectionStatus !== 'idle' && (
            <Alert className={
              connectionStatus === 'success' ? 'border-green-200 bg-green-50' :
              connectionStatus === 'error' ? 'border-red-200 bg-red-50' :
              'border-blue-200 bg-blue-50'
            }>
              {connectionStatus === 'success' && <CheckCircle2 className="h-4 w-4 text-green-600" />}
              {connectionStatus === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
              {connectionStatus === 'testing' && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />}
              <AlertTitle>
                {connectionStatus === 'success' && 'Connected'}
                {connectionStatus === 'error' && 'Connection Failed'}
                {connectionStatus === 'testing' && 'Testing Connection...'}
              </AlertTitle>
              <AlertDescription>{connectionMessage}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={testDatabaseConnection} disabled={connectionStatus === 'testing'}>
              {connectionStatus === 'testing' ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Test Connection
                </>
              )}
            </Button>
            <Button variant="outline" onClick={checkSetup} disabled={isCheckingSetup}>
              {isCheckingSetup ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Check Setup Status
                </>
              )}
            </Button>
            <Button variant="outline" onClick={openSupabase}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Supabase Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Setup Status */}
      {setupStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {setupStatus.isSetup ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              )}
              Database Setup Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(setupStatus.tables || {}).map(([table, exists]) => (
                <div key={table} className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="font-medium text-slate-700">{table}</span>
                  {exists ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Created</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-600">
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Missing</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Instructions */}
      {(needsSetup || !setupStatus?.isSetup) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-blue-600" />
              Run Database Setup Script
            </CardTitle>
            <CardDescription>
              Follow these steps to set up your Supabase database schema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Step-by-step instructions */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900">Step-by-Step Instructions:</h4>
              <ol className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    1
                  </span>
                  <span>Open the Supabase SQL Editor (click button below)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    2
                  </span>
                  <span>Click "New query" to create a new SQL query</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    3
                  </span>
                  <span>Copy the SQL script from <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">/SUPABASE_SETUP_COMPLETE.sql</code></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    4
                  </span>
                  <span>Paste the entire script into the SQL Editor</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    5
                  </span>
                  <span>Click "Run" or press Ctrl+Enter to execute the script</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 font-semibold text-xs shrink-0">
                    6
                  </span>
                  <span>Return here and click "Check Setup Status" to verify</span>
                </li>
              </ol>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                onClick={openSQLEditor} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open SQL Editor
              </Button>
              <Button 
                variant="outline"
                onClick={() => copyToClipboard(sqlSetupScript, 'SQL instructions')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Instructions
              </Button>
            </div>

            {/* Alert */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                The complete SQL setup script is located in the file <code className="text-xs bg-white px-1 py-0.5 rounded">/SUPABASE_SETUP_COMPLETE.sql</code> in your project root.
                You need to copy and run this script in the Supabase SQL Editor to create all tables, indexes, and security policies.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {setupStatus?.isSetup && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Database Setup Complete!</AlertTitle>
          <AlertDescription>
            All required database tables have been created. Your Development environment is ready to use.
          </AlertDescription>
        </Alert>
      )}

      {/* What Gets Created */}
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Overview</CardTitle>
          <CardDescription>
            Tables and features created by the setup script
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                Core Tables
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  users - User accounts and profiles
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  bills - BOQ projects and bills
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  bill_items - Line items in BOQ
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  suppliers - Supplier database
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  subscriptions - Payment tracking
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Features Enabled
              </h4>
              <ul className="space-y-1 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Row Level Security (RLS)
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  User data isolation
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Optimized indexes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  Cascade deletes
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                  UUID primary keys
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}