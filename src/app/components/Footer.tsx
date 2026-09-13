import React from 'react';
import { Shield, Lock, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate?: (view: 'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'auth') => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleNavigation = (view: 'privacy-policy' | 'terms-of-service' | 'cookie-policy' | 'auth') => {
    if (onNavigate) {
      onNavigate(view);
    } else {
      // Fallback for when used without navigation prop
      window.location.hash = view;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white py-12 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-[#00b4d8] mb-3">Qilly</h3>
            <p className="text-sm text-gray-400 mb-4 max-w-md">
              South Africa's leading Bill of Quantities (BOQ) pricing platform. 
              Automated pricing across 9 provinces with 98% coverage and POPIA compliance.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
              <p><strong className="text-white">Qilly (Pty) Ltd</strong></p>
              <p>Registration: K2026156151</p>
              <p>210 Kirkness Avenue</p>
              <p>Pierre van Ryneveld, 0157</p>
              <p>South Africa</p>
              <p className="mt-3">General enquiries</p>
              <p>
                <a href="tel:+27839412655" className="text-[#00b4d8] hover:text-[#0096c7] transition-colors">
                  +27 83 941 2655
                </a>
              </p>
              <p>
                <a href="tel:+27768765069" className="text-[#00b4d8] hover:text-[#0096c7] transition-colors">
                  +27 76 876 5069
                </a>
              </p>
              <p>
                <a href="mailto:support@qilly.co.za" className="text-[#00b4d8] hover:text-[#0096c7] transition-colors">
                  support@qilly.co.za
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigation('auth')}
                  className="text-gray-400 hover:text-[#00b4d8] transition-colors text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <a href="mailto:support@qilly.co.za" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="mailto:billing@qilly-software.co.za" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                  Billing Enquiries: billing@qilly-software.co.za
                </a>
                <span className="block text-xs text-gray-500">Alternative: <a href="mailto:billing@qilly.co.za" className="hover:text-[#00b4d8]">billing@qilly.co.za</a></span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal & Privacy</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => handleNavigation('privacy-policy')}
                  className="text-gray-400 hover:text-[#00b4d8] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('terms-of-service')}
                  className="text-gray-400 hover:text-[#00b4d8] transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('cookie-policy')}
                  className="text-gray-400 hover:text-[#00b4d8] transition-colors text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <a href="mailto:privacy@qilly.co.za" className="text-gray-400 hover:text-[#00b4d8] transition-colors">
                  Data Officer Contact
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="https://www.justice.gov.za/inforeg/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-400 transition-colors"
                >
                  Information Regulator (SA) →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Compliance Badges */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs">
            <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/30 px-4 py-2 rounded-lg">
              <Shield className="h-4 w-4 text-green-400" />
              <span className="text-green-300 font-medium">POPIA Compliant</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-900/20 border border-blue-700/30 px-4 py-2 rounded-lg">
              <Lock className="h-4 w-4 text-blue-400" />
              <span className="text-blue-300 font-medium">AES-256 Encrypted</span>
            </div>
            <div className="flex items-center gap-2 bg-purple-900/20 border border-purple-700/30 px-4 py-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4 text-purple-400" />
              <span className="text-purple-300 font-medium">SA Data Residency</span>
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-sm text-gray-400 mb-2">
            © {currentYear} Qilly (Pty) Ltd. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 max-w-3xl mx-auto">
            Qilly provides BOQ pricing estimates based on market data and industry standards. 
            All prices are estimates and should be verified with suppliers before finalizing contracts. 
            Qilly is not liable for project cost variations or supplier pricing changes.
          </p>
          <p className="text-xs text-gray-600 mt-3">
            Built with ❤️ in South Africa | BuildAid 2025/2026 referenced
          </p>
        </div>
      </div>
    </footer>
  );
}
