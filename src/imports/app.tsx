import { useState, useEffect } from 'react';
import { MainDashboard } from './components/MainDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthForm } from './components/AuthForm';
import { SupplierSignup } from './components/SupplierSignup';
import { ContractorSignup } from './components/ContractorSignup';
import { AdminLogin } from './components/AdminLogin';
import { Footer } from './components/Footer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';
import { Toaster } from 'sonner';

export default function App() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'auth' | 'supplier-signup' | 'contractor-signup' | 'admin-login' | 'main' | 'admin' | 'privacy-policy' | 'terms-of-service' | 'cookie-policy'>('auth');

  useEffect(() => {
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
    setAccessToken(null);
    setCurrentView('auth');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('admin_logged_in');
    sessionStorage.removeItem('demo_mode');
    sessionStorage.removeItem('user_type');
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

  return (
    <>
      <Toaster position="top-right" richColors />
      {currentView === 'auth' && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <AuthForm
            onSuccess={handleAuthSuccess}
            onSupplierSignup={() => setCurrentView('supplier-signup')}
            onContractorSignup={() => setCurrentView('contractor-signup')}
            onAdminLogin={() => setCurrentView('admin-login')}
            onNavigateToPolicy={(view) => setCurrentView(view)}
          />
        </div>
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
      {currentView === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
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
    </>
  );
}