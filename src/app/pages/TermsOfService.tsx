import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, AlertTriangle, Scale, CreditCard } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-[#00b4d8] border-2">
          <CardHeader className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Terms of Service</CardTitle>
                <p className="text-sm text-white/90 mt-1">Legal Agreement for Using Qilly</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-900">
                <strong>Important:</strong> By accessing or using Qilly, you agree to be bound by these Terms of Service. 
                If you do not agree, please do not use our service.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> August 28, 2026<br />
              <strong>Last Updated:</strong> August 28, 2026<br />
              <strong>Version:</strong> 2.0
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("<strong>Terms</strong>") constitute a legally binding agreement between you
              ("<strong>User</strong>", "<strong>you</strong>", or "<strong>your</strong>") and Qilly (Pty) Ltd
              ("<strong>Qilly</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>")
              regarding your use of the Qilly platform and all related services.
            </p>
            <p className="text-gray-700 mt-3">
              By creating an account, accessing our website at autobill.figma.site, or using any of our services,
              you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
              If you do not agree, please do not access or use our platform.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Service Description</h2>
            <p className="text-gray-700 mb-3">
              Qilly is a <strong>Construction Billing Intelligence</strong> platform purpose-built for South African
              contractors. Qilly automates the pricing of Bills of Quantities (BOQs) with the aim of achieving
              100% accuracy in under 5 minutes, using live supplier data, regional pricing, and compliance cost
              calculations. The following services are currently available:
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">2.1 Core BOQ Pricing Services (Live)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Automated BOQ Pricing:</strong> Upload a standard BOQ (Excel/CSV) and receive a fully priced, supplier-matched output with unit rates, transport costs, landed costs, and totals across all 13 cost columns</li>
              <li><strong>Regional Pricing Optimisation:</strong> Pricing across all 9 South African provinces and municipal areas, using region-specific supplier rates and transport distance calculations</li>
              <li><strong>Multi-Supplier Comparison:</strong> Each BOQ line item is matched against multiple suppliers to identify the most cost-effective regional source</li>
              <li><strong>P&amp;G (Preliminaries &amp; General) Costs:</strong> Automated calculation of site establishment, supervision, and general requirements based on project type and location</li>
              <li><strong>Compliance Cost Calculations:</strong> CIDB levy, NHBRC enrolment, BBBEE requirements, skills development levies, and statutory compliance costs</li>
              <li><strong>BOQ Template Library:</strong> Pre-loaded BuildAid 2025/2026 reference templates across project types including Housing Development, Road Construction, Infrastructure (Water/Sewer), Civil Works, and Building Construction</li>
              <li><strong>Steel BOQ Module:</strong> Dedicated structural steel pricing using current ArcelorMittal SA mill prices and fabrication rates</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">2.2 Export &amp; Reporting (Live)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Excel Export:</strong> Full 13-column priced BOQ with all cost breakdowns, supplier details, and totals</li>
              <li><strong>PDF Export:</strong> Professional watermark-free priced BOQ report (paid tiers)</li>
              <li><strong>Word (.docx) Export:</strong> Formatted priced BOQ document aligned to all 13 Excel columns</li>
              <li><strong>Compliance Report:</strong> Statutory compliance summary PDF</li>
              <li><strong>BOQ History:</strong> Access and re-download previously processed BOQs (paid tiers)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">2.3 Features Currently in Development (Coming Soon)</h3>
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-3">
              <p className="text-sm text-amber-900 mb-2">The following features are on the Qilly roadmap and are not yet available. They are visible on the platform but marked accordingly:</p>
              <ul className="text-sm text-amber-900 space-y-1 list-disc pl-4">
                <li><strong>Green Building &amp; Carbon Tracking:</strong> Environmental impact scoring and carbon footprint per BOQ line item (Enterprise tier — coming soon)</li>
                <li><strong>eTender Integration:</strong> Automated tender response generation linked to government eTender portal (Enterprise tier — coming soon)</li>
                <li><strong>Collusion Detection:</strong> AI-based pricing anomaly detection across tender submissions (Enterprise tier — coming soon)</li>
                <li><strong>Stitch Instant EFT:</strong> Real-time bank payment gateway (coming soon)</li>
                <li><strong>PayFast:</strong> Credit/debit card and SnapScan payment gateway (coming soon)</li>
                <li><strong>Team Management:</strong> Multi-user account administration (coming soon)</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-5 mb-3">2.4 Indicative Pricing Disclaimer</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-3">
              <p className="text-sm text-blue-900">
                All BOQ prices generated by Qilly are <strong>indicative estimates</strong> based on current market data,
                supplier catalogues, and published reference rates (including BuildAid 2025/2026). Prices are subject to
                change based on market fluctuations, supplier availability, and project-specific conditions. Qilly pricing
                should not be used as a final tender submission without independent verification by a qualified Quantity Surveyor.
                Steel prices are valid for 30 days from date of generation and must be confirmed with suppliers before tender submission.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts &amp; Registration</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Account Types</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Contractor Accounts:</strong> South African registered contractors who register to generate priced BOQs. Requires CIDB registration and company details. Subject to admin approval after payment verification.</li>
              <li><strong>Supplier Accounts:</strong> Material and equipment suppliers who list products on the Qilly supplier catalogue (registration pending — contact us to register)</li>
              <li><strong>Operator/Admin Accounts:</strong> Qilly internal staff accounts for platform administration</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Registration Requirements</h3>
            <p className="text-gray-700 mb-3">To register as a contractor on Qilly, you must:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Be at least 18 years old and legally authorised to represent your company</li>
              <li>Provide accurate company name, registration number, and contact information</li>
              <li>Hold a valid CIDB registration (grade and category required)</li>
              <li>Specify your operating province(s) and project types</li>
              <li>Select an Enterprise subscription plan and submit proof of EFT payment</li>
              <li>Maintain the security of your account credentials</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Account Approval Process</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>All paid contractor accounts</strong> are subject to admin review and approval before access is granted:
              </p>
              <ul className="text-sm text-blue-900 space-y-1 list-disc pl-4">
                <li>Submit registration and EFT proof of payment</li>
                <li>Qilly admin verifies payment and company details (typically within 24 hours on business days)</li>
                <li>You will be notified by email once your account is approved</li>
                <li>Login access is granted only after approval</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Account Responsibilities</h3>
            <p className="text-gray-700 mb-3">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All activities that occur under your account</li>
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>Notifying us immediately of any unauthorised use at support@qilly.co.za</li>
              <li>Ensuring only one account per registered company</li>
              <li>Keeping your CIDB registration and company information current</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. Subscription Plans & Pricing</h2>
            
            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left">Plan</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Price</th>
                    <th className="border border-gray-300 px-4 py-3 text-left">Features</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold">Free<br/><span className="text-xs font-normal text-gray-500">Training &amp; Evaluation</span></td>
                    <td className="border border-gray-300 px-4 py-3">R0</td>
                    <td className="border border-gray-300 px-4 py-3">
                      • Unlimited training BOQs<br/>
                      • 5 templates (1 per project type)<br/>
                      • BOQ structure visible (pricing encrypted)<br/>
                      • Email support<br/>
                      • No payment required
                    </td>
                  </tr>
                  <tr className="bg-blue-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">Professional</td>
                    <td className="border border-gray-300 px-4 py-3">R2,999/month<br/><span className="text-xs text-gray-500">excl. VAT</span></td>
                    <td className="border border-gray-300 px-4 py-3">
                      • 10 BOQs per month<br/>
                      • Custom BOQ upload (Excel/CSV)<br/>
                      • Live pricing (all amounts visible)<br/>
                      • 10 templates<br/>
                      • PDF &amp; Excel export<br/>
                      • Regional &amp; multi-supplier pricing<br/>
                      • Full compliance calculator<br/>
                      • 6 months project history<br/>
                      • Email + Chat support
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 font-semibold">Enterprise</td>
                    <td className="border border-gray-300 px-4 py-3">R8,999/month<br/><span className="text-xs text-gray-500">excl. VAT</span></td>
                    <td className="border border-gray-300 px-4 py-3">
                      • Everything in Professional<br/>
                      • 30 BOQs per month<br/>
                      • 15 templates<br/>
                      • Green building &amp; carbon tracking<br/>
                      • Future price projections<br/>
                      • Collusion detection<br/>
                      • eTender integration<br/>
                      • API access<br/>
                      • 5 concurrent users<br/>
                      • Unlimited project history<br/>
                      • Priority support
                    </td>
                  </tr>
                  <tr className="bg-purple-50">
                    <td className="border border-gray-300 px-4 py-3 font-semibold">Custom</td>
                    <td className="border border-gray-300 px-4 py-3">Contact Sales</td>
                    <td className="border border-gray-300 px-4 py-3">
                      • Everything in Enterprise<br/>
                      • Unlimited BOQs &amp; users<br/>
                      • White-label solution<br/>
                      • Custom integrations &amp; templates<br/>
                      • On-premise deployment<br/>
                      • Multi-company support<br/>
                      • SLA guarantees<br/>
                      • Dedicated account manager<br/>
                      • 24/7 support
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Payment Terms</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Billing</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Monthly Plans:</strong> Billed monthly in advance on your subscription date</li>
              <li><strong>Currency:</strong> All prices in South African Rand (ZAR), excluding VAT</li>
              <li><strong>VAT:</strong> 15% VAT will be added to all invoices</li>
              <li><strong>Admin Approval:</strong> All paid subscriptions are subject to payment verification and admin approval before access is granted</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Payment Methods</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>EFT / Manual Bank Transfer:</strong> Bank transfer with proof of payment submitted at registration; access granted after admin verification (typically within 24 hours)</li>
              <li><strong>Stitch Instant EFT:</strong> Real-time bank payment (coming soon)</li>
              <li><strong>PayFast:</strong> Credit/debit card, SnapScan, Instant EFT (coming soon)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3 Refunds</h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <ul className="text-sm text-yellow-900 space-y-2">
                <li><strong>Monthly Subscriptions:</strong> No refunds. You can cancel anytime; service continues until end of billing period.</li>
                <li><strong>Free Tier:</strong> No charges, no refunds needed.</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4 Failed Payments</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Grace Period:</strong> 7 days to update payment method</li>
              <li><strong>After 7 Days:</strong> Account suspended (no access to service)</li>
              <li><strong>After 30 Days:</strong> Account terminated and data deleted</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Acceptable Use Policy</h2>

            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 my-6">
              <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Prohibited Activities
              </h3>
              <p className="text-sm text-red-800 mb-3">You agree NOT to:</p>
              <ul className="text-sm text-red-800 space-y-2">
                <li>✗ Upload malicious files, viruses, or harmful code</li>
                <li>✗ Attempt to hack, breach security, or bypass access controls</li>
                <li>✗ Share your account credentials with other users or companies</li>
                <li>✗ Use the service for any illegal, fraudulent, or anti-competitive purpose</li>
                <li>✗ Submit false CIDB registration numbers or falsified company information</li>
                <li>✗ Reverse engineer, decompile, or attempt to extract our pricing algorithms</li>
                <li>✗ Scrape, copy, or extract pricing data, supplier rates, or BOQ templates for redistribution</li>
                <li>✗ Exceed your monthly BOQ quota by creating multiple accounts</li>
                <li>✗ Resell, sublicense, or redistribute Qilly-generated pricing to third parties without prior written consent</li>
                <li>✗ Use Qilly-generated BOQ prices as final tender prices without independent professional verification</li>
                <li>✗ Use automated bots or scripts to access the service</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 Qilly Intellectual Property</h3>
            <p className="text-gray-700 mb-3">Qilly (Pty) Ltd owns and retains all rights to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All software, source code, algorithms, and BOQ calculation methodologies</li>
              <li>Proprietary pricing databases, supplier rate cards, and regional cost models</li>
              <li>BOQ template libraries, including BuildAid reference templates</li>
              <li>The Qilly brand, logos, trademarks, and all design elements</li>
              <li>Documentation, user guides, and all training materials</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.2 Your Data &amp; Content</h3>
            <p className="text-gray-700 mb-3">You retain ownership of:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your uploaded BOQ files and project specifications</li>
              <li>Your project data, company information, and account content</li>
              <li>Your generated and downloaded priced BOQ reports</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.3 License Grant to You</h3>
            <p className="text-gray-700 mb-3">
              We grant you a <strong>non-exclusive, non-transferable, revocable licence</strong> to use the Qilly platform
              for your own internal business purposes during your active subscription period. This licence does not include
              the right to resell, sublicense, or redistribute the platform or its outputs.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.4 Licence Grant to Qilly</h3>
            <p className="text-gray-700">
              You grant Qilly a limited, non-exclusive licence to process, store, and use your uploaded data solely to
              provide the Qilly service as described in our Privacy Policy. We do not sell or share your project data
              with third parties.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Data Accuracy &amp; Pricing Disclaimer</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1 Nature of Pricing Outputs</h3>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="text-sm text-blue-900 mb-2">
                <strong>Our Commitment:</strong> Qilly aims to deliver BOQ pricing that reflects current market rates
                with high accuracy, using live supplier data and published reference standards.
              </p>
              <p className="text-sm text-blue-900">
                <strong>Important:</strong> All prices generated by Qilly are <strong>indicative estimates</strong> intended
                for planning, budgeting, and tender preparation purposes. They are not guaranteed final prices. You remain
                responsible for independent verification by a qualified Quantity Surveyor before submitting any formal tender.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.2 Price Validity</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>General BOQ prices are based on data current at the time of generation and may change without notice</li>
              <li>Steel pricing is based on current ArcelorMittal SA mill rates and is valid for <strong>30 days from date of generation</strong></li>
              <li>Supplier availability and regional transport costs are subject to change</li>
              <li>Qilly accepts no liability for price changes between generation and tender submission</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.3 Disclaimer of Warranties</h3>
            <p className="text-gray-700 mb-3 uppercase font-semibold text-sm">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
            </p>
            <p className="text-gray-700 mb-3">We do not guarantee:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Uninterrupted, error-free, or continuously available service</li>
              <li>That pricing estimates will match actual supplier quotes or final contract prices</li>
              <li>Availability of specific suppliers, materials, or rates in all regions</li>
              <li>That the service will meet all your specific project requirements</li>
              <li>Fitness of the service for any particular regulatory compliance requirement</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.4 Limitation of Liability</h3>
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-6 my-6">
              <p className="text-sm text-gray-800 mb-3 font-semibold uppercase">
                To the maximum extent permitted by South African law:
              </p>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Qilly's total aggregate liability is <strong>limited to the subscription fees you paid in the 12 months preceding the claim</strong></li>
                <li>• We are <strong>not liable</strong> for indirect, consequential, special, incidental, or punitive damages</li>
                <li>• We are <strong>not liable</strong> for project cost overruns, tender losses, or contract disputes arising from reliance on our pricing estimates</li>
                <li>• We are <strong>not liable</strong> for errors arising from inaccurate or incomplete data you upload</li>
                <li>• We are <strong>not liable</strong> for supplier non-performance, material quality, or delivery delays</li>
                <li>• We are <strong>not liable</strong> for any loss or damage resulting from services listed as "Coming Soon" that are not yet live</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Indemnification</h2>
            <p className="text-gray-700 mb-3">
              You agree to indemnify, defend, and hold harmless Qilly (Pty) Ltd, its directors, employees, and agents
              from any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Your use or misuse of the Qilly platform</li>
              <li>Your violation of these Terms of Service</li>
              <li>Your violation of any applicable South African law or regulation</li>
              <li>Your submission of false company registration, CIDB, or financial information</li>
              <li>Your reliance on Qilly pricing estimates without independent professional verification</li>
              <li>Third-party claims arising from your use of Qilly-generated BOQ reports</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Termination</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 Your Right to Terminate</h3>
            <p className="text-gray-700 mb-3">You may terminate your account at any time by:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Emailing <a href="mailto:support@qilly.co.za" className="text-[#00b4d8] underline">support@qilly.co.za</a> requesting cancellation</li>
              <li>Emailing <a href="mailto:billing@qilly-software.co.za" className="text-[#00b4d8] underline">billing@qilly-software.co.za</a> (or <a href="mailto:billing@qilly.co.za" className="text-[#00b4d8] underline">billing@qilly.co.za</a>) for billing-related termination</li>
            </ul>
            <p className="text-gray-700 mt-3">
              Your data will be retained for <strong>30 days after termination</strong> to allow data export (POPIA
              compliance), after which it will be permanently deleted. No refunds are issued for the remaining unused
              portion of a monthly billing period.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 Our Right to Terminate</h3>
            <p className="text-gray-700 mb-3">We may suspend or permanently terminate your account if:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You violate any provision of these Terms of Service</li>
              <li>You submit false, fraudulent, or misleading information during registration</li>
              <li>Your EFT payment is not verified within 7 business days of submission</li>
              <li>Your account remains inactive for more than 12 consecutive months</li>
              <li>We are required to do so by law or a competent authority</li>
              <li>We discontinue the platform (with at least 60 days advance written notice)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. POPIA Compliance &amp; Data Protection</h2>
            <p className="text-gray-700 mb-3">
              Qilly processes personal information in accordance with the <strong>Protection of Personal Information Act
              (POPIA), Act 4 of 2013</strong>. By registering, you consent to the collection, processing, and storage
              of your personal and company information as described in our Privacy Policy.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You have the right to access, correct, or request deletion of your personal data</li>
              <li>We will notify you within 72 hours of any data breach that may affect your information</li>
              <li>We do not sell your personal data to third parties</li>
              <li>Consent to processing is recorded at registration and stored in our audit log</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Governing Law &amp; Dispute Resolution</h2>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Jurisdiction
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>• These Terms are governed exclusively by the laws of the <strong>Republic of South Africa</strong></li>
                <li>• Disputes will be subject to the jurisdiction of the <strong>Gauteng Division of the High Court (Pretoria)</strong></li>
                <li>• Parties must attempt <strong>good-faith mediation</strong> before commencing litigation</li>
                <li>• Arbitration is available as an alternative under the AFSA Rules</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Changes to These Terms</h2>
            <p className="text-gray-700 mb-3">
              We may update these Terms from time to time to reflect changes in our services, pricing, or applicable law.
              When we do:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You will be notified via email at least <strong>30 days before</strong> material changes take effect</li>
              <li>The "Last Updated" date and version number at the top of this document will be updated</li>
              <li>Continued use of the platform after the effective date constitutes acceptance of the updated Terms</li>
              <li>If you do not accept updated Terms, you must stop using the service and request account closure</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">14. Contact Information</h2>

            <div className="bg-gray-100 rounded-lg p-6 my-6">
              <h3 className="font-bold text-gray-900 mb-4">Qilly (Pty) Ltd</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Company:</strong> Qilly (Pty) Ltd</p>
                <p><strong>Registration Number:</strong> K2026156151</p>
                <p><strong>Support Email:</strong> <a href="mailto:support@qilly.co.za" className="text-[#00b4d8] underline">support@qilly.co.za</a></p>
                <p><strong>Billing &amp; Subscriptions:</strong> <a href="mailto:billing@qilly-software.co.za" className="text-[#00b4d8] underline">billing@qilly-software.co.za</a> (alternative: <a href="mailto:billing@qilly.co.za" className="text-[#00b4d8] underline">billing@qilly.co.za</a>)</p>
                <p><strong>Phone:</strong> <a href="tel:+27837582645" className="text-[#00b4d8] underline">+27 83 758 2645</a></p>
                <p><strong>Alternative enquiries:</strong> <a href="tel:+27768765069" className="text-[#00b4d8] underline">+27 76 876 5069</a></p>
                <p><strong>Physical Address:</strong> 210 Kirkness Avenue, Pierre van Ryneveld, Centurion, 0157, Gauteng, South Africa</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">15. Miscellaneous</h2>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.1 Entire Agreement</h3>
            <p className="text-gray-700">
              These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between
              you and Qilly regarding your use of the platform and supersede all prior agreements or understandings.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.2 Severability</h3>
            <p className="text-gray-700">
              If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction,
              the remaining provisions will continue in full force and effect.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.3 Waiver</h3>
            <p className="text-gray-700">
              Our failure to enforce any right or provision of these Terms on any occasion will not constitute a waiver
              of that right or provision in future.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.4 Assignment</h3>
            <p className="text-gray-700">
              You may not assign or transfer your rights or obligations under these Terms without our prior written consent.
              Qilly may assign its rights and obligations to a successor entity without restriction.
            </p>

            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-green-900 mb-3">Acknowledgment</h3>
              <p className="text-sm text-green-800">
                By using Qilly, you acknowledge that you have read, understood, and agree to be bound by these Terms of
                Service, our Privacy Policy, and our Cookie Policy. If you do not agree with any part of these Terms,
                please discontinue use of the service immediately and contact us at support@qilly.co.za.
              </p>
            </div>

            <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-600">
              <p><strong>Last Updated:</strong> August 28, 2026 &nbsp;|&nbsp; <strong>Version:</strong> 2.0</p>
              <p className="mt-4">
                <a href="/privacy-policy" className="text-[#00b4d8] underline mr-4">Privacy Policy</a>
                <a href="/cookie-policy" className="text-[#00b4d8] underline">Cookie Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
