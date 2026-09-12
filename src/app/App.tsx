import { useState, useEffect } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { GreenDashboard } from './components/GreenDashboard';
import { PerformanceStressTest } from './components/PerformanceStressTest';
import { AuthForm } from './components/AuthForm';
import { SupplierSignup } from './components/SupplierSignup';
import { ContractorSignup } from './components/ContractorSignup';
import { AdminLogin } from './components/AdminLogin';
import { PublicPartnerPortal } from './components/PublicPartnerPortal';
import { PartnerLogin } from './components/PartnerLogin';
import { PartnerPortal } from './components/PartnerPortal';
import { Footer } from './components/Footer';
import { BuildAidReferenceBar } from './components/BuildAidReferenceBar';
import { CapitalRaisingGuide } from './components/CapitalRaisingGuide';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import { Toaster } from 'sonner';
import { initAuthCleanup } from '@/utils/supabase/auth-helpers';
import { supabase } from '@/utils/supabase';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'auth' | 'supplier-signup' | 'contractor-signup' | 'admin-login' | 'public-partner-portal' | 'partner-login' | 'partner-portal' | 'main' | 'admin' | 'green-building' | 'performance-test' | 'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'capital-raising'>('auth');

  useEffect(() => {
    // Initialize auth cleanup to prevent orphaned locks
    initAuthCleanup();
    
    // Check if user is already logged in (for page refresh)
    const sessionToken = sessionStorage.getItem('access_token');
    const isAdmin = sessionStorage.getItem('admin_logged_in') === 'true';
    
    if (sessionToken) {
      setAccessToken(sessionToken);
      if (isAdmin) {
        setCurrentView('admin');
      } else {
        setCurrentView('main');
      }
    }
  }, []);

  const handleAuthSuccess = (token: string) => {
    const isAdmin = sessionStorage.getItem('admin_logged_in') === 'true';
    setAccessToken(token);
    sessionStorage.setItem('access_token', token);
    
    if (isAdmin) {
      setCurrentView('admin');
    } else {
      setCurrentView('main');
    }
  };

  const handleLogout = () => {
    // Always clear UI state first so logout is never blocked
    setAccessToken(null);
    setCurrentView('auth');
    ['access_token', 'admin_logged_in', 'demo_mode', 'user_type',
     'contractor_id', 'contractor_data', 'partner_logged_in', 'partner_email'].forEach(k =>
      sessionStorage.removeItem(k)
    );
    // Fire-and-forget — don't await; demo sessions have no real Supabase session to sign out
    supabase.auth.signOut().catch(() => {});
  };

  const handleSupplierSignupSuccess = () => {
    setCurrentView('auth');
  };

  const handleContractorSignupSuccess = () => {
    setCurrentView('auth');
  };

  const handleAdminLoginSuccess = () => {
    sessionStorage.setItem('admin_logged_in', 'true');
    const demoToken = 'admin_token_' + Date.now();
    handleAuthSuccess(demoToken);
  };

  const handlePartnerLoginSuccess = () => {
    sessionStorage.setItem('partner_logged_in', 'true');
    const partnerToken = 'partner_token_' + Date.now();
    setAccessToken(partnerToken);
    sessionStorage.setItem('access_token', partnerToken);
    setCurrentView('partner-portal');
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <BuildAidReferenceBar />
      {currentView === 'auth' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <AuthForm
            onSuccess={handleAuthSuccess}
            onSupplierSignup={() => setCurrentView('supplier-signup')}
            onContractorSignup={() => setCurrentView('contractor-signup')}
            onAdminLogin={() => setCurrentView('admin-login')}
            onGreenBuilding={() => setCurrentView('green-building')}
            onPartnerPortal={() => setCurrentView('public-partner-portal')}
            onNavigateToPolicy={(view) => setCurrentView(view)}
          />
        </div>
      )}
      {currentView === 'public-partner-portal' && (
        <PublicPartnerPortal
          onBack={() => setCurrentView('auth')}
          onPartnerLogin={() => setCurrentView('partner-login')}
        />
      )}
      {currentView === 'partner-login' && (
        <PartnerLogin
          onSuccess={handlePartnerLoginSuccess}
          onBack={() => setCurrentView('public-partner-portal')}
        />
      )}
      {currentView === 'partner-portal' && accessToken && (
        <PartnerPortal onBack={() => {
          setAccessToken(null);
          sessionStorage.removeItem('access_token');
          sessionStorage.removeItem('partner_logged_in');
          sessionStorage.removeItem('partner_email');
          setCurrentView('auth');
        }} />
      )}
      {currentView === 'supplier-signup' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <SupplierSignup
            onSuccess={handleSupplierSignupSuccess}
            onBack={() => setCurrentView('auth')}
          />
        </div>
      )}
      {currentView === 'contractor-signup' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
          <ContractorSignup
            onSuccess={handleContractorSignupSuccess}
            onBack={() => setCurrentView('auth')}
          />
        </div>
      )}
      {currentView === 'admin-login' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <AdminLogin
            onSuccess={handleAdminLoginSuccess}
            onBack={() => setCurrentView('auth')}
          />
        </div>
      )}
      {currentView === 'main' && accessToken && (
        <MainDashboard accessToken={accessToken} onLogout={handleLogout} />
      )}
      {currentView === 'admin' && accessToken && (
        <AdminDashboard onLogout={handleLogout} onCapitalRaising={() => setCurrentView('capital-raising')} />
      )}
      {currentView === 'green-building' && (
        <GreenDashboard onLogout={() => setCurrentView('auth')} />
      )}
      {currentView === 'performance-test' && (
        <PerformanceStressTest />
      )}
      {currentView === 'privacy-policy' && (
        <div>
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setCurrentView('auth')}
              className="text-[#00b4d8] hover:text-[#0077b6] font-medium text-sm flex items-center gap-2"
            >
              ← Back to Home
            </button>
          </div>
          <PrivacyPolicy />
          <Footer onNavigate={(view) => setCurrentView(view)} />
        </div>
      )}
      {currentView === 'terms-of-service' && (
        <div>
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setCurrentView('auth')}
              className="text-[#00b4d8] hover:text-[#0077b6] font-medium text-sm flex items-center gap-2"
            >
              ← Back to Home
            </button>
          </div>
          <TermsOfService />
          <Footer onNavigate={(view) => setCurrentView(view)} />
        </div>
      )}
      {currentView === 'cookie-policy' && (
        <div>
          <div className="bg-white border-b border-gray-200 px-4 py-3">
            <button
              onClick={() => setCurrentView('auth')}
              className="text-[#00b4d8] hover:text-[#0077b6] font-medium text-sm flex items-center gap-2"
            >
              ← Back to Home
            </button>
          </div>
          <CookiePolicy />
          <Footer onNavigate={(view) => setCurrentView(view)} />
        </div>
      )}
      {currentView === 'capital-raising' && (
        <CapitalRaisingGuide onBack={() => setCurrentView('admin')} />
      )}
    </>
  );
}