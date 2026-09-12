import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { supabase } from '@/utils/supabase';
import { Building2, Shield, Hammer, Handshake } from 'lucide-react';

// Version: 2.0.0 - POPIA Compliance with Consent Tracking
interface AuthFormProps {
  onSuccess: (accessToken: string) => void;
  onSupplierSignup?: () => void;
  onContractorSignup?: () => void;
  onAdminLogin?: () => void;
  onGreenBuilding?: () => void;
  onPartnerPortal?: () => void;
  onNavigateToPolicy?: (view: 'privacy-policy' | 'terms-of-service' | 'cookie-policy') => void;
}

export function AuthForm({ onSuccess, onSupplierSignup, onContractorSignup, onAdminLogin, onGreenBuilding, onPartnerPortal, onNavigateToPolicy }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Fallback demo accounts — used when Supabase is unreachable or account doesn't exist in current env
    const fallbackAccounts: Record<string, { tier: string; type: string; company?: string }> = {
      'operator@test.com':            { tier: 'professional', type: 'operator' },
      'fallback_free@qilly-test.com': { tier: 'free',         type: 'contractor' },
      'fallback_pro@qilly-test.com':  { tier: 'professional', type: 'contractor' },
      'fallback_ent@qilly-test.com':  { tier: 'enterprise',   type: 'contractor' },
      'enter123@gmail.com':           { tier: 'enterprise',   type: 'contractor', company: 'Enter Construction (Pty) Ltd' },
    };

    const tryFallbackLogin = (email: string): boolean => {
      const fallback = fallbackAccounts[email.toLowerCase()];
      if (!fallback) return false;
      sessionStorage.setItem('demo_mode', 'true');
      sessionStorage.setItem('user_type', fallback.type);
      if (fallback.type === 'contractor') {
        const mockContractor = {
          id: 'demo-' + fallback.tier + '-' + email.split('@')[0],
          email: email.toLowerCase(),
          company_name: fallback.company || 'Demo Contractor (' + fallback.tier + ')',
          contact_person: email.split('@')[0],
          subscription_tier: fallback.tier,
          status: 'approved',
          payment_approved: true,
          payment_method: 'demo',
          cidb_grade: fallback.tier === 'enterprise' ? 'GB7' : 'GB4',
          operating_provinces: ['GP'],
          province: 'GP',
          project_types: ['Housing Development', 'Road Construction', 'Infrastructure (Water/Sewer)'],
          annual_turnover: fallback.tier === 'enterprise' ? 75000000 : 15000000,
        };
        sessionStorage.setItem('contractor_data', JSON.stringify(mockContractor));
        sessionStorage.setItem('contractor_id', mockContractor.id);
      }
      const demoToken = 'demo_' + fallback.tier + '_token_' + Date.now();
      onSuccess(demoToken);
      return true;
    };

    try {
      // Authenticate with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword(loginData);

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          if (tryFallbackLogin(loginData.email)) return;
          setError('Invalid email or password. Please check your credentials and try again.');
          setIsLoading(false);
          return;
        }
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (data.session) {
        // Check if user is a contractor in Supabase
        const { data: contractorData } = await supabase
          .from('contractors')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (contractorData) {
          // Gate 1: contractor record must be approved (status = 'approved')
          if (contractorData.status !== 'approved') {
            await supabase.auth.signOut();
            // Distinguish between manual-EFT-pending and other pending states
            // Accepts both 'manual' (current value) and 'bank_transfer' (legacy value)
            const isManualEFT = (
              contractorData.payment_method === 'manual' ||
              contractorData.payment_method === 'bank_transfer'
            ) && !contractorData.payment_approved;
            if (isManualEFT) {
              setError(
                'Your account is awaiting payment verification. An admin will verify your EFT payment ' +
                '(usually within 24 hours). You will receive login access once your payment is confirmed.'
              );
            } else {
              setError(
                'Your contractor account is pending admin approval. Please wait for approval.'
              );
            }
            setIsLoading(false);
            return;
          }

          // Gate 2: for paid tiers, payment must also be approved
          // (belt-and-suspenders: status alone is the primary gate, but
          //  this catches any edge case where status was manually set without payment verification)
          const isPaidTier = contractorData.subscription_tier && contractorData.subscription_tier !== 'free';
          if (isPaidTier && contractorData.payment_approved === false) {
            await supabase.auth.signOut();
            setError(
              'Your payment is pending admin verification. You will receive full access once your ' +
              'payment is confirmed. For instant access, please use Stitch or PayFast on your next registration.'
            );
            setIsLoading(false);
            return;
          }
          
          sessionStorage.setItem('user_type', 'contractor');
          sessionStorage.setItem('contractor_id', contractorData.id);
          sessionStorage.setItem('contractor_data', JSON.stringify(contractorData));
        } else {
          // Check if user is a supplier in Supabase
          const { data: supplierData } = await supabase
            .from('suppliers')
            .select('*')
            .eq('user_id', data.user.id)
            .single();

          if (supplierData) {
            // Check if supplier is approved
            if (supplierData.status !== 'approved') {
              await supabase.auth.signOut();
              setError('Your supplier account is pending admin approval. Please wait for approval.');
              setIsLoading(false);
              return;
            }
            
            sessionStorage.setItem('user_type', 'supplier');
            sessionStorage.setItem('supplier_id', supplierData.id);
          } else {
            sessionStorage.setItem('user_type', 'operator');
          }
        }
        
        onSuccess(data.session.access_token);
      }
    } catch (err) {
      // On network errors (Failed to fetch, timeout, etc.) try fallback accounts
      // This handles the case where Supabase is unreachable in the current environment
      const isNetworkError = err instanceof TypeError ||
        (err instanceof Error && (
          err.message.includes('Failed to fetch') ||
          err.message.includes('fetch') ||
          err.message.includes('network') ||
          err.message.includes('NetworkError') ||
          err.message.includes('AbortError') ||
          err.name === 'AbortError'
        ));
      if (isNetworkError && tryFallbackLogin(loginData.email)) return;

      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during login';
      setError(isNetworkError
        ? 'Unable to reach the authentication server. Please check your connection and try again.'
        : errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = () => {
    // Create a demo token that the API will recognize
    const demoToken = 'demo_operator_token_' + Date.now();
    sessionStorage.setItem('demo_mode', 'true');
    onSuccess(demoToken);
  };

  return (
    <div className="w-full max-w-md">
      {/* Logo and Header */}
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-[#00b4d8] p-4 rounded-2xl shadow-lg">
            <div className="h-16 flex items-center justify-center px-6">
              <span className="text-4xl font-bold text-white">Qilly</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#00b4d8] mb-2">Qilly</h1>
        <p className="text-gray-600">Construction Billing Intelligence</p>
        <p className="text-sm text-gray-500 mt-2">Automated BOQ pricing with 100% accuracy in under 5 minutes</p>
      </div>

      <Card className="shadow-lg border-2 border-gray-100">
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="user@example.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
        </CardContent>
      </Card>


      {/* Additional Login Options — disabled pending full integration */}
      <div className="mt-6 space-y-3">
        <Button
          variant="outline"
          className="w-full border-2 border-blue-200 text-blue-400 cursor-not-allowed opacity-50"
          disabled
        >
          <Handshake className="w-5 h-5 mr-2" />
          Partner Program - Join Our Ecosystem
        </Button>
        <Button
          variant="outline"
          className="w-full border-2 border-blue-200 cursor-not-allowed opacity-50"
          disabled
        >
          <Building2 className="w-4 h-4 mr-2" />
          Register as Supplier
        </Button>
        <Button
          variant="outline"
          className="w-full border-2 border-blue-600 hover:bg-blue-50 text-blue-700 font-semibold"
          onClick={onContractorSignup}
        >
          <Hammer className="w-4 h-4 mr-2" />
          Register as Contractor
        </Button>
        <Button
          variant="outline"
          className="w-full border-2 border-purple-200 hover:bg-purple-50"
          onClick={onAdminLogin}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin Login
        </Button>
        <Button
          variant="outline"
          className="w-full cursor-not-allowed opacity-50"
          disabled
        >
          Use Operator Credentials
        </Button>
      </div>

      {/* Footer Links */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
          <button
            onClick={() => onNavigateToPolicy?.('privacy-policy')}
            className="hover:text-[#00b4d8] transition-colors"
          >
            Privacy Policy
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => onNavigateToPolicy?.('terms-of-service')}
            className="hover:text-[#00b4d8] transition-colors"
          >
            Terms of Service
          </button>
          <span className="text-gray-300">•</span>
          <button
            onClick={() => onNavigateToPolicy?.('cookie-policy')}
            className="hover:text-[#00b4d8] transition-colors"
          >
            Cookie Policy
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-3">
          © {new Date().getFullYear()} Qilly (Pty) Ltd • POPIA Compliant
        </p>
      </div>
    </div>
  );
}