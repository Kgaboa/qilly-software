import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { provinces, getProvincialPricingBreakdown, type Province } from '@/utils/provincialPricing';
import { MapPin, TrendingUp, Info } from 'lucide-react';
import { useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

interface ProvincialPricingProps {
  selectedProvince?: string;
  onProvinceSelect?: (provinceCode: string) => void;
  showPricingInfo?: boolean;
  operatingProvinces?: string[]; // Array of province codes the contractor can operate in
}

export function ProvincialPricing({ 
  selectedProvince = 'GP', 
  onProvinceSelect,
  showPricingInfo = true,
  operatingProvinces // If provided, only these provinces can be selected
}: ProvincialPricingProps) {
  const [selected, setSelected] = useState(selectedProvince);

  const handleProvinceClick = (code: string, isDisabled: boolean) => {
    if (isDisabled) return; // Don't allow selection if disabled
    setSelected(code);
    onProvinceSelect?.(code);
  };

  // Check if a province is in the operating provinces list (if provided)
  const isProvinceSelectable = (provinceCode: string): boolean => {
    // If no operating provinces specified, all are selectable
    if (!operatingProvinces || operatingProvinces.length === 0) {
      return true;
    }
    // Check if province code is in operating provinces
    return operatingProvinces.includes(provinceCode);
  };

  // Get pricing tiers
  const basePricing = provinces.filter(p => p.factor === 1.0);
  const moderatePricing = provinces.filter(p => p.factor > 1.0 && p.factor <= 1.10);
  const higherPricing = provinces.filter(p => p.factor > 1.10);

  return (
    <div className="space-y-6">
      {/* Province Selection Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Select Province
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {provinces.map((province) => {
              const isSelectable = isProvinceSelectable(province.code);
              const buttonContent = (
                <button
                  key={province.code}
                  onClick={() => handleProvinceClick(province.code, !isSelectable)}
                  disabled={!isSelectable}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left w-full
                    ${selected === province.code
                      ? 'border-primary bg-primary/10 shadow-md'
                      : isSelectable
                        ? 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                        : 'border-gray-200 bg-gray-100 opacity-60 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="font-semibold text-lg">{province.code}</div>
                  <div className="text-sm text-gray-600 mt-1">{province.name}</div>
                  <div className={`text-xs mt-2 flex items-center gap-1 ${
                    province.factor === 1.0 
                      ? 'text-green-600' 
                      : province.factor <= 1.10 
                        ? 'text-orange-600' 
                        : 'text-red-600'
                  }`}>
                    {province.factor === 1.0 ? (
                      'Base Pricing'
                    ) : (
                      <>
                        <TrendingUp className="size-3" />
                        +{((province.factor - 1) * 100).toFixed(1)}%
                      </>
                    )}
                  </div>
                </button>
              );

              // Wrap in tooltip if not selectable
              if (!isSelectable) {
                return (
                  <Tooltip key={province.code}>
                    <TooltipTrigger asChild>
                      {buttonContent}
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Not your operating province</p>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return buttonContent;
            })}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Information */}
      {showPricingInfo && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Base Pricing Tier */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                <div className="size-3 rounded-full bg-green-600"></div>
                Base Pricing (1.0x)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600 mb-3">Major supply hubs with no price adjustments</p>
              {basePricing.map((province) => (
                <div key={province.code} className="text-sm">
                  <span className="font-semibold">{province.code}</span> - {province.name}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Moderate Adjustment Tier */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-orange-600">
                <div className="size-3 rounded-full bg-orange-600"></div>
                Moderate (+6% to +10%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600 mb-3">Secondary regions with moderate transport costs</p>
              {moderatePricing.map((province) => (
                <div key={province.code} className="text-sm">
                  <span className="font-semibold">{province.code}</span> - {province.name}
                  <span className="text-xs text-orange-600 ml-2">
                    +{((province.factor - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Higher Adjustment Tier */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                <div className="size-3 rounded-full bg-red-600"></div>
                Higher (+12% to +15%)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-gray-600 mb-3">Remote areas with higher transport costs</p>
              {higherPricing.map((province) => (
                <div key={province.code} className="text-sm">
                  <span className="font-semibold">{province.code}</span> - {province.name}
                  <span className="text-xs text-red-600 ml-2">
                    +{((province.factor - 1) * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Explanation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-blue-900 mb-2">About Provincial Pricing</p>
              <p>
                Qilly uses location-based pricing adjustments to ensure accurate cost estimates for your construction projects. 
                Provincial pricing factors account for transportation costs, regional market conditions, and supplier distribution networks. 
                These adjustments ensure your bills of quantities reflect the true landed costs for materials delivered to your project site.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}