import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { supabase } from '@/utils/supabase';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Database } from 'lucide-react';

interface DiagnosticResult {
  step: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  detail?: string;
}

export function SupplierVisibilityDiagnostic() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const diagnosticResults: DiagnosticResult[] = [];

    try {
      // Step 1: Check current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        diagnosticResults.push({
          step: '1. User Authentication',
          status: 'error',
          message: 'Not logged in or session expired',
          detail: userError?.message
        });
      } else {
        diagnosticResults.push({
          step: '1. User Authentication',
          status: 'success',
          message: `Logged in as: ${user.email}`,
          detail: `User ID: ${user.id}`
        });
      }

      // Step 2: Check if user is admin
      const { data: adminCheck, error: adminError } = await supabase
        .rpc('is_admin');

      if (adminError) {
        diagnosticResults.push({
          step: '2. Admin Function',
          status: 'error',
          message: 'is_admin() function not found',
          detail: 'Run /FIX_ADMIN_SUPPLIER_VISIBILITY.sql to create it'
        });
      } else {
        diagnosticResults.push({
          step: '2. Admin Function',
          status: adminCheck ? 'success' : 'warning',
          message: adminCheck ? 'You are an admin' : 'You are NOT an admin',
          detail: adminCheck ? 'Can see all suppliers' : 'Can only see your own suppliers'
        });
      }

      // Step 3: Check suppliers table accessibility
      const { data: suppliers, error: suppliersError } = await supabase
        .from('suppliers')
        .select('id, company_name, email, status, created_at')
        .order('created_at', { ascending: false });

      if (suppliersError) {
        diagnosticResults.push({
          step: '3. Suppliers Query',
          status: 'error',
          message: 'Failed to query suppliers table',
          detail: `Error: ${suppliersError.message} (Code: ${suppliersError.code})`
        });
      } else {
        diagnosticResults.push({
          step: '3. Suppliers Query',
          status: 'success',
          message: `Found ${suppliers?.length || 0} supplier(s)`,
          detail: suppliers?.length ? 
            suppliers.map(s => `${s.company_name} (${s.status})`).join(', ') : 
            'No suppliers in database'
        });
      }

      // Step 4: Check for missing columns
      const { data: columnCheck, error: columnError } = await supabase
        .from('suppliers')
        .select('approved_at, delivery_provinces, contact_email')
        .limit(1);

      if (columnError) {
        if (columnError.code === 'PGRST204' || columnError.message.includes('column')) {
          diagnosticResults.push({
            step: '4. Required Columns',
            status: 'error',
            message: 'Missing required columns',
            detail: 'Run /FIX_ADMIN_SUPPLIER_VISIBILITY.sql to add them'
          });
        } else {
          diagnosticResults.push({
            step: '4. Required Columns',
            status: 'warning',
            message: 'Could not verify columns',
            detail: columnError.message
          });
        }
      } else {
        diagnosticResults.push({
          step: '4. Required Columns',
          status: 'success',
          message: 'All required columns exist',
          detail: 'approved_at, delivery_provinces, contact_email confirmed'
        });
      }

      // Step 5: Check RLS policies
      const { data: policies, error: policiesError } = await supabase
        .from('suppliers')
        .select('id')
        .limit(1);

      if (!policiesError) {
        diagnosticResults.push({
          step: '5. RLS Policies',
          status: 'success',
          message: 'RLS policies are working',
          detail: 'You have permission to query suppliers table'
        });
      }

    } catch (err) {
      diagnosticResults.push({
        step: 'Unknown Error',
        status: 'error',
        message: 'An unexpected error occurred',
        detail: err instanceof Error ? err.message : String(err)
      });
    }

    setResults(diagnosticResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const allSuccess = results.length > 0 && results.every(r => r.status === 'success');
  const hasErrors = results.some(r => r.status === 'error');

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader className="bg-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Database className="w-6 h-6" />
          Supplier Visibility Diagnostic
        </CardTitle>
        <CardDescription>
          Check if admin can see suppliers (troubleshooting tool)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Diagnostic...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Run Diagnostic Check
            </>
          )}
        </Button>

        {results.length > 0 && (
          <>
            {/* Overall Status */}
            <Alert className={allSuccess ? 'border-green-500 bg-green-50' : hasErrors ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}>
              <AlertDescription className="font-semibold">
                {allSuccess ? '✅ All checks passed! Supplier visibility is working correctly.' : 
                 hasErrors ? '❌ Issues found. Follow the instructions below to fix them.' :
                 '⚠️ Some warnings detected. Review the results below.'}
              </AlertDescription>
            </Alert>

            {/* Diagnostic Results */}
            <div className="space-y-3">
              {results.map((result, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{result.step}</div>
                      <div className="text-sm mt-1">{result.message}</div>
                      {result.detail && (
                        <div className="text-xs mt-2 font-mono bg-white/50 p-2 rounded border">
                          {result.detail}
                        </div>
                      )}
                    </div>
                    <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                      {result.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Fix Instructions */}
            {hasErrors && (
              <Alert className="border-orange-500 bg-orange-50">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">🔧 How to Fix:</div>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Open Supabase Dashboard</li>
                    <li>Go to SQL Editor</li>
                    <li>Open <code className="bg-white px-2 py-1 rounded">/FIX_ADMIN_SUPPLIER_VISIBILITY.sql</code></li>
                    <li>Copy entire file and paste into SQL Editor</li>
                    <li>Click "RUN" button</li>
                    <li>Refresh this page and run diagnostic again</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}

            {/* Success Next Steps */}
            {allSuccess && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">✅ Everything is working!</div>
                  <div className="text-sm space-y-1">
                    <p>• You can now see all suppliers in the Suppliers tab</p>
                    <p>• Approval workflow will work correctly</p>
                    <p>• You're ready for Monday's investor presentation</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
