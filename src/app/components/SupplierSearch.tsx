import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Search, Package, MapPin, Banknote, Info } from 'lucide-react';
import { getAllSupplierItems } from '@/utils/supplierCatalog';
import { getProvincialPrice, PROVINCES } from '@/utils/provincialPricing';

interface SearchResult {
  itemName: string;
  supplier: string;
  category: string;
  description: string;
  unit: string;
  basePrice: number;
  provincialPrices: { [key: string]: number };
  lastUpdated: string;
}

export function SupplierSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const allItems = getAllSupplierItems();
    const query = searchQuery.toLowerCase();

    // Filter items based on search query (bidirectional matching for better results)
    const matches = allItems.filter(item => {
      const nameMatch = item.itemName.toLowerCase().includes(query) || query.includes(item.itemName.toLowerCase());
      const categoryMatch = item.category.toLowerCase().includes(query) || query.includes(item.category.toLowerCase());
      const keywordMatch = item.keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        return keywordLower.includes(query) || query.includes(keywordLower);
      });
      const descriptionMatch = item.description.toLowerCase().includes(query) || query.includes(item.description.toLowerCase());

      return nameMatch || categoryMatch || keywordMatch || descriptionMatch;
    });

    // Transform to search results with provincial pricing
    const results: SearchResult[] = matches.map(item => {
      const provincialPrices: { [key: string]: number } = {};
      
      PROVINCES.forEach(province => {
        provincialPrices[province.code] = getProvincialPrice(item.unitPrice, province.code);
      });

      return {
        itemName: item.itemName,
        supplier: item.supplier,
        category: item.category,
        description: item.description,
        unit: item.unit,
        basePrice: item.unitPrice,
        provincialPrices,
        lastUpdated: item.lastUpdated
      };
    });

    setSearchResults(results);
    setIsSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/5 to-blue-50/50">
          <CardTitle className="text-2xl text-[#00b4d8] flex items-center gap-2">
            <Search className="h-6 w-6" />
            Supplier Item Search
          </CardTitle>
          <CardDescription className="text-base">
            Search across 55 suppliers and 9 provinces to find the best prices for construction materials
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by item name, category, or keyword (e.g., cement, steel, excavation)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 h-12 text-base"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              className="bg-[#00b4d8] hover:bg-[#0096b8] h-12 px-8"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Stats */}
          {searchResults.length > 0 && (
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#00b4d8]" />
                <span className="font-semibold">{searchResults.length}</span> items found
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[#00b4d8]" />
                <span className="font-semibold">9</span> provinces
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search Results</CardTitle>
            <CardDescription>
              Click on an item to view detailed provincial pricing
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-bold">Item Name</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold">Supplier</TableHead>
                    <TableHead className="font-bold">Unit</TableHead>
                    <TableHead className="font-bold text-right">Base Price</TableHead>
                    <TableHead className="font-bold text-right">Price Range</TableHead>
                    <TableHead className="font-bold text-center">Best Province</TableHead>
                    <TableHead className="font-bold text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((result, index) => {
                    const lowestPrice = getLowestPrice(result.provincialPrices);
                    const highestPrice = getHighestPrice(result.provincialPrices);
                    const bestProvince = getBestProvince(result.provincialPrices);

                    return (
                      <TableRow 
                        key={index}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 cursor-pointer`}
                        onClick={() => setSelectedItem(result)}
                      >
                        <TableCell className="font-semibold text-gray-900">
                          {result.itemName}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {result.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#00b4d8] text-white">
                            {result.supplier}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">
                          {result.unit}
                        </TableCell>
                        <TableCell className="text-right font-mono font-semibold">
                          R{formatNumber(result.basePrice)}
                        </TableCell>
                        <TableCell className="text-right font-mono text-sm">
                          <div className="text-green-600 font-semibold">R{formatNumber(lowestPrice)}</div>
                          <div className="text-gray-500">R{formatNumber(highestPrice)}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-green-500 text-white font-bold">
                            {bestProvince}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedItem(result);
                            }}
                          >
                            <Info className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
              <p className="text-gray-600">
                Try searching with different keywords or browse by category
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Item Details Modal */}
      {selectedItem && (
        <Card className="border-2 border-[#00b4d8]">
          <CardHeader className="bg-gradient-to-r from-[#00b4d8]/10 to-blue-50/50">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl text-[#00b4d8]">{selectedItem.itemName}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {selectedItem.description}
                </CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedItem(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="flex gap-3 mt-4">
              <Badge className="bg-[#00b4d8] text-white">
                {selectedItem.supplier}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {selectedItem.category}
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Unit: {selectedItem.unit}
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
                const price = selectedItem.provincialPrices[province.code];
                const isLowest = price === getLowestPrice(selectedItem.provincialPrices);
                const isHighest = price === getHighestPrice(selectedItem.provincialPrices);

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
                      <Banknote className="h-4 w-4 text-gray-500" />
                      <span className="text-xl font-bold text-gray-900">
                        R{formatNumber(price)}
                      </span>
                      <span className="text-sm text-gray-500">/{selectedItem.unit}</span>
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
                    R{formatNumber(selectedItem.basePrice)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Lowest Price</div>
                  <div className="text-lg font-bold text-green-600">
                    R{formatNumber(getLowestPrice(selectedItem.provincialPrices))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 mb-1">Highest Price</div>
                  <div className="text-lg font-bold text-red-600">
                    R{formatNumber(getHighestPrice(selectedItem.provincialPrices))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 text-xs text-gray-500">
              Last Updated: {new Date(selectedItem.lastUpdated).toLocaleDateString('en-ZA', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Initial State */}
      {!searchQuery && searchResults.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center max-w-2xl mx-auto">
              <Search className="h-16 w-16 text-[#00b4d8] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search for Construction Materials
              </h3>
              <p className="text-gray-600 mb-6">
                Find the best prices across all suppliers and provinces. Enter a search term above to get started.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('cement');
                    handleSearch();
                  }}
                  className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                >
                  Cement
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('steel');
                    handleSearch();
                  }}
                  className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                >
                  Steel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('excavation');
                    handleSearch();
                  }}
                  className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                >
                  Excavation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('concrete');
                    handleSearch();
                  }}
                  className="border-[#00b4d8] text-[#00b4d8] hover:bg-[#00b4d8] hover:text-white"
                >
                  Concrete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}