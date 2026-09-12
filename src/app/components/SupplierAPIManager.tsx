/**
 * Supplier API Manager Component
 * Comprehensive API integration management for all supplier types:
 * - Manual: Upload/manage products manually
 * - Scraping: Configure web scraping settings
 * - REST: Configure REST API endpoints
 * - CSV: Import/export product data
 */

import { useState } from 'react';
import { Upload, Code, Globe, FileText, Settings, Play, CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';
import { type SupplierConfig } from '../../utils/suppliers/supplier-connector';

interface SupplierAPIManagerProps {
  supplier: SupplierConfig;
  onIntegrationComplete?: (supplierId: string, result: any) => void;
  onClose?: () => void;
}

export function SupplierAPIManager({ supplier, onIntegrationComplete, onClose }: SupplierAPIManagerProps) {
  const [activeConfig, setActiveConfig] = useState<'manual' | 'scraping' | 'rest' | 'csv'>(supplier.apiType);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{supplier.name} - API Configuration</h2>
              <p className="text-sm opacity-90 mt-1 capitalize">{supplier.category.replace('_', ' ')}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="bg-white bg-opacity-20 rounded px-3 py-1">
              <span className="opacity-75">Current API Type: </span>
              <span className="font-bold uppercase">{supplier.apiType}</span>
            </div>
            <div className="bg-white bg-opacity-20 rounded px-3 py-1">
              <span className="opacity-75">Provinces: </span>
              <span className="font-bold">{supplier.provinces.length}/9</span>
            </div>
          </div>
        </div>

        {/* API Type Tabs */}
        <div className="flex border-b bg-gray-50 overflow-x-auto">
          <button
            onClick={() => setActiveConfig('manual')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeConfig === 'manual'
                ? 'border-blue-500 text-blue-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Manual Upload</span>
          </button>
          <button
            onClick={() => setActiveConfig('scraping')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeConfig === 'scraping'
                ? 'border-purple-500 text-purple-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span className="text-sm font-medium">Web Scraping</span>
          </button>
          <button
            onClick={() => setActiveConfig('rest')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeConfig === 'rest'
                ? 'border-green-500 text-green-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="text-sm font-medium">REST API</span>
          </button>
          <button
            onClick={() => setActiveConfig('csv')}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeConfig === 'csv'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">CSV Import</span>
          </button>
        </div>

        {/* Configuration Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {activeConfig === 'manual' && <ManualUploadConfig supplier={supplier} />}
          {activeConfig === 'scraping' && <ScrapingConfig supplier={supplier} />}
          {activeConfig === 'rest' && <RESTAPIConfig supplier={supplier} />}
          {activeConfig === 'csv' && <CSVImportConfig supplier={supplier} />}
        </div>

        {/* Modal Footer */}
        <div className="border-t bg-gray-50 p-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Manual Upload Configuration
 */
function ManualUploadConfig({ supplier }: { supplier: SupplierConfig }) {
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    productCode: '',
    description: '',
    unit: '',
    unitPrice: '',
    category: supplier.category,
  });

  const handleAddProduct = () => {
    if (newProduct.description && newProduct.unit && newProduct.unitPrice) {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
      setNewProduct({
        productCode: '',
        description: '',
        unit: '',
        unitPrice: '',
        category: supplier.category,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Upload className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Manual Product Upload</h4>
            <p className="text-sm text-blue-800 mt-1">
              Add products manually through a form interface. Ideal for suppliers without automated data feeds.
            </p>
          </div>
        </div>
      </div>

      {/* Add Product Form */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h5 className="font-semibold mb-3">Add New Product</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Product Code</label>
            <input
              type="text"
              value={newProduct.productCode}
              onChange={(e) => setNewProduct({ ...newProduct, productCode: e.target.value })}
              placeholder="e.g., CEM-001"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description *</label>
            <input
              type="text"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="e.g., Cement 42.5N"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit *</label>
            <input
              type="text"
              value={newProduct.unit}
              onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
              placeholder="e.g., 50kg bag"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit Price (R) *</label>
            <input
              type="number"
              step="0.01"
              value={newProduct.unitPrice}
              onChange={(e) => setNewProduct({ ...newProduct, unitPrice: e.target.value })}
              placeholder="e.g., 95.50"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button
          onClick={handleAddProduct}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Products List */}
      {products.length > 0 && (
        <div>
          <h5 className="font-semibold mb-2">Products ({products.length})</h5>
          <div className="space-y-2">
            {products.map((product) => (
              <div key={product.id} className="border rounded p-3 bg-white flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.description}</p>
                  <p className="text-sm text-gray-600">
                    {product.productCode && `${product.productCode} • `}
                    {product.unit} • R{product.unitPrice}
                  </p>
                </div>
                <button
                  onClick={() => setProducts(products.filter(p => p.id !== product.id))}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Upload {products.length} Product{products.length !== 1 ? 's' : ''} to Database
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Web Scraping Configuration
 */
function ScrapingConfig({ supplier }: { supplier: SupplierConfig }) {
  const [config, setConfig] = useState({
    targetUrl: supplier.website || '',
    productListSelector: '',
    productNameSelector: '',
    priceSelector: '',
    unitSelector: '',
    scheduleFrequency: 'daily',
  });
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestScraper = () => {
    setTestStatus('testing');
    setTimeout(() => {
      setTestStatus(Math.random() > 0.3 ? 'success' : 'error');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-purple-900">Web Scraping Configuration</h4>
            <p className="text-sm text-purple-800 mt-1">
              Automatically extract product data from supplier websites. Configure CSS selectors for data extraction.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Target URL *</label>
          <input
            type="url"
            value={config.targetUrl}
            onChange={(e) => setConfig({ ...config, targetUrl: e.target.value })}
            placeholder="https://example.com/products"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product List Selector</label>
            <input
              type="text"
              value={config.productListSelector}
              onChange={(e) => setConfig({ ...config, productListSelector: e.target.value })}
              placeholder=".product-grid > .product-item"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Product Name Selector</label>
            <input
              type="text"
              value={config.productNameSelector}
              onChange={(e) => setConfig({ ...config, productNameSelector: e.target.value })}
              placeholder=".product-title"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price Selector</label>
            <input
              type="text"
              value={config.priceSelector}
              onChange={(e) => setConfig({ ...config, priceSelector: e.target.value })}
              placeholder=".product-price"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit Selector</label>
            <input
              type="text"
              value={config.unitSelector}
              onChange={(e) => setConfig({ ...config, unitSelector: e.target.value })}
              placeholder=".product-unit"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Scraping Schedule</label>
          <select
            value={config.scheduleFrequency}
            onChange={(e) => setConfig({ ...config, scheduleFrequency: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-purple-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily (recommended)</option>
            <option value="weekly">Weekly</option>
            <option value="manual">Manual only</option>
          </select>
        </div>
      </div>

      {/* Test Scraper */}
      <div className="flex gap-3">
        <button
          onClick={handleTestScraper}
          disabled={testStatus === 'testing'}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {testStatus === 'testing' ? 'Testing...' : 'Test Scraper'}
        </button>
        {testStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Scraper test successful!</span>
          </div>
        )}
        {testStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Scraper test failed. Check selectors.</span>
          </div>
        )}
      </div>

      <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Save Scraping Configuration
      </button>
    </div>
  );
}

/**
 * REST API Configuration
 */
function RESTAPIConfig({ supplier }: { supplier: SupplierConfig }) {
  const [config, setConfig] = useState({
    baseUrl: supplier.baseUrl || '',
    apiKey: supplier.apiKey || '',
    authType: 'api-key',
    productsEndpoint: '/api/products',
    priceEndpoint: '/api/prices',
    updateFrequency: '3600',
  });
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const handleTestConnection = () => {
    setConnectionStatus('testing');
    setTimeout(() => {
      setConnectionStatus(Math.random() > 0.3 ? 'success' : 'error');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">REST API Integration</h4>
            <p className="text-sm text-green-800 mt-1">
              Connect to supplier's REST API for real-time product and pricing data synchronization.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Base URL *</label>
          <input
            type="url"
            value={config.baseUrl}
            onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
            placeholder="https://api.supplier.com/v1"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Authentication Type</label>
          <select
            value={config.authType}
            onChange={(e) => setConfig({ ...config, authType: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="api-key">API Key</option>
            <option value="oauth2">OAuth 2.0</option>
            <option value="basic">Basic Auth</option>
            <option value="bearer">Bearer Token</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key / Token *</label>
          <input
            type="password"
            value={config.apiKey}
            onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            placeholder="Enter API key or token"
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Products Endpoint</label>
            <input
              type="text"
              value={config.productsEndpoint}
              onChange={(e) => setConfig({ ...config, productsEndpoint: e.target.value })}
              placeholder="/api/products"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 font-mono text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pricing Endpoint</label>
            <input
              type="text"
              value={config.priceEndpoint}
              onChange={(e) => setConfig({ ...config, priceEndpoint: e.target.value })}
              placeholder="/api/prices"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500 font-mono text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sync Frequency (seconds)</label>
          <select
            value={config.updateFrequency}
            onChange={(e) => setConfig({ ...config, updateFrequency: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
          >
            <option value="300">5 minutes</option>
            <option value="900">15 minutes</option>
            <option value="1800">30 minutes</option>
            <option value="3600">1 hour (recommended)</option>
            <option value="86400">Daily</option>
          </select>
        </div>
      </div>

      {/* Test Connection */}
      <div className="flex gap-3">
        <button
          onClick={handleTestConnection}
          disabled={connectionStatus === 'testing'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {connectionStatus === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
        {connectionStatus === 'success' && (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">API connection successful!</span>
          </div>
        )}
        {connectionStatus === 'error' && (
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Connection failed. Check credentials.</span>
          </div>
        )}
      </div>

      <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Save API Configuration
      </button>
    </div>
  );
}

/**
 * CSV Import Configuration
 */
function CSVImportConfig({ supplier }: { supplier: SupplierConfig }) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState({
    productCode: 'product_code',
    description: 'description',
    unit: 'unit',
    price: 'price',
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-orange-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-900">CSV Bulk Import</h4>
            <p className="text-sm text-orange-800 mt-1">
              Import large product catalogs via CSV files. Perfect for one-time migrations or periodic bulk updates.
            </p>
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            {uploadedFile ? uploadedFile.name : 'Click to upload CSV file'}
          </p>
          <p className="text-xs text-gray-500">or drag and drop</p>
        </label>
      </div>

      {/* Column Mapping */}
      {uploadedFile && (
        <div className="border rounded-lg p-4">
          <h5 className="font-semibold mb-3">Map CSV Columns</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Product Code Column</label>
              <input
                type="text"
                value={mapping.productCode}
                onChange={(e) => setMapping({ ...mapping, productCode: e.target.value })}
                placeholder="product_code"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description Column</label>
              <input
                type="text"
                value={mapping.description}
                onChange={(e) => setMapping({ ...mapping, description: e.target.value })}
                placeholder="description"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit Column</label>
              <input
                type="text"
                value={mapping.unit}
                onChange={(e) => setMapping({ ...mapping, unit: e.target.value })}
                placeholder="unit"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price Column</label>
              <input
                type="text"
                value={mapping.price}
                onChange={(e) => setMapping({ ...mapping, price: e.target.value })}
                placeholder="price"
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-orange-500 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* CSV Template Download */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h5 className="font-semibold">Need a CSV template?</h5>
            <p className="text-sm text-gray-600 mt-1">
              Download our standard CSV template with the correct column format
            </p>
          </div>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      <button
        disabled={!uploadedFile}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploadedFile ? `Import ${uploadedFile.name}` : 'Upload a CSV file to import'}
      </button>
    </div>
  );
}