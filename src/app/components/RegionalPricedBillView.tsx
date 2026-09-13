import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Download, MapPin, TrendingDown, Truck, Banknote, Package, Info, FileSpreadsheet, FileText, ChevronDown, ChevronUp, Shield, AlertTriangle, Leaf, TreeDeciduous, Lock } from 'lucide-react';
import type { RegionalPricedBillItem, RegionalSupplierQuote } from '@/utils/regionalPricingEngine';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { exportToExcel, exportToPDF, exportToWord, exportComplianceReportToPDF } from '@/utils/exportBOQ';
import { ComplianceCostCalculator } from '@/app/components/ComplianceCostCalculator';
import { PGCostsCard } from '@/app/components/PGCostsCard';
import type { ProjectParameters, ComplianceCosts } from '@/utils/complianceCalculations';
import { calculateAllComplianceCosts, applyProvincialAdjustments } from '@/utils/complianceCalculations';
import { calculateProjectCarbonSummary } from '@/utils/carbonTracking';
import { TenderResponseGenerator } from '@/app/components/TenderResponseGenerator';
import { CollusionDetection } from '@/app/components/CollusionDetection';
import { EnvironmentalComplianceDashboard } from '@/app/components/EnvironmentalComplianceDashboard';
import { hasFeatureAccess, getTierFeatures, type SubscriptionTier } from '@/utils/tierAccess';
import { UpgradePrompt, UpgradeBadge } from '@/app/components/UpgradePrompt';
import { SubscriptionUpgradeModal } from '@/app/components/payments/SubscriptionUpgradeModal';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface RegionalPricedBillViewProps {
  pricedItems?: RegionalPricedBillItem[];
  bill?: {
    items: RegionalPricedBillItem[];
    projectSettings?: {
      province?: string;
      municipality?: string;
      profitMargin?: string;
      cidbGrading?: string;
      duration?: string;
      machineryType?: string;
    };
  };
  projectSettings?: {
    province?: string;
    municipality?: string;
    profitMargin?: string;
    cidbGrading?: string;
    duration?: string;
    machineryType?: string;
  };
  contractorData?: {
    id?: string;
    email?: string;
    company_name?: string;
    contact_person?: string;
    annual_turnover?: number;
    cidb_grade?: string;
    subscription_tier?: string;
    subscription_start_date?: string;
    last_payment_date?: string;
  };
  processingTime?: number;
  onBack?: () => void;
}

