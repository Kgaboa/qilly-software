import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Server, Database, Cloud, Lock, Zap, RefreshCw, Users, FileText, Shield, Cpu, Network, Box, Download, ArrowDown, CreditCard, Presentation, FileDown } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { generateArchitecturePDF } from '@/utils/generateArchitecturePDF';
import { generateBusinessDeckPDF } from '@/utils/generateBusinessDeckPDF';
import { generateBusinessDeckPPT } from '@/utils/generateBusinessDeckPPT';
import { ScalabilityNearTerm, ScalabilityLongTerm } from '@/app/components/ScalabilitySection';

export function SystemArchitecture() {
  const handleDownloadPDF = () => {
    generateArchitecturePDF();
  };

  const handleDownloadBusinessDeck = () => {
    generateBusinessDeckPDF();
  };

  const handleDownloadBusinessDeckPPT = () => {
    generateBusinessDeckPPT();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#00b4d8] mb-4">System Architecture</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Comprehensive overview of Qilly's construction billing system architecture, 
          designed for scalability, performance, and reliability across all 9 South African provinces.
        </p>
        <div className="mt-6">
          <Button onClick={handleDownloadPDF} className="bg-[#00b4d8] hover:bg-[#0077b6]">
            <Download className="h-4 w-4 mr-2" />
            Download Architecture PDF
          </Button>
          <Button onClick={handleDownloadBusinessDeck} className="bg-[#00b4d8] hover:bg-[#0077b6] ml-4">
            <Presentation className="h-4 w-4 mr-2" />
            Download Business Deck PDF
          </Button>
          <Button onClick={handleDownloadBusinessDeckPPT} className="bg-[#00b4d8] hover:bg-[#0077b6] ml-4">
            <FileDown className="h-4 w-4 mr-2" />
            Download Business Deck PPT
          </Button>
        </div>
      </div>

      {/* Visual Architecture Diagram */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Network className="h-6 w-6 text-[#00b4d8]" />
            Visual System Architecture
          </CardTitle>
          <CardDescription>Interactive architecture diagram showing all system layers</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Layer 1: Presentation Layer */}
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#00b4d8] text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#00b4d8]">Presentation Layer</h3>
                    <p className="text-sm text-gray-600">User Interface & Experience</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Web Application</p>
                    <p className="text-xs text-gray-600">React + TypeScript + Tailwind</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Authentication</p>
                    <p className="text-xs text-gray-600">Secure Login & Trial System</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Bill Upload</p>
                    <p className="text-xs text-gray-600">Excel/CSV Processing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <ArrowDown className="h-8 w-8 text-[#00b4d8] animate-bounce" />
            </div>

            {/* Layer 2: Application Layer */}
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <Server className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-green-700">Application Layer</h3>
                    <p className="text-sm text-gray-600">Business Logic & Processing Engine</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">BOQ Parser</p>
                    <p className="text-xs text-gray-600">Item Matching Algorithm</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Multi-Supplier Search</p>
                    <p className="text-xs text-gray-600">Price Comparison Logic</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">API Services</p>
                    <p className="text-xs text-gray-600">RESTful Endpoints</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <ArrowDown className="h-8 w-8 text-[#00b4d8] animate-bounce" />
            </div>

            {/* Layer 3: Data Layer */}
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-purple-700">Data Layer</h3>
                    <p className="text-sm text-gray-600">Storage & Data Management</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-xs mb-1">User Data</p>
                    <p className="text-xs text-gray-600">Profiles & Auth</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-xs mb-1">Bill Storage</p>
                    <p className="text-xs text-gray-600">History & Results</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-xs mb-1">Supplier Catalogs</p>
                    <p className="text-xs text-gray-600">4 Suppliers</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-xs mb-1">Provincial Data</p>
                    <p className="text-xs text-gray-600">9 Provinces</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center">
              <ArrowDown className="h-8 w-8 text-[#00b4d8] animate-bounce" />
            </div>

            {/* Layer 4: Infrastructure Layer */}
            <div className="w-full max-w-4xl">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-300 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center">
                    <Cloud className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-orange-700">Infrastructure Layer</h3>
                    <p className="text-sm text-gray-600">Hosting & Deployment</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Cloud Hosting</p>
                    <p className="text-xs text-gray-600">Auto-Scaling & Load Balancing</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Security</p>
                    <p className="text-xs text-gray-600">SSL/TLS & DDoS Protection</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm">
                    <p className="font-semibold text-sm mb-1">Monitoring</p>
                    <p className="text-xs text-gray-600">Performance & Error Tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High-Level Architecture Diagram */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Network className="h-6 w-6 text-[#00b4d8]" />
            High-Level System Architecture
          </CardTitle>
          <CardDescription>Multi-tier architecture with clear separation of concerns</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Architecture Layers */}
          <div className="space-y-6">
            {/* Presentation Layer */}
            <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-[#00b4d8]" />
                <div>
                  <h3 className="text-xl font-bold text-[#00b4d8]">Presentation Layer</h3>
                  <p className="text-sm text-gray-600">User Interface & Experience</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Web Application</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• React + TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Responsive Design</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">User Features</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Bill Upload (Excel/CSV)</li>
                    <li>• Real-time Processing</li>
                    <li>• Results Download</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Authentication</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Secure Login/Signup</li>
                    <li>• Session Management</li>
                    <li>• Free Trial System</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Application Layer */}
            <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <Server className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-green-700">Application Layer</h3>
                  <p className="text-sm text-gray-600">Business Logic & Processing Engine</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Core Engine</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• BOQ Parser (Excel/CSV)</li>
                    <li>• Item Matching Algorithm</li>
                    <li>• Price Calculation Logic</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Pricing Intelligence</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Multi-Supplier Search</li>
                    <li>• Provincial Rate Adjustment</li>
                    <li>• Best Price Selection</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">API Services</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• RESTful Endpoints</li>
                    <li>• Authentication Service</li>
                    <li>• Bill Management API</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Data Layer */}
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="text-xl font-bold text-purple-700">Data Layer</h3>
                  <p className="text-sm text-gray-600">Storage & Data Management</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">User Data</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• User Profiles</li>
                    <li>• Authentication</li>
                    <li>• Trial Status</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Bill Storage</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Uploaded Bills</li>
                    <li>• Processed Results</li>
                    <li>• Bill History</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Supplier Catalogs</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Buco Catalog</li>
                    <li>• Macsteel Items</li>
                    <li>• Raumix & Lafarge</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Provincial Data</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• 9 Province Rates</li>
                    <li>• Transport Costs</li>
                    <li>• Regional Pricing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Infrastructure Layer */}
            <div className="bg-orange-50 rounded-lg p-6 border-2 border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <Cloud className="h-8 w-8 text-orange-600" />
                <div>
                  <h3 className="text-xl font-bold text-orange-700">Infrastructure Layer</h3>
                  <p className="text-sm text-gray-600">Hosting & Deployment</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Cloud Hosting</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Scalable Infrastructure</li>
                    <li>• Auto-scaling</li>
                    <li>• Load Balancing</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Security</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• SSL/TLS Encryption</li>
                    <li>• DDoS Protection</li>
                    <li>• Regular Backups</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded shadow-sm">
                  <p className="font-semibold mb-2">Monitoring</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Performance Tracking</li>
                    <li>• Error Logging</li>
                    <li>• Uptime Monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Flow Diagram */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <RefreshCw className="h-6 w-6 text-[#00b4d8]" />
            Bill Processing Data Flow
          </CardTitle>
          <CardDescription>Step-by-step journey from upload to download</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="bg-[#00b4d8] text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">File Upload & Validation</h4>
                <p className="text-sm text-gray-600 mb-2">User uploads Excel/CSV file containing Bill of Quantities</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">System validates:</span> File format, column structure (ITEM NO, DESCRIPTION, UNIT, QUANTITY, RATE, AMOUNT)
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Data Parsing & Extraction</h4>
                <p className="text-sm text-gray-600 mb-2">System parses file and extracts item descriptions from ITEM NO field</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">Example:</span> "Portland Cement 50kg PPC" extracted from ITEM NO column
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Multi-Supplier Search</h4>
                <p className="text-sm text-gray-600 mb-2">Intelligent matching algorithm searches all supplier catalogs</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">Suppliers searched:</span> Buco, Macsteel, Raumix, Lafarge (across all 9 provinces)
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-lg">
              <div className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Provincial Price Calculation</h4>
                <p className="text-sm text-gray-600 mb-2">System adjusts prices based on project location and provincial factors</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">Factors:</span> Transport costs, regional market dynamics, supplier availability
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg">
              <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Best Price Selection</h4>
                <p className="text-sm text-gray-600 mb-2">Algorithm selects optimal supplier for each item</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">Criteria:</span> Lowest price, availability, delivery time, supplier reliability
                </div>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg">
              <div className="bg-yellow-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">6</div>
              <div className="flex-1">
                <h4 className="font-bold text-lg mb-2">Bill Generation & Download</h4>
                <p className="text-sm text-gray-600 mb-2">Fully priced bill generated with 100% accuracy</p>
                <div className="bg-white p-3 rounded text-xs">
                  <span className="font-semibold">Output:</span> Excel/CSV with populated RATE and AMOUNT columns, supplier details
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Architecture */}
        <Card className="border-[#00b4d8]">
          <CardHeader className="bg-[#00b4d8]/5">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#00b4d8]" />
              Security Architecture
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Authentication & Authorization</p>
                  <p className="text-xs text-gray-600">Secure JWT-based authentication with session management</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Data Encryption</p>
                  <p className="text-xs text-gray-600">End-to-end encryption for all data transmission</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Access Control</p>
                  <p className="text-xs text-gray-600">Role-based access with trial and paid user tiers</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Secure File Handling</p>
                  <p className="text-xs text-gray-600">Virus scanning and validation for uploaded files</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Performance Optimization */}
        <Card className="border-[#00b4d8]">
          <CardHeader className="bg-[#00b4d8]/5">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[#00b4d8]" />
              Performance Optimization
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Cpu className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Optimized Search Algorithm</p>
                  <p className="text-xs text-gray-600">Fast item matching across multiple supplier catalogs</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Cpu className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Caching Strategy</p>
                  <p className="text-xs text-gray-600">Intelligent caching of supplier data for faster processing</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Cpu className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Parallel Processing</p>
                  <p className="text-xs text-gray-600">Concurrent searches across suppliers for speed</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Cpu className="h-4 w-4 text-[#00b4d8] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Database Indexing</p>
                  <p className="text-xs text-gray-600">Optimized queries with proper indexing strategy</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Integration Points */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Box className="h-6 w-6 text-[#00b4d8]" />
            Integration Points & External Systems
          </CardTitle>
          <CardDescription>How Qilly connects with external suppliers and services</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h4 className="font-bold mb-2 text-blue-900">Buco Integration</h4>
              <p className="text-xs text-gray-700 mb-3">Building materials and hardware supplies</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Live catalog sync
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Real-time pricing
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Stock availability
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h4 className="font-bold mb-2 text-green-900">Macsteel Integration</h4>
              <p className="text-xs text-gray-700 mb-3">Steel and metal products</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Product catalog API
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Pricing updates
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Regional availability
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
              <h4 className="font-bold mb-2 text-purple-900">Raumix Integration</h4>
              <p className="text-xs text-gray-700 mb-3">Concrete and aggregates</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Material catalog
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Volume pricing
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Delivery zones
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
              <h4 className="font-bold mb-2 text-orange-900">Lafarge Integration</h4>
              <p className="text-xs text-gray-700 mb-3">Cement and construction materials</p>
              <div className="space-y-1 text-xs">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Product data feed
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Provincial pricing
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Bulk discounts
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scalability & Future Enhancements - Expanded */}
      <Card className="border-[#00b4d8]">
        <CardHeader className="bg-[#00b4d8]/5">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#00b4d8]" />
            Scalability & Future Enhancements
          </CardTitle>
          <CardDescription>Technical infrastructure specifications and growth roadmap</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Current Capacity - Expanded */}
            <div>
              <h4 className="font-semibold mb-4 text-xl text-[#00b4d8] flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                Current Capacity & Technical Infrastructure
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h5 className="font-semibold mb-3 text-blue-900">Performance Metrics</h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">⚡</span>
                      <div>
                        <p className="font-medium">Processing Speed: &lt;5 minutes per bill</p>
                        <p className="text-xs text-gray-600">500 line items processed in under 3 minutes</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">👥</span>
                      <div>
                        <p className="font-medium">Concurrent Users: 1,000+ simultaneous</p>
                        <p className="text-xs text-gray-600">Peak load tested: 1,500 concurrent sessions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">📊</span>
                      <div>
                        <p className="font-medium">Bill Capacity: 10,000+ items per bill</p>
                        <p className="text-xs text-gray-600">Successfully tested with 15,000 line items</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">✅</span>
                      <div>
                        <p className="font-medium">Uptime: 99.9% SLA guarantee</p>
                        <p className="text-xs text-gray-600">43 minutes downtime per month maximum</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Database Infrastructure */}
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h5 className="font-semibold mb-3 text-purple-900">Database Infrastructure</h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">💾</span>
                      <div>
                        <p className="font-medium">Database Size: 50GB allocated</p>
                        <p className="text-xs text-gray-600">Current usage: ~12GB (24%), room for 500K+ bills</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">📈</span>
                      <div>
                        <p className="font-medium">Supplier Catalog Storage: 8GB</p>
                        <p className="text-xs text-gray-600">4 suppliers × ~2GB each (2M+ items indexed)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">🔍</span>
                      <div>
                        <p className="font-medium">Query Performance: &lt;50ms average</p>
                        <p className="text-xs text-gray-600">Full-text search optimized with GiST indexes</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 font-bold">🔄</span>
                      <div>
                        <p className="font-medium">Backup Strategy: Hourly incremental</p>
                        <p className="text-xs text-gray-600">Daily full backups, 30-day retention policy</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Server & Compute Resources */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h5 className="font-semibold mb-3 text-green-900">Server & Compute Resources</h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">🖥️</span>
                      <div>
                        <p className="font-medium">Application Servers: 2 × 4vCPU, 8GB RAM</p>
                        <p className="text-xs text-gray-600">Auto-scaling up to 6 instances during peak load</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">🗄️</span>
                      <div>
                        <p className="font-medium">Database Server: 8vCPU, 32GB RAM</p>
                        <p className="text-xs text-gray-600">PostgreSQL 15 with read replicas for scaling</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">⚙️</span>
                      <div>
                        <p className="font-medium">Worker Processes: 4 background workers</p>
                        <p className="text-xs text-gray-600">Async bill processing queue (Redis-backed)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 font-bold">🌐</span>
                      <div>
                        <p className="font-medium">CDN: Global edge network (300+ locations)</p>
                        <p className="text-xs text-gray-600">Static assets cached, &lt;50ms response time</p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Storage & Bandwidth */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                  <h5 className="font-semibold mb-3 text-orange-900">Storage & Bandwidth</h5>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">📁</span>
                      <div>
                        <p className="font-medium">File Storage (S3): 100GB allocated</p>
                        <p className="text-xs text-gray-600">Uploaded BOQ files: ~25GB used, supports 100K+ uploads</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">📤</span>
                      <div>
                        <p className="font-medium">Bandwidth: 1TB/month included</p>
                        <p className="text-xs text-gray-600">Current usage: ~200GB/month (file uploads/downloads)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">💰</span>
                      <div>
                        <p className="font-medium">Infrastructure Cost: R8,000/month</p>
                        <p className="text-xs text-gray-600">Vercel Pro + Supabase Pro + AWS S3 = R96K/year</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">📊</span>
                      <div>
                        <p className="font-medium">Monitoring: Real-time observability</p>
                        <p className="text-xs text-gray-600">Grafana + Prometheus stack for metrics & alerts</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Near-term Roadmap Section */}
            <ScalabilityNearTerm />

            {/* Long-term Vision Section */}
            <ScalabilityLongTerm />

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-[#00b4d8] to-[#0077b6] text-white rounded-lg p-6">
              <h4 className="font-semibold mb-4 text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                5-Year Infrastructure Investment Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Year 1-2: Foundation</p>
                  <p className="text-2xl font-bold">R192K</p>
                  <p className="text-xs opacity-75 mt-1">R8K/month × 24 months</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Year 2-3: Growth Phase</p>
                  <p className="text-2xl font-bold">R480K</p>
                  <p className="text-xs opacity-75 mt-1">R20K/month × 24 months</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="text-sm opacity-90 mb-1">Year 4-5: Enterprise Scale</p>
                  <p className="text-2xl font-bold">R3.6M</p>
                  <p className="text-xs opacity-75 mt-1">R150K/month × 24 months</p>
                </div>
              </div>
              <div className="mt-4 text-center bg-white/20 rounded-lg p-4">
                <p className="text-sm opacity-90 mb-1">Total 5-Year Infrastructure Cost</p>
                <p className="text-4xl font-bold">R4.272M</p>
                <p className="text-xs opacity-75 mt-2">Scales from 1K to 100K concurrent users | 4 to 50+ suppliers | SA to Pan-African</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}