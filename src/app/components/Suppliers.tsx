import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Droplets, Construction, Zap, Building2, HardHat, Wrench, Package, Hammer, Factory, Truck, ShieldCheck, TreePine, Home, Lightbulb, Cable, Power, Wind, PaintBucket, Drill, DoorOpen, Building, Blocks, Component, Search, X, Filter, TrendingDown, TrendingUp, FlaskConical, Microscope, TestTube, MapPin, Coins, Info, Database } from 'lucide-react';
import { getAllSuppliers, getSupplierCatalog, getAllSupplierItems } from '@/utils/supplierCatalog';
import { getProvincialPrice, PROVINCES } from '@/utils/provincialPricing';
import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { fetchSuppliersWithProducts, fetchAllDatabaseProducts, type DatabaseProduct, type SupplierWithProducts } from '@/utils/databaseProducts';

interface SearchResult {
  itemName: string;
  supplier: string;
  category: string;
  description: string;
  unit: string;
  basePrice: number;
  provincialPrices: { [key: string]: number };
  lastUpdated: string;
  available: boolean;
  keywords: string[];
}

export function Suppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [catalogSearchTerm, setCatalogSearchTerm] = useState('');
  const [catalogSortBy, setCatalogSortBy] = useState<'name' | 'price-low' | 'price-high'>('name');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  
  // Database state
  const [databaseSuppliers, setDatabaseSuppliers] = useState<SupplierWithProducts[]>([]);
  const [databaseProducts, setDatabaseProducts] = useState<DatabaseProduct[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);
  const [useDatabase, setUseDatabase] = useState(true);
  
  // Contact form state
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    province: '',
    productCategories: '',
    message: ''
  });

  // Load database products on mount
  useEffect(() => {
    const loadDatabaseData = async () => {
      setIsLoadingDb(true);
      const [suppliers, products] = await Promise.all([
        fetchSuppliersWithProducts(),
        fetchAllDatabaseProducts()
      ]);
      
      setDatabaseSuppliers(suppliers);
      setDatabaseProducts(products);
      setIsLoadingDb(false);
      
      if (suppliers.length > 0 && products.length > 0) {
        console.log(`✅ Suppliers Catalog: Loaded ${suppliers.length} suppliers and ${products.length} products from database`);
        setUseDatabase(true);
      } else {
        console.log('ℹ️ Using local catalog (database empty or not configured)');
        setUseDatabase(false);
      }
    };

    loadDatabaseData();
  }, []);
  
  const suppliers = useDatabase && databaseSuppliers.length > 0
    ? databaseSuppliers.map(s => s.name)
    : getAllSuppliers();

  // Helper to get supplier catalog from database or fallback
  const getSupplierCatalogData = (supplierName: string) => {
    if (useDatabase && databaseSuppliers.length > 0) {
      const supplier = databaseSuppliers.find(s => s.name === supplierName);
      if (supplier && supplier.products.length > 0) {
        return supplier.products.map(p => ({
          itemName: p.description,
          unit: p.unit,
          unitPrice: p.unit_price,
          available: p.is_available,
          keywords: [], // Keywords not in database schema
          category: p.category || 'General'
        }));
      }
    }
    // Fallback to catalog
    return getSupplierCatalog(supplierName);
  };

  const supplierInfo = {
    // Original 4
    'BUCO': { icon: Building2, description: 'Comprehensive building materials and hardware', category: 'MATERIAL SUPPLIER' },
    'MACSTEEL': { icon: Wrench, description: 'Steel and reinforcement products', category: 'MATERIAL SUPPLIER' },
    'LAFARGE': { icon: Construction, description: 'Cement, concrete, and aggregates', category: 'MATERIAL SUPPLIER' },
    'RAUMIX': { icon: HardHat, description: 'Ready-mix concrete and building materials', category: 'MATERIAL SUPPLIER' },
    
    // Water provision suppliers
    'KSB': { icon: Droplets, description: 'Water pumps and equipment', category: 'MATERIAL SUPPLIER' },
    'ZENZELE': { icon: Droplets, description: 'Water pipes and storage solutions', category: 'MATERIAL SUPPLIER' },
    'AVK': { icon: Droplets, description: 'Water valves and fittings', category: 'MATERIAL SUPPLIER' },
    'SIZABANTU': { icon: Droplets, description: 'Water infrastructure solutions', category: 'MATERIAL SUPPLIER' },
    'STEWARDS&LLODS': { icon: Construction, description: 'Precast concrete and water infrastructure', category: 'MATERIAL SUPPLIER' },
    'SEKUNALO': { icon: Droplets, description: 'Water infrastructure and drainage systems', category: 'MATERIAL SUPPLIER' },
    'STRUANDALE': { icon: Droplets, description: 'Water treatment and supply solutions', category: 'MATERIAL SUPPLIER' },
    'LLOCS': { icon: Droplets, description: 'Water management systems', category: 'MATERIAL SUPPLIER' },
    'MARLEY': { icon: Droplets, description: 'Drainage and plumbing products', category: 'MATERIAL SUPPLIER' },
    
    // TALS - Water related products
    'POLYFRAME': { icon: Droplets, description: 'Polymer water systems and frames', category: 'MATERIAL SUPPLIER' },
    
    // Roads provision suppliers
    'EAST COAST': { icon: Truck, description: 'Asphalt and road surfacing', category: 'MATERIAL SUPPLIER' },
    'EAST COAST FENCING': { icon: ShieldCheck, description: 'Fencing and security solutions', category: 'MATERIAL SUPPLIER' },
    'MUCH PLANT': { icon: Truck, description: 'Plant hire and equipment', category: 'MATERIAL SUPPLIER' },
    'POLOKWANE SURFACING': { icon: Construction, description: 'Road surface treatments', category: 'MATERIAL SUPPLIER' },
    'BOSUN': { icon: ShieldCheck, description: 'Road furniture and safety equipment', category: 'MATERIAL SUPPLIER' },
    'SHERRERD ROAD SIGNS': { icon: ShieldCheck, description: 'Road signage and markings', category: 'MATERIAL SUPPLIER' },
    
    // Electrical & Mechanical provision suppliers
    'ACTOM': { icon: Zap, description: 'Electrical equipment and transformers', category: 'MATERIAL SUPPLIER' },
    'ABADERE': { icon: Lightbulb, description: 'Street lighting and electrical equipment', category: 'MATERIAL SUPPLIER' },
    'ARB': { icon: Cable, description: 'Electrical cables and wiring', category: 'MATERIAL SUPPLIER' },
    'VOLTEX': { icon: Zap, description: 'Electrical distribution equipment', category: 'MATERIAL SUPPLIER' },
    'VYL-TEX': { icon: Power, description: 'Electrical cables and power equipment', category: 'MATERIAL SUPPLIER' },
    'VYLTEX': { icon: Power, description: 'PVC and electrical products', category: 'MATERIAL SUPPLIER' },
    'POWER EQUIPMENT': { icon: Power, description: 'Power generation and solar', category: 'MATERIAL SUPPLIER' },
    'AERMART': { icon: Wind, description: 'Pneumatic equipment and tools', category: 'MATERIAL SUPPLIER' },
    'AERMATT': { icon: Wind, description: 'Compaction and pneumatic equipment', category: 'MATERIAL SUPPLIER' },
    'AGUENIE': { icon: Lightbulb, description: 'Industrial supplies and equipment', category: 'MATERIAL SUPPLIER' },
    'A3M': { icon: Zap, description: 'Road marking and mechanical components', category: 'MATERIAL SUPPLIER' },
    
    // Building provision suppliers
    'BUILDERS': { icon: Hammer, description: 'Building materials and construction supplies', category: 'MATERIAL SUPPLIER' },
    'BUILDERS DEPOT': { icon: Hammer, description: 'Building materials and supplies', category: 'MATERIAL SUPPLIER' },
    'LEROY MERLIN': { icon: PaintBucket, description: 'Tiles, paints, and finishes', category: 'MATERIAL SUPPLIER' },
    'TIMBER CITY': { icon: TreePine, description: 'Timber and wood products', category: 'MATERIAL SUPPLIER' },
    'RSC': { icon: Building, description: 'Roofing and building materials', category: 'MATERIAL SUPPLIER' },
    'BILT': { icon: Blocks, description: 'Construction blocks and materials', category: 'MATERIAL SUPPLIER' },
    
    // Plant Hire & Equipment
    'ATLAS PLANT': { icon: Factory, description: 'Construction equipment and plant hire', category: 'HIRE AND RENTAL' },
    
    // Civils provision suppliers
    'INFRASET': { icon: Blocks, description: 'Civils products and paving', category: 'MATERIAL SUPPLIER' },
    'TECHNI CRETE': { icon: Building, description: 'Precast concrete structures', category: 'MATERIAL SUPPLIER' },
    'TALISMAN': { icon: DoorOpen, description: 'Doors, windows and building products', category: 'MATERIAL SUPPLIER' },
    'JVR STEEL': { icon: Wrench, description: 'Steel reinforcement products', category: 'MATERIAL SUPPLIER' },
    'NJR STEEL': { icon: Wrench, description: 'Steel and reinforcement supplies', category: 'MATERIAL SUPPLIER' },
    
    // Structural provision suppliers
    'GLOBAL ROOFING': { icon: Home, description: 'Structural steel and roofing solutions', category: 'MATERIAL SUPPLIER' },
    'RSC GLOBAL': { icon: Home, description: 'Roofing and structural systems', category: 'MATERIAL SUPPLIER' },
    'CORRSHINE': { icon: Component, description: 'Corrugated roofing materials', category: 'MATERIAL SUPPLIER' },
    
    // Hire and Rental suppliers
    'CONTAINER WORLD': { icon: Package, description: 'Site containers and storage solutions', category: 'HIRE AND RENTAL' },
    'TALISMAN HIRE': { icon: Drill, description: 'Power tools and equipment hire', category: 'HIRE AND RENTAL' },
    'HIREALL': { icon: Factory, description: 'Construction equipment rental', category: 'HIRE AND RENTAL' },
    'MUCH ASPHALT PLANT HIRE': { icon: Truck, description: 'Asphalt plant and equipment hire', category: 'HIRE AND RENTAL' },
    'PAN': { icon: Blocks, description: 'Formwork systems rental', category: 'HIRE AND RENTAL' },
    'BRIDGEDECK': { icon: Construction, description: 'Bridge formwork hire', category: 'HIRE AND RENTAL' },
    'MAKU': { icon: Hammer, description: 'Formwork and scaffolding rental', category: 'HIRE AND RENTAL' },
    
    // Specialized Services suppliers
    'ROOFCAP': { icon: FlaskConical, description: 'Specialized testing and quality control services', category: 'SPECIALISED SERVICES' },
    'CIVIL LAB': { icon: Microscope, description: 'Civil engineering laboratory testing', category: 'SPECIALISED SERVICES' },
    'CONCRETE LAB': { icon: TestTube, description: 'Concrete testing and analysis services', category: 'SPECIALISED SERVICES' },
  };

  const categories = ['ALL', 'MATERIAL SUPPLIER', 'HIRE AND RENTAL', 'SPECIALISED SERVICES'];

  // Filter suppliers by category
  const filteredSuppliers = suppliers.filter((supplier) => {
    if (selectedCategory === 'ALL') return true;
    const info = supplierInfo[supplier as keyof typeof supplierInfo];
    return info?.category === selectedCategory;
  });

  // Get supplier count for each category
  const getCategoryCount = (category: string) => {
    if (category === 'ALL') return suppliers.length;
    return suppliers.filter((supplier) => {
      const info = supplierInfo[supplier as keyof typeof supplierInfo];
      return info?.category === category;
    }).length;
  };

  // Sort and filter suppliers based on search term and sort criteria
  const sortedFilteredSuppliers = useMemo(() => {
    let sortedSuppliers = filteredSuppliers.slice();

    if (sortBy === 'price-low') {
      sortedSuppliers.sort((a, b) => {
        const catalogA = getSupplierCatalogData(a);
        const catalogB = getSupplierCatalogData(b);
        const minPriceA = catalogA.length > 0 ? Math.min(...catalogA.map(item => item.unitPrice)) : Infinity;
        const minPriceB = catalogB.length > 0 ? Math.min(...catalogB.map(item => item.unitPrice)) : Infinity;
        return minPriceA - minPriceB;
      });
    } else if (sortBy === 'price-high') {
      sortedSuppliers.sort((a, b) => {
        const catalogA = getSupplierCatalogData(a);
        const catalogB = getSupplierCatalogData(b);
        const maxPriceA = catalogA.length > 0 ? Math.max(...catalogA.map(item => item.unitPrice)) : -Infinity;
        const maxPriceB = catalogB.length > 0 ? Math.max(...catalogB.map(item => item.unitPrice)) : -Infinity;
        return maxPriceB - maxPriceA;
      });
    } else {
      sortedSuppliers.sort((a, b) => a.localeCompare(b));
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      sortedSuppliers = sortedSuppliers.filter(supplier => supplier.toLowerCase().includes(lowerCaseSearchTerm));
    }

    return sortedSuppliers;
  }, [filteredSuppliers, sortBy, searchTerm]);

  // Filter and sort catalog items when a supplier is selected
  const filteredCatalogItems = useMemo(() => {
    if (!selectedSupplier) return [];
    
    let items = getSupplierCatalogData(selectedSupplier);
    
    // Filter by availability
    if (availabilityFilter === 'in-stock') {
      items = items.filter(item => item.available);
    } else if (availabilityFilter === 'out-of-stock') {
      items = items.filter(item => !item.available);
    }
    
    // Filter by search term
    if (catalogSearchTerm) {
      const lowerSearchTerm = catalogSearchTerm.toLowerCase();
      items = items.filter(item => 
        item.itemName.toLowerCase().includes(lowerSearchTerm) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    // Sort items
    if (catalogSortBy === 'price-low') {
      items.sort((a, b) => a.unitPrice - b.unitPrice);
    } else if (catalogSortBy === 'price-high') {
      items.sort((a, b) => b.unitPrice - a.unitPrice);
    } else {
      items.sort((a, b) => a.itemName.localeCompare(b.itemName));
    }
    
    return items;
  }, [selectedSupplier, catalogSearchTerm, catalogSortBy, availabilityFilter]);

  // Search across all suppliers - for item search with provincial pricing
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedSearchItem, setSelectedSearchItem] = useState<SearchResult | null>(null);

  // Helper function to normalize supplier names for lookup
  const getSupplierInfo = (supplierName: string) => {
    // Try exact match first
    let info = supplierInfo[supplierName as keyof typeof supplierInfo];
    if (info) return info;
    
    // Try uppercase match
    const upperName = supplierName.toUpperCase();
    info = supplierInfo[upperName as keyof typeof supplierInfo];
    if (info) return info;
    
    // Try case-insensitive match
    const matchingKey = Object.keys(supplierInfo).find(
      key => key.toLowerCase() === supplierName.toLowerCase()
    );
    if (matchingKey) {
      return supplierInfo[matchingKey as keyof typeof supplierInfo];
    }
    
    return null;
  };

  const handleItemSearch = () => {
    if (!itemSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Use database products if available, otherwise use catalog
    const allItems = useDatabase && databaseProducts.length > 0
      ? databaseProducts.map(p => ({
          itemName: p.description,
          supplier: p.supplier_name,
          unit: p.unit,
          unitPrice: p.unit_price,
          available: p.is_available,
          keywords: [], // Keywords not in database schema
          category: p.category || 'General'
        }))
      : getAllSupplierItems();

    const query = itemSearchQuery.toLowerCase();

    // Filter items based on search query
    const matches = allItems.filter(item => {
      const nameMatch = item.itemName.toLowerCase().includes(query);
      const keywordMatch = item.keywords.some(keyword => keyword.toLowerCase().includes(query));
      return nameMatch || keywordMatch;
    });

    // Transform to search results with provincial pricing
    const results: SearchResult[] = matches.map(item => {
      const provincialPrices: { [key: string]: number } = {};
      
      PROVINCES.forEach(province => {
        provincialPrices[province.code] = getProvincialPrice(item.unitPrice, province.code);
      });

      const supplierInfo = getSupplierInfo(item.supplier);
      return {
        itemName: item.itemName,
        supplier: item.supplier,
        category: supplierInfo?.category || 'Unknown',
        description: supplierInfo?.description || '',
        unit: item.unit,
        basePrice: item.unitPrice,
        provincialPrices,
        lastUpdated: 'January 28, 2026',
        available: item.available,
        keywords: item.keywords,
      };
    });

    setSearchResults(results);
  };

  const formatNumber = (value: number) => {
    return value.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getLowestPrice = (provincialPrices: { [key: string]: number }) => {
    const prices = Object.values(provincialPrices);
    return Math.min(...prices);
  };

  const getHighestPrice = (provincialPrices: { [key: string]: number }) => {
    const prices = Object.values(provincialPrices);
    return Math.max(...prices);
  };

  const getBestProvince = (provincialPrices: { [key: string]: number }) => {
    let bestProvince = '';
    let lowestPrice = Infinity;

    Object.entries(provincialPrices).forEach(([code, price]) => {
      if (price < lowestPrice) {
        lowestPrice = price;
        bestProvince = code;
      }
    });

    return bestProvince;
  };

  const handleContactFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const inquiryData = {
        company_name: contactFormData.companyName,
        contact_person: contactFormData.contactPerson,
        email: contactFormData.email,
        phone: contactFormData.phone,
        province: contactFormData.province,
        product_categories: contactFormData.productCategories,
        message: contactFormData.message,
        status: 'new',
        id: Date.now().toString(),
        submitted_at: new Date().toISOString()
      };

      // Store inquiry in localStorage
      const localInquiries = JSON.parse(localStorage.getItem('supplier_inquiries') || '[]');
      localInquiries.push(inquiryData);
      localStorage.setItem('supplier_inquiries', JSON.stringify(localInquiries));
      
      // Log for management review
      console.log('New Supplier Inquiry Received:', {
        timestamp: new Date().toISOString(),
        ...inquiryData
      });

      toast.success('Thank you! We will contact you within 24 hours.');

      setShowContactForm(false);
      setContactFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        province: '',
        productCategories: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-br from-[#00b4d8]/10 to-white rounded-lg border">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold">Live Supplier Pricing Catalog</h1>
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
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse our real-time pricing from trusted suppliers across South Africa. 
          Our intelligent pricing engine automatically finds the best rates for your projects.
        </p>
      </div>

      {/* Tabs for Browse vs Search */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="browse">Browse Suppliers</TabsTrigger>
          <TabsTrigger value="search">Search Items</TabsTrigger>
        </TabsList>

        {/* Browse Suppliers Tab */}
        <TabsContent value="browse" className="space-y-8 mt-8">
          {!selectedSupplier ? (
            <>
              {/* Category Filters */}
              <Card className="border-2">
                <CardContent className="py-6">
                  <h2 className="text-lg font-semibold mb-4 text-center">Filter by Category</h2>
                  <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((category) => {
                      const count = getCategoryCount(category);
                      const isActive = selectedCategory === category;
                      return (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                            isActive
                              ? 'bg-[#00b4d8] text-white shadow-lg transform scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                          }`}
                        >
                          {category}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                            isActive ? 'bg-white/20' : 'bg-gray-300'
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Suppliers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedFilteredSuppliers.map((supplier) => {
                  const info = supplierInfo[supplier as keyof typeof supplierInfo];
                  if (!info) return null; // Skip suppliers without info
                  const Icon = info.icon;
                  const catalog = getSupplierCatalogData(supplier);
                  
                  return (
                    <Card 
                      key={supplier} 
                      className="border-2 transition-all cursor-pointer hover:border-[#00b4d8] hover:shadow-lg"
                      onClick={() => setSelectedSupplier(supplier)}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-3 bg-[#00b4d8] rounded-lg">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{supplier}</CardTitle>
                            <p className="text-sm text-gray-600 mt-1">{catalog.length} items</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Package className="h-3 w-3" />
                          <span>Live pricing updated daily</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          ) : (
            /* Selected Supplier Catalog - Full Page View */
            <Card className="border-2 border-[#00b4d8]">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    onClick={() => {
                      setSelectedSupplier(null);
                      setCatalogSearchTerm('');
                      setCatalogSortBy('name');
                      setAvailabilityFilter('all');
                    }}
                    variant="outline"
                    className="flex items-center gap-2 border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Supplier Category
                  </Button>
                  <Badge className="bg-[#00b4d8] text-white px-4 py-2 text-sm">
                    {selectedCategory !== 'ALL' ? selectedCategory : 'ALL SUPPLIERS'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{selectedSupplier} Catalog</CardTitle>
                    <p className="text-gray-600">Current pricing as of January 25, 2026</p>
                  </div>
                </div>

                {/* Catalog Filters */}
                <div className="mt-4 space-y-3">
                  {/* Search */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search items by name or keyword..."
                        value={catalogSearchTerm}
                        onChange={(e) => setCatalogSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {catalogSearchTerm && (
                      <button
                        onClick={() => setCatalogSearchTerm('')}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>

                  {/* Sort and Filter Controls */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">Sort:</span>
                    <Badge
                      onClick={() => setCatalogSortBy('name')}
                      className={`cursor-pointer hover:bg-[#00b4d8] hover:text-white ${
                        catalogSortBy === 'name' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Name
                    </Badge>
                    <Badge
                      onClick={() => setCatalogSortBy('price-low')}
                      className={`cursor-pointer hover:bg-[#00b4d8] hover:text-white ${
                        catalogSortBy === 'price-low' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <TrendingDown className="h-3 w-3 mr-1" />
                      Low Price
                    </Badge>
                    <Badge
                      onClick={() => setCatalogSortBy('price-high')}
                      className={`cursor-pointer hover:bg-[#00b4d8] hover:text-white ${
                        catalogSortBy === 'price-high' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      High Price
                    </Badge>

                    <span className="text-sm text-gray-600 font-medium ml-4">Availability:</span>
                    <Badge
                      onClick={() => setAvailabilityFilter('all')}
                      className={`cursor-pointer hover:bg-[#00b4d8] hover:text-white ${
                        availabilityFilter === 'all' ? 'bg-[#00b4d8] text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      All ({getSupplierCatalogData(selectedSupplier).length})
                    </Badge>
                    <Badge
                      onClick={() => setAvailabilityFilter('in-stock')}
                      className={`cursor-pointer hover:bg-green-600 hover:text-white ${
                        availabilityFilter === 'in-stock' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      In Stock ({getSupplierCatalogData(selectedSupplier).filter(i => i.available).length})
                    </Badge>
                    <Badge
                      onClick={() => setAvailabilityFilter('out-of-stock')}
                      className={`cursor-pointer hover:bg-red-600 hover:text-white ${
                        availabilityFilter === 'out-of-stock' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Out of Stock ({getSupplierCatalogData(selectedSupplier).filter(i => !i.available).length})
                    </Badge>
                  </div>

                  {/* Results Count */}
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold">{filteredCatalogItems.length}</span> of{' '}
                    <span className="font-semibold">{getSupplierCatalogData(selectedSupplier).length}</span> items
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCatalogItems.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No items found</h3>
                    <p className="text-gray-500 mb-4">
                      {catalogSearchTerm 
                        ? `No items match "${catalogSearchTerm}"`
                        : availabilityFilter === 'in-stock'
                        ? 'No items currently in stock'
                        : 'No items currently out of stock'
                      }
                    </p>
                    <button
                      onClick={() => {
                        setCatalogSearchTerm('');
                        setAvailabilityFilter('all');
                        setCatalogSortBy('name');
                      }}
                      className="px-4 py-2 bg-[#00b4d8] text-white rounded-lg hover:bg-[#0096c7] transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#00b4d8]/20">
                        <tr>
                          <th className="text-left p-3 font-semibold">Item Name</th>
                          <th className="text-left p-3 font-semibold">Unit</th>
                          <th className="text-right p-3 font-semibold">Base Price</th>
                          <th className="text-right p-3 font-semibold">Price Range</th>
                          <th className="text-center p-3 font-semibold">Best Province</th>
                          <th className="text-center p-3 font-semibold">Available</th>
                          <th className="text-center p-3 font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCatalogItems.map((item, idx) => {
                          // Calculate provincial prices for this item
                          const provincialPrices: { [key: string]: number } = {};
                          PROVINCES.forEach(province => {
                            provincialPrices[province.code] = getProvincialPrice(item.unitPrice, province.code);
                          });
                          
                          const lowestPrice = getLowestPrice(provincialPrices);
                          const highestPrice = getHighestPrice(provincialPrices);
                          const bestProvince = getBestProvince(provincialPrices);
                          
                          // Create search result object for modal
                          const itemAsSearchResult: SearchResult = {
                            itemName: item.itemName,
                            supplier: selectedSupplier!,
                            category: supplierInfo[selectedSupplier as keyof typeof supplierInfo]?.category || 'Unknown',
                            description: supplierInfo[selectedSupplier as keyof typeof supplierInfo]?.description || '',
                            unit: item.unit,
                            basePrice: item.unitPrice,
                            provincialPrices,
                            lastUpdated: 'January 28, 2026',
                            available: item.available,
                            keywords: item.keywords,
                          };
                          
                          return (
                            <tr 
                              key={idx} 
                              className={`border-b hover:bg-blue-50 cursor-pointer ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                              onClick={() => setSelectedSearchItem(itemAsSearchResult)}
                            >
                              <td className="p-3">
                                <div>
                                  <div className="font-medium">{item.itemName}</div>
                                  <div className="text-sm text-gray-500">
                                    {item.keywords.slice(0, 4).join(', ')}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-gray-700 font-medium">{item.unit}</td>
                              <td className="p-3 text-right font-mono font-semibold">
                                R{formatNumber(item.unitPrice)}
                              </td>
                              <td className="p-3 text-right font-mono text-sm">
                                <div className="text-green-600 font-semibold">R{formatNumber(lowestPrice)}</div>
                                <div className="text-gray-500">R{formatNumber(highestPrice)}</div>
                              </td>
                              <td className="p-3 text-center">
                                <Badge className="bg-green-500 text-white font-bold">
                                  {bestProvince}
                                </Badge>
                              </td>
                              <td className="p-3 text-center">
                                {item.available ? (
                                  <span className="text-green-600 text-sm font-medium">✓ In Stock</span>
                                ) : (
                                  <span className="text-red-600 text-sm font-medium">Out of Stock</span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSearchItem(itemAsSearchResult);
                                  }}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Search Items Tab */}
        <TabsContent value="search" className="space-y-8 mt-8">
          {searchResults.length === 0 ? (
            /* Search Interface */
            <Card className="border-2">
              <CardContent className="py-6">
                <div className="flex items-center gap-3">
                  <Input
                    type="text"
                    placeholder="Search items by name or keyword..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleItemSearch();
                      }
                    }}
                    className="w-full"
                  />
                  <Button
                    onClick={handleItemSearch}
                    className="bg-[#00b4d8] hover:bg-[#0096c7] text-white"
                  >
                    <Search className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Search Results - Full Page View */
            <Card className="border-2 border-[#00b4d8]">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Button
                    onClick={() => {
                      setSearchResults([]);
                      setItemSearchQuery('');
                    }}
                    variant="outline"
                    className="flex items-center gap-2 border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                    Back to Search
                  </Button>
                  <Badge className="bg-[#00b4d8] text-white px-4 py-2 text-sm">
                    Search: "{itemSearchQuery}"
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Search Results</CardTitle>
                    <p className="text-gray-600">Current pricing as of January 25, 2026</p>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                  Showing <span className="font-semibold">{searchResults.length}</span> items
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {searchResults.map((item, idx) => {
                    const lowestPrice = getLowestPrice(item.provincialPrices);
                    const highestPrice = getHighestPrice(item.provincialPrices);
                    const bestProvince = getBestProvince(item.provincialPrices);
                    
                    return (
                      <div 
                        key={idx} 
                        className="border-2 rounded-lg p-4 hover:border-[#00b4d8] hover:shadow-md cursor-pointer transition-all bg-white"
                        onClick={() => setSelectedSearchItem(item)}
                      >
                        {/* Item Header */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.itemName}</h3>
                            <p className="text-sm text-gray-500">{item.keywords.slice(0, 4).join(', ')}</p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSearchItem(item);
                            }}
                            className="shrink-0"
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Badges Row */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-[#00b4d8] text-white">
                            {item.supplier}
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {item.category}
                          </Badge>
                          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                            {item.unit}
                          </Badge>
                          <Badge className={item.available ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                            {item.available ? "✓ In Stock" : "Out of Stock"}
                          </Badge>
                        </div>

                        {/* Pricing Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Base Price</div>
                            <div className="font-mono font-semibold text-gray-900">
                              R{formatNumber(item.basePrice)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Lowest Price</div>
                            <div className="font-mono font-semibold text-green-600">
                              R{formatNumber(lowestPrice)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Highest Price</div>
                            <div className="font-mono font-semibold text-red-600">
                              R{formatNumber(highestPrice)}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Best Province</div>
                            <Badge className="bg-green-500 text-white font-bold">
                              {bestProvince}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Item Details Modal - Provincial Pricing */}
      {selectedSearchItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <Card className="border-0">
              <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50/50 sticky top-0 z-10 bg-white border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-[#00b4d8]">{selectedSearchItem.itemName}</CardTitle>
                    <p className="text-base mt-2 text-gray-600">
                      {selectedSearchItem.description}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedSearchItem(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </Button>
                </div>
                <div className="flex gap-3 mt-4">
                  <Badge className="bg-[#00b4d8] text-white">
                    {selectedSearchItem.supplier}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {selectedSearchItem.category}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Unit: {selectedSearchItem.unit}
                  </Badge>
                  <Badge className={selectedSearchItem.available ? "bg-green-600 text-white" : "bg-red-600 text-white"}>
                    {selectedSearchItem.available ? "✓ In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[#00b4d8]" />
                  Provincial Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PROVINCES.map(province => {
                    const price = selectedSearchItem.provincialPrices[province.code];
                    const isLowest = price === getLowestPrice(selectedSearchItem.provincialPrices);
                    const isHighest = price === getHighestPrice(selectedSearchItem.provincialPrices);

                    return (
                      <div
                        key={province.code}
                        className={`p-4 rounded-lg border-2 ${
                          isLowest 
                            ? 'border-green-500 bg-green-50' 
                            : isHighest 
                            ? 'border-red-300 bg-red-50'
                            : 'border-gray-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-900">{province.code}</span>
                          {isLowest && (
                            <Badge className="bg-green-500 text-white text-xs">Best Price</Badge>
                          )}
                          {isHighest && (
                            <Badge className="bg-red-500 text-white text-xs">Highest</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mb-2">{province.name}</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xl font-bold text-gray-900">
                            R{formatNumber(price)}
                          </span>
                          <span className="text-sm text-gray-500">/{selectedSearchItem.unit}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Factor: {province.factor}x
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Summary */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold text-gray-900 mb-3">Price Summary</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Base Price (GP, WC, KZN)</div>
                      <div className="text-lg font-bold text-gray-900">
                        R{formatNumber(selectedSearchItem.basePrice)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Lowest Price</div>
                      <div className="text-lg font-bold text-green-600">
                        R{formatNumber(getLowestPrice(selectedSearchItem.provincialPrices))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Highest Price</div>
                      <div className="text-lg font-bold text-red-600">
                        R{formatNumber(getHighestPrice(selectedSearchItem.provincialPrices))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 text-xs text-gray-500">
                  Last Updated: {selectedSearchItem.lastUpdated}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-br from-[#00b4d8]/10 to-white border-2">
        <CardContent className="py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-3">Want to Become a Supplier Partner?</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join our network of trusted suppliers and reach more construction businesses across South Africa.
            </p>
            <button 
              onClick={() => setShowContactForm(true)}
              className="px-6 py-3 bg-[#00b4d8] text-white font-semibold rounded-lg hover:bg-[#0096c7] transition-colors"
            >
              Contact Us
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Supplier Contact Form Dialog */}
      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#00b4d8]">Become a Supplier Partner</DialogTitle>
            <DialogDescription>
              Fill in your details below and our team will contact you within 24 hours to discuss partnership opportunities.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactFormSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company (Pty) Ltd"
                  value={contactFormData.companyName}
                  onChange={(e) => setContactFormData({ ...contactFormData, companyName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Doe"
                  value={contactFormData.contactPerson}
                  onChange={(e) => setContactFormData({ ...contactFormData, contactPerson: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@yourcompany.co.za"
                  value={contactFormData.email}
                  onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={contactFormData.phone}
                  onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Primary Operating Province *</Label>
              <select
                id="province"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                value={contactFormData.province}
                onChange={(e) => setContactFormData({ ...contactFormData, province: e.target.value })}
                required
              >
                <option value="">Select Province</option>
                {PROVINCES.map((province) => (
                  <option key={province.code} value={province.code}>
                    {province.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategories">Product Categories *</Label>
              <Input
                id="productCategories"
                placeholder="e.g., Cement, Steel, Electrical, etc."
                value={contactFormData.productCategories}
                onChange={(e) => setContactFormData({ ...contactFormData, productCategories: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your company, product range, delivery capabilities, etc."
                rows={4}
                value={contactFormData.message}
                onChange={(e) => setContactFormData({ ...contactFormData, message: e.target.value })}
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowContactForm(false)}
                disabled={isSubmittingContact}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00b4d8] hover:bg-[#0096c7]"
                disabled={isSubmittingContact}
              >
                {isSubmittingContact ? 'Submitting...' : 'Submit Inquiry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}