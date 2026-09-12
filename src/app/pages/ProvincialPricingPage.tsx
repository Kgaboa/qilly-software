import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ProvincialPricing } from '@/app/components/ProvincialPricing';
import { provinces, getProvincialPrice } from '@/utils/provincialPricing';
import { getAllSupplierItems } from '@/utils/supplierCatalog';
import { useState, useEffect } from 'react';
import { MapPin, Coins, TrendingUp, Search, Filter, Database, AlertCircle, CheckCircle } from 'lucide-react';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { fetchAllDatabaseProducts, type DatabaseProduct } from '@/utils/databaseProducts';
import { fetchProvincialPricingFactors, type ProvincialPricingFactor } from '@/utils/databaseProvincialPricing';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';

// Helper function to convert province full names to codes
const provinceNameToCode = (provinceName: string): string => {
  const mapping: Record<string, string> = {
    'gauteng': 'GP',
    'western cape': 'WC',
    'kwazulu-natal': 'KZN',
    'kzn': 'KZN',
    'eastern cape': 'EC',
    'free state': 'FS',
    'mpumalanga': 'MP',
    'limpopo': 'LP',
    'north west': 'NW',
    'northwest': 'NW',
    'northern cape': 'NC',
    // Also support codes as-is
    'gp': 'GP',
    'wc': 'WC',
    'ec': 'EC',
    'fs': 'FS',
    'mp': 'MP',
    'lp': 'LP',
    'nw': 'NW',
    'nc': 'NC',
  };
  const normalized = provinceName.toLowerCase().trim();
  return mapping[normalized] || provinceName.toUpperCase();
};

interface ProvincialPricingPageProps {
  contractorData?: any;
}

