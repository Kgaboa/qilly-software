/**
 * Supplier Integration Component
 * Admin interface for managing supplier connections and syncing products
 */

import { useState, useEffect } from 'react';
import { 
  SUPPLIER_CONFIGS, 
  getAllSuppliers, 
  syncSupplierProducts,
  SupplierProduct,
  getSupplierProducts,
  getBestPrice,
  type SupplierConfig 
} from '../../utils/suppliers/supplier-connector';
import { getAllProvinces, type Province } from '../../utils/suppliers/province-config';
import { SupplierAPIManager } from './SupplierAPIManager';
import { SyncArchitectureInfo } from './SyncArchitectureInfo';
import { getCurrentEnvironment, getEnvironmentDisplay, setEnvironment } from '../../utils/environment';
import { EnvironmentBanner } from './EnvironmentBanner';
import { fetchSupplierProducts } from '../../utils/suppliers/product-fetchers';
import { toast } from 'sonner';

export function SupplierIntegration() {
  const [activeTab, setActiveTab] = useState<'overview' | 'sync' | 'test-pricing' | 'api-management'>('overview');
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<Record<string, { success: number; errors: number }>>({});
  const [databaseError, setDatabaseError] = useState<string | null>(null);
  
  // API Management state
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierConfig | null>(null);
  
  // Test pricing state
  const [testDescription, setTestDescription] = useState('Cement 42.5N');
  const [testUnit, setTestUnit] = useState('50kg bag');
  const [testQuantity, setTestQuantity] = useState('100');
  const [testProvince, setTestProvince] = useState<Province>('gauteng');
  const [priceQuotes, setPriceQuotes] = useState<any[]>([]);
  const [testingPrices, setTestingPrices] = useState(false);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    setLoading(true);
    setDatabaseError(null);
    
    try {
      const data = await getAllSuppliers();
      setSuppliers(data);
    } catch (error: any) {
      console.error('Error loading suppliers:', error);
      
      // Check if it's a "table doesn't exist" error
      if (error?.code === 'PGRST205' || error?.message?.includes('Could not find the table')) {
        setDatabaseError('database_not_setup');
      } else {
        setDatabaseError(error?.message || 'Unknown error');
      }
    }
    
    setLoading(false);
  };

  const handleSync = async (supplierId: string) => {
    setLoading(true);
    
    try {
      // Generate sample products based on supplier
      const sampleProducts = generateSampleProducts(supplierId);
      
      const result = await syncSupplierProducts(supplierId, sampleProducts);
      setSyncStatus(prev => ({
        ...prev,
        [supplierId]: result
      }));
      
      // Reload suppliers to get updated last_sync timestamp
      await loadSuppliers();
    } catch (error) {
      console.error('Error syncing supplier:', error);
      setSyncStatus(prev => ({
        ...prev,
        [supplierId]: { success: 0, errors: 1 }
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAll = async () => {
    setLoading(true);
    
    // Only sync scraping and REST API suppliers
    const activeSuppliers = SUPPLIER_CONFIGS.filter(s => s.isActive && (s.apiType === 'scraping' || s.apiType === 'rest'));
    let totalSuccess = 0;
    let totalErrors = 0;
    
    try {
      // Sync all suppliers sequentially
      for (const supplier of activeSuppliers) {
        try {
          const sampleProducts = generateSampleProducts(supplier.id);
          const result = await syncSupplierProducts(supplier.id, sampleProducts);
          
          setSyncStatus(prev => ({
            ...prev,
            [supplier.id]: result
          }));
          
          totalSuccess += result.success;
          totalErrors += result.errors;
        } catch (error) {
          console.error(`Error syncing ${supplier.name}:`, error);
          setSyncStatus(prev => ({
            ...prev,
            [supplier.id]: { success: 0, errors: 1 }
          }));
          totalErrors += 1;
        }
      }
      
      // Reload suppliers to get updated timestamps
      await loadSuppliers();
      
      // Show summary notification
      alert(`✅ Sync All Complete!\n\n${totalSuccess} products synced\n${totalErrors} errors\n${activeSuppliers.length} suppliers processed (scraping & REST only)`);
    } catch (error) {
      console.error('Error in sync all:', error);
      alert('❌ Sync All failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestPricing = async () => {
    setTestingPrices(true);
    try {
      const quotes = await getBestPrice(
        testDescription,
        testUnit,
        parseInt(testQuantity),
        testProvince
      );
      setPriceQuotes(quotes);
    } catch (error) {
      console.error('Error testing pricing:', error);
    }
    setTestingPrices(false);
  };

  return (
    <div className="space-y-6">
      {/* Environment Indicator */}
      <EnvironmentBanner />
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Supplier Integration</h2>
        <p className="text-gray-600">
          Manage supplier connections and sync product pricing across all 9 SA provinces
        </p>
      </div>

      {/* Database Not Setup Warning */}
      {databaseError === 'database_not_setup' && (
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-red-900 mb-2">
                ⚠️ Database Tables Missing!
              </h3>
              <p className="text-red-800 mb-4">
                The <code className="bg-red-100 px-2 py-1 rounded font-mono">suppliers</code> and <code className="bg-red-100 px-2 py-1 rounded font-mono">supplier_products</code> tables don't exist in your Supabase database yet.
              </p>
              <div className="bg-white border-2 border-red-300 rounded-lg p-5 mb-4">
                <p className="font-bold text-red-900 mb-3 text-lg">🔧 QUICK FIX (2 minutes):</p>
                <ol className="list-decimal list-inside space-y-3 text-sm text-red-900">
                  <li className="pl-2">
                    <strong>Open Supabase SQL Editor:</strong>
                    <div className="mt-2">
                      <a
                        href={`https://supabase.com/dashboard/project/${window.localStorage.getItem('supabase_project_ref')}/sql/new`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-sm"
                      >
                        🚀 Open Supabase SQL Editor
                      </a>
                    </div>
                  </li>
                  <li className="pl-2 mt-4">
                    <strong>Copy this FIXED SQL script:</strong>
                    <div className="mt-2 p-3 bg-gray-50 border border-gray-300 rounded font-mono text-xs overflow-x-auto">
                      /SUPABASE_SETUP_FIXED.sql
                    </div>
                    <div className="mt-2 text-xs bg-yellow-50 border border-yellow-300 p-2 rounded">
                      💡 <strong>Note:</strong> Use the <code className="bg-yellow-100 px-1">FIXED</code> version - it handles existing tables safely!
                    </div>
                  </li>
                  <li className="pl-2 mt-4">
                    <strong>Paste the entire script into Supabase and click "Run"</strong>
                    <div className="mt-1 text-xs text-gray-600">
                      You should see "Success. No rows returned"
                    </div>
                  </li>
                  <li className="pl-2 mt-4">
                    <strong>Click "Try Again" below</strong> to verify the tables were created
                  </li>
                </ol>
              </div>
              
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-4 mb-4">
                <p className="font-semibold text-blue-900 mb-2">📋 What gets created:</p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✅ <code className="bg-blue-100 px-1 rounded">suppliers</code> table - 6 SA suppliers (Buco, Builders Warehouse, PPC, etc.)</li>
                  <li>✅ <code className="bg-blue-100 px-1 rounded">supplier_products</code> table - Product catalog for pricing</li>
                  <li>✅ All other required tables (users, bills, bill_items, subscriptions)</li>
                  <li>✅ Row-level security policies</li>
                  <li>✅ Database indexes for performance</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={loadSuppliers}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
                >
                  🔄 Try Again
                </button>
                <button
                  onClick={() => setDatabaseError(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generic Error Warning */}
      {databaseError && databaseError !== 'database_not_setup' && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-orange-900">Database Error</h4>
              <p className="text-sm text-orange-800">{databaseError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('sync')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'sync'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🔄 Sync Products
        </button>
        <button
          onClick={() => setActiveTab('test-pricing')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'test-pricing'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          💰 Test Pricing
        </button>
        <button
          onClick={() => setActiveTab('api-management')}
          className={`px-4 py-2 border-b-2 transition-colors ${
            activeTab === 'api-management'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          🔧 API Management
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUPPLIER_CONFIGS.map(supplier => {
              const dbSupplier = suppliers.find(s => s.company_name === supplier.name); // Fixed: Changed from s.name to s.company_name
              
              // Get province abbreviations
              const provinceAbbrevs = supplier.provinces
                .map(p => {
                  const provinceInfo = getAllProvinces().find(prov => prov.code === p);
                  return provinceInfo?.shortName || p.substring(0, 2).toUpperCase();
                })
                .join(', ');
              
              return (
                <div
                  key={supplier.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{supplier.name}</h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {supplier.category.replace('_', ' ')}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${
                      supplier.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">API Type:</span>
                      <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium uppercase">
                        {supplier.apiType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Provinces:</span>
                      <span className="ml-2 font-medium">
                        {supplier.provinces.length}/9 → ({provinceAbbrevs})
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium">
                        {dbSupplier ? (
                          <span className="text-green-600">✓ Synced to DB</span>
                        ) : (
                          <span className="text-gray-500">Not synced</span>
                        )}
                      </span>
                    </div>
                    {dbSupplier?.last_sync && (
                      <div>
                        <span className="text-gray-600">Last Sync:</span>
                        <div className="ml-2 text-xs text-gray-500">
                          {new Date(dbSupplier.last_sync).toLocaleString('en-ZA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )}
                    {supplier.website && (
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block"
                      >
                        Visit Website →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🌍 Provincial Coverage</h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {getAllProvinces().map(province => (
                <div key={province.code} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {province.name} ({province.shortName})
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sync Tab */}
      {activeTab === 'sync' && (
        <div className="space-y-4">
          {/* Educational Component */}
          <SyncArchitectureInfo />
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Sync Sample Data</h4>
            <p className="text-sm text-yellow-800 mb-2">
              This will sync sample product data to the database for testing. 
              In production, this would fetch real data from supplier APIs.
            </p>
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Only syncing suppliers with API Type <span className="px-1 bg-blue-100 rounded font-mono text-xs">SCRAPING</span> or <span className="px-1 bg-green-100 rounded font-mono text-xs">REST</span>. Manual upload suppliers are excluded.
            </p>
          </div>

          <div className="space-y-3">
            {SUPPLIER_CONFIGS.filter(s => s.isActive && (s.apiType === 'scraping' || s.apiType === 'rest')).map(supplier => (
              <div
                key={supplier.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold">{supplier.name}</h4>
                  <p className="text-sm text-gray-600">
                    {supplier.apiType === 'scraping' && 'Will scrape product catalog'}
                    {supplier.apiType === 'rest' && 'Will fetch via REST API'}
                  </p>
                  {syncStatus[supplier.id] && (
                    <p className="text-sm mt-1">
                      <span className="text-green-600">
                        ✓ {syncStatus[supplier.id].success} products synced
                      </span>
                      {syncStatus[supplier.id].errors > 0 && (
                        <span className="text-red-600 ml-2">
                          {syncStatus[supplier.id].errors} errors
                        </span>
                      )}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleSync(supplier.id)}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Syncing...' : 'Sync Now'}
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSyncAll}
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {loading ? 'Syncing All...' : '🔄 Sync All Suppliers'}
          </button>
        </div>
      )}

      {/* Test Pricing Tab */}
      {activeTab === 'test-pricing' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">💡 Test Price Optimization</h4>
            <p className="text-sm text-green-800">
              Search for the best prices across all suppliers in a specific province.
              Make sure to sync supplier data first!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Product Description</label>
              <input
                type="text"
                value={testDescription}
                onChange={(e) => setTestDescription(e.target.value)}
                placeholder="e.g., Cement 42.5N"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <input
                type="text"
                value={testUnit}
                onChange={(e) => setTestUnit(e.target.value)}
                placeholder="e.g., 50kg bag"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                value={testQuantity}
                onChange={(e) => setTestQuantity(e.target.value)}
                placeholder="100"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Province</label>
              <select
                value={testProvince}
                onChange={(e) => setTestProvince(e.target.value as Province)}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                {getAllProvinces().map(province => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleTestPricing}
            disabled={testingPrices}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            {testingPrices ? 'Searching...' : '🔍 Find Best Prices'}
          </button>

          {priceQuotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Price Quotes ({priceQuotes.length} found)</h4>
              {priceQuotes.map((quote, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    index === 0 ? 'border-green-500 bg-green-50' : ''
                  }`}
                >
                  {index === 0 && (
                    <div className="bg-green-600 text-white px-2 py-1 rounded text-xs inline-block mb-2">
                      ⭐ BEST PRICE
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold">{quote.supplierName}</h5>
                      <p className="text-sm text-gray-600">{quote.product.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        R{quote.totalCost.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-600">total cost</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-gray-600">Unit Price:</span>
                      <div className="font-semibold">R{quote.product.unitPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <div className="font-semibold">R{quote.deliveryCost.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery Time:</span>
                      <div className="font-semibold">{quote.deliveryDays} days</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {priceQuotes.length === 0 && testingPrices === false && (
            <div className="text-center py-8 text-gray-500">
              No price quotes yet. Try searching for a product!
            </div>
          )}
        </div>
      )}

      {/* API Management Tab */}
      {activeTab === 'api-management' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🔧 API Management</h4>
            <p className="text-sm text-blue-800">
              Manage API keys, endpoints, and configurations for supplier integrations.
            </p>
          </div>

          <div className="space-y-3">
            {SUPPLIER_CONFIGS.map(supplier => (
              <div
                key={supplier.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-semibold">{supplier.name}</h4>
                  <p className="text-sm text-gray-600">
                    {supplier.apiType === 'scraping' && 'Will scrape product catalog'}
                    {supplier.apiType === 'rest' && 'Will fetch via REST API'}
                    {supplier.apiType === 'manual' && 'Manual product upload'}
                    {supplier.apiType === 'csv' && 'CSV import required'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSupplier(supplier)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Manage API
                </button>
              </div>
            ))}
          </div>

          {selectedSupplier && (
            <SupplierAPIManager
              supplier={selectedSupplier}
              onClose={() => setSelectedSupplier(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Generate sample products for testing
 * COMPREHENSIVE DEMO CATALOG - All major suppliers included!
 * Provincial pricing calculated at query time via DB view
 * 
 * FOR FUNDER DEMO:
 * - 40+ suppliers with realistic product catalogs
 * - 200+ total products across all categories
 * - Full coverage: Building Materials, Steel, Concrete, Plumbing, Electrical, Hardware, Timber, Paint, Roofing
 */
function generateSampleProducts(supplierId: string): SupplierProduct[] {
  // Base product catalog (Gauteng pricing - stored in DB)
  const baseProducts: Record<string, SupplierProduct[]> = {
    // ========== BUILDING MATERIALS & HARDWARE ==========
    'buco': [
      { description: 'Cement 42.5N PPC', unit: '50kg bag', unitPrice: 95.50, category: 'concrete_aggregates', isAvailable: true, productCode: 'BUC-CEM-001' },
      { description: 'Building Sand', unit: 'm3', unitPrice: 285.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BUC-SND-001' },
      { description: 'Steel Reinforcing Bar Y12', unit: '6m length', unitPrice: 115.75, category: 'steel_metal', isAvailable: true, productCode: 'BUC-STL-001' },
      { description: 'Bricks Clay Stock 230x110x76mm', unit: '1000 bricks', unitPrice: 4250.00, category: 'building_materials', isAvailable: true, productCode: 'BUC-BRK-001' },
      { description: 'Plaster Sand', unit: 'm3', unitPrice: 295.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BUC-SND-002' },
      { description: '13mm Gravel', unit: 'm3', unitPrice: 320.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BUC-GRV-001' },
    ],
    'builders-warehouse': [
      { description: 'Cement 42.5N Lafarge', unit: '50kg bag', unitPrice: 97.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BW-CEM-001' },
      { description: 'Building Sand Washed', unit: 'm3', unitPrice: 290.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BW-SND-001' },
      { description: 'Steel Mesh 193', unit: '6m x 2.4m sheet', unitPrice: 385.00, category: 'steel_metal', isAvailable: true, productCode: 'BW-STL-001' },
      { description: 'Bricks Cement Stock', unit: '1000 bricks', unitPrice: 3950.00, category: 'building_materials', isAvailable: true, productCode: 'BW-BRK-001' },
      { description: 'Plywood 18mm', unit: '2440x1220mm sheet', unitPrice: 485.00, category: 'timber', isAvailable: true, productCode: 'BW-PLY-001' },
    ],
    'builders-depot': [
      { description: 'Cement 52.5N', unit: '50kg bag', unitPrice: 105.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BD-CEM-001' },
      { description: 'River Sand', unit: 'm3', unitPrice: 275.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BD-SND-001' },
      { description: 'Bricks Maxi', unit: '1000 bricks', unitPrice: 4100.00, category: 'building_materials', isAvailable: true, productCode: 'BD-BRK-001' },
      { description: 'Crusher Dust', unit: 'm3', unitPrice: 265.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BD-DST-001' },
    ],
    'bilt': [
      { description: 'Timber Pine 38x114mm', unit: '4.2m length', unitPrice: 78.50, category: 'timber', isAvailable: true, productCode: 'BIL-TIM-001' },
      { description: 'Timber Pine 38x152mm', unit: '4.2m length', unitPrice: 95.00, category: 'timber', isAvailable: true, productCode: 'BIL-TIM-002' },
      { description: 'Chipboard 16mm', unit: '2440x1220mm sheet', unitPrice: 275.00, category: 'timber', isAvailable: true, productCode: 'BIL-CHI-001' },
    ],
    'talisman': [
      { description: 'Paving Bricks Charcoal', unit: 'm2', unitPrice: 185.00, category: 'building_materials', isAvailable: true, productCode: 'TAL-PAV-001' },
      { description: 'Paving Bricks Red', unit: 'm2', unitPrice: 175.00, category: 'building_materials', isAvailable: true, productCode: 'TAL-PAV-002' },
      { description: 'Kerbing 300mm', unit: 'm', unitPrice: 95.00, category: 'building_materials', isAvailable: true, productCode: 'TAL-KER-001' },
    ],

    // ========== STEEL & METAL ==========
    'macsteel': [
      { description: 'Steel Reinforcing Bar Y10', unit: '12m length', unitPrice: 145.00, category: 'steel_metal', isAvailable: true, productCode: 'MAC-STL-001' },
      { description: 'Steel Reinforcing Bar Y16', unit: '12m length', unitPrice: 285.00, category: 'steel_metal', isAvailable: true, productCode: 'MAC-STL-002' },
      { description: 'Steel Reinforcing Bar Y20', unit: '12m length', unitPrice: 425.00, category: 'steel_metal', isAvailable: true, productCode: 'MAC-STL-003' },
      { description: 'Steel Angle 50x50x5mm', unit: '6m length', unitPrice: 165.00, category: 'steel_metal', isAvailable: true, productCode: 'MAC-ANG-001' },
    ],
    'njr-steel': [
      { description: 'Steel Reinforcing Bar Y12', unit: '12m length', unitPrice: 195.00, category: 'steel_metal', isAvailable: true, productCode: 'NJR-STL-001' },
      { description: 'Steel Mesh D8-200', unit: '6m x 2.4m sheet', unitPrice: 495.00, category: 'steel_metal', isAvailable: true, productCode: 'NJR-MSH-001' },
      { description: 'Steel Flat Bar 50x10mm', unit: '6m length', unitPrice: 185.00, category: 'steel_metal', isAvailable: true, productCode: 'NJR-FLT-001' },
    ],
    'jvr-steel': [
      { description: 'Steel Pipe 50mm', unit: '6m length', unitPrice: 325.00, category: 'steel_metal', isAvailable: true, productCode: 'JVR-PIP-001' },
      { description: 'Steel Channel 100mm', unit: '6m length', unitPrice: 485.00, category: 'steel_metal', isAvailable: true, productCode: 'JVR-CHL-001' },
      { description: 'Steel I-Beam 150mm', unit: '6m length', unitPrice: 1250.00, category: 'steel_metal', isAvailable: true, productCode: 'JVR-IBM-001' },
    ],
    'stewardsllods': [
      { description: 'Steel Pipe Galvanised 100mm', unit: '6m length', unitPrice: 875.00, category: 'steel_metal', isAvailable: true, productCode: 'STW-PIP-001' },
      { description: 'Steel Tube Square 50x50mm', unit: '6m length', unitPrice: 295.00, category: 'steel_metal', isAvailable: true, productCode: 'STW-TUB-001' },
    ],

    // ========== CONCRETE & AGGREGATES ==========
    'ppc-cement': [
      { description: 'Cement 42.5N PPC SUREBUILD', unit: '50kg bag', unitPrice: 93.50, category: 'concrete_aggregates', isAvailable: true, productCode: 'PPC-CEM-001' },
      { description: 'Cement 32.5R PPC', unit: '50kg bag', unitPrice: 87.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'PPC-CEM-002' },
      { description: 'Cement 52.5N PPC SUREBUILD', unit: '50kg bag', unitPrice: 108.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'PPC-CEM-003' },
    ],
    'lafarge': [
      { description: 'Cement 42.5N PowerPlus', unit: '50kg bag', unitPrice: 96.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'LAF-CEM-001' },
      { description: 'Ready Mix Concrete 25MPa', unit: 'm3', unitPrice: 1250.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'LAF-CON-001' },
      { description: 'Ready Mix Concrete 30MPa', unit: 'm3', unitPrice: 1385.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'LAF-CON-002' },
    ],
    'raumix': [
      { description: 'Ready Mix Concrete 20MPa', unit: 'm3', unitPrice: 1150.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'RAU-CON-001' },
      { description: 'Ready Mix Concrete 30MPa', unit: 'm3', unitPrice: 1350.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'RAU-CON-002' },
      { description: 'Ready Mix Concrete 40MPa', unit: 'm3', unitPrice: 1550.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'RAU-CON-003' },
    ],
    'infraset': [
      { description: 'Concrete Blocks 140mm', unit: '100 blocks', unitPrice: 485.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'INF-BLK-001' },
      { description: 'Concrete Blocks 190mm', unit: '100 blocks', unitPrice: 625.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'INF-BLK-002' },
      { description: 'Concrete Lintels 1800mm', unit: 'each', unitPrice: 185.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'INF-LIN-001' },
    ],
    'technicrete': [
      { description: 'Paving Slabs 450x450mm', unit: 'm2', unitPrice: 195.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'TEC-PAV-001' },
      { description: 'Kerb Stones Heavy Duty', unit: 'm', unitPrice: 125.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'TEC-KER-001' },
    ],

    // ========== PLUMBING & WATER ==========
    'ksb': [
      { description: 'Water Pump Centrifugal 5.5kW', unit: 'each', unitPrice: 12500.00, category: 'plumbing', isAvailable: true, productCode: 'KSB-PMP-001' },
      { description: 'Water Pump Submersible 2.2kW', unit: 'each', unitPrice: 8750.00, category: 'plumbing', isAvailable: true, productCode: 'KSB-PMP-002' },
      { description: 'Pump Controller 7.5kW', unit: 'each', unitPrice: 4250.00, category: 'plumbing', isAvailable: true, productCode: 'KSB-CTR-001' },
    ],
    'avk': [
      { description: 'Gate Valve 100mm', unit: 'each', unitPrice: 2850.00, category: 'plumbing', isAvailable: true, productCode: 'AVK-VLV-001' },
      { description: 'Butterfly Valve 150mm', unit: 'each', unitPrice: 3950.00, category: 'plumbing', isAvailable: true, productCode: 'AVK-VLV-002' },
      { description: 'Hydrant Stand Pipe', unit: 'each', unitPrice: 1250.00, category: 'plumbing', isAvailable: true, productCode: 'AVK-HYD-001' },
    ],
    'marley': [
      { description: 'PVC Pipe 110mm Class 9', unit: '6m length', unitPrice: 285.00, category: 'plumbing', isAvailable: true, productCode: 'MAR-PVC-001' },
      { description: 'PVC Pipe 160mm Class 9', unit: '6m length', unitPrice: 495.00, category: 'plumbing', isAvailable: true, productCode: 'MAR-PVC-002' },
      { description: 'PVC Fittings 110mm Bend 87.5°', unit: 'each', unitPrice: 45.00, category: 'plumbing', isAvailable: true, productCode: 'MAR-FIT-001' },
      { description: 'PVC Fittings 110mm Tee', unit: 'each', unitPrice: 65.00, category: 'plumbing', isAvailable: true, productCode: 'MAR-FIT-002' },
    ],

    // ========== ELECTRICAL ==========
    'actom': [
      { description: 'Transformer 100kVA', unit: 'each', unitPrice: 45000.00, category: 'electrical', isAvailable: true, productCode: 'ACT-TRF-001' },
      { description: 'Motor 7.5kW 3-Phase', unit: 'each', unitPrice: 8500.00, category: 'electrical', isAvailable: true, productCode: 'ACT-MOT-001' },
      { description: 'Circuit Breaker 63A', unit: 'each', unitPrice: 485.00, category: 'electrical', isAvailable: true, productCode: 'ACT-BRK-001' },
    ],
    'arb': [
      { description: 'Distribution Board 8-Way', unit: 'each', unitPrice: 750.00, category: 'electrical', isAvailable: true, productCode: 'ARB-DIS-001' },
      { description: 'Cable Tray 300mm', unit: '3m length', unitPrice: 385.00, category: 'electrical', isAvailable: true, productCode: 'ARB-TRY-001' },
      { description: 'Conduit PVC 25mm', unit: '3m length', unitPrice: 45.00, category: 'electrical', isAvailable: true, productCode: 'ARB-CON-001' },
    ],
    'voltex': [
      { description: 'Electrical Cable 2.5mm² Single Core', unit: '100m roll', unitPrice: 485.00, category: 'electrical', isAvailable: true, productCode: 'VOL-CAB-001' },
      { description: 'Electrical Cable 4mm² Single Core', unit: '100m roll', unitPrice: 725.00, category: 'electrical', isAvailable: true, productCode: 'VOL-CAB-002' },
      { description: 'LED Floodlight 100W', unit: 'each', unitPrice: 950.00, category: 'electrical', isAvailable: true, productCode: 'VOL-LED-001' },
      { description: 'Light Pole Steel 6m', unit: 'each', unitPrice: 3250.00, category: 'electrical', isAvailable: true, productCode: 'VOL-POL-001' },
    ],
    'power-equipment': [
      { description: 'Generator Diesel 20kVA', unit: 'each', unitPrice: 35000.00, category: 'electrical', isAvailable: true, productCode: 'PWR-GEN-001' },
      { description: 'Generator Diesel 50kVA', unit: 'each', unitPrice: 75000.00, category: 'electrical', isAvailable: true, productCode: 'PWR-GEN-002' },
      { description: 'Inverter 5kVA Pure Sine Wave', unit: 'each', unitPrice: 12500.00, category: 'electrical', isAvailable: true, productCode: 'PWR-INV-001' },
    ],

    // ========== HARDWARE & EQUIPMENT ==========
    'much-plant': [
      { description: 'Excavator 20-Ton Hire', unit: 'day', unitPrice: 4500.00, category: 'hardware', isAvailable: true, productCode: 'MUC-EXC-001' },
      { description: 'TLB Hire', unit: 'day', unitPrice: 3200.00, category: 'hardware', isAvailable: true, productCode: 'MUC-TLB-001' },
      { description: 'Roller 10-Ton Hire', unit: 'day', unitPrice: 2850.00, category: 'hardware', isAvailable: true, productCode: 'MUC-ROL-001' },
    ],
    'bosun': [
      { description: 'Scaffolding Standard 1.8m', unit: 'each', unitPrice: 185.00, category: 'hardware', isAvailable: true, productCode: 'BOS-SCF-001' },
      { description: 'Scaffolding Ledger 3m', unit: 'each', unitPrice: 145.00, category: 'hardware', isAvailable: true, productCode: 'BOS-SCF-002' },
      { description: 'Props Acro 2.5m-3.6m', unit: 'each', unitPrice: 285.00, category: 'hardware', isAvailable: true, productCode: 'BOS-PRP-001' },
    ],
    'atlas-plant': [
      { description: 'Concrete Mixer 300L Hire', unit: 'day', unitPrice: 350.00, category: 'hardware', isAvailable: true, productCode: 'ATL-MIX-001' },
      { description: 'Compactor Plate Hire', unit: 'day', unitPrice: 450.00, category: 'hardware', isAvailable: true, productCode: 'ATL-CMP-001' },
      { description: 'Water Pump 3" Hire', unit: 'day', unitPrice: 275.00, category: 'hardware', isAvailable: true, productCode: 'ATL-PMP-001' },
    ],
    'container-world': [
      { description: 'Storage Container 20ft', unit: 'each', unitPrice: 28500.00, category: 'hardware', isAvailable: true, productCode: 'CON-STR-001' },
      { description: 'Storage Container 40ft', unit: 'each', unitPrice: 45000.00, category: 'hardware', isAvailable: true, productCode: 'CON-STR-002' },
      { description: 'Site Office Container', unit: 'each', unitPrice: 38500.00, category: 'hardware', isAvailable: true, productCode: 'CON-OFF-001' },
    ],
    'talisman-hire': [
      { description: 'Toilet Portable Hire', unit: 'month', unitPrice: 850.00, category: 'hardware', isAvailable: true, productCode: 'TAH-TOI-001' },
      { description: 'Fence Panel 3.6m Hire', unit: 'month', unitPrice: 95.00, category: 'hardware', isAvailable: true, productCode: 'TAH-FEN-001' },
    ],
    'hireall': [
      { description: 'Ladder Aluminium 6m', unit: 'day', unitPrice: 125.00, category: 'hardware', isAvailable: true, productCode: 'HIR-LAD-001' },
      { description: 'Wheelbarrow Heavy Duty', unit: 'day', unitPrice: 75.00, category: 'hardware', isAvailable: true, productCode: 'HIR-WHE-001' },
      { description: 'Concrete Vibrator Hire', unit: 'day', unitPrice: 285.00, category: 'hardware', isAvailable: true, productCode: 'HIR-VIB-001' },
    ],

    // ========== TIMBER ==========
    'timber-city': [
      { description: 'Timber Pine 38x76mm', unit: '4.2m length', unitPrice: 52.00, category: 'timber', isAvailable: true, productCode: 'TIC-TIM-001' },
      { description: 'Timber Pine 38x114mm', unit: '4.2m length', unitPrice: 75.00, category: 'timber', isAvailable: true, productCode: 'TIC-TIM-002' },
      { description: 'Timber Eucalyptus Poles 100mm', unit: '3m length', unitPrice: 125.00, category: 'timber', isAvailable: true, productCode: 'TIC-POL-001' },
    ],

    // ========== PAINT & FINISHES ==========
    'dulux': [
      { description: 'Paint Emulsion White 20L', unit: '20L', unitPrice: 685.00, category: 'paint_finishes', isAvailable: true, productCode: 'DUL-PAI-001' },
      { description: 'Paint Gloss White 5L', unit: '5L', unitPrice: 285.00, category: 'paint_finishes', isAvailable: true, productCode: 'DUL-PAI-002' },
      { description: 'Primer Sealer 20L', unit: '20L', unitPrice: 575.00, category: 'paint_finishes', isAvailable: true, productCode: 'DUL-PRI-001' },
    ],
    'plascon': [
      { description: 'Paint Acrylic White 20L', unit: '20L', unitPrice: 695.00, category: 'paint_finishes', isAvailable: true, productCode: 'PLA-PAI-001' },
      { description: 'Paint Roof Red 20L', unit: '20L', unitPrice: 785.00, category: 'paint_finishes', isAvailable: true, productCode: 'PLA-PAI-002' },
    ],

    // ========== ROOFING ==========
    'corrshine': [
      { description: 'IBR Roof Sheeting 0.5mm', unit: 'm', unitPrice: 95.00, category: 'roofing', isAvailable: true, productCode: 'COR-IBR-001' },
      { description: 'Corrugated Sheeting 0.5mm', unit: 'm', unitPrice: 85.00, category: 'roofing', isAvailable: true, productCode: 'COR-COR-001' },
      { description: 'Roof Flashing 0.5mm', unit: 'm', unitPrice: 65.00, category: 'roofing', isAvailable: true, productCode: 'COR-FLA-001' },
    ],

    // ========== MAJOR HARDWARE RETAILERS ==========
    'cashbuild': [
      { description: 'Cement 42.5N', unit: '50kg bag', unitPrice: 98.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'CSH-CEM-001' },
      { description: 'Building Sand', unit: 'm3', unitPrice: 280.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'CSH-SND-001' },
      { description: 'Bricks Clay Face 222x106x73mm', unit: '1000 bricks', unitPrice: 4850.00, category: 'building_materials', isAvailable: true, productCode: 'CSH-BRK-001' },
      { description: 'Steel Reinforcing Bar Y10', unit: '6m length', unitPrice: 75.00, category: 'steel_metal', isAvailable: true, productCode: 'CSH-STL-001' },
    ],
    'pennypinchers': [
      { description: 'Cement 42.5N Surecem', unit: '50kg bag', unitPrice: 92.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'PEN-CEM-001' },
      { description: 'River Sand', unit: 'm3', unitPrice: 270.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'PEN-SND-001' },
      { description: 'Timber Pine 38x76mm CCA Treated', unit: '3.6m length', unitPrice: 58.00, category: 'timber', isAvailable: true, productCode: 'PEN-TIM-001' },
    ],
    'build-it': [
      { description: 'Cement 42.5N', unit: '50kg bag', unitPrice: 96.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BLD-CEM-001' },
      { description: 'Plaster Sand', unit: 'm3', unitPrice: 288.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BLD-SND-001' },
      { description: 'Concrete Blocks 140mm Hollow', unit: '100 blocks', unitPrice: 495.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'BLD-BLK-001' },
      { description: 'Steel Mesh 193 D5', unit: '2.4m x 6m sheet', unitPrice: 395.00, category: 'steel_metal', isAvailable: true, productCode: 'BLD-MSH-001' },
    ],

    // ========== CEMENT & CONCRETE (ADDITIONAL) ==========
    'afrisam': [
      { description: 'Cement 42.5N Afrisam', unit: '50kg bag', unitPrice: 94.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'AFR-CEM-001' },
      { description: 'Cement 32.5R Afrisam', unit: '50kg bag', unitPrice: 86.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'AFR-CEM-002' },
      { description: 'Ready Mix Concrete 25MPa', unit: 'm3', unitPrice: 1225.00, category: 'concrete_aggregates', isAvailable: true, productCode: 'AFR-CON-001' },
    ],
    'prominent-paints': [
      { description: 'Paint Acrylic PVA White 20L', unit: '20L', unitPrice: 675.00, category: 'paint_finishes', isAvailable: true, productCode: 'PRO-PAI-001' },
      { description: 'Paint Roof Tile Red 20L', unit: '20L', unitPrice: 765.00, category: 'paint_finishes', isAvailable: true, productCode: 'PRO-PAI-002' },
    ],

    // ══════════════════════════════════════════════════════════════════════
    // BATCH 2 — 59 NEW SUPPLIERS — BuildAid 2025/2026 aligned pricing
    // Prices = Gauteng base (March 2026). Provincial multipliers applied at query time.
    // Source: BuildAid 2025/2026, SAFCEC wage schedule, published supplier price lists.
    // Status: SIMULATED/ESTIMATED — see Pricing Strategy note below.
    // ══════════════════════════════════════════════════════════════════════

    // ── CIVIL EARTHWORKS & AGGREGATES ──────────────────────────────────────
    'g4-cube': [
      { description: 'G4 Sub-base Crushed Stone', unit: 'm³', unitPrice: 285.00, category: 'civil_earthworks', isAvailable: true, productCode: 'G4C-G4-001' },
      { description: 'G7 Fill Material Crushed Stone', unit: 'm³', unitPrice: 245.00, category: 'civil_earthworks', isAvailable: true, productCode: 'G4C-G7-001' },
      { description: 'Crusher Dust 19mm', unit: 'm³', unitPrice: 265.00, category: 'civil_earthworks', isAvailable: true, productCode: 'G4C-DST-001' },
      { description: 'Crusher Run 37.5mm', unit: 'm³', unitPrice: 255.00, category: 'civil_earthworks', isAvailable: true, productCode: 'G4C-CRN-001' },
      { description: 'Roadstone 19mm', unit: 'm³', unitPrice: 295.00, category: 'civil_earthworks', isAvailable: true, productCode: 'G4C-RDS-001' },
    ],
    'afrimat': [
      { description: 'Crushed Stone 19mm', unit: 'm³', unitPrice: 310.00, category: 'civil_earthworks', isAvailable: true, productCode: 'AFM-CST-001' },
      { description: 'Crushed Stone 13mm', unit: 'm³', unitPrice: 320.00, category: 'civil_earthworks', isAvailable: true, productCode: 'AFM-CST-002' },
      { description: 'G4 Sub-base Graded Crushed Stone', unit: 'm³', unitPrice: 290.00, category: 'civil_earthworks', isAvailable: true, productCode: 'AFM-G4-001' },
      { description: 'Clinker Aggregate Lightweight', unit: 'm³', unitPrice: 385.00, category: 'civil_earthworks', isAvailable: true, productCode: 'AFM-CLK-001' },
      { description: 'Mining Aggregate Specification', unit: 'tonne', unitPrice: 185.00, category: 'civil_earthworks', isAvailable: true, productCode: 'AFM-MIN-001' },
    ],
    'sapstone': [
      { description: 'Roadstone 37.5mm Crushed', unit: 'm³', unitPrice: 275.00, category: 'civil_earthworks', isAvailable: true, productCode: 'SAP-RDS-001' },
      { description: 'Crusher Dust Bedding', unit: 'm³', unitPrice: 258.00, category: 'civil_earthworks', isAvailable: true, productCode: 'SAP-DST-001' },
      { description: 'Drainage Stone 40mm', unit: 'm³', unitPrice: 305.00, category: 'civil_earthworks', isAvailable: true, productCode: 'SAP-DRN-001' },
    ],
    'much-asphalt': [
      { description: 'Hot Mix Asphalt AC-14 wearing course', unit: 'tonne', unitPrice: 1850.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAS-HMA-001' },
      { description: 'Hot Mix Asphalt AC-20 base course', unit: 'tonne', unitPrice: 1650.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAS-HMA-002' },
      { description: 'Cold Mix Asphalt pothole repair', unit: 'tonne', unitPrice: 2250.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAS-CMA-001' },
      { description: 'Asphalt Laying & Rolling per tonne', unit: 'tonne laid', unitPrice: 285.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAS-LAY-001' },
    ],
    'concor-readymix': [
      { description: 'Ready Mix Concrete 20MPa (B20)', unit: 'm³', unitPrice: 1150.00, category: 'civil_earthworks', isAvailable: true, productCode: 'CRM-RMC-001' },
      { description: 'Ready Mix Concrete 25MPa (B25)', unit: 'm³', unitPrice: 1250.00, category: 'civil_earthworks', isAvailable: true, productCode: 'CRM-RMC-002' },
      { description: 'Ready Mix Concrete 30MPa (B30)', unit: 'm³', unitPrice: 1385.00, category: 'civil_earthworks', isAvailable: true, productCode: 'CRM-RMC-003' },
      { description: 'Ready Mix Concrete 35MPa (B35)', unit: 'm³', unitPrice: 1485.00, category: 'civil_earthworks', isAvailable: true, productCode: 'CRM-RMC-004' },
      { description: 'Ready Mix Concrete 40MPa (B40) — Structural', unit: 'm³', unitPrice: 1625.00, category: 'civil_earthworks', isAvailable: true, productCode: 'CRM-RMC-005' },
    ],
    'lafarge-readymix': [
      { description: 'Ready Mix Concrete 25MPa Lafarge', unit: 'm³', unitPrice: 1265.00, category: 'civil_earthworks', isAvailable: true, productCode: 'LRM-RMC-001' },
      { description: 'Ready Mix Concrete 30MPa Lafarge', unit: 'm³', unitPrice: 1395.00, category: 'civil_earthworks', isAvailable: true, productCode: 'LRM-RMC-002' },
      { description: 'Ready Mix Concrete 40MPa Lafarge High Strength', unit: 'm³', unitPrice: 1650.00, category: 'civil_earthworks', isAvailable: true, productCode: 'LRM-RMC-003' },
    ],
    'murray-roberts-readymix': [
      { description: 'Ready Mix Concrete 25MPa M&R', unit: 'm³', unitPrice: 1280.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MRR-RMC-001' },
      { description: 'Ready Mix Concrete 30MPa M&R', unit: 'm³', unitPrice: 1415.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MRR-RMC-002' },
    ],
    'fibertex': [
      { description: 'Geotextile Nonwoven 150g/m² Fibertex', unit: 'm²', unitPrice: 28.50, category: 'civil_earthworks', isAvailable: true, productCode: 'FBX-GTX-001' },
      { description: 'Geotextile Nonwoven 200g/m² Fibertex', unit: 'm²', unitPrice: 36.00, category: 'civil_earthworks', isAvailable: true, productCode: 'FBX-GTX-002' },
      { description: 'Geotextile Woven 200g/m² Stabilisation', unit: 'm²', unitPrice: 42.00, category: 'civil_earthworks', isAvailable: true, productCode: 'FBX-GTW-001' },
    ],
    'kaytech': [
      { description: 'Geotextile Bidim A3 — 150g/m²', unit: 'm²', unitPrice: 30.00, category: 'civil_earthworks', isAvailable: true, productCode: 'KAY-BID-001' },
      { description: 'Geotextile Bidim A8 — 270g/m²', unit: 'm²', unitPrice: 52.00, category: 'civil_earthworks', isAvailable: true, productCode: 'KAY-BID-002' },
      { description: 'Drainage Composite Enkadrain 7510', unit: 'm²', unitPrice: 185.00, category: 'civil_earthworks', isAvailable: true, productCode: 'KAY-ENC-001' },
      { description: 'Geomembrane HDPE 0.5mm', unit: 'm²', unitPrice: 65.00, category: 'civil_earthworks', isAvailable: true, productCode: 'KAY-GMB-001' },
    ],
    'maccaferri': [
      { description: 'Gabion Box 2x1x1m Galvanised', unit: 'each', unitPrice: 850.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAC-GAB-001' },
      { description: 'Gabion Box 2x1x0.5m Galvanised', unit: 'each', unitPrice: 485.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAC-GAB-002' },
      { description: 'Reno Mattress 3x2x0.17m', unit: 'each', unitPrice: 1250.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAC-REN-001' },
      { description: 'Erosion Control Matting MacMat', unit: 'm²', unitPrice: 85.00, category: 'civil_earthworks', isAvailable: true, productCode: 'MAC-ECM-001' },
    ],
    'tosas': [
      { description: 'Bitumen Emulsion SS-60 prime coat', unit: 'litre', unitPrice: 12.50, category: 'civil_earthworks', isAvailable: true, productCode: 'TOS-BIT-001' },
      { description: 'Bitumen Emulsion MS-60 tack coat', unit: 'litre', unitPrice: 14.00, category: 'civil_earthworks', isAvailable: true, productCode: 'TOS-BIT-002' },
      { description: 'Modified Bitumen SBS 60/70', unit: 'tonne', unitPrice: 18500.00, category: 'civil_earthworks', isAvailable: true, productCode: 'TOS-MBS-001' },
    ],
    'total-bitumen': [
      { description: 'Bitumen 60/70 Penetration Grade', unit: 'tonne', unitPrice: 16500.00, category: 'civil_earthworks', isAvailable: true, productCode: 'TOT-BIT-001' },
      { description: 'Bitumen Emulsion Anionic SS-60', unit: '1000L IBC', unitPrice: 14500.00, category: 'civil_earthworks', isAvailable: true, productCode: 'TOT-EMU-001' },
    ],
    'engen-bitumen': [
      { description: 'Bitumen 60/70 Road Grade', unit: 'tonne', unitPrice: 16800.00, category: 'civil_earthworks', isAvailable: true, productCode: 'ENG-BIT-001' },
      { description: 'Cut-back Bitumen MC-800', unit: 'litre', unitPrice: 18.50, category: 'civil_earthworks', isAvailable: true, productCode: 'ENG-CUT-001' },
    ],

    // ── STEEL & METAL (NEW) ────────────────────────────────────────────────
    'bolt-eng': [
      { description: 'High Tensile Bolt M16x75 Grade 8.8', unit: 'each', unitPrice: 18.50, category: 'steel_metal', isAvailable: true, productCode: 'BLT-HTB-001' },
      { description: 'High Tensile Bolt M20x75 Grade 8.8', unit: 'each', unitPrice: 28.00, category: 'steel_metal', isAvailable: true, productCode: 'BLT-HTB-002' },
      { description: 'Anchor Bolt M16x300 Galvanised', unit: 'each', unitPrice: 45.00, category: 'steel_metal', isAvailable: true, productCode: 'BLT-ANK-001' },
      { description: 'Chemical Anchor Kit M16', unit: 'each', unitPrice: 125.00, category: 'steel_metal', isAvailable: true, productCode: 'BLT-CHM-001' },
      { description: 'Threaded Rod M12 x 1m Galvanised', unit: 'each', unitPrice: 55.00, category: 'steel_metal', isAvailable: true, productCode: 'BLT-ROD-001' },
    ],
    'vanderbijl-steel': [
      { description: 'Structural Steel I-Beam 152x152x23', unit: '6m length', unitPrice: 1485.00, category: 'steel_metal', isAvailable: true, productCode: 'VBS-IBM-001' },
      { description: 'Structural Steel I-Beam 203x203x46', unit: '6m length', unitPrice: 2850.00, category: 'steel_metal', isAvailable: true, productCode: 'VBS-IBM-002' },
      { description: 'Steel Column 203x203x60 UC', unit: '6m length', unitPrice: 3650.00, category: 'steel_metal', isAvailable: true, productCode: 'VBS-COL-001' },
      { description: 'Steel Channel 100x50mm PFC', unit: '6m length', unitPrice: 485.00, category: 'steel_metal', isAvailable: true, productCode: 'VBS-CHL-001' },
    ],
    'brc-reinforcing': [
      { description: 'BRC Mesh Ref 188 (5.6mm bars @ 200mm)', unit: '6x2.4m sheet', unitPrice: 485.00, category: 'steel_metal', isAvailable: true, productCode: 'BRC-MSH-001' },
      { description: 'BRC Mesh Ref 193 (7mm bars @ 200mm)', unit: '6x2.4m sheet', unitPrice: 685.00, category: 'steel_metal', isAvailable: true, productCode: 'BRC-MSH-002' },
      { description: 'BRC Mesh Ref 196 (8mm bars @ 200mm)', unit: '6x2.4m sheet', unitPrice: 850.00, category: 'steel_metal', isAvailable: true, productCode: 'BRC-MSH-003' },
      { description: 'BRC Mesh D8-200 Double layer', unit: '6x2.4m sheet', unitPrice: 985.00, category: 'steel_metal', isAvailable: true, productCode: 'BRC-MSH-004' },
    ],
    'betec-concrete': [
      { description: 'Plastic Chair 40mm Cover (box 100)', unit: 'box of 100', unitPrice: 185.00, category: 'steel_metal', isAvailable: true, productCode: 'BTC-CHR-001' },
      { description: 'Concrete Spacer Block 25mm (box 200)', unit: 'box of 200', unitPrice: 145.00, category: 'steel_metal', isAvailable: true, productCode: 'BTC-SPC-001' },
      { description: 'Bar Chair High 75mm', unit: 'each', unitPrice: 4.50, category: 'steel_metal', isAvailable: true, productCode: 'BTC-BCH-001' },
    ],

    // ── PLUMBING & CIVIL WATER (NEW) ────────────────────────────────────────
    'pipe-world': [
      { description: 'HDPE Pipe 110mm PN10 SDR11', unit: '6m length', unitPrice: 485.00, category: 'plumbing', isAvailable: true, productCode: 'PWD-HDP-001' },
      { description: 'HDPE Pipe 160mm PN10 SDR11', unit: '6m length', unitPrice: 985.00, category: 'plumbing', isAvailable: true, productCode: 'PWD-HDP-002' },
      { description: 'HDPE Pipe 200mm PN10 SDR11', unit: '6m length', unitPrice: 1450.00, category: 'plumbing', isAvailable: true, productCode: 'PWD-HDP-003' },
      { description: 'DI Pipe Class K9 150mm', unit: '6m length', unitPrice: 2850.00, category: 'plumbing', isAvailable: true, productCode: 'PWD-DIP-001' },
    ],
    'flo-tek': [
      { description: 'HDPE Elbow 90° 110mm', unit: 'each', unitPrice: 185.00, category: 'plumbing', isAvailable: true, productCode: 'FLT-ELB-001' },
      { description: 'HDPE Tee Equal 110mm', unit: 'each', unitPrice: 265.00, category: 'plumbing', isAvailable: true, productCode: 'FLT-TEE-001' },
      { description: 'HDPE Coupler 110mm Electrofusion', unit: 'each', unitPrice: 145.00, category: 'plumbing', isAvailable: true, productCode: 'FLT-CUP-001' },
      { description: 'HDPE Saddle 110x50mm Branch', unit: 'each', unitPrice: 285.00, category: 'plumbing', isAvailable: true, productCode: 'FLT-SAD-001' },
    ],
    'wavin-sa': [
      { description: 'uPVC Sewer Pipe 110mm SN8', unit: '3m length', unitPrice: 165.00, category: 'plumbing', isAvailable: true, productCode: 'WAV-PVC-001' },
      { description: 'uPVC Sewer Pipe 160mm SN8', unit: '3m length', unitPrice: 295.00, category: 'plumbing', isAvailable: true, productCode: 'WAV-PVC-002' },
      { description: 'uPVC Pressure Pipe 63mm PN10', unit: '6m length', unitPrice: 185.00, category: 'plumbing', isAvailable: true, productCode: 'WAV-PRE-001' },
      { description: 'uPVC Pressure Pipe 90mm PN10', unit: '6m length', unitPrice: 285.00, category: 'plumbing', isAvailable: true, productCode: 'WAV-PRE-002' },
      { description: 'uPVC Inspection Chamber 450mm', unit: 'each', unitPrice: 850.00, category: 'plumbing', isAvailable: true, productCode: 'WAV-ICH-001' },
    ],
    'vaal-sanitaryware': [
      { description: 'Close Coupled Toilet Suite White', unit: 'each', unitPrice: 2850.00, category: 'plumbing', isAvailable: true, productCode: 'VSW-TOI-001' },
      { description: 'Pedestal Washbasin White 550mm', unit: 'each', unitPrice: 1485.00, category: 'plumbing', isAvailable: true, productCode: 'VSW-BAS-001' },
      { description: 'Acrylic Bath 1700mm White', unit: 'each', unitPrice: 3250.00, category: 'plumbing', isAvailable: true, productCode: 'VSW-BTH-001' },
      { description: 'Urinal Suite Wall Hung', unit: 'each', unitPrice: 2150.00, category: 'plumbing', isAvailable: true, productCode: 'VSW-URI-001' },
    ],
    'roca-sa': [
      { description: 'Roca Close Coupled WC Suite The Gap', unit: 'each', unitPrice: 4850.00, category: 'plumbing', isAvailable: true, productCode: 'ROC-WC-001' },
      { description: 'Roca Washbasin 550mm Ceramic', unit: 'each', unitPrice: 2650.00, category: 'plumbing', isAvailable: true, productCode: 'ROC-BAS-001' },
      { description: 'Roca Bath Acrylic 1700mm', unit: 'each', unitPrice: 5850.00, category: 'plumbing', isAvailable: true, productCode: 'ROC-BTH-001' },
    ],
    'abs-pumps': [
      { description: 'Sewage Pump Submersible 1.5kW', unit: 'each', unitPrice: 8500.00, category: 'plumbing', isAvailable: true, productCode: 'ABS-SWP-001' },
      { description: 'Drainage Pump Submersible 0.75kW', unit: 'each', unitPrice: 4850.00, category: 'plumbing', isAvailable: true, productCode: 'ABS-DRP-001' },
      { description: 'Pump Station Packaged 1.5kW Dual', unit: 'each', unitPrice: 28500.00, category: 'plumbing', isAvailable: true, productCode: 'ABS-PST-001' },
    ],

    // ── ELECTRICAL (NEW) ────────────────────────────────────────────────────
    'cabstrut': [
      { description: 'Cable Tray 300mm wide Perforated', unit: '3m length', unitPrice: 485.00, category: 'electrical', isAvailable: true, productCode: 'CBS-CTR-001' },
      { description: 'Cable Tray 450mm wide Perforated', unit: '3m length', unitPrice: 685.00, category: 'electrical', isAvailable: true, productCode: 'CBS-CTR-002' },
      { description: 'Cable Ladder 300mm Galvanised', unit: '3m length', unitPrice: 585.00, category: 'electrical', isAvailable: true, productCode: 'CBS-CLD-001' },
      { description: 'Strut Channel 41x41mm Unistrut', unit: '3m length', unitPrice: 185.00, category: 'electrical', isAvailable: true, productCode: 'CBS-STR-001' },
    ],
    'helukabel': [
      { description: 'LV Cable 6mm² 3-core XLPE (per metre)', unit: 'm', unitPrice: 85.00, category: 'electrical', isAvailable: true, productCode: 'HLK-CAB-001' },
      { description: 'LV Cable 16mm² 3-core XLPE (per metre)', unit: 'm', unitPrice: 185.00, category: 'electrical', isAvailable: true, productCode: 'HLK-CAB-002' },
      { description: 'LV Cable 35mm² 4-core Armoured (per metre)', unit: 'm', unitPrice: 385.00, category: 'electrical', isAvailable: true, productCode: 'HLK-CAB-003' },
      { description: 'Control Cable 4-core 1.5mm² (per metre)', unit: 'm', unitPrice: 18.50, category: 'electrical', isAvailable: true, productCode: 'HLK-CTL-001' },
    ],
    'prysmian': [
      { description: 'Armoured Cable 10mm² 4-core (per metre)', unit: 'm', unitPrice: 125.00, category: 'electrical', isAvailable: true, productCode: 'PRY-ARM-001' },
      { description: 'Armoured Cable 25mm² 4-core (per metre)', unit: 'm', unitPrice: 285.00, category: 'electrical', isAvailable: true, productCode: 'PRY-ARM-002' },
      { description: 'Armoured Cable 70mm² 4-core (per metre)', unit: 'm', unitPrice: 685.00, category: 'electrical', isAvailable: true, productCode: 'PRY-ARM-003' },
    ],
    'belden-sa': [
      { description: 'Fire Alarm Cable 2-core 1.5mm² (per metre)', unit: 'm', unitPrice: 22.00, category: 'electrical', isAvailable: true, productCode: 'BLD-FAC-001' },
      { description: 'Instrumentation Cable 2-pair 1.5mm² (per metre)', unit: 'm', unitPrice: 35.00, category: 'electrical', isAvailable: true, productCode: 'BLD-INS-001' },
      { description: 'Data Cable Cat6 UTP (per metre)', unit: 'm', unitPrice: 14.50, category: 'electrical', isAvailable: true, productCode: 'BLD-CAT-001' },
    ],
    'fuchs-lighting': [
      { description: 'LED Batten 36W 1200mm IP65', unit: 'each', unitPrice: 485.00, category: 'electrical', isAvailable: true, productCode: 'FUC-BAT-001' },
      { description: 'LED Panel 40W 600x600mm', unit: 'each', unitPrice: 685.00, category: 'electrical', isAvailable: true, productCode: 'FUC-PAN-001' },
      { description: 'LED High Bay 150W Industrial', unit: 'each', unitPrice: 2850.00, category: 'electrical', isAvailable: true, productCode: 'FUC-HBY-001' },
    ],
    'radiant-lighting': [
      { description: 'LED Street Light 100W 6500K', unit: 'each', unitPrice: 3850.00, category: 'electrical', isAvailable: true, productCode: 'RAD-STL-001' },
      { description: 'LED Flood Light 200W IP67', unit: 'each', unitPrice: 4850.00, category: 'electrical', isAvailable: true, productCode: 'RAD-FLD-001' },
      { description: 'LED Downlight 10W Recessed', unit: 'each', unitPrice: 285.00, category: 'electrical', isAvailable: true, productCode: 'RAD-DWN-001' },
    ],
    'solar-md': [
      { description: 'Solar Panel Mono 400W 1722x1134mm', unit: 'each', unitPrice: 2850.00, category: 'electrical', isAvailable: true, productCode: 'SLR-PAN-001' },
      { description: 'Hybrid Inverter 5kW Single Phase', unit: 'each', unitPrice: 18500.00, category: 'electrical', isAvailable: true, productCode: 'SLR-INV-001' },
      { description: 'Lithium Battery 100Ah 48V BMS', unit: 'each', unitPrice: 22500.00, category: 'electrical', isAvailable: true, productCode: 'SLR-BAT-001' },
      { description: 'Grid-tie Inverter 10kW Three Phase', unit: 'each', unitPrice: 45000.00, category: 'electrical', isAvailable: true, productCode: 'SLR-GTI-001' },
    ],
    'suntech-sa': [
      { description: 'PV Module 410W Half-cut Mono PERC', unit: 'each', unitPrice: 2950.00, category: 'electrical', isAvailable: true, productCode: 'SUN-PVM-001' },
      { description: 'PV Module 540W Half-cut Mono', unit: 'each', unitPrice: 3750.00, category: 'electrical', isAvailable: true, productCode: 'SUN-PVM-002' },
    ],

    // ── ROOFING (NEW) ──────────────────────────────────────────────────────
    'safintra-roofing': [
      { description: 'IBR Roof Sheeting 0.47mm AZ150', unit: 'linear metre', unitPrice: 92.00, category: 'roofing', isAvailable: true, productCode: 'SAF-IBR-001' },
      { description: 'IBR Roof Sheeting 0.53mm AZ150', unit: 'linear metre', unitPrice: 108.00, category: 'roofing', isAvailable: true, productCode: 'SAF-IBR-002' },
      { description: 'Corrugated Sheeting 0.47mm', unit: 'linear metre', unitPrice: 82.00, category: 'roofing', isAvailable: true, productCode: 'SAF-COR-001' },
      { description: 'Flashings Valley Gutter 150mm', unit: 'linear metre', unitPrice: 65.00, category: 'roofing', isAvailable: true, productCode: 'SAF-FLS-001' },
      { description: 'Ridge Capping IBR', unit: 'linear metre', unitPrice: 55.00, category: 'roofing', isAvailable: true, productCode: 'SAF-RDG-001' },
    ],
    'clotan-steel': [
      { description: 'IBR Sheeting 0.50mm Galvanised', unit: 'linear metre', unitPrice: 98.00, category: 'roofing', isAvailable: true, productCode: 'CLT-IBR-001' },
      { description: 'Chromadek IBR 0.50mm White', unit: 'linear metre', unitPrice: 125.00, category: 'roofing', isAvailable: true, productCode: 'CLT-CHR-001' },
      { description: 'Chromadek Flashing 150mm', unit: 'linear metre', unitPrice: 72.00, category: 'roofing', isAvailable: true, productCode: 'CLT-FLS-001' },
    ],
    'truecor-roofing': [
      { description: 'Concrete Roof Tile Flat', unit: 'each', unitPrice: 22.50, category: 'roofing', isAvailable: true, productCode: 'TRC-TIL-001' },
      { description: 'Concrete Roof Tile Roman Profile', unit: 'each', unitPrice: 25.00, category: 'roofing', isAvailable: true, productCode: 'TRC-TIL-002' },
      { description: 'Roof Tile Ridge Piece', unit: 'each', unitPrice: 85.00, category: 'roofing', isAvailable: true, productCode: 'TRC-RDG-001' },
    ],
    'trussworks': [
      { description: 'Timber Roof Trusses Supply & Erect', unit: 'm² plan area', unitPrice: 285.00, category: 'roofing', isAvailable: true, productCode: 'TRW-TRS-001' },
      { description: 'Timber Roof Trusses Supply only', unit: 'm² plan area', unitPrice: 215.00, category: 'roofing', isAvailable: true, productCode: 'TRW-TRS-002' },
      { description: 'Purlins 38x76mm SA Pine CCA', unit: 'linear metre', unitPrice: 28.00, category: 'roofing', isAvailable: true, productCode: 'TRW-PUR-001' },
    ],
    'waterproofing-co': [
      { description: 'Torch-on Membrane 3mm SBS 10m²/roll', unit: 'm²', unitPrice: 185.00, category: 'roofing', isAvailable: true, productCode: 'WPC-TOM-001' },
      { description: 'Liquid Waterproofing Membrane 20L', unit: '20L', unitPrice: 1485.00, category: 'roofing', isAvailable: true, productCode: 'WPC-LWM-001' },
      { description: 'Crystalline Waterproofing 25kg', unit: '25kg bag', unitPrice: 850.00, category: 'roofing', isAvailable: true, productCode: 'WPC-CRY-001' },
    ],

    // ── TIMBER & JOINERY (NEW) ─────────────────────────────────────────────
    'pg-bison': [
      { description: 'MDF Board 16mm 2750x1830mm', unit: 'sheet', unitPrice: 485.00, category: 'timber', isAvailable: true, productCode: 'PGB-MDF-001' },
      { description: 'Chipboard 16mm Melamine White 2750x1830mm', unit: 'sheet', unitPrice: 385.00, category: 'timber', isAvailable: true, productCode: 'PGB-CHI-001' },
      { description: 'Formwork Plywood 18mm F/F 2440x1220mm', unit: 'sheet', unitPrice: 595.00, category: 'timber', isAvailable: true, productCode: 'PGB-FPW-001' },
      { description: 'Hardboard 3.2mm Tempered', unit: 'sheet', unitPrice: 185.00, category: 'timber', isAvailable: true, productCode: 'PGB-HBD-001' },
    ],
    'saligna-timber': [
      { description: 'Saligna Hardwood 76x76mm 3m Pole', unit: 'each', unitPrice: 185.00, category: 'timber', isAvailable: true, productCode: 'SAL-HWD-001' },
      { description: 'SA Pine Structural Timber 38x114mm 4.2m', unit: 'each', unitPrice: 78.00, category: 'timber', isAvailable: true, productCode: 'SAL-STR-001' },
      { description: 'SA Pine CCA Treated 38x152mm 4.5m', unit: 'each', unitPrice: 115.00, category: 'timber', isAvailable: true, productCode: 'SAL-CCA-001' },
    ],
    'lacewood-flooring': [
      { description: 'Engineered Wood Floor Board 14mm 2200mm', unit: 'm²', unitPrice: 485.00, category: 'timber', isAvailable: true, productCode: 'LAC-EWF-001' },
      { description: 'Solid Oak Parquet 19mm 300mm strips', unit: 'm²', unitPrice: 950.00, category: 'timber', isAvailable: true, productCode: 'LAC-OAK-001' },
      { description: 'Laminate Flooring 8mm AC4 1215mm', unit: 'm²', unitPrice: 185.00, category: 'timber', isAvailable: true, productCode: 'LAC-LAM-001' },
    ],

    // ── GLASS & GLAZING ────────────────────────────────────────────────────
    'pg-glass': [
      { description: 'Float Glass Clear 6mm per m²', unit: 'm²', unitPrice: 285.00, category: 'glass_glazing', isAvailable: true, productCode: 'PGG-FLT-001' },
      { description: 'Toughened Glass Clear 10mm per m²', unit: 'm²', unitPrice: 685.00, category: 'glass_glazing', isAvailable: true, productCode: 'PGG-TGH-001' },
      { description: 'Laminated Glass 6.38mm (3+0.38+3) per m²', unit: 'm²', unitPrice: 785.00, category: 'glass_glazing', isAvailable: true, productCode: 'PGG-LAM-001' },
      { description: 'IGU Double Glazed Unit 4-12-4 per m²', unit: 'm²', unitPrice: 1250.00, category: 'glass_glazing', isAvailable: true, productCode: 'PGG-IGU-001' },
    ],
    'guardian-glass': [
      { description: 'Planibel Clear Float 6mm per m²', unit: 'm²', unitPrice: 295.00, category: 'glass_glazing', isAvailable: true, productCode: 'GRD-FLT-001' },
      { description: 'Guardian ClimaGuard Low-E 6mm per m²', unit: 'm²', unitPrice: 850.00, category: 'glass_glazing', isAvailable: true, productCode: 'GRD-LOE-001' },
    ],
    'aluplast': [
      { description: 'Aluminium Window Top Hung 900x1200mm', unit: 'each', unitPrice: 2850.00, category: 'glass_glazing', isAvailable: true, productCode: 'ALP-WIN-001' },
      { description: 'Aluminium Window Sliding 1200x1200mm', unit: 'each', unitPrice: 3650.00, category: 'glass_glazing', isAvailable: true, productCode: 'ALP-WIN-002' },
      { description: 'Aluminium Sliding Door 2400x2100mm', unit: 'each', unitPrice: 8500.00, category: 'glass_glazing', isAvailable: true, productCode: 'ALP-DOR-001' },
      { description: 'Aluminium Fixed Window 600x600mm', unit: 'each', unitPrice: 1250.00, category: 'glass_glazing', isAvailable: true, productCode: 'ALP-WIN-003' },
    ],
    'fenster': [
      { description: 'Aluminium Casement Window 900x1200mm', unit: 'each', unitPrice: 2650.00, category: 'glass_glazing', isAvailable: true, productCode: 'FEN-WIN-001' },
      { description: 'Aluminium Bi-fold Door 4-panel 3600x2100mm', unit: 'each', unitPrice: 22500.00, category: 'glass_glazing', isAvailable: true, productCode: 'FEN-DOR-001' },
      { description: 'Aluminium Louvre Window 600x900mm', unit: 'each', unitPrice: 1850.00, category: 'glass_glazing', isAvailable: true, productCode: 'FEN-LOU-001' },
    ],
    'stalwart-doors': [
      { description: 'Internal Flush Door 813x2032mm Hollow Core', unit: 'each', unitPrice: 850.00, category: 'glass_glazing', isAvailable: true, productCode: 'STW-DOR-001' },
      { description: 'Internal Flush Door 813x2032mm Solid Core', unit: 'each', unitPrice: 1485.00, category: 'glass_glazing', isAvailable: true, productCode: 'STW-DOR-002' },
      { description: 'Fire Door FD30 813x2032mm', unit: 'each', unitPrice: 4850.00, category: 'glass_glazing', isAvailable: true, productCode: 'STW-FDR-001' },
      { description: 'External Solid Door 813x2032mm Hardwood', unit: 'each', unitPrice: 3250.00, category: 'glass_glazing', isAvailable: true, productCode: 'STW-EXT-001' },
    ],

    // ── MASONRY ────────────────────────────────────────────────────────────
    'corobrick': [
      { description: 'Clay Stock Brick 222x106x73mm', unit: '1000 bricks', unitPrice: 4250.00, category: 'masonry', isAvailable: true, productCode: 'CRB-CLY-001' },
      { description: 'Clay Maxi Brick 290x140x90mm', unit: '1000 bricks', unitPrice: 6850.00, category: 'masonry', isAvailable: true, productCode: 'CRB-MAX-001' },
      { description: 'Concrete Block Hollow 140mm', unit: '100 blocks', unitPrice: 490.00, category: 'masonry', isAvailable: true, productCode: 'CRB-BLK-001' },
      { description: 'Concrete Block Hollow 190mm', unit: '100 blocks', unitPrice: 625.00, category: 'masonry', isAvailable: true, productCode: 'CRB-BLK-002' },
    ],
    'ocon-brick': [
      { description: 'Face Brick Smooth Red 222x106x73mm', unit: '1000 bricks', unitPrice: 5250.00, category: 'masonry', isAvailable: true, productCode: 'OCN-FBR-001' },
      { description: 'Face Brick Rough Texture Charcoal', unit: '1000 bricks', unitPrice: 5850.00, category: 'masonry', isAvailable: true, productCode: 'OCN-FBR-002' },
      { description: 'Paving Brick 60mm Grey', unit: 'm²', unitPrice: 165.00, category: 'masonry', isAvailable: true, productCode: 'OCN-PAV-001' },
    ],
    'midrand-brick': [
      { description: 'Concrete Stock Brick 222x106x73mm', unit: '1000 bricks', unitPrice: 3850.00, category: 'masonry', isAvailable: true, productCode: 'MDB-CSB-001' },
      { description: 'Concrete Block Solid 140mm', unit: '100 blocks', unitPrice: 545.00, category: 'masonry', isAvailable: true, productCode: 'MDB-BLK-001' },
      { description: 'Concrete Block Solid 190mm', unit: '100 blocks', unitPrice: 685.00, category: 'masonry', isAvailable: true, productCode: 'MDB-BLK-002' },
    ],
    'hebel-blocks': [
      { description: 'Hebel AAC Block 100mm thick per m²', unit: 'm²', unitPrice: 485.00, category: 'masonry', isAvailable: true, productCode: 'HBL-AAC-001' },
      { description: 'Hebel AAC Block 150mm thick per m²', unit: 'm²', unitPrice: 685.00, category: 'masonry', isAvailable: true, productCode: 'HBL-AAC-002' },
      { description: 'Hebel AAC Adhesive Mortar 25kg', unit: '25kg bag', unitPrice: 185.00, category: 'masonry', isAvailable: true, productCode: 'HBL-ADH-001' },
    ],

    // ── SCAFFOLDING & FORMWORK ───��─────────────────────────────────────────
    'safway': [
      { description: 'Scaffolding Hire Frame System per m²/month', unit: 'm²/month', unitPrice: 185.00, category: 'scaffolding', isAvailable: true, productCode: 'SFW-SCF-001' },
      { description: 'Scaffolding Erect & Strike Labour', unit: 'm²', unitPrice: 95.00, category: 'scaffolding', isAvailable: true, productCode: 'SFW-LAB-001' },
      { description: 'Scaffolding Tube & Clip System /m²/week', unit: 'm²/week', unitPrice: 65.00, category: 'scaffolding', isAvailable: true, productCode: 'SFW-TUB-001' },
    ],
    'formscaff': [
      { description: 'Slab Formwork Hire Table System /m²/week', unit: 'm²/week', unitPrice: 145.00, category: 'scaffolding', isAvailable: true, productCode: 'FSC-SLB-001' },
      { description: 'Wall Formwork Hire Panel /m²/cycle', unit: 'm²/cycle', unitPrice: 285.00, category: 'scaffolding', isAvailable: true, productCode: 'FSC-WLL-001' },
      { description: 'Acrow Prop Hire 2.5-4.0m each/week', unit: 'each/week', unitPrice: 45.00, category: 'scaffolding', isAvailable: true, productCode: 'FSC-ACR-001' },
    ],
    'doka-sa': [
      { description: 'Doka Framax Wall Formwork Hire /m²/month', unit: 'm²/month', unitPrice: 385.00, category: 'scaffolding', isAvailable: true, productCode: 'DOK-WFM-001' },
      { description: 'Doka Top-50 Slab Formwork /m²/month', unit: 'm²/month', unitPrice: 285.00, category: 'scaffolding', isAvailable: true, productCode: 'DOK-SFM-001' },
    ],

    // ── EXTERNAL WORKS & LANDSCAPING ────────────────────────────────────────
    'tegola': [
      { description: 'Concrete Paving Brick 60mm Charcoal', unit: 'm²', unitPrice: 165.00, category: 'landscaping', isAvailable: true, productCode: 'TEG-PAV-001' },
      { description: 'Concrete Paving Brick 80mm Natural', unit: 'm²', unitPrice: 185.00, category: 'landscaping', isAvailable: true, productCode: 'TEG-PAV-002' },
      { description: 'Concrete Kerbing Channel 300x150mm', unit: 'linear metre', unitPrice: 125.00, category: 'landscaping', isAvailable: true, productCode: 'TEG-KRB-001' },
      { description: 'Concrete Drainage Channel 300mm', unit: 'linear metre', unitPrice: 185.00, category: 'landscaping', isAvailable: true, productCode: 'TEG-DCH-001' },
    ],
    'terraforce': [
      { description: 'Terraforce Retaining Block T-10 (per block)', unit: 'each', unitPrice: 45.00, category: 'landscaping', isAvailable: true, productCode: 'TRF-BLK-001' },
      { description: 'Terraforce Retaining Wall /m² face', unit: 'm²', unitPrice: 385.00, category: 'landscaping', isAvailable: true, productCode: 'TRF-WLL-001' },
      { description: 'Geocell Ground Reinforcement per m²', unit: 'm²', unitPrice: 85.00, category: 'landscaping', isAvailable: true, productCode: 'TRF-GEO-001' },
    ],
    'envirowild': [
      { description: 'Kikuyu Turf Supply & Lay per m²', unit: 'm²', unitPrice: 85.00, category: 'landscaping', isAvailable: true, productCode: 'EWD-TRF-001' },
      { description: 'Indigenous Tree 100L bag planted', unit: 'each', unitPrice: 1850.00, category: 'landscaping', isAvailable: true, productCode: 'EWD-TRE-001' },
      { description: 'Drip Irrigation System per m²', unit: 'm²', unitPrice: 125.00, category: 'landscaping', isAvailable: true, productCode: 'EWD-IRR-001' },
      { description: 'Garden Bark Mulch 70L bag', unit: 'bag', unitPrice: 85.00, category: 'landscaping', isAvailable: true, productCode: 'EWD-MUL-001' },
    ],

    // ── HVAC ────────────────────────────────────────────────────────────────
    'trane-sa': [
      { description: 'Split Unit 9000BTU R410A Supply & Install', unit: 'each', unitPrice: 12500.00, category: 'hvac', isAvailable: true, productCode: 'TRN-SPL-001' },
      { description: 'Split Unit 18000BTU R410A Supply & Install', unit: 'each', unitPrice: 22500.00, category: 'hvac', isAvailable: true, productCode: 'TRN-SPL-002' },
      { description: 'Chiller Air-Cooled 100kW', unit: 'each', unitPrice: 285000.00, category: 'hvac', isAvailable: true, productCode: 'TRN-CHI-001' },
    ],
    'daikin-sa': [
      { description: 'Daikin Inverter Split 9000BTU', unit: 'each', unitPrice: 11500.00, category: 'hvac', isAvailable: true, productCode: 'DAI-SPL-001' },
      { description: 'Daikin VRV 4 Outdoor 8HP', unit: 'each', unitPrice: 85000.00, category: 'hvac', isAvailable: true, productCode: 'DAI-VRV-001' },
      { description: 'Daikin VRV Indoor Cassette 2.5kW', unit: 'each', unitPrice: 22500.00, category: 'hvac', isAvailable: true, productCode: 'DAI-CAS-001' },
    ],
    'energy-hvac': [
      { description: 'Galvanised Ductwork 300x150mm per metre', unit: 'linear metre', unitPrice: 285.00, category: 'hvac', isAvailable: true, productCode: 'EHV-DUC-001' },
      { description: 'Linear Slot Diffuser 1200mm 4-slot', unit: 'each', unitPrice: 950.00, category: 'hvac', isAvailable: true, productCode: 'EHV-DIF-001' },
      { description: 'Exhaust Fan Axial 315mm 230V', unit: 'each', unitPrice: 1850.00, category: 'hvac', isAvailable: true, productCode: 'EHV-EXH-001' },
    ],

    // ── FIRE PROTECTION ─────────────────────────────────────────────────────
    'wormald': [
      { description: 'Sprinkler Head Standard Response 68°C', unit: 'each', unitPrice: 285.00, category: 'fire_protection', isAvailable: true, productCode: 'WRM-SPR-001' },
      { description: 'Fire Alarm Panel Conventional 8-zone', unit: 'each', unitPrice: 8500.00, category: 'fire_protection', isAvailable: true, productCode: 'WRM-FAP-001' },
      { description: 'Smoke Detector Addressable', unit: 'each', unitPrice: 850.00, category: 'fire_protection', isAvailable: true, productCode: 'WRM-SMK-001' },
      { description: 'Heat Detector Fixed Temperature 57°C', unit: 'each', unitPrice: 650.00, category: 'fire_protection', isAvailable: true, productCode: 'WRM-HET-001' },
      { description: 'Hydrant Box Surface Mounted', unit: 'each', unitPrice: 2850.00, category: 'fire_protection', isAvailable: true, productCode: 'WRM-HYD-001' },
    ],
    'fire-solutions-sa': [
      { description: 'Dry Powder Extinguisher 9kg ABC', unit: 'each', unitPrice: 750.00, category: 'fire_protection', isAvailable: true, productCode: 'FSA-EXT-001' },
      { description: 'CO2 Extinguisher 5kg', unit: 'each', unitPrice: 1250.00, category: 'fire_protection', isAvailable: true, productCode: 'FSA-EXT-002' },
      { description: 'Fire Hose Reel 36m Swinging Arm', unit: 'each', unitPrice: 4850.00, category: 'fire_protection', isAvailable: true, productCode: 'FSA-HHR-001' },
      { description: 'Emergency Exit Light LED 3hr', unit: 'each', unitPrice: 850.00, category: 'fire_protection', isAvailable: true, productCode: 'FSA-EXL-001' },
    ],
  };

  // Return base products only - provincial pricing handled by DB view!
  return baseProducts[supplierId] || [];
}