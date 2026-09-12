import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Cookie, Settings, Eye, Shield } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-8 border-[#00b4d8] border-2">
          <CardHeader className="bg-gradient-to-r from-[#00b4d8] to-[#0077b6] text-white">
            <div className="flex items-center gap-3">
              <Cookie className="h-8 w-8" />
              <div>
                <CardTitle className="text-2xl">Cookie Policy</CardTitle>
                <p className="text-sm text-white/90 mt-1">How Qilly Uses Cookies</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="font-semibold text-green-900 text-sm">Essential Only</p>
                <p className="text-xs text-green-700">No tracking cookies</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                <Eye className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="font-semibold text-blue-900 text-sm">Full Transparency</p>
                <p className="text-xs text-blue-700">Know what we use</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                <Settings className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="font-semibold text-purple-900 text-sm">Your Control</p>
                <p className="text-xs text-purple-700">Opt out anytime</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Card>
          <CardContent className="p-8 prose prose-sm max-w-none">
            <p className="text-sm text-gray-600 mb-6">
              <strong>Last Updated:</strong> March 6, 2026<br />
              <strong>Version:</strong> 1.0
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 leading-relaxed">
              Cookies are small text files that are stored on your device (computer, smartphone, or tablet) when you visit 
              a website. They help websites remember your preferences, keep you logged in, and improve your user experience.
            </p>
            <p className="text-gray-700 mt-3">
              Qilly uses cookies and similar technologies (local storage, session storage) to provide our Bill of Quantities 
              (BOQ) pricing service and enhance your experience on our platform.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Cookies We Use</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Essential Cookies (Required)</h3>
            <p className="text-gray-700 mb-4">
              These cookies are <strong>strictly necessary</strong> for the Qilly platform to function. You cannot opt out 
              of these cookies without affecting core functionality.
            </p>

            <div className="overflow-x-auto my-6">
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm">Cookie Name</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm">Purpose</th>
                    <th className="border border-gray-300 px-4 py-3 text-left text-sm">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <code className="bg-gray-200 px-2 py-1 rounded">qilly_auth_token</code>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Keeps you logged in to your account. Without this, you would need to re-enter your credentials on every page.
                    </td>
                    <td className="border border-gray-300 px-4 py-3">7 days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <code className="bg-gray-200 px-2 py-1 rounded">qilly_session</code>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Maintains your session while you browse Qilly. Stores temporary data like your current BOQ draft.
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Until browser closes</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3">
                      <code className="bg-gray-200 px-2 py-1 rounded">qilly_preferences</code>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Remembers your settings (e.g., default province, preferred units, theme preferences).
                    </td>
                    <td className="border border-gray-300 px-4 py-3">1 year</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      <code className="bg-gray-200 px-2 py-1 rounded">qilly_csrf_token</code>
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      Security cookie to prevent Cross-Site Request Forgery (CSRF) attacks. Protects your account.
                    </td>
                    <td className="border border-gray-300 px-4 py-3">Session (browser close)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Local Storage</h3>
            <p className="text-gray-700 mb-4">
              In addition to cookies, Qilly uses <strong>browser local storage</strong> to save:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>BOQ Drafts:</strong> Your unsaved work (so you don't lose it if you refresh the page)</li>
              <li><strong>User Preferences:</strong> Settings like default project type, province selection</li>
              <li><strong>Authentication Tokens:</strong> Secure tokens for API access (encrypted)</li>
              <li><strong>Recent Projects:</strong> Quick access to your last 5 BOQ projects</li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm">
              Local storage data stays on your device and is not transmitted to our servers unless you explicitly save or submit data.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. What We DON'T Use</h2>
            
            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 my-6">
              <h3 className="font-bold text-green-900 mb-3">Privacy-First Approach</h3>
              <p className="text-sm text-green-800 mb-3">
                Unlike many websites, Qilly does <strong>NOT</strong> use:
              </p>
              <ul className="text-sm text-green-900 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No Google Analytics:</strong> We don't track your behavior across pages</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No Facebook Pixel:</strong> We don't share your data with social media</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No Advertising Cookies:</strong> We don't serve targeted ads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No Cross-Site Tracking:</strong> We don't follow you around the internet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">✓</span>
                  <span><strong>No Third-Party Trackers:</strong> We don't embed external tracking scripts</span>
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">4. How We Use Cookies</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Authentication & Security</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Keep you logged in across pages (so you don't have to re-login constantly)</li>
              <li>Verify your identity when you access account settings or make changes</li>
              <li>Prevent unauthorized access and Cross-Site Request Forgery (CSRF) attacks</li>
              <li>Detect suspicious login activity (e.g., login from unusual location)</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 User Experience</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Remember your BOQ drafts (so you don't lose work if you refresh)</li>
              <li>Save your preferences (default province, units, display settings)</li>
              <li>Pre-fill forms with your previous selections (saves time)</li>
              <li>Restore your session if you accidentally close the browser</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Performance</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Cache frequently accessed data to reduce loading times</li>
              <li>Store calculation results temporarily (so you can navigate back without recalculating)</li>
              <li>Optimize API calls by storing non-sensitive data locally</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">5. How to Control Cookies</h2>
            
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Browser Settings</h3>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings:
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
              <p className="font-semibold text-blue-900 mb-3">Popular Browsers:</p>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>
                  <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data → 
                  "Block third-party cookies" or "Block all cookies"
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong> Preferences → Privacy & Security → Cookies and Site Data → 
                  Manage settings
                </li>
                <li>
                  <strong>Safari:</strong> Preferences → Privacy → "Block all cookies" or "Prevent cross-site tracking"
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Clear Cookies</h3>
            <p className="text-gray-700 mb-3">
              To delete existing cookies:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Open your browser settings</li>
              <li>Navigate to "Privacy" or "Security" section</li>
              <li>Select "Clear browsing data" or "Clear cookies"</li>
              <li>Choose "Cookies and site data"</li>
              <li>Select the time range (e.g., "All time")</li>
              <li>Click "Clear data"</li>
            </ul>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
              <p className="text-sm text-yellow-900">
                <strong>Warning:</strong> If you block or delete all cookies, you will be logged out of Qilly and may 
                lose access to essential features. Essential cookies are required for the platform to function.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3 Incognito/Private Mode</h3>
            <p className="text-gray-700 mb-3">
              Use private browsing mode to prevent cookies from being stored:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Chrome:</strong> Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)</li>
              <li><strong>Firefox:</strong> Ctrl+Shift+P (Windows) or Cmd+Shift+P (Mac)</li>
              <li><strong>Safari:</strong> File → New Private Window</li>
              <li><strong>Edge:</strong> Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)</li>
            </ul>
            <p className="text-gray-700 mt-3 text-sm">
              Note: You'll still need to log in each time in private mode, and your BOQ drafts won't be saved.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 my-6">
              <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Cookie Security Measures
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li>
                  <strong>HTTP-Only Cookies:</strong> Authentication cookies cannot be accessed by JavaScript (prevents XSS attacks)
                </li>
                <li>
                  <strong>Secure Flag:</strong> Cookies are only transmitted over HTTPS (encrypted connections)
                </li>
                <li>
                  <strong>SameSite Attribute:</strong> Cookies are not sent with cross-site requests (prevents CSRF attacks)
                </li>
                <li>
                  <strong>Short Expiration:</strong> Session cookies expire when you close the browser
                </li>
                <li>
                  <strong>Encrypted Tokens:</strong> Sensitive data in cookies is encrypted (not readable by third parties)
                </li>
              </ul>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">7. Updates to This Policy</h2>
            <p className="text-gray-700 mb-3">
              We may update this Cookie Policy from time to time to reflect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Changes in cookie technology</li>
              <li>New features or functionality on Qilly</li>
              <li>Legal or regulatory requirements</li>
            </ul>
            <p className="text-gray-700 mt-3">
              When we update this policy, we will change the "Last Updated" date at the top of this page. We encourage you 
              to review this policy periodically.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">8. Contact Us</h2>
            
            <div className="bg-gray-100 rounded-lg p-6 my-6">
              <p className="text-gray-700 mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Email:</strong> <a href="mailto:privacy@qilly.co.za" className="text-[#00b4d8] underline">privacy@qilly.co.za</a></p>
                <p><strong>Subject Line:</strong> "Cookie Policy Inquiry"</p>
                <p><strong>Response Time:</strong> Within 7 business days</p>
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-blue-900 mb-3">Related Policies</h3>
              <p className="text-sm text-blue-800 mb-3">
                For more information about how we protect your data:
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="/privacy-policy" 
                  className="inline-block bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Privacy Policy (POPIA)
                </a>
                <a 
                  href="/terms-of-service" 
                  className="inline-block bg-white text-blue-700 px-4 py-2 rounded-lg border border-blue-300 hover:bg-blue-100 transition-colors text-sm font-medium"
                >
                  Terms of Service
                </a>
              </div>
            </div>

            <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-600">
              <p><strong>Last Updated:</strong> March 6, 2026</p>
              <p><strong>Version:</strong> 1.0</p>
              <p className="mt-2 text-xs text-gray-500">
                Compliant with POPIA and ECTA (Electronic Communications and Transactions Act)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