export default function ProvincialPricingPage({ contractorData }: ProvincialPricingPageProps) {
  const [selectedProvince, setSelectedProvince] = useState('GP');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('all');
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);
  const [provincialFactors, setProvincialFactors] = useState<ProvincialPricingFactor[]>([]);
  const [isLoadingFactors, setIsLoadingFactors] = useState(true);
  const [useDatabaseFactors, setUseDatabaseFactors] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Add debug message helper
  const addDebug = (message: string) => {
    setDebugInfo(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  // Load provincial pricing factors from database
  useEffect(() => {
    const loadProvincialFactors = async () => {
      setIsLoadingFactors(true);
      addDebug('🔄 Starting to load provincial factors from database...');
      
      const factors = await fetchProvincialPricingFactors();
      setProvincialFactors(factors);
      setIsLoadingFactors(false);
      
      if (factors.length > 0) {
        addDebug(`✅ Loaded ${factors.length} pricing factors from Supabase database`);
        setUseDatabaseFactors(true);
        
        // Log each factor for verification (using new schema: short_name and multiplier)
        factors.forEach(f => {
          addDebug(`   - ${f.short_name}: ${f.multiplier}x (${f.province_name})`);
        });
      } else {
        addDebug('⚠️ No pricing factors in database, falling back to hardcoded values');
        setUseDatabaseFactors(false);
        
        // Log hardcoded fallback values
        provinces.forEach(p => {
          addDebug(`   - ${p.code}: ${p.factor}x (${p.name}) [FALLBACK]`);
        });
      }
    };

    loadProvincialFactors();
  }, []);

  // Use database factors if available, otherwise fallback to hardcoded provinces
  // Database schema: short_name (GP), province_name, multiplier, logistics_notes
  const allProvinces = useDatabaseFactors && provincialFactors.length > 0
    ? provincialFactors.map(f => ({
        code: f.short_name,              // Use short_name (GP, WC, etc.)
        name: f.province_name,            // Province name
        factor: f.multiplier,             // Use multiplier instead of pricing_factor
        description: f.logistics_notes || '' // Use logistics_notes instead of description
      }))
    : provinces;

  const selectedProvinceData = allProvinces.find(p => p.code === selectedProvince);
  
  // Ensure we always have a valid factor (fallback to 1.0 if province not found)
  const currentFactor = selectedProvinceData?.factor ?? 1.0;

  // Log when selected province changes
  useEffect(() => {
    if (selectedProvinceData) {
      addDebug(`📍 Selected Province: ${selectedProvinceData.name} (${selectedProvinceData.code}) - Factor: ${selectedProvinceData.factor}x`);
    }
  }, [selectedProvince]); // Only depend on selectedProvince, not selectedProvinceData

  // Load products from database
  useEffect(() => {
    const loadDatabaseProducts = async () => {
      setIsLoadingDb(true);
      addDebug('🔄 Loading products from database...');
      
      const products = await fetchAllDatabaseProducts();
      setDatabaseProducts(products);
      setIsLoadingDb(false);
      
      if (products.length > 0) {
        addDebug(`✅ Loaded ${products.length} products from Supabase database`);
      } else {
        addDebug('⚠️ No products in database, falling back to catalog');
        setUseDatabase(false);
      }
    };

    loadDatabaseProducts();
  }, []);

  // Get all supplier items from catalog (fallback)
  const catalogItems = getAllSupplierItems();
  
  // Choose data source
  const allItems = useDatabase && databaseProducts.length > 0 
    ? databaseProducts.map(p => ({
        itemName: p.description,
        supplier: p.supplier_name,
        category: p.category || 'General',
        unit: p.unit,
        unitPrice: p.unit_price,
        available: p.is_available,
        keywords: [] // Keywords not in database schema yet
      }))
    : catalogItems;
  
  // Filter items based on search and supplier
  const filteredItems = allItems.filter(item => {
    const matchesSearch = searchQuery === '' || 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSupplier = selectedSupplier === 'all' || 
      item.supplier.toLowerCase() === selectedSupplier.toLowerCase();
    
    return matchesSearch && matchesSupplier && item.available;
  });

  // Get unique suppliers for filter
  const uniqueSuppliers = Array.from(new Set(allItems.map(item => item.supplier))).sort();

  // Convert contractor's operating provinces to codes
  const operatingProvinceCodes = contractorData?.operating_provinces 
    ? contractorData.operating_provinces.map((prov: string) => provinceNameToCode(prov))
    : undefined;

  // Check if a province is selectable (in operating provinces list)
  const isProvinceSelectable = (provinceCode: string): boolean => {
    // If no operating provinces specified, all are selectable
    if (!operatingProvinceCodes || operatingProvinceCodes.length === 0) {
      return true;
    }
    // Check if province code is in operating provinces
    return operatingProvinceCodes.includes(provinceCode);
  };

  // Filter provinces to only show contractor's operating provinces
  const displayedProvinces = operatingProvinceCodes && operatingProvinceCodes.length > 0
    ? allProvinces.filter(p => operatingProvinceCodes.includes(p.code))
    : allProvinces;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Provincial Pricing</h1>
                {isLoadingDb ? (
                  <Badge className="bg-gray-500 text-white">
                    <Database className="w-3 h-3 mr-1" />
                    Loading...
                  </Badge>
                ) : useDatabase && databaseProducts.length > 0 ? (
                  <Badge className="bg-green-600 text-white">
                    <Database className="w-3 h-3 mr-1" />
                    Database ({databaseProducts.length} products)
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white">
                    Catalog (Fallback)
                  </Badge>
                )}
                {isLoadingFactors ? (
                  <Badge className="bg-gray-500 text-white">
                    <Database className="w-3 h-3 mr-1" />
                    Loading Factors...
                  </Badge>
                ) : useDatabaseFactors && provincialFactors.length > 0 ? (
                  <Badge className="bg-green-600 text-white">
                    <Database className="w-3 h-3 mr-1" />
                    DB Factors ({provincialFactors.length})
                  </Badge>
                ) : (
                  <Badge className="bg-orange-500 text-white">
                    Hardcoded Factors
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 mt-1">
                View supplier rates adjusted for all South African provinces
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Province Selector */}
          <ProvincialPricing 
            selectedProvince={selectedProvince}
            onProvinceSelect={setSelectedProvince}
            showPricingInfo={true}
            operatingProvinces={operatingProvinceCodes}
          />

          {/* Selected Province Details */}
          {selectedProvinceData && (
            <Card className="bg-gradient-to-r from-primary/10 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5 text-primary" />
                  Selected Province: {selectedProvinceData.name} ({selectedProvinceData.code})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Pricing Factor</div>
                    <div className="text-2xl font-bold text-primary mt-1">
                      {selectedProvinceData.factor.toFixed(2)}x
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Price Adjustment</div>
                    <div className={`text-2xl font-bold mt-1 ${
                      selectedProvinceData.factor === 1.0 
                        ? 'text-green-600' 
                        : 'text-orange-600'
                    }`}>
                      {selectedProvinceData.factor === 1.0 
                        ? 'Base Rate' 
                        : `+${((selectedProvinceData.factor - 1) * 100).toFixed(1)}%`
                      }
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600">Description</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">
                      {selectedProvinceData.description}
                    </div>
                  </div>
                </div>

                {/* Calculation Example */}
                <div className="mt-4 bg-white rounded-lg p-4 border-2 border-primary/20">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="size-5 text-green-600" />
                    Pricing Calculation Example
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Example: Cement bag in Gauteng (GP)</span>
                      <span className="font-mono font-semibold">R150.00</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Pricing factor for {selectedProvinceData.code}</span>
                      <span className="font-mono font-semibold">{selectedProvinceData.factor.toFixed(2)}x</span>
                    </div>
                    <div className="border-t pt-2 flex items-center justify-between">
                      <span className="font-semibold text-gray-900">Price in {selectedProvinceData.code}:</span>
                      <span className="font-mono font-bold text-primary text-lg">
                        R{(150 * selectedProvinceData.factor).toFixed(2)}
                      </span>
                    </div>
                    {selectedProvinceData.factor !== 1.0 && (
                      <div className="flex items-center justify-between text-sm border-t pt-2">
                        <span className="text-orange-600 font-medium">Additional cost:</span>
                        <span className="font-mono font-semibold text-orange-600">
                          +R{(150 * (selectedProvinceData.factor - 1)).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-2 rounded">
                    <strong>Formula:</strong> Provincial Price = GP Base Price × {selectedProvinceData.factor.toFixed(2)}
                    {selectedProvinceData.factor !== 1.0 && ` (adds ${((selectedProvinceData.factor - 1) * 100).toFixed(1)}% to cover transport costs)`}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Provincial Pricing Factors Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-primary" />
                  Provincial Pricing Factors
                </CardTitle>
                {useDatabaseFactors && provincialFactors.length > 0 && (
                  <Badge className="bg-green-600 text-white">
                    Live from Database
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Province Code</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Province Name</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Pricing Factor</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">Adjustment</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedProvinces.map((province) => {
                      const isBasePricing = province.factor === 1.0;
                      const adjustment = ((province.factor - 1) * 100).toFixed(1);
                      const isSelectable = isProvinceSelectable(province.code);
                      
                      const rowContent = (
                        <tr 
                          key={province.code} 
                          className={`border-b ${
                            isSelectable 
                              ? 'hover:bg-gray-50 cursor-pointer' 
                              : 'bg-gray-100 opacity-60 cursor-not-allowed'
                          } ${
                            selectedProvince === province.code ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => {
                            if (isSelectable) {
                              setSelectedProvince(province.code);
                            }
                          }}
                        >
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center justify-center w-12 h-8 bg-primary/10 text-primary font-bold rounded">
                              {province.code}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900">{province.name}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-3 py-1 rounded-full font-bold ${
                              isBasePricing 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {province.factor.toFixed(2)}x
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {isBasePricing ? (
                              <span className="text-green-600 font-semibold">Base Rate</span>
                            ) : (
                              <span className="text-orange-600 font-semibold">+{adjustment}%</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">{province.description}</td>
                        </tr>
                      );

                      // Wrap in tooltip if not selectable
                      if (!isSelectable) {
                        return (
                          <Tooltip key={province.code}>
                            <TooltipTrigger asChild>
                              {rowContent}
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Not your operating province</p>
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return rowContent;
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}