import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, ArrowLeft } from 'lucide-react';

interface TermsOfServiceProps {
  onBack: () => void;
}

export function TermsOfService({ onBack }: TermsOfServiceProps) {
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
              <FileText className="h-6 w-6" />
              Terms of Service
            </CardTitle>
            <p className="text-blue-100 text-sm mt-2">
              Qilly Construction Billing System - Service Agreement
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
              <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p className="text-slate-700 leading-relaxed">
                By registering for Qilly, you agree to these Terms of Service. If you do not agree, you may not use the service. These terms constitute a legally binding agreement between you (the "Contractor") and Qilly (Pty) Ltd ("Qilly", "we", "us").
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">2. Service Description</h2>
              <p className="text-slate-700 leading-relaxed">
                Qilly provides an automated construction billing system that:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Generates Bills of Quantities (BOQs) using live South African supplier data</li>
                <li>Prices BOQs according to BuildAid 2025/2026 standards</li>
                <li>Ensures compliance with SANS 1200 specifications</li>
                <li>Provides regional pricing across South African provinces</li>
                <li>Offers carbon tracking for green building initiatives (ENTERPRISE tier only)</li>
                <li>Integrates with eTender for tender submissions (ENTERPRISE & CUSTOM tiers)</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">3. Subscription Tiers</h2>
              
              <div className="space-y-4">
                <div className="border-l-4 border-gray-400 pl-4">
                  <h3 className="font-bold text-slate-800">3.1 FREE Tier (Training Mode)</h3>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                    <li>Unlimited BOQ generation with encrypted pricing (R ●●●●●●)</li>
                    <li>Training and system familiarization only</li>
                    <li>Requires admin approval to access</li>
                    <li>No live pricing or compliance documents</li>
                    <li>Monthly cost: R0</li>
                  </ul>
                </div>

                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-bold text-slate-800">3.2 PROFESSIONAL Tier</h3>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                    <li>10 BOQs per month with live pricing</li>
                    <li>SANS 1200 compliance documents</li>
                    <li>Regional pricing across all provinces</li>
                    <li>Email support</li>
                    <li>Monthly cost: R2,999</li>
                    <li>Annual cost: R29,990 (save R6,000 - 2 months free)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-bold text-slate-800">3.3 ENTERPRISE Tier (Recommended)</h3>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                    <li>30 BOQs per month with live pricing</li>
                    <li>eTender integration for tender submissions</li>
                    <li>Collusion detection and compliance monitoring</li>
                    <li>Green building & carbon tracking per BOQ item</li>
                    <li>Priority support</li>
                    <li>Monthly cost: R8,999</li>
                    <li>Annual cost: R89,990 (save R18,000 - 2 months free)</li>
                  </ul>
                </div>

                <div className="border-l-4 border-amber-500 pl-4">
                  <h3 className="font-bold text-slate-800">3.4 CUSTOM Tier</h3>
                  <ul className="list-disc pl-6 text-slate-700 space-y-1 mt-2">
                    <li>Unlimited BOQs and all features</li>
                    <li>White-label solution</li>
                    <li>Custom integrations and on-premise deployment</li>
                    <li>Multi-company support</li>
                    <li>24/7 dedicated support and account manager</li>
                    <li>Pricing: Contact Sales</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">4. CIDB Registration Requirements</h2>
              <p className="text-slate-700 leading-relaxed">
                All contractors must:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Hold a valid CIDB registration</li>
                <li>Provide accurate CIDB class and grade information</li>
                <li>Maintain active CIDB status throughout subscription period</li>
                <li>Notify Qilly immediately of any changes to CIDB registration</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-2">
                <strong>Verification:</strong> Qilly reserves the right to verify CIDB registration details. Fraudulent or invalid CIDB information will result in immediate account suspension.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">5. Payment Terms</h2>
              
              <h3 className="font-semibold text-slate-800 mt-3">5.1 Billing Cycle</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Monthly subscriptions are billed on the same day each month</li>
                <li>Annual subscriptions are billed once per year (with 2-month discount)</li>
                <li>FREE tier has no billing</li>
              </ul>

              <h3 className="font-semibold text-slate-800 mt-3">5.2 Payment Methods</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Manual Bank Transfer (EFT)</li>
                <li>Stitch Instant Payments</li>
                <li>PayFast Credit Card</li>
              </ul>

              <h3 className="font-semibold text-slate-800 mt-3">5.3 Payment Approval</h3>
              <p className="text-slate-700 leading-relaxed">
                All payments require admin verification before account activation. Processing typically takes 1-2 business days for EFT, and instant for Stitch/PayFast.
              </p>

              <h3 className="font-semibold text-slate-800 mt-3">5.4 Late Payments</h3>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Accounts with overdue payments will be suspended after 7 days</li>
                <li>Data will be retained for 30 days after suspension</li>
                <li>Accounts not paid within 30 days may be permanently deleted</li>
              </ul>

              <h3 className="font-semibold text-slate-800 mt-3">5.5 Refund Policy</h3>
              <p className="text-slate-700 leading-relaxed">
                Refunds are available within 14 days of initial payment for first-time subscribers. No refunds for renewals or partial months. Annual subscriptions are non-refundable after 30 days.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">6. Data Accuracy and Warranties</h2>
              
              <h3 className="font-semibold text-slate-800 mt-3">6.1 Pricing Data</h3>
              <p className="text-slate-700 leading-relaxed">
                Qilly uses live South African supplier data based on BuildAid 2025/2026 standards. While we strive for accuracy:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Pricing is indicative and subject to supplier availability</li>
                <li>Final pricing must be confirmed with suppliers before tender submission</li>
                <li>Qilly is not liable for pricing discrepancies or supplier changes</li>
                <li>Regional pricing may vary based on location and market conditions</li>
              </ul>

              <h3 className="font-semibold text-slate-800 mt-3">6.2 Compliance</h3>
              <p className="text-slate-700 leading-relaxed">
                BOQs generated comply with SANS 1200 standards as of the generation date. Contractors are responsible for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Verifying compliance with current standards</li>
                <li>Reviewing BOQs before tender submission</li>
                <li>Ensuring project-specific requirements are met</li>
              </ul>

              <h3 className="font-semibold text-slate-800 mt-3">6.3 Disclaimer</h3>
              <p className="text-slate-700 leading-relaxed bg-yellow-50 border border-yellow-300 p-3 rounded">
                <strong>IMPORTANT:</strong> Qilly is a tool to assist with BOQ generation. Final responsibility for accuracy, pricing, and compliance rests with the contractor. Always verify data before submission.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">7. Prohibited Uses</h2>
              <p className="text-slate-700 leading-relaxed">
                You may NOT:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Share account credentials with non-authorized users</li>
                <li>Use Qilly for illegal activities or tender manipulation</li>
                <li>Scrape, copy, or redistribute Qilly's pricing database</li>
                <li>Reverse engineer or attempt to access source code</li>
                <li>Submit fraudulent BOQs or manipulate pricing data</li>
                <li>Use FREE tier for commercial tender submissions</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">8. Intellectual Property</h2>
              <p className="text-slate-700 leading-relaxed">
                Qilly retains all intellectual property rights to:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Software, algorithms, and pricing models</li>
                <li>User interface and design</li>
                <li>Supplier data aggregation and processing methods</li>
                <li>Branding, logos, and trademarks</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-2">
                You retain ownership of BOQs you generate, but grant Qilly a license to store and process them for service delivery.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">9. Limitation of Liability</h2>
              <p className="text-slate-700 leading-relaxed">
                Qilly shall not be liable for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Lost profits, revenue, or business opportunities</li>
                <li>Tender rejections or disqualifications</li>
                <li>Pricing errors or supplier data inaccuracies</li>
                <li>Service interruptions or data loss (beyond our control)</li>
                <li>Third-party integrations (eTender, payment processors)</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-2">
                Maximum liability is limited to the subscription fees paid in the 12 months preceding the claim.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">10. Termination</h2>
              
              <h3 className="font-semibold text-slate-800 mt-3">10.1 By Contractor</h3>
              <p className="text-slate-700 leading-relaxed">
                You may cancel your subscription at any time. Access continues until the end of the current billing period.
              </p>

              <h3 className="font-semibold text-slate-800 mt-3">10.2 By Qilly</h3>
              <p className="text-slate-700 leading-relaxed">
                We may suspend or terminate your account for:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-1">
                <li>Violation of these Terms of Service</li>
                <li>Non-payment of subscription fees</li>
                <li>Fraudulent CIDB registration or business information</li>
                <li>Prohibited use or abuse of the system</li>
                <li>Legal or regulatory requirements</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">11. Governing Law</h2>
              <p className="text-slate-700 leading-relaxed">
                These Terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of Johannesburg, South Africa.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900">12. Contact Information</h2>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <p className="text-slate-700 leading-relaxed">
                  <strong>Qilly (Pty) Ltd</strong><br />
                  Email: support@qilly.co.za<br />
                  Phone: +27 11 555 1234<br />
                  Address: 123 Business Avenue, Sandton, Johannesburg, 2196<br />
                  Website: www.qilly.co.za
                </p>
              </div>
            </section>

            <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded mt-6">
              <p className="text-sm text-green-900">
                <strong>✓ Legal Compliance:</strong> These Terms of Service comply with South African consumer protection laws, the Electronic Communications and Transactions Act (ECTA), and construction industry regulations.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
