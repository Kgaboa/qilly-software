import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Shield, ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Shield className="h-6 w-6" />
              Privacy Policy - POPIA Compliance
            </CardTitle>
            <p className="text-blue-100 text-sm mt-2">
              Protection of Personal Information Act (POPIA), Act 4 of 2013
            </p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="text-sm text-blue-900">
                <strong>Last Updated:</strong> March 13, 2026<br />
                <strong>Effective Date:</strong> January 1, 2024<br />
                <strong>Version:</strong> 1.0
              </p>
            </div>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">1. Introduction</h2>
              <p className="text-slate-700 leading-relaxed">
                Qilly (Pty) Ltd ("we", "us", "our") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), Act 4 of 2013. This Privacy Policy explains how we collect, use, store, and protect your personal information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
              <div className="space-y-2 pl-4">
                <h3 className="font-semibold text-slate-800">2.1 Contractor Information:</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Company name and CIDB registration details</li>
                  <li>Contact person name, email, and phone number</li>
                  <li>Business address and operating provinces</li>
                  <li>BBBEE level and certification status</li>
                  <li>Project types and years in business</li>
                  <li>Payment and billing information</li>
                </ul>

                <h3 className="font-semibold text-slate-800 mt-4">2.2 Automatically Collected:</h3>
                <ul className="list-disc pl-6 text-slate-700 space-y-1">
                  <li>Login timestamps and IP addresses</li>
                  <li>BOQ generation and pricing queries</li>
                  <li>System usage analytics</li>
                </ul>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li><strong>BOQ Pricing:</strong> Generate accurate bills of quantities using South African supplier data</li>
                <li><strong>Account Management:</strong> Verify CIDB registration and manage subscription tiers</li>
                <li><strong>Compliance:</strong> Ensure SANS 1200 and BuildAid 2025/2026 standards compliance</li>
                <li><strong>Billing:</strong> Process subscription payments and generate invoices</li>
                <li><strong>Support:</strong> Provide customer service and technical assistance</li>
                <li><strong>Legal:</strong> Comply with South African construction industry regulations</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. Data Storage and Security</h2>
              <p className="text-slate-700 leading-relaxed">
                Your personal information is stored securely on Supabase cloud infrastructure with:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>256-bit AES encryption for data at rest</li>
                <li>TLS 1.3 encryption for data in transit</li>
                <li>Row-level security policies</li>
                <li>Regular security audits and backups</li>
                <li>Access controls limited to authorized personnel only</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">5. Data Sharing and Disclosure</h2>
              <p className="text-slate-700 leading-relaxed">
                We do <strong>NOT</strong> sell your personal information. We may share data only with:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>eTender:</strong> For Enterprise tier eTender integration (with your consent)</li>
                <li><strong>Payment Processors:</strong> For subscription billing (Stitch/PayFast)</li>
                <li><strong>Legal Authorities:</strong> When required by South African law</li>
                <li><strong>Service Providers:</strong> Cloud hosting and infrastructure providers</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">6. Your POPIA Rights</h2>
              <p className="text-slate-700 leading-relaxed">
                Under POPIA, you have the right to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Portability:</strong> Request your data in a portable format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time (may affect service access)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">7. Data Retention</h2>
              <p className="text-slate-700 leading-relaxed">
                We retain your personal information for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li><strong>Active Accounts:</strong> Duration of subscription + 7 years (CIPC compliance)</li>
                <li><strong>Closed Accounts:</strong> 7 years for tax and audit purposes</li>
                <li><strong>BOQ Records:</strong> 7 years as per construction industry standards</li>
                <li><strong>Consent Logs:</strong> Permanently for POPIA compliance proof</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">8. Cookies and Tracking</h2>
              <p className="text-slate-700 leading-relaxed">
                We use essential cookies for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Authentication and session management</li>
                <li>System performance monitoring</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-2">
                We do <strong>NOT</strong> use third-party advertising cookies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">9. Children's Privacy</h2>
              <p className="text-slate-700 leading-relaxed">
                Qilly is a business-to-business service for registered contractors. We do not knowingly collect information from individuals under 18 years of age.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">10. Contact Us</h2>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <p className="text-slate-700 leading-relaxed">
                  <strong>Information Officer:</strong> Qilly Privacy Team<br />
                  <strong>Email:</strong> privacy@qilly.co.za<br />
                  <strong>Phone:</strong> +27 11 555 1234<br />
                  <strong>Address:</strong> 123 Business Avenue, Sandton, Johannesburg, 2196<br />
                  <strong>Information Regulator:</strong> <a href="https://inforegulator.org.za" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">inforegulator.org.za</a>
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">11. Changes to This Policy</h2>
              <p className="text-slate-700 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of material changes via email and update the "Last Updated" date above.
              </p>
            </section>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mt-6">
              <p className="text-sm text-green-900">
                <strong>✓ POPIA Compliant:</strong> This Privacy Policy complies with the Protection of Personal Information Act (POPIA), Act 4 of 2013, and adheres to the eight POPIA conditions for lawful processing.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