export function RegionalPricedBillView({ pricedItems: propPricedItems, bill, projectSettings: propProjectSettings, contractorData, processingTime, onBack }: RegionalPricedBillViewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [showInflationProjection, setShowInflationProjection] = useState(false);
  const [customInflationRate, setCustomInflationRate] = useState<number>(7.5);
  const [showComplianceCosts, setShowComplianceCosts] = useState(false);
  const [complianceCosts, setComplianceCosts] = useState<ComplianceCosts | null>(null);
  const [showRegionalSettings, setShowRegionalSettings] = useState(false);
  const [showPGCosts, setShowPGCosts] = useState(false); // P&G collapsed by default
  const [showSummaryCards, setShowSummaryCards] = useState(false); // COLLAPSED BY DEFAULT
  const [showRegionalOptimization, setShowRegionalOptimization] = useState(false);
  const [showGreenAnalysis, setShowGreenAnalysis] = useState(false); // GREEN BUILDING TOGGLE
  const [showEnvironmentalCompliance, setShowEnvironmentalCompliance] = useState(false); // ENVIRONMENTAL COMPLIANCE MODULE
  const [applyGreenMaterials, setApplyGreenMaterials] = useState(false); // NEW: Green materials opt-in toggle
  const [isExporting, setIsExporting] = useState(false); // EXPORT LOADING STATE
  const [showUpgradeModal, setShowUpgradeModal] = useState(false); // UPGRADE MODAL STATE
  const summaryCardsRef = useRef<HTMLDivElement>(null);

  // NEW: Store original items and displayed items (for green material swapping)
  const [displayedItems, setDisplayedItems] = useState<any[]>([]);
  const originalItems = useRef<any[]>([]);

  // TIER ACCESS CONTROL
  const contractorTier: SubscriptionTier = (contractorData?.subscription_tier as SubscriptionTier) || 'free';
  const tierFeatures = getTierFeatures(contractorTier);
  const isFreeTier = contractorTier === 'free';

  // ✅ Helper functions to encrypt amounts for FREE tier contractors
  const formatAmount = (amount: number) => {
    if (contractorTier === 'free') {
      return 'R ●●●●●●';
    }
    return `R${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number) => {
    if (contractorTier === 'free') {
      return '●●●%';
    }
    return `${value.toFixed(1)}%`;
  };

  // Memoize the compliance costs callback to prevent infinite re-renders
  const handleCostsCalculated = useCallback((costs: ComplianceCosts) => {
    setComplianceCosts(costs);
  }, []);

  // Support both direct pricedItems or bill.items structure (MUST COME FIRST)
  const pricedItems = propPricedItems || bill?.items || [];
  const projectSettings = propProjectSettings || bill?.projectSettings;

  // Calculate totals (now that pricedItems is defined)
  const { grandTotal, totalTransportCost, totalOptimizedSavings, totalWithoutTransport } = useMemo(() => {
    // Use displayedItems (which may have green materials applied) for calculations
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    
    const grand = itemsToCalculate.reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice) || 0);
    }, 0);

    // transportCost is already the TOTAL transport cost for the line item (not per unit)
    const transport = itemsToCalculate.reduce((sum, item) => {
      return sum + (parseFloat(item.transportCost) || 0);
    }, 0);

    const savings = itemsToCalculate.reduce((sum, item) => {
      return sum + ((item.optimizedSavings && !isNaN(parseFloat(item.optimizedSavings))) ? parseFloat(item.optimizedSavings) : 0);
    }, 0);

    const withoutTransport = grand - transport;

    return {
      grandTotal: grand,
      totalTransportCost: transport,
      totalOptimizedSavings: savings,
      totalWithoutTransport: withoutTransport
    };
  }, [displayedItems, pricedItems]);

  // Auto-calculated compliance costs (placed after totals calculation)
  const projectParameters = useMemo(() => {
    if (!pricedItems.length || !projectSettings?.province || grandTotal === 0) return null;
    
    const isHousingProject = pricedItems.some(item => 
      (item.description || item.name || '').toLowerCase().includes('housing') || 
      (item.description || item.name || '').toLowerCase().includes('residential')
    );
    
    const isLowCostHousing = isHousingProject && grandTotal < 1500000;
    
    const companyTurnover = contractorData?.annual_turnover || (grandTotal * 4);
    
    return {
      projectValue: grandTotal,
      province: projectSettings?.province || 'GP',
      projectDuration: parseInt(projectSettings?.duration || '6'),
      labourContent: 40,
      projectType: (isHousingProject || isLowCostHousing) ? 'housing' as const : 'commercial' as const,
      contractorGrade: projectSettings?.cidbGrading || 'GB1',
      companyTurnover,
      houseType: isLowCostHousing ? 'RDP' as const : 'Custom' as const
    };
  }, [grandTotal, pricedItems, projectSettings?.province, projectSettings?.duration, projectSettings?.cidbGrading, contractorData?.annual_turnover]);

  const autoCalculatedComplianceCosts = useMemo(() => {
    if (!projectParameters || grandTotal === 0) return null;
    
    try {
      const baseCosts = calculateAllComplianceCosts(projectParameters);
      const adjustedCosts = applyProvincialAdjustments(baseCosts, projectParameters.province);
      return adjustedCosts;
    } catch (error) {
      console.error('Error auto-calculating compliance costs:', error);
      return null;
    }
  }, [projectParameters, grandTotal]);

  const effectiveComplianceCosts = complianceCosts || autoCalculatedComplianceCosts;

  // Export handlers with loading state to prevent UI freeze
  const handleExportToExcel = useCallback(() => {
    setIsExporting(true);
    // Use double requestAnimationFrame + setTimeout to ensure UI updates before heavy operation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            exportToExcel({
              pricedItems: displayedItems.length > 0 ? displayedItems : pricedItems,
              projectSettings,
              grandTotal,
              totalTransportCost,
              totalSavings: totalOptimizedSavings,
              inflationRate: customInflationRate,
              complianceCosts: effectiveComplianceCosts || undefined,
              pgCosts: effectiveComplianceCosts?.preliminaries.total || 0,
              includeGreenData: applyGreenMaterials,
              contractorTier
            });
          } catch (error) {
            console.error('Export to Excel failed:', error);
          } finally {
            setIsExporting(false);
          }
        }, 50);
      });
    });
  }, [displayedItems, pricedItems, projectSettings, grandTotal, totalTransportCost, totalOptimizedSavings, customInflationRate, effectiveComplianceCosts, applyGreenMaterials, contractorTier]);

  const handleExportToPDF = useCallback(() => {
    setIsExporting(true);
    // Use double requestAnimationFrame + setTimeout to ensure UI updates before heavy operation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          try {
            exportToPDF({
              pricedItems: displayedItems.length > 0 ? displayedItems : pricedItems,
              projectSettings,
              grandTotal,
              totalTransportCost,
              totalSavings: totalOptimizedSavings,
              inflationRate: customInflationRate,
              complianceCosts: effectiveComplianceCosts || undefined,
              pgCosts: effectiveComplianceCosts?.preliminaries.total || 0,
              includeGreenData: applyGreenMaterials,
              contractorTier
            });
          } catch (error) {
            console.error('Export to PDF failed:', error);
          } finally {
            setIsExporting(false);
          }
        }, 50);
      });
    });
  }, [displayedItems, pricedItems, projectSettings, grandTotal, totalTransportCost, totalOptimizedSavings, customInflationRate, effectiveComplianceCosts, applyGreenMaterials, contractorTier]);

  const handleExportToWord = useCallback(() => {
    setIsExporting(true);
    exportToWord({
      pricedItems: displayedItems.length > 0 ? displayedItems : pricedItems,
      projectSettings,
      grandTotal,
      totalTransportCost,
      totalSavings: totalOptimizedSavings,
      complianceCosts: effectiveComplianceCosts || undefined,
      pgCosts: effectiveComplianceCosts?.preliminaries.total || 0,
      contractorTier,
    }).finally(() => setIsExporting(false));
  }, [displayedItems, pricedItems, projectSettings, grandTotal, totalTransportCost, totalOptimizedSavings, effectiveComplianceCosts, contractorTier]);

  // Initialize displayed items and store originals
  useEffect(() => {
    if (pricedItems.length > 0 && originalItems.current.length === 0) {
      originalItems.current = JSON.parse(JSON.stringify(pricedItems)); // Deep copy
      setDisplayedItems(pricedItems);
    }
  }, [pricedItems]);

  // Debug logging for processing time (only log once on mount)
  useEffect(() => {
    if (processingTime !== undefined) {
      console.log('🕐 RegionalPricedBillView received processingTime:', processingTime);
    }
  }, []); // Empty dependency array = only runs once on mount

  // Auto-scroll to summary cards when component mounts
  useEffect(() => {
    if (summaryCardsRef.current) {
      summaryCardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Calculate carbon data for green building analysis (moved up to avoid temporal dead zone)
  const carbonSummary = useMemo(() => {
    if (pricedItems.length === 0) return null;
    return calculateProjectCarbonSummary(pricedItems);
  }, [pricedItems]);

  // SWAP SUPPLIERS WHEN GREEN MATERIALS TOGGLE CHANGES
  useEffect(() => {
    if (originalItems.current.length === 0) return;

    if (applyGreenMaterials) {
      // Apply green materials: swap to green suppliers
      const greenItems = originalItems.current.map((item: any) => {
        // Find carbon data for this item from carbonSummary
        const itemWithCarbon = carbonSummary?.itemsWithCarbon?.find((i: any) => 
          i.code === item.code || 
          (i.name === item.name && parseFloat(i.quantity) === parseFloat(item.quantity))
        );
        const carbonData = itemWithCarbon?.carbonData;
        
        // If this item has a green alternative, swap the supplier
        if (carbonData?.greenAlternative) {
          const greenPremium = carbonData.greenAlternative.totalPricePremium;
          const newTotalPrice = parseFloat(item.totalPrice) + greenPremium;
          const newUnitPrice = parseFloat(item.finalUnitPrice || item.baseUnitPrice) * (1 + (carbonData.greenAlternative.pricePremiumPercent / 100));
          
          // Update transport cost to reflect green supplier premium (proportional to price premium)
          const originalTransportPerUnit = parseFloat(item.transportCostPerUnit || '0');
          const newTransportPerUnit = originalTransportPerUnit * (1 + (carbonData.greenAlternative.pricePremiumPercent / 100));
          const quantity = parseFloat(item.quantity) || 0;
          const newTransportTotal = newTransportPerUnit * quantity;
          
          return {
            ...item,
            supplierName: carbonData.greenAlternative.supplierName,
            selectedSupplier: carbonData.greenAlternative.supplierName, // Update displayed supplier
            finalUnitPrice: newUnitPrice,
            totalPrice: newTotalPrice.toString(),
            transportCostPerUnit: newTransportPerUnit.toFixed(2),
            transportCost: newTransportTotal.toString(),
            isGreenMaterial: true, // Flag for visual indication
            carbonData, // Store for display
          };
        }
        
        return { ...item, isGreenMaterial: false, carbonData };
      });
      
      setDisplayedItems(greenItems);
    } else {
      // Revert to standard suppliers
      const standardItems = originalItems.current.map((item: any) => {
        // Find carbon data for this item from carbonSummary
        const itemWithCarbon = carbonSummary?.itemsWithCarbon?.find((i: any) => 
          i.code === item.code || 
          (i.name === item.name && parseFloat(i.quantity) === parseFloat(item.quantity))
        );
        const carbonData = itemWithCarbon?.carbonData;
        
        return {
          ...item,
          isGreenMaterial: false,
          carbonData,
        };
      });
      setDisplayedItems(standardItems);
    }
  }, [applyGreenMaterials, carbonSummary]);

  const toggleRow = (index: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  // Calculate total profit amount from additionalFeesBreakdown
  // Note: profitMargin in the breakdown is already the total profit amount for that line item, not per unit
  const totalProfitAmount = useMemo(() => {
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    return itemsToCalculate.reduce((sum, item) => {
      if (item.additionalFeesBreakdown?.profitMargin) {
        return sum + item.additionalFeesBreakdown.profitMargin;
      }
      return sum;
    }, 0);
  }, [displayedItems, pricedItems]);

  // Calculate total additional fees (per-unit fees × quantity for each item)
  const totalAdditionalFees = useMemo(() => {
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    return itemsToCalculate.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const additionalFeesPerUnit = parseFloat(item.additionalFees) || 0;
      return sum + (additionalFeesPerUnit * quantity);
    }, 0);
  }, [displayedItems, pricedItems]);

  // Calculate total CIDB overhead amount
  const totalCidbAmount = useMemo(() => {
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    return itemsToCalculate.reduce((sum, item) => {
      if (item.additionalFeesBreakdown?.cidbOverhead) {
        return sum + item.additionalFeesBreakdown.cidbOverhead;
      }
      return sum;
    }, 0);
  }, [displayedItems, pricedItems]);

  // Calculate total Duration adjustment amount
  const totalDurationAmount = useMemo(() => {
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    return itemsToCalculate.reduce((sum, item) => {
      if (item.additionalFeesBreakdown?.durationAdjustment) {
        return sum + item.additionalFeesBreakdown.durationAdjustment;
      }
      return sum;
    }, 0);
  }, [displayedItems, pricedItems]);

  // Calculate total Machinery adjustment amount
  const totalMachineryAmount = useMemo(() => {
    const itemsToCalculate = displayedItems.length > 0 ? displayedItems : pricedItems;
    return itemsToCalculate.reduce((sum, item) => {
      if (item.additionalFeesBreakdown?.machineryAdjustment) {
        return sum + item.additionalFeesBreakdown.machineryAdjustment;
      }
      return sum;
    }, 0);
  }, [displayedItems, pricedItems]);

  // NOTE: projectParameters, autoCalculatedCompliance Costs, and effectiveComplianceCosts moved earlier (before export handlers)

  // Determine required CIDB grade based on project value (South African CIDB regulations)
  const getRequiredCidbGrade = (projectValue: number): string => {
    if (projectValue <= 200000) return 'GB1';
    if (projectValue <= 650000) return 'GB2';
    if (projectValue <= 2000000) return 'GB3';
    if (projectValue <= 4000000) return 'GB4';
    if (projectValue <= 6500000) return 'GB5';
    if (projectValue <= 13000000) return 'GB6';
    if (projectValue <= 40000000) return 'GB7';
    if (projectValue <= 130000000) return 'GB8';
    return 'GB9';
  };

  // Extract grade number for comparison (e.g., 'GB4' -> 4)
  const extractGradeNumber = (grade: string): number => {
    const match = grade.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // Check if contractor CIDB grade is below required grade
  const requiredGrade = getRequiredCidbGrade(grandTotal);
  const contractorGrade = projectSettings?.cidbGrading || 'GB1';
  const showCidbWarning = extractGradeNumber(contractorGrade) < extractGradeNumber(requiredGrade);

  // Get material type badge color
  const getMaterialTypeBadge = (materialType: string) => {
    const colors: { [key: string]: string } = {
      bulk: 'bg-orange-100 text-orange-800 border-orange-300',
      standard: 'bg-blue-100 text-blue-800 border-blue-300',
      lightweight: 'bg-green-100 text-green-800 border-green-300',
      'Green Certified': 'bg-green-600 text-white border-green-700', // Special styling for green materials
    };
    return colors[materialType] || 'bg-gray-100 text-gray-800';
  };

  // Extract category from item code (e.g., "C1.2.1" -> "C1.2")
  const getCategory = (code: string): string => {
    const parts = code.split('.');
    if (parts.length >= 2) {
      return `${parts[0]}.${parts[1]}`;
    }
    return parts[0];
  };

  // Group items by category and calculate subtotals
  // Use displayedItems (which may have green materials swapped) instead of pricedItems
  const itemsForGrouping = displayedItems.length > 0 ? displayedItems : pricedItems;
  const groupedItems = itemsForGrouping.reduce((acc, item) => {
    const category = getCategory(item.code);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, RegionalPricedBillItem[]>);

  // Calculate category subtotals
  const categorySubtotals = Object.keys(groupedItems).reduce((acc, category) => {
    const total = groupedItems[category].reduce((sum, item) => {
      return sum + (parseFloat(item.totalPrice) || 0);
    }, 0);
    acc[category] = total;
    return acc;
  }, {} as Record<string, number>);

  // Calculate green premium by comparing displayed items vs original items
  const greenCostPremium = applyGreenMaterials && carbonSummary ? carbonSummary.costPremium : 0;
  
  // Calculate Overall BOQ Total (Total on Delivery + Compliance Costs + P&G)
  // Note: When green materials are applied, grandTotal already includes green prices (from displayedItems)
  const overallBOQTotal = grandTotal + (effectiveComplianceCosts?.total || 0) + (effectiveComplianceCosts?.preliminaries.total || 0);

  return (
    <div className="space-y-6">
      {/* FREE TIER TRAINING MODE BANNER */}
      {contractorTier === 'free' && (
        <div className="w-full p-3 bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-2 border-amber-500 rounded-lg shadow">
          <div className="flex items-start gap-2">
            <div className="text-xl">🎓</div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-amber-900 mb-1">
                Training Mode: BuildAid 2025/2026 Template Results
              </h3>
              <p className="text-xs text-amber-800 mb-2">
                You're viewing <strong>pricing results from a pre-loaded training template</strong> with real SA supplier data. 
                This demonstrates Qilly's full pricing capabilities.
              </p>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="bg-white/60 p-2 rounded border border-amber-300">
                  <p className="text-[10px] font-semibold text-amber-900 mb-1">✅ You CAN:</p>
                  <ul className="text-[10px] text-amber-800 space-y-0.5">
                    <li>• View pricing breakdown</li>
                    <li>• See supplier comparisons</li>
                    <li>• Explore transport optimization</li>
                    <li>• Review compliance costs</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-2 rounded border border-amber-300">
                  <p className="text-[10px] font-semibold text-red-900 mb-1">❌ You CANNOT:</p>
                  <ul className="text-[10px] text-red-800 space-y-0.5">
                    <li>• Export to Excel</li>
                    <li>• Generate tender responses</li>
                    <li>• Access compliance docs</li>
                    <li>• Save to history</li>
                    <li>• Submit real BOQs</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-amber-400">
                <Badge className="bg-amber-600 text-white text-[9px] px-2 py-0.5">TRAINING DATA</Badge>
                <p className="text-[10px] text-amber-900 flex-1">
                  <strong>Ready to price your own BOQs?</strong> Upgrade to <strong>PROFESSIONAL</strong> (R2,999/mo).{' '}
                  <a href="mailto:support@qilly.co.za" className="underline font-semibold hover:text-amber-950">Contact sales</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header with Summary Cards - Collapsible */}
      {showSummaryCards ? (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Banknote className="h-4 w-4 text-[#00b4d8]" />
              BOQ Summary
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSummaryCards(false)}
              className="text-xs border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide Summary
            </Button>
          </div>
          <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-2 text-xs text-amber-800">
            <span className="mt-0.5 shrink-0">⚠️</span>
            <span>
              <strong>Indicative pricing only.</strong> Prices are based on BuildAid 2025/2026 industry benchmarks and may differ from confirmed supplier quotes.
              For billing-related enquiries, contact <a href="mailto:billing@qilly-software.co.za" className="underline font-medium">billing@qilly-software.co.za</a> or <a href="mailto:billing@qilly.co.za" className="underline font-medium">billing@qilly.co.za</a>. Confirm actual rates directly with suppliers.
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5" ref={summaryCardsRef}>
        <Card className="shadow-sm">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#00b4d8]" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-gray-900">
              {projectSettings?.municipality || 'Johannesburg'}
            </div>
            <p className="text-[9px] text-gray-500">{projectSettings?.province || 'GP'}</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <Banknote className="h-3 w-3 text-green-600" />
              Total on Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-gray-900">
              R{grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[9px] text-gray-500">{pricedItems.length} items</p>
          </CardContent>
        </Card>

        <Card className="border-[#00b4d8] bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <svg className="h-3 w-3 text-[#00b4d8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-[#00b4d8]">
              {processingTime > 0 
                ? (processingTime < 1000 
                    ? `${Math.round(processingTime)}ms`
                    : `${(processingTime / 1000).toFixed(2)}s`)
                : '--'
              }
            </div>
            <p className="text-[9px] text-gray-500">
              {processingTime > 0 ? 'Intelligent pricing' : 'Waiting...'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <Shield className="h-3 w-3 text-purple-600" />
              Compliance Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-purple-600">
              {effectiveComplianceCosts 
                ? (isFreeTier ? 'R ●●●●●●' : formatAmount(effectiveComplianceCosts.total))
                : 'Calculating...'}
            </div>
            <p className="text-[9px] text-gray-500">
              {effectiveComplianceCosts 
                ? `${isFreeTier ? '●●●%' : formatPercentage((effectiveComplianceCosts.total / grandTotal) * 100)} of total`
                : 'SA compliance'} (excl. P&G)
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-gray-600 flex items-center gap-1">
              <Package className="h-3 w-3 text-amber-600" />
              P&G Costs
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-amber-600">
              {effectiveComplianceCosts 
                ? formatAmount(effectiveComplianceCosts.preliminaries.total)
                : 'Calculating...'}
            </div>
            <p className="text-[9px] text-gray-500">
              {effectiveComplianceCosts 
                ? `${formatPercentage((effectiveComplianceCosts.preliminaries.total / grandTotal) * 100)} of total`
                : 'Project overhead'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#00b4d8] bg-gradient-to-br from-[#00b4d8] to-[#0096c7] shadow-lg">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-[10px] font-medium text-white flex items-center gap-1">
              <Banknote className="h-3 w-3 text-white" />
              Overall BOQ Total
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-1">
            <div className="text-sm font-bold text-white">
              {formatAmount(overallBOQTotal)}
            </div>
            <p className="text-[9px] text-white opacity-90">
              Delivery + Compliance + P&G{greenCostPremium > 0 ? ' + Green Premium' : ''}
            </p>
            {greenCostPremium > 0 && (
              <p className="text-[8px] text-green-200 mt-0.5">
                🌿 +{formatAmount(greenCostPremium)} for green materials
              </p>
            )}
          </CardContent>
        </Card>
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-r from-[#00b4d8] to-[#0096c7] shadow-lg">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <p className="text-base font-bold flex items-center gap-2">
                  <Banknote className="h-5 w-5" />
                  Overall BOQ Total: {formatAmount(overallBOQTotal)}
                </p>
                <p className="text-xs opacity-90 mt-1">
                  Location: {projectSettings?.municipality || 'Johannesburg'}, {projectSettings?.province || 'GP'} • {pricedItems.length} items • Delivery + Compliance + P&G{greenCostPremium > 0 ? ' + Green Premium' : ''} included
                </p>
                {greenCostPremium > 0 && (
                  <p className="text-xs text-green-200 mt-1">
                    🌿 Includes +{formatAmount(greenCostPremium)} for green materials
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (contractorTier !== 'free') {
                    setShowSummaryCards(true);
                  }
                }}
                className={contractorTier === 'free' 
                  ? 'bg-gray-400/50 border-gray-500/40 text-gray-200 cursor-not-allowed opacity-50' 
                  : 'bg-white/20 border-white/40 text-white hover:bg-white/30'
                }
                disabled={contractorTier === 'free'}
              >
                {contractorTier === 'free' ? <Lock className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                Show Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GREEN BUILDING & CARBON TRACKING SECTION - COMING SOON */}
      {false ? (
        <Card className="mt-4 border border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-green-900 text-sm">
                <Leaf className="w-4 h-4" />
                Green Building & Carbon Tracking
                <Badge className="bg-green-600 text-white ml-2 text-[9px] px-1.5 py-0.5">DHS</Badge>
                <Badge className="bg-purple-600 text-white ml-2 text-[9px] px-1.5 py-0.5">ENTERPRISE</Badge>
                {contractorTier === 'free' && <Lock className="w-4 h-4 text-amber-600 ml-2" />}
                {applyGreenMaterials && (
                  <Badge className="bg-emerald-600 text-white ml-2 animate-pulse text-[9px] px-1.5 py-0.5">
                    ✓ ACTIVE
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (contractorTier !== 'free') {
                    setShowGreenAnalysis(!showGreenAnalysis);
                  }
                }}
                className={contractorTier === 'free' ? 'border-gray-300 text-gray-500 h-7 text-xs opacity-50 cursor-not-allowed' : 'border-green-600 text-green-700 hover:bg-green-100 h-7 text-xs'}
                disabled={contractorTier === 'free'}
              >
                {showGreenAnalysis ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                {showGreenAnalysis ? 'Hide' : 'Show'}
              </Button>
            </div>
            <CardDescription className="text-green-700 mt-1 text-xs">
              Carbon footprint & green alternatives for DHS compliance
              {contractorTier === 'free' && (
                <span className="block text-amber-700 font-semibold mt-1">
                  🔒 Locked in Training Mode. Upgrade to ENTERPRISE.
                </span>
              )}
            </CardDescription>
          </CardHeader>
        {showGreenAnalysis && (
          <CardContent className="pt-2">
            {/* OPT-IN/OPT-OUT TOGGLE FOR GREEN MATERIALS */}
            <div className="mb-3 bg-gradient-to-r from-green-100 to-emerald-100 p-2 rounded border border-green-400">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-green-900 flex items-center gap-1">
                    <Leaf className="w-3 h-3" />
                    Apply Green Materials
                  </h4>
                  <p className="text-[10px] text-green-700 mt-0.5">
                    {applyGreenMaterials 
                      ? '✅ Green materials ACTIVE' 
                      : '⚪ Standard materials'}
                  </p>
                </div>
                <Button
                  onClick={() => setApplyGreenMaterials(!applyGreenMaterials)}
                  className={`${
                    applyGreenMaterials 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-700'
                  } transition-all duration-300 text-xs h-7`}
                  size="sm"
                >
                  {applyGreenMaterials ? '✓ Applied' : 'Apply'}
                </Button>
              </div>
              {applyGreenMaterials && carbonSummary && (
                <div className="mt-2 pt-2 border-t border-green-300">
                  <p className="text-[10px] text-green-800">
                    <strong>+R{carbonSummary.costPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</strong> 
                    ({carbonSummary.costPremiumPercent.toFixed(1)}%) • Save {carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (~{carbonSummary.treesEquivalent} trees)
                  </p>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-3">
                <TreeDeciduous className="w-3 h-3 inline mr-1 text-green-600" />
                Carbon tracking integrated into BOQ pricing
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-2 rounded border border-gray-200">
                  <div className="text-[10px] text-gray-600 mb-0.5">Standard Footprint</div>
                  <div className="text-lg font-bold text-gray-900">
                    {carbonSummary ? `${carbonSummary.totalCarbon.toFixed(1)} tCO₂e` : '--'}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">Total emissions</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-2 rounded border border-green-300">
                  <div className="text-[10px] text-green-700 mb-0.5">Green Alternatives</div>
                  <div className="text-lg font-bold text-green-900">
                    {carbonSummary ? `${carbonSummary.totalCarbonWithGreen.toFixed(1)} tCO₂e` : '--'}
                  </div>
                  <div className="text-[10px] text-green-600 mt-0.5">
                    {carbonSummary ? `Save ${carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e (${carbonSummary.carbonSavingsPercent.toFixed(1)}%)` : 'Savings'}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-100 p-2 rounded border border-blue-300">
                  <div className="text-[10px] text-blue-700 mb-0.5">DHS Score</div>
                  <div className="text-lg font-bold text-blue-900">
                    {carbonSummary ? carbonSummary.overallGreenScore : '--'}
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">
                    {carbonSummary ? `${carbonSummary.itemsWithGreenAlternatives}/${carbonSummary.totalItems} eco-options` : 'Rating'}
                  </div>
                </div>
              </div>
              
              {carbonSummary && (
                <>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-2 rounded border border-orange-200">
                      <div className="flex items-center gap-1 mb-1">
                        <TreeDeciduous className="w-3 h-3 text-green-700" />
                        <div className="text-[10px] text-gray-700 font-semibold">Environmental Impact</div>
                      </div>
                      <div className="text-xs text-gray-800">
                        <strong>~{carbonSummary.treesEquivalent} trees</strong> worth of CO₂ absorption
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-2 rounded border border-purple-200">
                      <div className="flex items-center gap-1 mb-1">
                        <Banknote className="w-3 h-3 text-purple-700" />
                        <div className="text-[10px] text-gray-700 font-semibold">Cost Premium</div>
                      </div>
                      <div className="text-xs text-gray-800">
                        <strong>+R{carbonSummary.costPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong> ({carbonSummary.costPremiumPercent.toFixed(1)}%)
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 bg-white rounded border border-green-300 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-2 py-1.5">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        <TreeDeciduous className="w-3 h-3" />
                        Standard vs Green Materials Comparison
                      </h4>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead className="bg-gray-100 border-b border-gray-300">
                          <tr>
                            <th className="text-left py-1 px-2 font-semibold text-gray-700 text-[10px]">Metric</th>
                            <th className="text-center py-1 px-2 font-semibold text-gray-700 bg-gray-50 text-[10px]">Standard</th>
                            <th className="text-center py-1 px-2 font-semibold text-green-700 bg-green-50 text-[10px]">Green</th>
                            <th className="text-center py-1 px-2 font-semibold text-blue-700 bg-blue-50 text-[10px]">Diff</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-1.5 px-2 font-medium text-gray-800">Carbon Emissions</td>
                            <td className="py-1.5 px-2 text-center text-gray-900 font-mono">{carbonSummary.totalCarbon.toFixed(1)} tCO₂e</td>
                            <td className="py-1.5 px-2 text-center text-green-900 font-mono font-bold">{carbonSummary.totalCarbonWithGreen.toFixed(1)} tCO₂e</td>
                            <td className="py-1.5 px-2 text-center">
                              <Badge className="bg-green-600 text-white text-[9px] px-1 py-0">
                                -{carbonSummary.carbonSavingsPercent.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-1.5 px-2 font-medium text-gray-800">Carbon Saved</td>
                            <td className="py-1.5 px-2 text-center text-gray-500">—</td>
                            <td className="py-1.5 px-2 text-center text-green-900 font-mono font-bold">{carbonSummary.totalCarbonSavings.toFixed(1)} tCO₂e</td>
                            <td className="py-1.5 px-2 text-center text-green-700 text-[10px]">
                              🌳 {carbonSummary.treesEquivalent}
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 bg-orange-50">
                            <td className="py-1.5 px-2 font-medium text-gray-800">Project Cost</td>
                            <td className="py-1.5 px-2 text-center text-gray-900 font-mono">
                              R{carbonSummary.totalCost.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-1.5 px-2 text-center text-orange-900 font-mono font-bold">
                              R{carbonSummary.totalCostWithGreen.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <Badge className="bg-orange-500 text-white text-[9px] px-1 py-0">
                                +{carbonSummary.costPremiumPercent.toFixed(1)}%
                              </Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-200 hover:bg-gray-50 bg-orange-50">
                            <td className="py-1.5 px-2 font-medium text-gray-800">Cost Premium</td>
                            <td className="py-1.5 px-2 text-center text-gray-500">—</td>
                            <td className="py-1.5 px-2 text-center text-orange-900 font-mono font-bold">
                              +R{carbonSummary.costPremium.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-1.5 px-2 text-center text-[10px] text-gray-600">
                              R{(carbonSummary.costPremium / carbonSummary.totalCarbonSavings).toFixed(0)}/tCO₂e
                            </td>
                          </tr>
                          <tr className="bg-blue-50">
                            <td className="py-1.5 px-2 font-medium text-gray-800">Green Options</td>
                            <td className="py-1.5 px-2 text-center text-gray-500">—</td>
                            <td className="py-1.5 px-2 text-center text-blue-900 font-bold">
                              {carbonSummary.itemsWithGreenAlternatives}/{carbonSummary.totalItems}
                            </td>
                            <td className="py-1.5 px-2 text-center">
                              <Badge className={`text-white text-[9px] px-1 py-0 ${
                                carbonSummary.overallGreenScore === 'A+' ? 'bg-green-700' :
                                carbonSummary.overallGreenScore === 'A' ? 'bg-green-600' :
                                carbonSummary.overallGreenScore === 'B' ? 'bg-blue-600' :
                                carbonSummary.overallGreenScore === 'C' ? 'bg-orange-500' : 'bg-red-500'
                              }`}>
                                {carbonSummary.overallGreenScore}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 rounded">
                    <p className="text-[10px] text-emerald-800">
                      <strong>✅ Live Calculation:</strong> Carbon from {carbonSummary.totalItems} BOQ items using BuildAid 2025/2026 coefficients.
                    </p>
                  </div>
                </>
              )}
              
              {!carbonSummary && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-[10px] text-yellow-800">
                    <strong>ℹ️ Note:</strong> Upload a BOQ to see live carbon calculations.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        )}
        </Card>
      ) : (
        <Card className="mt-4 border border-gray-200 bg-gray-50 opacity-60">
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-gray-500 text-sm">
              <Leaf className="w-4 h-4" />
              Green Building & Carbon Tracking
              <Badge className="bg-gray-400 text-white ml-2 text-[9px] px-1.5 py-0.5">Coming Soon</Badge>
            </CardTitle>
            <CardDescription className="text-gray-400 text-xs">
              Carbon footprint tracking &amp; green material alternatives — launching soon.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* ETENDER INTEGRATION — COMING SOON */}
      <Card className="mt-4 border border-gray-200 bg-gray-50 opacity-60">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-gray-500 text-sm">
            <FileText className="w-4 h-4" />
            eTender Integration: Automated Tender Response Generator
            <Badge className="bg-gray-400 text-white ml-2 text-[9px] px-1.5 py-0.5">Coming Soon</Badge>
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs">
            Automated tender response packages with executive summary, compliance declarations, and environmental statements — launching soon.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* COLLUSION DETECTION — COMING SOON */}
      <Card className="mt-4 border border-gray-200 bg-gray-50 opacity-60">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4" />
            Collusion Detection
            <Badge className="bg-gray-400 text-white ml-2 text-[9px] px-1.5 py-0.5">Coming Soon</Badge>
          </CardTitle>
          <CardDescription className="text-gray-400 text-xs">
            Statistical bid-rigging and price manipulation detection for tender integrity — launching soon.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ENVIRONMENTAL COMPLIANCE MODULE */}
      {showEnvironmentalCompliance && hasFeatureAccess(contractorTier, 'environmentalDashboard') && (
        <Card className="mt-4 border-2 border-teal-300 bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-teal-900">
                  <Leaf className="w-5 h-5" />
                  Environmental Compliance Assessment
                  <Badge className="bg-teal-600 text-white ml-2">NEMA & Waste Management</Badge>
                </CardTitle>
                <CardDescription className="text-teal-700 mt-2">
                  Comprehensive environmental compliance screening for NEMA, Waste Act & EMP requirements
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEnvironmentalCompliance(false)}
                className="border-teal-600 text-teal-700 hover:bg-teal-100"
              >
                <ChevronUp className="w-4 h-4 mr-1" />
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <EnvironmentalComplianceDashboard
              projectParams={{
                projectName: `${projectSettings?.municipality || 'Construction'} Project`,
                projectType: 'residential', // TODO: Make this dynamic based on project settings
                siteArea: parseFloat(projectSettings?.buildingFootprint || '0') * 1.5, // Assume 1.5x building footprint for site
                buildingFootprint: parseFloat(projectSettings?.buildingFootprint || '1000'),
                excavationVolume: pricedItems.find(item => 
                  (item.description || '').toLowerCase().includes('excavat')
                )?.quantity ? parseFloat(pricedItems.find(item => 
                  (item.description || '').toLowerCase().includes('excavat')
                )!.quantity) : undefined,
                isUrbanArea: ['Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth'].some(city => 
                  (projectSettings?.municipality || '').includes(city)
                ),
                province: projectSettings?.province || 'GP',
                municipality: projectSettings?.municipality || 'Johannesburg',
              }}
              pricedItems={pricedItems}
              onClose={() => setShowEnvironmentalCompliance(false)}
            />
          </CardContent>
        </Card>
      )}

      {!showEnvironmentalCompliance && (
        hasFeatureAccess(contractorTier, 'environmentalDashboard') ? (
          <Card className="bg-teal-50 border-teal-200 mt-4">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-teal-600" />
                    Environmental Compliance Assessment
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Screen for NEMA listed activities, waste management requirements & environmental authorizations
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEnvironmentalCompliance(true)}
                  className="bg-white border-teal-300 text-teal-700 hover:bg-teal-100"
                >
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Run Environmental Screening
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-4">
            <UpgradePrompt
              currentTier={contractorTier}
              requiredTier="enterprise"
              featureName="Environmental Compliance Assessment"
              featureDescription="Comprehensive environmental compliance screening for NEMA listed activities, waste management requirements, and environmental authorization triggers. Includes automated compliance reports for DHS submissions."
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>
        )
      )}

      {/* CIDB Compliance Warning - Only Show When Contractor Grade Below Required */}
      {showCidbWarning && (
        <Card className="mt-6 bg-red-50 border-red-200">
          <CardContent className="py-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">⚠️ CIDB Grading Warning: Contractor Grade Below Project Requirements</p>
                <p className="text-xs text-red-700 mt-1">
                  <strong>Project Value:</strong> R{grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} requires <strong>{requiredGrade}</strong> CIDB grading.<br />
                  <strong>Your Current Grade:</strong> {contractorGrade}<br /><br />
                  You must upgrade your CIDB registration to {requiredGrade} or higher to legally tender for this project. 
                  Tendering with insufficient CIDB grading may result in disqualification, contract cancellations, or legal penalties. 
                  Contact CIDB to upgrade your registration before submitting this tender.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Cost Calculator */}
      {showComplianceCosts && (
        <Card className="mt-4 border-2 border-blue-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Shield className="w-5 h-5" />
                South African Construction Compliance Costs
              </CardTitle>
              <div className="flex items-center gap-2">
                {contractorTier !== 'free' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (complianceCosts) {
                        exportComplianceReportToPDF(complianceCosts, projectSettings, contractorData);
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white border-blue-700"
                    disabled={!complianceCosts}
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Export PDF
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowComplianceCosts(false)}
                >
                  <ChevronUp className="w-4 h-4 mr-1" />
                  Collapse
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ComplianceCostCalculator
              projectParameters={projectParameters}
              onCostsCalculated={handleCostsCalculated}
              contractorTier={contractorTier}
            />
          </CardContent>
        </Card>
      )}

      {!showComplianceCosts && (
        <Card className="bg-blue-50 border-blue-200 mt-4">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  Compliance Costs
                  {contractorTier === 'free' && <Lock className="w-4 h-4 text-amber-600" />}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  View mandatory SA construction compliance costs (NHBRC, CIDB, Statutory Labour, Testing, BBBEE)
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-blue-600 text-white text-xs">Total Compliance Costs (excl. P&G)</Badge>
                  <span className="text-sm font-bold text-blue-700">
                    {effectiveComplianceCosts 
                      ? (isFreeTier 
                          ? 'R ●●●●●●' 
                          : `R${effectiveComplianceCosts.total.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                      : 'Calculating...'
                    }
                  </span>
                </div>
                {contractorTier === 'free' && (
                  <p className="text-[10px] text-amber-700 mt-2 font-semibold">
                    🔒 Locked in Training Mode. Upgrade to expand detailed breakdown.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (contractorTier !== 'free') {
                    setShowComplianceCosts(true);
                  }
                }}
                className={contractorTier === 'free' ? 'bg-gray-100 opacity-50 cursor-not-allowed' : 'bg-white'}
                disabled={contractorTier === 'free'}
              >
                <ChevronDown className="w-4 h-4 mr-1" />
                Show Compliance Costs
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* P&G Costs Card - Separate from Compliance */}
      <PGCostsCard 
        complianceCosts={effectiveComplianceCosts}
        grandTotal={grandTotal}
        showPGCosts={showPGCosts}
        onToggle={() => setShowPGCosts(!showPGCosts)}
        contractorTier={contractorTier}
      />

      {/* Regional Settings & Additional Fee Values - Collapsible */}
      {showRegionalSettings ? (
        <Card id="regional-settings-values" className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-indigo-600" />
                  Regional Settings & Additional Fee Values
                </CardTitle>
                <CardDescription>
                  Fee percentages and transport costs applied per region
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                onClick={() => setShowRegionalSettings(false)}
              >
                <ChevronUp className="h-3 w-3 mr-1" />
                Hide Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {/* Fee Structure */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-green-600" />
                Additional Fee Structure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">CIDB Grading Overhead</div>
                      <div className="text-2xl font-bold text-purple-600">{projectSettings?.cidbGrading || 'Grade 7'}</div>
                    </div>
                    <Badge className="bg-purple-600 text-white">CIDB</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-3 space-y-1">
                    <div>• Grade 1-3: ~5-8% overhead</div>
                    <div>• Grade 4-6: ~10-15% overhead</div>
                    <div>• Grade 7-9: ~15-20% overhead</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="text-xs text-gray-600 mb-1">Your CIDB Percentage</div>
                    <div className="text-lg font-bold text-purple-700">
                      {(() => {
                        const cidbPercentages: { [key: string]: number } = {
                          'GB1': 2, 'GB2': 3, 'GB3': 4, 'GB4': 5,
                          'GB5': 6, 'GB6': 7, 'GB7': 8, 'GB8': 9, 'GB9': 10
                        };
                        const grade = projectSettings?.cidbGrading || 'GB7';
                        return `${cidbPercentages[grade] || 8}% (R${totalCidbAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                      })()}
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Profit Margin</div>
                      <div className="text-2xl font-bold text-green-600">{projectSettings?.profitMargin || '15'}%</div>
                    </div>
                    <Badge className="bg-green-600 text-white">Profit</Badge>
                  </div>
                  <div className="text-xs text-gray-600 mt-3">
                    Applied to: (Base + Transport + CIDB) × {projectSettings?.profitMargin || '15'}%
                  </div>
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="text-xs text-gray-600 mb-1">Total Profit Amount</div>
                    <div className="text-lg font-bold text-green-700">
                      R{totalProfitAmount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Transport Cost Breakdown by Material Type */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-600" />
                Transport Cost per Kilometer (by Material Type)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-orange-700" />
                    <div className="font-semibold text-sm text-orange-900">Bulk Materials</div>
                  </div>
                  <div className="text-xl font-bold text-orange-700 mb-1">R8.50/km</div>
                  <div className="text-xs text-orange-800">Cement, aggregates, sand</div>
                  <div className="text-xs text-orange-700 mt-2 italic">Requires larger trucks</div>
                  <div className="text-xs text-orange-900 mt-2 pt-2 border-t border-orange-300 font-semibold">
                    Min. charge: R450 (same area)
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-blue-700" />
                    <div className="font-semibold text-sm text-blue-900">Standard Materials</div>
                  </div>
                  <div className="text-xl font-bold text-blue-700 mb-1">R6.00/km</div>
                  <div className="text-xs text-blue-800">Bricks, steel, timber</div>
                  <div className="text-xs text-blue-700 mt-2 italic">Medium transport</div>
                  <div className="text-xs text-blue-900 mt-2 pt-2 border-t border-blue-300 font-semibold">
                    Min. charge: R300 (same area)
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-green-700" />
                    <div className="font-semibold text-sm text-green-900">Lightweight Materials</div>
                  </div>
                  <div className="text-xl font-bold text-green-700 mb-1">R3.50/km</div>
                  <div className="text-xs text-green-800">Fittings, paint, hardware</div>
                  <div className="text-xs text-green-700 mt-2 italic">Smaller delivery vehicles</div>
                  <div className="text-xs text-green-900 mt-2 pt-2 border-t border-green-300 font-semibold">
                    Min. charge: R150 (same area)
                  </div>
                </div>
              </div>
              
              {/* Overall Transport Cost Summary */}
              <div className="mt-3 bg-gradient-to-r from-orange-100 to-orange-50 p-4 rounded-lg border-2 border-orange-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-orange-800 mb-1">Overall Transport Cost (This Project)</div>
                    <div className="text-2xl font-bold text-orange-700">
                      {formatAmount(totalTransportCost)}
                    </div>
                  </div>
                  <Badge className="bg-orange-600 text-white">
                    <Truck className="h-3 w-3 mr-1" />
                    Total Transport
                  </Badge>
                </div>
                <div className="text-xs text-orange-800 mt-2">
                  Calculated across all {pricedItems.length} items • {formatPercentage((totalTransportCost / grandTotal) * 100)} of delivery total
                </div>
              </div>
            </div>

            {/* Regional Machinery Impact */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-600" />
                Machinery & Duration Impact on Fees
              </h3>
              <div className="bg-white p-4 rounded-lg border border-indigo-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Machinery Type Impact</div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">Owned</Badge>
                        <span className="text-gray-700">Reduces earthworks costs by up to 60% (fuel & maintenance only)</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300">Rented</Badge>
                        <span className="text-gray-700">Includes market rates, mobilization, operators, and demobilization</span>
                      </div>
                      <div className="mt-2 p-2 bg-blue-50 rounded text-blue-900 text-xs">
                        <strong>Your selection:</strong> {projectSettings?.machineryType === 'owned' ? 'Owned Plant (Cost Optimized)' : 'Rented/Hired (Full Market Rate)'}
                      </div>
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <div className="text-xs text-gray-600 mb-1">Machinery Type</div>
                        <div className="text-sm font-bold text-blue-700">
                          {(() => {
                            const isOwned = projectSettings?.machineryType === 'owned';
                            const machineryPercent = isOwned ? '-5%' : '+3%';
                            return `${machineryPercent} (R${Math.abs(totalMachineryAmount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-2">Duration Impact</div>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div>• <strong>1-3 months:</strong> Rush premium (+2-5% compressed timeline)</div>
                      <div>• <strong>4-12 months:</strong> Standard duration (0% - optimal)</div>
                      <div>• <strong>13+ months:</strong> Economies of scale (-1% to -3% better planning)</div>
                      <div className="mt-2 p-2 bg-orange-50 rounded text-orange-900 text-xs">
                        <strong>Your project:</strong> {projectSettings?.duration || '6'} months duration
                      </div>
                      <div className="mt-2 pt-2 border-t border-orange-200">
                        <div className="text-xs text-gray-600 mb-1">Project Duration</div>
                        <div className="text-sm font-bold text-orange-700">
                          {(() => {
                            const duration = parseInt(projectSettings?.duration || '6');
                            let durationPercent = '0%';
                            if (duration <= 1) durationPercent = '+5%';
                            else if (duration <= 3) durationPercent = '+2%';
                            else if (duration <= 12) durationPercent = '0%';
                            else if (duration <= 18) durationPercent = '-1%';
                            else if (duration <= 24) durationPercent = '-2%';
                            else durationPercent = '-3%';
                            return `${durationPercent} (R${Math.abs(totalDurationAmount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Flow Formula */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-purple-600" />
                Calculation Flow
              </h3>
              <div className="bg-white p-4 rounded-lg border-2 border-purple-200">
                <div className="text-xs font-mono space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">1.</span>
                    <span className="text-gray-700">Base + Transport = Subtotal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">2.</span>
                    <span className="text-gray-700">Add CIDB % + Profit % + Duration/Machinery = Additional Fees (purple column in the Priced Bill of Quantities)</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-900 font-bold">Total Additional Fees (already added to the Overall BOQ Total):</span>
                      <span className="text-lg font-bold text-purple-600">
                        {formatAmount(totalAdditionalFees)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-2 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
              <Info className="h-4 w-4 text-indigo-700 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-indigo-900">
                <span className="font-semibold">Note:</span> These values are used to calculate the Additional Fees shown in the purple column of the pricing table below. 
                All fees are automatically applied based on your project location ({projectSettings?.municipality || 'Johannesburg'}, {projectSettings?.province || 'GP'}) and configuration settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      ) : (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  <Info className="h-4 w-4 text-indigo-600" />
                  Regional Settings & Additional Fee Values
                  {contractorTier === 'free' && <Lock className="w-4 h-4 text-amber-600" />}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  View fee structure (CIDB, Profit), transport costs & machinery/duration impact
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="bg-purple-600 text-white text-xs">Total Additional Fees (already added to the Overall BOQ Total)</Badge>
                  <span className="text-sm font-bold text-purple-700">
                    {formatAmount(totalAdditionalFees)}
                  </span>
                </div>
                {contractorTier === 'free' && (
                  <p className="text-[10px] text-amber-700 mt-2 font-semibold">
                    🔒 Locked in Training Mode. Upgrade to view detailed breakdown.
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (contractorTier !== 'free') {
                    setShowRegionalSettings(true);
                  }
                }}
                className={contractorTier === 'free' ? 'bg-gray-100 border-gray-300 text-gray-500 opacity-50 cursor-not-allowed' : 'bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-100'}
                disabled={contractorTier === 'free'}
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Priced Bill Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Priced Bill of Quantities</CardTitle>
              <CardDescription>
                Optimized for {projectSettings?.municipality || 'Johannesburg'}, {projectSettings?.province || 'GP'} • 
                Including transport costs from nearest branches
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {onBack && (
                <Button 
                  variant="outline" 
                  onClick={onBack}
                  className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8]/10"
                >
                  ← Back to Upload
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className={
                      contractorTier === 'free' 
                        ? 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed' 
                        : isExporting
                        ? 'bg-[#00b4d8] hover:bg-[#00b4d8] cursor-wait'
                        : 'bg-[#00b4d8] hover:bg-[#0096c7]'
                    }
                    disabled={contractorTier === 'free' || isExporting}
                  >
                    {contractorTier === 'free' ? (
                      <Lock className="h-4 w-4 mr-2" />
                    ) : (
                      <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
                    )}
                    {isExporting ? 'Exporting...' : 'Download'}
                  </Button>
                </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Export Format</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {hasFeatureAccess(contractorTier, 'excelExport') ? (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      handleExportToExcel();
                    }} 
                    disabled={isExporting}
                    className={isExporting ? 'opacity-50 cursor-wait' : ''}
                  >
                    <FileSpreadsheet className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
                    {isExporting ? 'Exporting...' : `Download as Excel${applyGreenMaterials ? ' (with Green Materials)' : ''}`}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled className="opacity-50">
                    <Lock className="h-4 w-4 mr-2" />
                    Download as Excel
                    <UpgradeBadge requiredTier="professional" />
                  </DropdownMenuItem>
                )}
                {hasFeatureAccess(contractorTier, 'pdfExport') ? (
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.preventDefault();
                      handleExportToPDF();
                    }} 
                    disabled={isExporting}
                    className={isExporting ? 'opacity-50 cursor-wait' : ''}
                  >
                    <FileText className={`h-4 w-4 mr-2 ${isExporting ? 'animate-pulse' : ''}`} />
                    {isExporting ? 'Exporting...' : `Download as PDF${applyGreenMaterials ? ' (with Green Materials)' : ''}`}
                    {!isExporting && tierFeatures.pdfWatermark && (
                      <Badge className="ml-2 bg-yellow-600 text-white text-[8px]">TRAINING</Badge>
                    )}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem disabled className="opacity-50">
                    <Lock className="h-4 w-4 mr-2" />
                    Download as PDF
                    <UpgradeBadge requiredTier="professional" />
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => { e.preventDefault(); handleExportToWord(); }}
                  disabled={isExporting}
                  className={isExporting ? 'opacity-50 cursor-wait' : ''}
                >
                  <FileText className={`h-4 w-4 mr-2 text-blue-600 ${isExporting ? 'animate-pulse' : ''}`} />
                  {isExporting ? 'Exporting...' : 'Download as Word (.docx)'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full border rounded-lg min-h-[600px] overflow-y-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs p-2 min-w-[60px]">Item</TableHead>
                  <TableHead className="text-xs p-2">Description</TableHead>
                  <TableHead className="text-right text-xs p-2">Qty</TableHead>
                  <TableHead className="text-xs p-2">Best Supplier</TableHead>
                  <TableHead className="text-xs p-2">Unit</TableHead>
                  <TableHead className="text-right text-xs p-2 min-w-[70px]">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Base Price</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs font-semibold mb-1">Supplier Catalog Price (Per Unit)</p>
                          <p className="text-xs mb-2">Sourced from 96 major SA suppliers across 9 categories:</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>• Automatically adjusted for provincial pricing multipliers</li>
                            <li>• Live pricing data (auto-sync suppliers updated daily)</li>
                            <li>• SANS 1200 compliant materials only</li>
                          </ul>
                          <p className="text-xs mt-2 text-gray-500 italic">Does NOT include transport or additional fees</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right text-xs p-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Transport</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs font-semibold mb-1">Transport Cost Per Unit</p>
                          <p className="text-xs mb-2">Calculated from nearest supplier branch using GPS coordinates. Uses whichever is HIGHER:</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>• <span className="font-medium">Distance-based</span>: km × rate/km, OR</li>
                            <li>• <span className="font-medium">Minimum charge</span>: Bulk (R450), Standard (R300), Lightweight (R150)</li>
                          </ul>
                          <p className="text-xs mt-2 text-gray-500 italic">Ensures realistic delivery costs per SA industry standards</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right text-xs p-2 bg-purple-50">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Add. Fees</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs font-semibold mb-1">Additional Fees Per Unit</p>
                          <p className="text-xs mb-2">Includes 4 project-specific cost factors:</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>• <span className="font-medium">CIDB Overhead</span>: GB1-GB9 grading factor (2%-10%)</li>
                            <li>• <span className="font-medium">Profit Margin</span>: Contractor markup (customizable %)</li>
                            <li>• <span className="font-medium">Duration Impact</span>: Timeline adjustment (rush/extended)</li>
                            <li>• <span className="font-medium">Machinery</span>: Owned (5% discount) vs Hired (3% premium)</li>
                          </ul>
                          <p className="text-xs mt-2 text-gray-500 italic">Applied cumulatively to landed cost (base + transport)</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right text-xs p-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Best Overall Price</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs font-semibold mb-1">Final Unit Price (All-Inclusive)</p>
                          <p className="text-xs mb-2">Complete per-unit cost calculation:</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>• Base Price (provincial-adjusted catalog price)</li>
                            <li>• + Transport Cost (optimized for nearest branch)</li>
                            <li>• + Additional Fees (CIDB, profit, duration, machinery)</li>
                          </ul>
                          <p className="text-xs mt-2 font-medium text-blue-600">= Best Overall Price per unit</p>
                          <p className="text-xs mt-1 text-gray-500 italic">Multiply by quantity for Total Price</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-right font-bold text-xs p-2 bg-blue-100 border-l-2 border-blue-300">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">Total</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                          <p className="text-xs font-semibold mb-1">Total Item Cost</p>
                          <p className="text-xs mb-2">Full cost for this line item:</p>
                          <ul className="text-xs space-y-1 ml-3">
                            <li>• Best Overall Price × Quantity</li>
                            <li>• Includes all base, transport, and additional fees</li>
                          </ul>
                          <p className="text-xs mt-2 font-medium text-blue-600">This is your final line item cost</p>
                          <p className="text-xs mt-1 text-gray-500 italic">Sum of all line totals = Grand Total</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.keys(groupedItems).flatMap((category, categoryIndex) => {
                  const categoryItems = groupedItems[category];
                  const categoryRows: JSX.Element[] = [];
                  let itemIndexOffset = 0;
                  
                  // Calculate the global index offset for this category
                  Object.keys(groupedItems).slice(0, categoryIndex).forEach(cat => {
                    itemIndexOffset += groupedItems[cat].length;
                  });

                  // Add all items in this category
                  categoryItems.forEach((item, localIndex) => {
                    const globalIndex = itemIndexOffset + localIndex;
                    const isExpanded = expandedRows.has(globalIndex);
                    const hasAlternatives = item.supplierPrices.length > 1;
                    const mainRowKey = `row-${item.code}-${globalIndex}`;
                    const expandedRowKey = `expanded-${item.code}-${globalIndex}`;
                    
                    // Calculate carbon data for this item (from carbonSummary)
                    const itemWithCarbon = carbonSummary?.itemsWithCarbon?.find((i: any) => 
                      i.code === item.code || 
                      (i.name === item.name && parseFloat(i.quantity) === parseFloat(item.quantity))
                    );
                    const itemCarbonData = itemWithCarbon?.carbonData;
                    
                    // Main item row
                    categoryRows.push(
                      <TableRow
                        key={mainRowKey}
                        className={`cursor-pointer hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}
                        onClick={() => toggleRow(globalIndex)}
                      >
                        <TableCell className="font-medium text-xs p-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          <div>{item.code}</div>
                          {(item.buildAidRef || item.sansCode) && (
                            <div className="flex flex-col gap-0.5 mt-1">
                              {item.buildAidRef && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-amber-50 border-amber-300 text-amber-800 cursor-help w-fit">
                                        📘 {item.buildAidRef}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="text-xs font-semibold mb-1">BuildAid 2025/2026 Reference</p>
                                      <p className="text-xs">{item.buildAidRef} - Industry standard pricing reference</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              {item.sansCode && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 bg-blue-50 border-blue-300 text-blue-800 cursor-help w-fit">
                                        {item.sansCode}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <p className="text-xs font-semibold mb-1">SANS Standard Code</p>
                                      <p className="text-xs">{item.sansCode} - South African National Standard</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="p-2">
                          <div className="text-xs font-medium leading-tight flex items-center gap-1" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>
                            {item.name}
                            {showGreenAnalysis && itemCarbonData?.greenAlternative && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex">
                                      <Leaf className="w-3 h-3 text-green-600 flex-shrink-0 cursor-help" />
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <p className="text-xs">Green alternative available: {itemCarbonData.greenScore} rating. Click row to see details.</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                          {item.selectedSupplier !== 'Not Available' && item.selectedSupplier !== 'N/A' && item.distance !== undefined && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className={`text-[10px] leading-none mt-1 cursor-help ${item.distance <= 50 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {item.distance}km
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="text-xs">Distance from your project site ({projectSettings?.municipality || 'project location'}) to the nearest supplier branch. Calculated using GPS coordinates.</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </TableCell>
                        <TableCell className="text-right text-xs p-2" style={{ whiteSpace: 'normal' }}>{item.quantity}</TableCell>
                        <TableCell className={`p-2 ${item.isGreenMaterial ? 'bg-green-50' : ''}`}>
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="text-xs" style={{ wordBreak: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal' }}>{item.selectedSupplier || item.supplierName}</span>
                            {applyGreenMaterials && item.isGreenMaterial && (
                              <Badge className="bg-green-600 text-white text-[10px] px-1.5 py-0 h-4 shrink-0">
                                🌿 Green
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs p-2" style={{ whiteSpace: 'normal' }}>{item.unit}</TableCell>
                        <TableCell className="text-right text-xs p-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>R{item.baseUnitPrice}</TableCell>
                        <TableCell className="text-right text-orange-600 font-medium text-xs p-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          +R{item.transportCostPerUnit}
                        </TableCell>
                        <TableCell className="text-right text-purple-600 font-medium text-xs p-2 bg-purple-50" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          +R{item.additionalFees || '0.00'}
                        </TableCell>
                        <TableCell className="text-right font-medium text-xs p-2" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          R{parseFloat(item.finalUnitPrice || item.landedUnitPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-bold text-[#00b4d8] text-xs p-2 bg-blue-50 border-l-2 border-blue-300" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          R{parseFloat(item.totalPrice).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    );

                    // Add expanded row if needed
                    if (isExpanded && hasAlternatives) {
                      categoryRows.push(
                        <TableRow key={expandedRowKey}>
                          <TableCell colSpan={10} className="bg-gray-50 p-4">
                            <div className="space-y-2">
                              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                Alternative Supplier Quotes (with all costs & fees)
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(() => {
                                  // If green materials are applied and this item has a green alternative,
                                  // show green supplier as the "Best Price" option
                                  let quotesToDisplay = item.supplierPrices
                                    .filter(quote => quote.available)
                                    .sort((a, b) => parseFloat(a.landedUnitPrice) - parseFloat(b.landedUnitPrice));
                                  
                                  // If green materials applied, create a green supplier quote and mark it as best
                                  if (applyGreenMaterials && item.isGreenMaterial && item.carbonData?.greenAlternative) {
                                    const greenAlt = item.carbonData.greenAlternative;
                                    const quantity = parseFloat(item.quantity) || 1;
                                    const greenUnitPrice = parseFloat(item.finalUnitPrice);
                                    const greenTransportPerUnit = parseFloat(item.transportCostPerUnit || '0');
                                    const greenBasePrice = greenUnitPrice - greenTransportPerUnit - (parseFloat(item.additionalFees || '0'));
                                    
                                    // Create green supplier quote
                                    const greenQuote = {
                                      supplier: greenAlt.supplierName,
                                      branchName: 'Green Materials Division',
                                      baseUnitPrice: greenBasePrice.toFixed(2),
                                      transportCostPerUnit: greenTransportPerUnit.toFixed(2),
                                      distance: 'Eco-Optimized',
                                      landedUnitPrice: (greenBasePrice + greenTransportPerUnit).toFixed(2),
                                      totalLandedCost: ((greenBasePrice + greenTransportPerUnit) * quantity).toString(),
                                      materialType: 'Green Certified',
                                      available: true,
                                      isNationalBest: true, // Mark green as best when applied
                                      savingsVsNationalBest: '0.00',
                                    };
                                    
                                    // Remove the "Best Price" flag from standard suppliers
                                    quotesToDisplay = quotesToDisplay.map(q => ({
                                      ...q,
                                      isNationalBest: false,
                                    }));
                                    
                                    // Add green quote at the beginning
                                    quotesToDisplay = [greenQuote, ...quotesToDisplay];
                                  }
                                  
                                  return quotesToDisplay.map((quote, quoteIndex) => {
                                    // Calculate final unit price with additional fees for this quote
                                    const landedPrice = parseFloat(quote.landedUnitPrice);
                                    const quantity = parseFloat(item.quantity) || 1;
                                    
                                    // Apply project settings to calculate final price
                                    let finalUnitPriceForQuote = landedPrice;
                                    let additionalFeesForQuote = 0;
                                    
                                    if (projectSettings) {
                                      let currentPrice = landedPrice;
                                      
                                      // Apply CIDB overhead
                                      const cidbFactors: { [key: string]: number } = {
                                        'GB1': 1.02, 'GB2': 1.03, 'GB3': 1.04, 'GB4': 1.05,
                                        'GB5': 1.06, 'GB6': 1.07, 'GB7': 1.08, 'GB8': 1.09, 'GB9': 1.10,
                                      };
                                      const cidbFactor = cidbFactors[projectSettings.cidbGrading || 'GB4'] || 1.05;
                                      currentPrice *= cidbFactor;
                                      
                                      // Apply Duration factor
                                      const duration = parseInt(projectSettings.duration || '6');
                                      let durationFactor = 1.00;
                                      if (duration <= 1) durationFactor = 1.05;
                                      else if (duration <= 3) durationFactor = 1.02;
                                      else if (duration <= 12) durationFactor = 1.00;
                                      else if (duration <= 18) durationFactor = 0.99;
                                      else if (duration <= 24) durationFactor = 0.98;
                                      else durationFactor = 0.97;
                                      currentPrice *= durationFactor;
                                      
                                      // Apply Machinery factor
                                      const machineryFactor = projectSettings.machineryType === 'owned' ? 0.95 : 1.03;
                                      currentPrice *= machineryFactor;
                                      
                                      // Apply Profit margin
                                      const profitMarginPercent = parseFloat(projectSettings.profitMargin || '15') / 100;
                                      currentPrice *= (1 + profitMarginPercent);
                                      
                                      finalUnitPriceForQuote = currentPrice;
                                      additionalFeesForQuote = currentPrice - landedPrice;
                                    }
                                    
                                    const finalTotalPrice = finalUnitPriceForQuote * quantity;
                                    
                                    return (
                                    <Card
                                      key={quoteIndex}
                                      className={`${
                                        quote.isNationalBest
                                          ? 'border-2 border-green-500 bg-green-50'
                                          : 'border border-gray-200'
                                      }`}
                                    >
                                      <CardContent className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                          <div>
                                            <div className="font-semibold text-sm flex items-center gap-1">
                                              {quote.materialType === 'Green Certified' && (
                                                <Leaf className="w-4 h-4 text-green-600" />
                                              )}
                                              {quote.supplier}
                                            </div>
                                            <div className="text-xs text-gray-500">{quote.branchName}</div>
                                          </div>
                                          {quote.isNationalBest && (
                                            <Badge className="bg-green-600 text-white text-xs">
                                              {quote.materialType === 'Green Certified' ? '🌿 Best Green' : 'Best Price'}
                                            </Badge>
                                          )}
                                        </div>

                                        <div className="space-y-1.5 mt-3">
                                          <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600">Base Unit Price:</span>
                                            <span className="font-medium">R{quote.baseUnitPrice}</span>
                                          </div>
                                          <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600 flex items-center gap-1">
                                              <Truck className="h-3 w-3" />
                                              Transport ({quote.distance}km):
                                            </span>
                                            <span className="font-medium text-orange-600">
                                              +R{quote.transportCostPerUnit}/unit
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center text-xs">
                                            <span className="text-gray-600 flex items-center gap-1">
                                              <Package className="h-3 w-3" />
                                              Material Type:
                                            </span>
                                            <Badge variant="outline" className={`text-xs ${getMaterialTypeBadge(quote.materialType)}`}>
                                              {quote.materialType}
                                            </Badge>
                                          </div>
                                          <div className="pt-2 mt-2 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                              <span className="text-xs font-semibold text-gray-700">Landed Unit Price:</span>
                                              <span className="text-sm font-bold text-[#00b4d8]">
                                                R{quote.landedUnitPrice}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="text-xs text-gray-600">Landed Total:</span>
                                              <span className="text-xs font-medium">
                                                R{parseFloat(quote.totalLandedCost).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                                              </span>
                                            </div>
                                          </div>

                                          {/* NEW: Show Additional Fees and Final Price */}
                                          <div className="pt-2 mt-2 border-t border-purple-200 bg-purple-50/50 -mx-4 px-4 py-2">
                                            <div className="flex justify-between items-center">
                                              <span className="text-xs text-purple-700">Additional Fees:</span>
                                              <span className="text-xs font-medium text-purple-700">
                                                +R{additionalFeesForQuote.toFixed(2)}/unit
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-purple-300">
                                              <span className="text-xs font-bold text-gray-800">Final Unit Price:</span>
                                              <span className="text-sm font-bold text-green-700">
                                                R{finalUnitPriceForQuote.toFixed(2)}
                                              </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="text-xs font-bold text-gray-800">Final Total:</span>
                                              <span className="text-sm font-bold text-green-700">
                                                R{finalTotalPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                              </span>
                                            </div>
                                          </div>

                                          {quote.savingsVsNationalBest && parseFloat(quote.savingsVsNationalBest) > 0 && (
                                            <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
                                              +R{quote.savingsVsNationalBest} more expensive
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )});
                                })()}

                              </div>
                              
                              {/* Green Building Carbon Data - Show when Green Analysis is enabled */}
                              {showGreenAnalysis && itemCarbonData && (
                                <div className="mt-4 pt-4 border-t-2 border-green-200">
                                  <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                                    <Leaf className="w-4 h-4" />
                                    Carbon Footprint & Green Alternative
                                    <Badge className={`text-xs ${
                                      itemCarbonData.greenScore === 'A+' ? 'bg-green-700' :
                                      itemCarbonData.greenScore === 'A' ? 'bg-green-600' :
                                      itemCarbonData.greenScore === 'B' ? 'bg-blue-600' :
                                      itemCarbonData.greenScore === 'C' ? 'bg-orange-500' : 'bg-red-500'
                                    } text-white`}>
                                      Green Score: {itemCarbonData.greenScore}
                                    </Badge>
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <Card className="bg-gray-50 border-gray-300">
                                      <CardHeader className="pb-2">
                                        <CardTitle className="text-xs text-gray-600">Standard Material</CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-1">
                                          <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Carbon per unit:</span>
                                            <span className="font-medium">{itemCarbonData.carbonPerUnit.toFixed(2)} kgCO₂e</span>
                                          </div>
                                          <div className="flex justify-between text-xs">
                                            <span className="text-gray-600">Total carbon:</span>
                                            <span className="font-bold text-gray-900">{(itemCarbonData.totalCarbon / 1000).toFixed(2)} tCO₂e</span>
                                          </div>
                                          <div className="text-xs text-gray-500 mt-2">
                                            Category: {itemCarbonData.category}
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                    
                                    {itemCarbonData.greenAlternative ? (
                                      <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-400">
                                        <CardHeader className="pb-2">
                                          <CardTitle className="text-xs text-green-800 flex items-center gap-1">
                                            <TreeDeciduous className="w-3 h-3" />
                                            {itemCarbonData.greenAlternative.name}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                              <span className="text-green-700">Carbon savings:</span>
                                              <span className="font-bold text-green-900">
                                                -{itemCarbonData.greenAlternative.carbonSavingsPercent.toFixed(1)}%
                                              </span>
                                            </div>
                                            <div className="flex justify-between text-xs">
                                              <span className="text-green-700">Total carbon:</span>
                                              <span className="font-medium">{(itemCarbonData.greenAlternative.totalCarbon / 1000).toFixed(2)} tCO₂e</span>
                                            </div>
                                            <div className="flex justify-between text-xs mt-2 pt-2 border-t border-green-300">
                                              <span className="text-orange-700">Cost premium:</span>
                                              <span className="font-medium text-orange-900">
                                                +R{itemCarbonData.greenAlternative.totalPricePremium.toFixed(2)} (+{itemCarbonData.greenAlternative.pricePremiumPercent.toFixed(1)}%)
                                              </span>
                                            </div>
                                            <div className="text-xs text-green-600 mt-2 font-medium">
                                              🏢 {itemCarbonData.greenAlternative.supplierName}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ) : (
                                      <Card className="bg-blue-50 border-blue-300">
                                        <CardContent className="py-4">
                                          <div className="text-xs text-blue-800 text-center">
                                            <Info className="w-4 h-4 inline mb-1" />
                                            <div>No green alternative available yet for this material type.</div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  });

                  // Add "TOTAL CARRIED FORWARD" row for this category
                  const categoryTotal = categorySubtotals[category];
                  categoryRows.push(
                    <TableRow 
                      key={`subtotal-${category}`} 
                      className="bg-yellow-50 border-t border-b border-yellow-300 font-semibold"
                    >
                      <TableCell colSpan={9} className="text-right p-2 text-[11px] uppercase">
                        TOTAL CARRIED FORWARD - {category}:
                      </TableCell>
                      <TableCell className="text-right text-yellow-900 font-bold p-2 text-[11px] whitespace-nowrap">
                        R{categoryTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  );

                  return categoryRows;
                })}

                {/* Grand Total Row */}
                <TableRow className="bg-[#00b4d8]/10 font-bold border-t-2 border-[#00b4d8]">
                  <TableCell colSpan={9} className="text-right p-2 text-[11px] uppercase">
                    GRAND TOTAL:
                  </TableCell>
                  <TableCell className="text-right text-[#00b4d8] p-2 text-[11px] whitespace-nowrap">
                    R{grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Future Price Projections (Inflation-Adjusted) - ENTERPRISE TIER ONLY */}
      {hasFeatureAccess(contractorTier, 'futurePriceProjections') ? (
        showInflationProjection ? (
          <Card className="border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 mt-6">
          <CardHeader className="py-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Future Price Projections
                  <Badge className="bg-purple-600 text-white ml-2 text-[9px] px-1.5 py-0.5">ENTERPRISE</Badge>
                </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                BOQ costs at 6 and 12 months based on SA construction inflation
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInflationProjection(false)}
              className="border-amber-300 text-amber-700 hover:bg-amber-100 h-7 text-xs"
            >
              Hide
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
              {/* Inflation Rate Control */}
              <div className="bg-white p-2 rounded border border-amber-200">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-semibold text-gray-900">Annual Inflation Rate</div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      SA construction material inflation (2024-2026 avg)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.5"
                      value={customInflationRate}
                      onChange={(e) => setCustomInflationRate(parseFloat(e.target.value) || 7.5)}
                      className="w-16 px-2 py-1 text-xs border border-amber-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <span className="text-sm font-bold text-amber-600">{customInflationRate}%</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-1 text-[10px]">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-300 text-[9px] px-1 py-0">Bulk</Badge>
                    <span className="text-gray-600">~8-10%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-[9px] px-1 py-0">Standard</Badge>
                    <span className="text-gray-600">~6-8%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-[9px] px-1 py-0">Light</Badge>
                    <span className="text-gray-600">~5-7%</span>
                  </div>
                </div>
              </div>

              {/* Projection Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Current Price */}
                <Card className="border-2 border-[#00b4d8] bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <div className="p-1 bg-[#00b4d8] rounded">
                        <Banknote className="h-3 w-3 text-white" />
                      </div>
                      Current Price
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-[#00b4d8] mb-1 break-words overflow-hidden">
                      R{grandTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-gray-600">
                      Today's pricing • February 2026
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <Badge className="bg-[#00b4d8] text-white text-[10px]">Baseline</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 6 Months Projection */}
                <Card className="border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <div className="p-1 bg-amber-500 rounded">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      6 Months Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-amber-600 mb-1 break-words overflow-hidden">
                      R{(grandTotal * (1 + (customInflationRate / 100) * 0.5)).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-gray-600 mb-2">
                      Estimated price by August 2026
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                      <div className="overflow-hidden min-w-0">
                        <div className="text-[10px] text-gray-600">Increase</div>
                        <div className="text-xs font-bold text-amber-700 break-words">
                          +R{(grandTotal * (customInflationRate / 100) * 0.5).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300 flex-shrink-0 ml-2 text-[10px]">
                        +{(customInflationRate * 0.5).toFixed(1)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 12 Months Projection */}
                <Card className="border-2 border-red-300 bg-gradient-to-br from-red-50 to-orange-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xs flex items-center gap-1.5">
                      <div className="p-1 bg-red-500 rounded">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      12 Months Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold text-red-600 mb-1 break-words overflow-hidden">
                      R{(grandTotal * (1 + (customInflationRate / 100))).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-gray-600 mb-2">
                      Estimated price by February 2027
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-red-200">
                      <div className="overflow-hidden min-w-0">
                        <div className="text-[10px] text-gray-600">Increase</div>
                        <div className="text-xs font-bold text-red-700 break-words">
                          +R{(grandTotal * (customInflationRate / 100)).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-700 border-red-300 flex-shrink-0 ml-2 text-[10px]">
                        +{customInflationRate.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Inflation Impact Warning */}
              <div className="flex items-start gap-3 p-4 bg-amber-100 rounded-lg border border-amber-300">
                <Info className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-amber-900 mb-1">Why Plan for Price Increases?</div>
                  <p className="text-xs text-amber-800">
                    Construction material prices in South Africa typically rise 6-10% annually due to currency fluctuation, 
                    energy costs, and supply chain factors. Projects starting in 6-12 months should budget for these increases. 
                    Consider locking in prices with suppliers or adding contingency funds to your project budget.
                  </p>
                  <div className="mt-2 text-xs text-amber-900">
                    <strong>💡 Recommendation:</strong> For projects starting in {projectSettings?.duration || '6'} months, 
                    add {(customInflationRate * (parseInt(projectSettings?.duration || '6') / 12)).toFixed(1)}% contingency 
                    (≈R{(grandTotal * (customInflationRate / 100) * (parseInt(projectSettings?.duration || '6') / 12)).toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}) 
                    to your budget.
                  </div>
                </div>
              </div>

              {/* Historical Context */}
              <Card className="bg-white border border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">South African Construction Material Inflation (Historical)</CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Based on Statistics South Africa (Stats SA) PPI data and industry reports. Last updated: February 2026
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-600 mb-1">2023</div>
                      <div className="text-lg font-bold text-gray-900">8.2%</div>
                      <div className="text-gray-500">Steel & cement spike</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-600 mb-1">2024</div>
                      <div className="text-lg font-bold text-gray-900">7.1%</div>
                      <div className="text-gray-500">Currency impact</div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <div className="text-gray-600 mb-1">2025</div>
                      <div className="text-lg font-bold text-gray-900">6.8%</div>
                      <div className="text-gray-500">Moderating trend</div>
                    </div>
                    <div className="bg-amber-50 p-3 rounded border border-amber-300">
                      <div className="text-amber-700 mb-1">2026 (Est.)</div>
                      <div className="text-lg font-bold text-amber-700">{customInflationRate}%</div>
                      <div className="text-amber-600">Your assumption</div>
                    </div>
                  </div>
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600 border border-gray-200">
                    <strong>Disclaimer:</strong> These projections are estimates based on historical trends and current economic conditions. 
                    Actual future prices may vary due to market volatility, exchange rates, global commodity prices, and other economic factors. 
                    We recommend obtaining updated quotes from suppliers before committing to purchases.
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 mt-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <p className="text-sm font-semibold text-gray-900">
                    Future Price Projections (Inflation-Adjusted)
                  </p>
                </div>
                <p className="text-xs text-gray-600 mb-3">
                  Estimated BOQ costs at 6 and 12 months based on SA construction inflation trends
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-amber-600 text-white text-xs">6 Months</Badge>
                    <span className="text-sm font-bold text-amber-700">
                      R{(grandTotal * (1 + (customInflationRate / 100) * 0.5)).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-600">
                      (+{(customInflationRate * 0.5).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white text-xs">12 Months</Badge>
                    <span className="text-sm font-bold text-red-700">
                      R{(grandTotal * (1 + (customInflationRate / 100))).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-gray-600">
                      (+{customInflationRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowInflationProjection(true)}
                className="bg-white border-amber-300 text-amber-700 hover:bg-amber-100"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Show Details
              </Button>
            </div>
          </CardContent>
        </Card>
        )
      ) : (
        <div className="mt-6">
          <UpgradePrompt
            currentTier={contractorTier}
            requiredTier="enterprise"
            featureName="Future Price Projections"
            featureDescription="See 6-month and 12-month inflation-adjusted price forecasts based on South African construction material trends. Essential for budget planning and tender submissions."
            onUpgrade={() => setShowUpgradeModal(true)}
          />
        </div>
      )}

      {/* UPGRADE MODAL - Pre-select Enterprise tier for Professional users */}
      {showUpgradeModal && contractorData && (
        <SubscriptionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={() => {
            setShowUpgradeModal(false);
            window.location.reload(); // Reload to update tier access
          }}
          userId={contractorData.id || ''}
          userEmail={contractorData.email || ''}
          userName={contractorData.contact_person || contractorData.company_name || ''}
          currentTier={contractorTier} // Pass current tier
          defaultTier="enterprise" // Pre-select Enterprise tier
          subscriptionStartDate={contractorData.subscription_start_date}
          lastPaymentDate={contractorData.last_payment_date}
        />
      )}
    </div>
  );
}