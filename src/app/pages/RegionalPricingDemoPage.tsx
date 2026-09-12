import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { BillUpload } from '@/app/components/BillUpload';
import { RegionalPricedBillView } from '@/app/components/RegionalPricedBillView';
import { priceRegionalBill, type RegionalPricedBillItem } from '@/utils/regionalPricingEngine';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface BillItem {
  code: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  isRateOnly?: boolean;
}

interface ProjectSettings {
  province: string;
  municipality?: string;
  profitMargin: string;
  cidbGrading: string;
  duration: string;
  machineryType: string;
}

export function RegionalPricingDemoPage() {
  const [pricedItems, setPricedItems] = useState<RegionalPricedBillItem[]>([]);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings | undefined>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingTime, setProcessingTime] = useState<number>(0);

  const handleProcess = (billItems: BillItem[], settings?: ProjectSettings) => {
    console.log('🕐 TIMING START: handleProcess called');
    setIsProcessing(true);
    setProjectSettings(settings);

    // Start timing
    const startTime = performance.now();
    console.log('🕐 Start time recorded:', startTime);

    // Simulate processing delay
    setTimeout(() => {
      console.log('🕐 setTimeout callback executing...');
      const results = priceRegionalBill(billItems, settings);
      
      // Calculate processing time
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      console.log('🕐 Processing completed:', {
        startTime,
        endTime,
        totalTime,
        totalTimeInSeconds: (totalTime / 1000).toFixed(2),
        totalTimeFormatted: totalTime < 1000 ? `${totalTime.toFixed(0)}ms` : `${(totalTime / 1000).toFixed(2)}s`
      });
      
      console.log('🕐 Setting processingTime state to:', totalTime);
      setProcessingTime(totalTime);
      setPricedItems(results);
      setIsProcessing(false);
    }, 1000);
  };

  const handleBack = () => {
    setPricedItems([]);
    setProjectSettings(undefined);
    setProcessingTime(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-[#00b4d8] text-white p-3 rounded-lg">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Regional Price Optimization Demo</h1>
              <p className="text-lg text-gray-600 mt-1">
                Experience Qilly's location-aware BOQ pricing with transport cost optimization
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {pricedItems.length === 0 ? (
          <>
            {/* Info Card */}
            <Card className="mb-6 border-[#00b4d8] bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardHeader>
                <CardTitle className="text-[#00b4d8]">How Regional Optimization Works</CardTitle>
                <CardDescription>
                  Qilly automatically calculates the best supplier based on total landed cost
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Select Location</h3>
                      <p className="text-xs text-gray-600 mt-1">Choose your project's province and municipality</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Upload BOQ</h3>
                      <p className="text-xs text-gray-600 mt-1">Import your bill or enter items manually</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Auto-Calculate</h3>
                      <p className="text-xs text-gray-600 mt-1">System finds nearest branches and calculates transport</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Get Results</h3>
                      <p className="text-xs text-gray-600 mt-1">View optimized pricing with full breakdown</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bill Upload Component */}
            <BillUpload 
              onProcess={handleProcess}
              isLoading={isProcessing}
              canProcess={true}
            />
          </>
        ) : (
          <>
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Price Another Bill
              </Button>
            </div>

            {/* Results */}
            <RegionalPricedBillView 
              pricedItems={pricedItems}
              projectSettings={projectSettings}
              processingTime={processingTime}
            />
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Qilly Regional Price Optimization System • 
            Accurate landed cost pricing for South African construction
          </p>
        </div>
      </div>
    </div>
  );
}