import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Presentation, FileCode, Download, Shield, Building2 } from 'lucide-react';
import { generateAPISpecPDF } from '@/utils/generateSupplierEngagementPDFs';
import { generateAPISpecPDFWithCompliance } from '@/utils/generateSupplierEngagementPDFsV2';
import { generateAPISpecMultiSectorPDF } from '@/utils/generateSupplierEngagementPDFsV3';
import { generatePitchDeckPPT } from '@/utils/generateSupplierPitchDeckPPT';

export function SupplierEngagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Qilly Supplier Engagement Kit
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Complete documentation for onboarding suppliers with daily price API integration
          </p>
          <div className="mt-4 inline-block bg-amber-100 border border-amber-300 rounded-lg px-4 py-2">
            <p className="text-sm text-amber-900 font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              NEW: v2.0 API with DHS Construction Compliance Features
            </p>
          </div>
        </div>

        {/* Documents */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Pitch Deck Card */}
          <Card className="border-2 border-[#00b4d8]">
            <CardHeader className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Presentation className="w-6 h-6" />
                Supplier Pitch Deck
              </CardTitle>
              <CardDescription className="text-blue-50">
                Value proposition presentation
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-slate-600 text-sm">
                10-slide presentation covering:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li>• Partnership value proposition</li>
                <li>• How the integration works</li>
                <li>• Partnership models</li>
                <li>• Technical requirements</li>
                <li>• Price integrity safeguards</li>
                <li>• ROI projections</li>
                <li>• Onboarding timeline (7 weeks)</li>
              </ul>
              <Button 
                onClick={generatePitchDeckPPT}
                className="w-full bg-[#00b4d8] hover:bg-[#0096c7] flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PPT
              </Button>
            </CardContent>
          </Card>

          {/* API Spec v1.0 Card */}
          <Card className="border-2 border-slate-300">
            <CardHeader className="bg-gradient-to-r from-slate-600 to-slate-700 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <FileCode className="w-6 h-6" />
                API Spec v1.0 (Legacy)
              </CardTitle>
              <CardDescription className="text-slate-200">
                Basic API without compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-slate-600 text-sm">
                Standard API documentation:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li>• REST API endpoints</li>
                <li>• Authentication (API Key/OAuth)</li>
                <li>• Core data schema</li>
                <li>• Daily sync schedule</li>
                <li>• Price validation system</li>
                <li>• Error handling</li>
                <li>• Testing procedures</li>
                <li>• SLA commitments</li>
              </ul>
              <Button 
                onClick={generateAPISpecPDF}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-slate-400 text-slate-700 hover:bg-slate-100"
              >
                <Download className="w-4 h-4" />
                Download v1.0 PDF
              </Button>
              <p className="text-xs text-slate-500 text-center">
                For suppliers not serving DHS projects
              </p>
            </CardContent>
          </Card>

          {/* API Spec v2.0 with DHS Compliance */}
          <Card className="border-2 border-amber-400 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="w-6 h-6" />
                API Spec v2.0 + Compliance
              </CardTitle>
              <CardDescription className="text-amber-50">
                🆕 DHS Construction Compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-amber-900 mb-1">✨ RECOMMENDED FOR DHS PROJECTS</p>
                <p className="text-xs text-amber-800">Premium visibility for suppliers with compliance data</p>
              </div>
              <p className="text-slate-600 text-sm font-semibold">
                All v1.0 features PLUS:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="font-semibold text-amber-900">• 🏗️ SANS 1200 compliance data</li>
                <li className="font-semibold text-amber-900">• 📋 NHBRC alignment data</li>
                <li className="font-semibold text-amber-900">• ✅ AGRÉMENT certification</li>
                <li className="font-semibold text-amber-900">• 🔒 POPIA requirements (mandatory)</li>
                <li className="font-semibold text-amber-900">• 🎯 BBBEE tracking (mandatory)</li>
                <li className="font-semibold text-amber-900">• 📊 PFMA/MFMA audit support</li>
                <li>• Weekly compliance data sync</li>
                <li>• Compliance validation layer</li>
                <li>• Certificate expiry alerts</li>
              </ul>
              <Button 
                onClick={generateAPISpecPDFWithCompliance}
                className="w-full bg-amber-500 hover:bg-amber-600 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download v2.0 PDF (Compliance Edition)
              </Button>
              <p className="text-xs text-amber-700 text-center font-semibold">
                Required for Department of Human Settlements projects
              </p>
            </CardContent>
          </Card>

          {/* API Spec v3.0 Multi-Sector */}
          <Card className="border-2 border-blue-400 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="w-6 h-6" />
                API Spec v3.0 + Multi-Sector
              </CardTitle>
              <CardDescription className="text-blue-50">
                🆕 Multi-Sector Compliance
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <p className="text-xs font-semibold text-blue-900 mb-1">✨ RECOMMENDED FOR MULTI-SECTOR PROJECTS</p>
                <p className="text-xs text-blue-800">Premium visibility for suppliers with compliance data</p>
              </div>
              <p className="text-slate-600 text-sm font-semibold">
                All v1.0 features PLUS:
              </p>
              <ul className="text-sm text-slate-600 space-y-1.5">
                <li className="font-semibold text-blue-900">• 🏗️ SANS 1200 compliance data</li>
                <li className="font-semibold text-blue-900">• 📋 NBR alignment data</li>
                <li className="font-semibold text-blue-900">• ✅ AGRÉMENT certification</li>
                <li className="font-semibold text-blue-900">• 🔒 POPIA requirements (mandatory)</li>
                <li className="font-semibold text-blue-900">• 🎯 BBBEE tracking (mandatory)</li>
                <li className="font-semibold text-blue-900">• 📊 PFMA/MFMA audit support</li>
                <li>• Weekly compliance data sync</li>
                <li>• Compliance validation layer</li>
                <li>• Certificate expiry alerts</li>
              </ul>
              <Button 
                onClick={generateAPISpecMultiSectorPDF}
                className="w-full bg-blue-500 hover:bg-blue-600 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download v3.0 PDF (Multi-Sector Edition)
              </Button>
              <p className="text-xs text-blue-700 text-center font-semibold">
                Required for multi-sector projects
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Features Explainer */}
        <Card className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <Shield className="w-6 h-6" />
              What are DHS Construction Compliance Features?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">6 Compliance Features in v2.0 API:</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">1. SANS 1200 Compliance</p>
                    <p className="text-xs text-slate-600">Product standard verification for SA construction</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">2. NHBRC Alignment</p>
                    <p className="text-xs text-slate-600">National Building Regulations compliance</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">3. AGRÉMENT Certification</p>
                    <p className="text-xs text-slate-600">Product certification tracking & expiry monitoring</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">4. POPIA Compliance</p>
                    <p className="text-xs text-slate-600">Data protection (mandatory for all suppliers)</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">5. BBBEE Tracking</p>
                    <p className="text-xs text-slate-600">BEE level & preferential procurement (mandatory)</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-amber-200">
                    <p className="font-semibold text-sm text-amber-900">6. PFMA/MFMA Audit Trails</p>
                    <p className="text-xs text-slate-600">Public finance audit support (automatic)</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Benefits for Suppliers:</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Premium Visibility:</strong> Priority display for DHS housing projects</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Competitive Advantage:</strong> First-of-its-kind compliance in SA</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Automated Verification:</strong> No manual certificate checks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Expiry Alerts:</strong> 30-day warnings for BBBEE/AGRÉMENT renewal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Government Projects:</strong> Meet DHS procurement standards automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span><strong>Optional Fields:</strong> SANS/NBR/AGRÉMENT data optional (but recommended)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-0.5">⚠</span>
                    <span><strong>POPIA & BBBEE:</strong> Mandatory for all suppliers (required fields)</span>
                  </li>
                </ul>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900 mb-1">📊 DHS Value Proposition</p>
                  <p className="text-xs text-blue-800">
                    Version 2.0 API positions Qilly as the first construction procurement platform in South Africa with integrated government-grade compliance checking. Suppliers providing compliance data receive priority placement on DHS housing projects worth R10M-R43M annually.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Version Comparison Table */}
        <Card className="mt-6 bg-white">
          <CardHeader>
            <CardTitle className="text-slate-900">API Version Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-300">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Feature</th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">v1.0 (Legacy)</th>
                    <th className="text-center py-3 px-4 font-semibold bg-amber-50 text-amber-900">v2.0 (Compliance Edition)</th>
                    <th className="text-center py-3 px-4 font-semibold bg-blue-50 text-blue-900">v3.0 (Multi-Sector Edition)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">REST API Endpoints</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Authentication (API Key/OAuth)</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓ (encrypted)</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓ (encrypted)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Core Product Data Schema</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓ Extended</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓ Extended</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Daily Price Sync (06:00 SAST)</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Price Validation (Multi-layer)</td>
                    <td className="text-center py-3 px-4">✓</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓ + Compliance Layer</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓ + Compliance Layer</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-amber-50">
                    <td className="py-3 px-4 font-semibold text-amber-900">SANS 1200 Compliance Data</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-100 font-semibold text-amber-900">✓ Optional</td>
                    <td className="text-center py-3 px-4 bg-blue-100 font-semibold text-blue-900">✓ Optional</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-amber-50">
                    <td className="py-3 px-4 font-semibold text-amber-900">NBR Alignment Data</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-100 font-semibold text-amber-900">✓ Optional</td>
                    <td className="text-center py-3 px-4 bg-blue-100 font-semibold text-blue-900">✓ Optional</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-amber-50">
                    <td className="py-3 px-4 font-semibold text-amber-900">AGRÉMENT Certification</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-100 font-semibold text-amber-900">✓ Optional</td>
                    <td className="text-center py-3 px-4 bg-blue-100 font-semibold text-blue-900">✓ Optional</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-red-50">
                    <td className="py-3 px-4 font-semibold text-red-900">POPIA Compliance (Data Protection)</td>
                    <td className="text-center py-3 px-4">Basic</td>
                    <td className="text-center py-3 px-4 bg-red-100 font-semibold text-red-900">✓ MANDATORY</td>
                    <td className="text-center py-3 px-4 bg-red-100 font-semibold text-red-900">✓ MANDATORY</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-red-50">
                    <td className="py-3 px-4 font-semibold text-red-900">BBBEE Tracking (BEE Level)</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-red-100 font-semibold text-red-900">✓ MANDATORY</td>
                    <td className="text-center py-3 px-4 bg-red-100 font-semibold text-red-900">✓ MANDATORY</td>
                  </tr>
                  <tr className="border-b border-slate-200 bg-amber-50">
                    <td className="py-3 px-4 font-semibold text-amber-900">PFMA/MFMA Audit Trails</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-100 font-semibold text-amber-900">✓ Automatic</td>
                    <td className="text-center py-3 px-4 bg-blue-100 font-semibold text-blue-900">✓ Automatic</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Weekly Compliance Data Sync</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">Certificate Expiry Alerts</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓ (30-day notice)</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓ (30-day notice)</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-3 px-4">7-Year Audit Data Retention</td>
                    <td className="text-center py-3 px-4">—</td>
                    <td className="text-center py-3 px-4 bg-amber-50">✓</td>
                    <td className="text-center py-3 px-4 bg-blue-50">✓</td>
                  </tr>
                  <tr className="bg-slate-50 font-semibold">
                    <td className="py-3 px-4">Recommended For</td>
                    <td className="text-center py-3 px-4 text-slate-700">Private contractors</td>
                    <td className="text-center py-3 px-4 bg-amber-100 text-amber-900">DHS Government Projects</td>
                    <td className="text-center py-3 px-4 bg-blue-100 text-blue-900">Multi-Sector Projects</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-1">Migration Path for Existing v1.0 Suppliers</p>
                <p className="text-xs text-blue-800">
                  Current suppliers can upgrade to v2.0 by adding BBBEE metadata and optional compliance fields. Qilly provides migration support and testing. Average upgrade time: 2-3 weeks. Contact api@qilly.co.za for migration assistance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <Card className="mt-8 bg-gradient-to-r from-[#00b4d8] to-[#0096c7] text-white">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Partner?</h3>
              <p className="text-blue-100 mb-4">
                Download the documents above and contact our partnership team to get started.
              </p>
              <div className="space-y-1 text-sm">
                <p>Partnership Inquiries: partnerships@qilly.co.za</p>
                <p>Technical Integration: api@qilly.co.za</p>
                <p>Compliance Questions: compliance@qilly.co.za (NEW!)</p>
                <p>Phone: +27 (0)11 123 4567</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}