/**
 * Investor Pitch Deck Generator Component
 * Download Monday's investor presentation
 */

import { useState } from 'react';
import { Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { downloadInvestorPitchDeck } from '@/utils/generateInvestorPitchDeck';

export function InvestorPitchDeckGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'generating' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatus('generating');

    try {
      const file = await downloadInvestorPitchDeck();
      setFileName(file);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error generating pitch deck:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Qilly Investor Pitch Deck
          </h2>
          <p className="text-gray-600 mb-4">
            Download the complete investor presentation for Monday's meeting.
            Includes all key sections: problem, solution, market, competition, financials, and ask.
          </p>

          {/* Features list */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">12 Professional Slides + AI Drawing Feature</p>
                <p className="text-sm text-gray-600">Title, Problem, Solution (with AI extraction), Market, Competition, Revenue, Financials, Traction, Demo, Ask, Returns, Contact</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Complete Competitive Analysis</p>
                <p className="text-sm text-gray-600">Qilly vs Traditional QS, CCS Candy, Buildsmart with head-to-head comparison table</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Financial Projections</p>
                <p className="text-sm text-gray-600">5-year model: R18.5M → R819M revenue, 93% CAGR, 40% EBITDA margin</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Return Scenarios</p>
                <p className="text-sm text-gray-600">Conservative, base (39x MOIC), and optimistic scenarios with IRR calculations</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Current Traction</p>
                <p className="text-sm text-gray-600">31 suppliers, 105 products, 1.4s processing, government LOI</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Investment Ask</p>
                <p className="text-sm text-gray-600">R2-5M bridge round, 10-15% equity, clear use of funds</p>
              </div>
            </div>
          </div>

          {/* Key highlights */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📊 Presentation Highlights:</h3>
            <ul className="space-y-1.5 text-sm text-blue-800">
              <li>• <strong>🤖 NEW: AI Drawing Analysis:</strong> Upload drawings (PDF/DWG) → Auto-extract BOQ → Full pricing</li>
              <li>• <strong>R32.5B Problem:</strong> Professional fees waste (R5.7B) + delays (R12B) + fraud (R14.8B)</li>
              <li>• <strong>R54.6B TAM:</strong> South African construction procurement market</li>
              <li>• <strong>No Direct Competitors:</strong> Only platform with AI extraction + automated pricing</li>
              <li>• <strong>Working Product:</strong> Live demo ready at sit.qilly.co.za</li>
              <li>• <strong>39x Return Potential:</strong> R25M investment → R980M exit in Year 5</li>
            </ul>
          </div>

          {/* Competitive positioning summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-green-900 mb-2">🎯 Competitive Positioning (Slide 5):</h3>
            <div className="text-sm text-green-800 space-y-2">
              <div>
                <strong>Traditional QS Firms:</strong> 3-7 days, R15k-R50k per BOQ, manual measurements from drawings
              </div>
              <div>
                <strong>CCS Candy:</strong> Desktop tool for QS professionals (NOT automated, NO AI extraction, NO live data)
              </div>
              <div>
                <strong>Buildsmart:</strong> Construction ERP for contractors (NOT BOQ pricing focused, NO drawing analysis)
              </div>
              <div className="pt-2 border-t border-green-300">
                <strong className="text-green-900">QILLY:</strong> Only platform with AI drawing extraction + automated BOQ pricing + materials/labor/equipment costing across 9 provinces
              </div>
            </div>
          </div>

          {/* AI Drawing Feature Callout */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-300 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              NEW GAME-CHANGER: AI Drawing Extraction
            </h3>
            <div className="text-sm text-purple-900 space-y-2">
              <div className="font-semibold">
                Qilly eliminates TWO bottlenecks, not just one:
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold text-purple-700">❌ OLD PROCESS:</div>
                  <ol className="list-decimal list-inside space-y-1 mt-1">
                    <li>QS manually measures drawings (2-5 days)</li>
                    <li>QS manually creates BOQ (1 day)</li>
                    <li>QS manually prices BOQ (1-2 days)</li>
                  </ol>
                  <div className="mt-2 font-semibold text-red-700">Total: 4-8 days + R15k-R50k</div>
                </div>
                <div>
                  <div className="font-semibold text-green-700">✅ QILLY PROCESS:</div>
                  <ol className="list-decimal list-inside space-y-1 mt-1">
                    <li>AI extracts BOQ from drawing (2 mins)</li>
                    <li>AI prices with materials/labor/equipment (3 mins)</li>
                    <li>Download comprehensive report</li>
                  </ol>
                  <div className="mt-2 font-semibold text-green-700">Total: 5 minutes + R0</div>
                </div>
              </div>
              <div className="pt-3 border-t border-purple-300 font-semibold text-center text-purple-900">
                This feature positions Qilly as THE market leader - no competitor has AI extraction + full costing
              </div>
            </div>
          </div>

          {/* Generate button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Generating Presentation...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download Investor Pitch Deck (.pptx)
                </>
              )}
            </Button>

            {status === 'success' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Downloaded: {fileName}</span>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error generating presentation</span>
              </div>
            )}
          </div>

          {/* Usage instructions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">📝 How to Use:</h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li><strong>1. Download:</strong> Click the button above to generate and download the PowerPoint file</li>
              <li><strong>2. Review:</strong> Open in PowerPoint/Google Slides and review all 12 slides</li>
              <li><strong>3. Customize:</strong> Update contact details, add your photo, adjust branding (optional)</li>
              <li><strong>4. Practice:</strong> Rehearse the presentation 3-5 times before Monday</li>
              <li><strong>5. Demo Ready:</strong> Have live demo at sit.qilly.co.za open in separate tab</li>
            </ol>
          </div>

          {/* Timing guide */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-900 mb-2">⏱️ Presentation Timing (30-min meeting):</h3>
            <div className="grid grid-cols-2 gap-3 text-sm text-amber-800">
              <div>
                <div className="flex justify-between">
                  <span>0:00-0:03 • Title & Introduction</span>
                  <span className="font-mono">3 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:03-0:05 • Problem (Slide 2)</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:05-0:07 • Solution (Slide 3)</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:07-0:09 • Market (Slide 4)</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:09-0:11 • Competition (Slide 5)</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:11-0:23 • LIVE DEMO ⭐</span>
                  <span className="font-mono font-bold">12 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:23-0:25 • Revenue & Financials</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between">
                  <span>0:25-0:28 • Investment Ask</span>
                  <span className="font-mono">3 min</span>
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-amber-300">
                <div className="flex justify-between font-semibold">
                  <span>0:28-0:30 • Q&A / Next Steps</span>
                  <span className="font-mono">2 min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional resources */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">📚 Additional Resources Available:</h3>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Executive Summary</strong> - Send to investor 24-48h before meeting</li>
              <li>• <strong>Problem Statement</strong> - Deep dive on R32.5B crisis</li>
              <li>• <strong>Market Analysis</strong> - Full competitive landscape research</li>
              <li>• <strong>5-Year Projections</strong> - Detailed financial model with assumptions</li>
              <li>• <strong>Product Backlog</strong> - Complete technical roadmap</li>
            </ul>
            <p className="text-sm text-gray-600 mt-2 italic">
              All documents available in Documentation → Investor Materials section
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}