import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Lock, Eye, Download, Trash2, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-[#00b4d8] border-2">
          <CardHeader className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Privacy Policy</CardTitle>
                <p className="text-sm text-white/90 mt-1">POPIA Compliant - Protection of Personal Information</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <Lock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900">AES-256 Encrypted</p>
                <p className="text-xs text-green-700">Bank-grade security</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-blue-900">Full Transparency</p>
                <p className="text-xs text-blue-700">Know what we collect</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <Download className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-purple-900">Your Data Rights</p>
                <p className="text-xs text-purple-700">Export or delete anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Effective Date:</strong> March 6, 2026<br />
              <strong>Last Updated:</strong> March 6, 2026<br />
              <strong>Version:</strong> 1.0
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Qilly (Pty) Ltd ("<strong>Qilly</strong>", "<strong>we</strong>", "<strong>us</strong>", or "<strong>our</strong>") 
              is committed to protecting your personal information in accordance with the Protection of Personal Information Act 
              (POPIA) 4 of 2013. This Privacy Policy explains how we collect, use, store, and protect your personal information 
              when you use our Bill of Quantities (BOQ) pricing platform.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <p className="text-sm text-blue-900">
                <strong>Your Rights:</strong> Under POPIA, you have the right to access, correct, delete, and export your personal 
                information. You can exercise these rights at any time through your account settings or by contacting our Data Officer.
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information</h3>
            <p className="text-gray-700 mb-3">We collect the following personal information when you register or use our services:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Identity Information:</strong> Full name, ID number (optional)</li>
              <li><strong>Contact Information:</strong> Email address, phone number, physical address</li>
              <li><strong>Company Information:</strong> Company name, registration number, CIDB grading</li>
              <li><strong>Professional Information:</strong> CIDB registration number, NHBRC number, BBBEE certificate details</li>
              <li><strong>Financial Information:</strong> Bank account details (for payments), billing address</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Project and Usage Data</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>BOQ Files:</strong> Uploaded drawings, Excel files, project specifications</li>
              <li><strong>Project Details:</strong> Project type, location, value, duration</li>
              <li><strong>Pricing Requests:</strong> Materials requested, quantities, provincial preferences</li>
              <li><strong>Generated Reports:</strong> Priced BOQs, compliance calculations, PDF exports</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Technical Data</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type and version, operating system</li>
              <li><strong>Usage Analytics:</strong> Pages visited, features used, time spent, click patterns</li>
              <li><strong>Authentication Data:</strong> Login timestamps, session duration, password (hashed)</li>
              <li><strong>Cookies:</strong> Session cookies, preference cookies (see Cookie Policy)</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Service Delivery</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Process and price your BOQ requests</li>
              <li>Match materials to suppliers across 9 South African provinces</li>
              <li>Calculate compliance costs (CIDB, NHBRC, BBBEE, statutory)</li>
              <li>Generate priced BOQ reports and PDF exports</li>
              <li>Provide customer support and technical assistance</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Account Management</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Authenticate your identity and secure your account</li>
              <li>Manage your subscription and free trial limits</li>
              <li>Process payments and issue invoices</li>
              <li>Send account notifications and service updates</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Legal Compliance</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Verify CIDB registration and contractor grading</li>
              <li>Maintain audit trails for PFMA/MFMA compliance (government users)</li>
              <li>Prevent fraud, money laundering, and unauthorized access</li>
              <li>Comply with legal obligations and regulatory requirements</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Legal Basis (POPIA Sections 8-12)</h3>
            <p className="text-gray-700 mb-3">We process your information based on:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Consent:</strong> You explicitly agreed during signup</li>
              <li><strong>Contract Performance:</strong> Necessary to provide BOQ pricing services</li>
              <li><strong>Legal Obligation:</strong> Required for CIDB, NHBRC, tax compliance</li>
              <li><strong>Legitimate Interest:</strong> Fraud prevention, security, service improvement</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. How We Protect Your Data</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Measures
              </h3>
              <ul className="space-y-2 text-green-900">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Encryption at Rest:</strong> AES-256 encryption for all stored data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Encryption in Transit:</strong> TLS 1.3 for all data transmission</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Password Security:</strong> Bcrypt hashing with salt (industry standard)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Access Control:</strong> Row-level security (RLS) policies, role-based access</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Multi-Factor Authentication:</strong> Optional 2FA for enhanced security</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Regular Security Audits:</strong> Quarterly penetration testing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span><strong>Data Access Logging:</strong> Every admin access logged with IP and timestamp</span>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Storage Location</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Primary Storage:</strong> Supabase (PostgreSQL) - AWS Cape Town region</li>
              <li><strong>Data Residency:</strong> All data stored in South Africa</li>
              <li><strong>No International Transfers:</strong> Your data never leaves South Africa without explicit consent</li>
              <li><strong>POPIA-Compliant Hosting:</strong> Infrastructure meets South African data protection standards</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. Who Has Access to Your Data</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Internal Access</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Qilly Administrators:</strong> Support staff for customer service and compliance verification</li>
              <li><strong>Development Team:</strong> Engineers for system maintenance and bug fixes (anonymized data only)</li>
              <li><strong>Automated Systems:</strong> Pricing algorithms, compliance calculators (no human access)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Third-Party Access</h3>
            <p className="text-gray-700 mb-3"><strong>We DO NOT share your data with third parties</strong>, except:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Payment Processors:</strong> Stitch, PayFast (for payment processing only)</li>
              <li><strong>Hosting Provider:</strong> Supabase/AWS (infrastructure, bound by data processing agreements)</li>
              <li><strong>Legal Requirements:</strong> Court orders, CIDB audits, SARS investigations, law enforcement</li>
            </ul>

            <p className="text-gray-700 mt-4">
              <strong>No Marketing:</strong> We NEVER sell your data to marketers, advertisers, or third-party suppliers.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Data Retention</h2>
            
            <table className="min-w-full border border-gray-300 my-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Data Type</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Retention Period</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Active accounts</td>
                  <td className="border border-gray-300 px-4 py-2">Indefinitely</td>
                  <td className="border border-gray-300 px-4 py-2">While you use our service</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Inactive accounts (no login)</td>
                  <td className="border border-gray-300 px-4 py-2">12 months</td>
                  <td className="border border-gray-300 px-4 py-2">Then archived</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Deleted accounts</td>
                  <td className="border border-gray-300 px-4 py-2">30 days</td>
                  <td className="border border-gray-300 px-4 py-2">Grace period, then permanent deletion</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Audit trails (govt users)</td>
                  <td className="border border-gray-300 px-4 py-2">5 years</td>
                  <td className="border border-gray-300 px-4 py-2">PFMA/MFMA legal requirement</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">BOQ history</td>
                  <td className="border border-gray-300 px-4 py-2">Until deletion requested</td>
                  <td className="border border-gray-300 px-4 py-2">Your convenience</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">Payment records</td>
                  <td className="border border-gray-300 px-4 py-2">7 years</td>
                  <td className="border border-gray-300 px-4 py-2">Tax compliance (SARS requirement)</td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights Under POPIA</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Right to Access
                </h4>
                <p className="text-sm text-blue-800">
                  View all personal information we hold about you. Use the "Download My Data" button in your profile.
                </p>
              </div>

              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Right to Correction
                </h4>
                <p className="text-sm text-green-800">
                  Update incorrect or incomplete information anytime through your account settings.
                </p>
              </div>

              <div className="border-2 border-red-200 rounded-lg p-4 bg-red-50">
                <h4 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Right to Deletion
                </h4>
                <p className="text-sm text-red-800">
                  Request permanent data removal. Use "Delete My Account" in settings. 30-day grace period applies.
                </p>
              </div>

              <div className="border-2 border-purple-200 rounded-lg p-4 bg-purple-50">
                <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Right to Portability
                </h4>
                <p className="text-sm text-purple-800">
                  Export your data in JSON format to use with other services. Available in your profile.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 How to Exercise Your Rights</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Email:</strong> privacy@qilly.co.za</li>
              <li><strong>In-App:</strong> Use "Download My Data" or "Delete Account" buttons</li>
              <li><strong>Response Time:</strong> Within 30 days (POPIA requirement)</li>
              <li><strong>No Fee:</strong> First request is free; subsequent requests may incur admin fee</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Cookies and Tracking</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1 Essential Cookies (Required)</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><code className="bg-gray-200 px-2 py-1 rounded">qilly_auth_token</code> - Keeps you logged in (expires: 7 days)</li>
              <li><code className="bg-gray-200 px-2 py-1 rounded">qilly_session</code> - Maintains your session (expires: on browser close)</li>
              <li><code className="bg-gray-200 px-2 py-1 rounded">qilly_preferences</code> - Remembers your settings (expires: 1 year)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.2 What We DON'T Use</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>❌ No Google Analytics</li>
              <li>❌ No Facebook Pixel</li>
              <li>❌ No advertising or tracking cookies</li>
              <li>❌ No cross-site tracking</li>
            </ul>

            <p className="text-sm text-gray-600 mt-4">
              See our <a href="/cookie-policy" className="text-[#00b4d8] underline">Cookie Policy</a> for full details.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">9. Data Breach Notification</h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 my-6">
              <h3 className="font-bold text-red-900 mb-2">Our Commitment</h3>
              <p className="text-sm text-red-800 mb-3">
                In the unlikely event of a data breach affecting your personal information:
              </p>
              <ul className="text-sm text-red-800 space-y-1">
                <li><strong>✓ You will be notified within 72 hours</strong> (POPIA requirement)</li>
                <li><strong>✓ Information Regulator will be notified</strong></li>
                <li><strong>✓ We will provide guidance</strong> on protective measures</li>
                <li><strong>✓ We will publish a public statement</strong> (if widely impacted)</li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700">
              Qilly is intended for professional use by adults (18+). We do not knowingly collect personal information from 
              children under 18. If we discover such data, it will be deleted immediately. Parents/guardians can contact 
              privacy@qilly.co.za to request deletion.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">11. Changes to This Policy</h2>
            <p className="text-gray-700 mb-3">
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. When we do:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>You will be notified via email (at least 30 days before changes take effect)</li>
              <li>The "Last Updated" date at the top will be changed</li>
              <li>Continued use of Qilly after changes = acceptance of new policy</li>
              <li>Version history available on request</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">12. Contact Information</h2>
            
            <div className="bg-gray-100 rounded-lg p-6 my-6">
              <h3 className="font-bold text-gray-900 mb-4">Data Protection Officer</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Company:</strong> Qilly (Pty) Ltd</p>
                <p><strong>Registration Number:</strong> K2026156151</p>
                <p><strong>Email:</strong> <a href="mailto:privacy@qilly.co.za" className="text-[#00b4d8] underline">privacy@qilly.co.za</a></p>
                <p><strong>Phone:</strong> <a href="tel:+27839412655" className="text-[#00b4d8] underline">+27 83 941 2655</a></p>
                <p><strong>Physical Address:</strong> 210 Kirkness Avenue, Pierre van Ryneveld, 0157, South Africa</p>
                <p><strong>Response Time:</strong> Within 30 days</p>
              </div>
            </div>

            <div className="bg-blue-100 rounded-lg p-6 my-6">
              <h3 className="font-bold text-blue-900 mb-4">Regulatory Authority</h3>
              <p className="text-sm text-blue-800 mb-3">
                If you are not satisfied with our response to your privacy concerns, you can file a complaint with:
              </p>
              <div className="space-y-2 text-blue-900">
                <p><strong>Information Regulator (South Africa)</strong></p>
                <p><strong>Email:</strong> <a href="mailto:inforeg@justice.gov.za" className="underline">inforeg@justice.gov.za</a></p>
                <p><strong>Website:</strong> <a href="https://www.justice.gov.za/inforeg/" className="underline" target="_blank" rel="noopener noreferrer">www.justice.gov.za/inforeg</a></p>
                <p><strong>Phone:</strong> 010 023 5207</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">13. Complaints Procedure</h2>
            <ol className="list-decimal pl-6 text-gray-700 space-y-2">
              <li>Email your complaint to privacy@qilly.co.za with details</li>
              <li>We will acknowledge receipt within 7 days</li>
              <li>We will investigate and respond within 30 days (POPIA requirement)</li>
              <li>If unsatisfied, escalate to Information Regulator (contact details above)</li>
            </ol>

            <div className="bg-green-100 border-2 border-green-300 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-green-900 mb-3">Legal Compliance</h3>
              <p className="text-sm text-green-800 mb-2">This Privacy Policy complies with:</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>✓ <strong>Protection of Personal Information Act (POPIA) 4 of 2013</strong></li>
                <li>✓ <strong>Promotion of Access to Information Act (PAIA) 2 of 2000</strong></li>
                <li>✓ <strong>Electronic Communications and Transactions Act (ECTA) 25 of 2002</strong></li>
                <li>✓ <strong>Consumer Protection Act 68 of 2008</strong></li>
              </ul>
            </div>

            <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-600">
              <p><strong>Last Reviewed:</strong> March 6, 2026</p>
              <p><strong>Version:</strong> 1.0</p>
              <p className="mt-4">
                <a href="/terms-of-service" className="text-[#00b4d8] underline mr-4">Terms of Service</a>
                <a href="/cookie-policy" className="text-[#00b4d8] underline">Cookie Policy</a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
