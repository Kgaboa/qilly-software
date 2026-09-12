import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Search, Package, Filter, Building2 } from 'lucide-react';
import { getAllSupplierItems, getAllSuppliers, type SupplierPrice } from '@/utils/supplierCatalog';

export function ActiveSuppliers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<string>('All');
  const allItems = getAllSupplierItems();
  const allSuppliers = getAllSuppliers();
  
  // Filter items based on search term and selected supplier
  const filteredItems = allItems.filter(item => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = (
      item.itemName.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.supplier.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
    
    const matchesSupplier = selectedSupplier === 'All' || item.supplier === selectedSupplier;
    
    return matchesSearch && matchesSupplier;
  });

  // Group items by supplier
  const itemsBySupplier = filteredItems.reduce((acc, item) => {
    if (!acc[item.supplier]) {
      acc[item.supplier] = [];
    }
    acc[item.supplier].push(item);
    return acc;
  }, {} as Record<string, SupplierPrice[]>);

  const suppliers = Object.keys(itemsBySupplier).sort();

  const formatPrice = (price: number) => {
    return price.toFixed(2);
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Cement': 'bg-gray-100 text-gray-800',
      'Concrete': 'bg-gray-100 text-gray-800',
      'Bricks & Blocks': 'bg-orange-100 text-orange-800',
      'Sand & Aggregates': 'bg-amber-100 text-amber-800',
      'Timber': 'bg-yellow-100 text-yellow-800',
      'Steel & Reinforcement': 'bg-blue-100 text-blue-800',
      'Steel Products': 'bg-blue-100 text-blue-800',
      'Plumbing': 'bg-cyan-100 text-cyan-800',
      'Project Management': 'bg-purple-100 text-purple-800',
      'Site Maintenance': 'bg-green-100 text-green-800',
      'Road Maintenance': 'bg-indigo-100 text-indigo-800',
      'Financial': 'bg-emerald-100 text-emerald-800',
      'Coordination': 'bg-teal-100 text-teal-800',
      'Health & Safety': 'bg-red-100 text-red-800',
      'Labour': 'bg-pink-100 text-pink-800',
      'Procurement': 'bg-violet-100 text-violet-800',
      'Disposal': 'bg-slate-100 text-slate-800',
      'Road Materials': 'bg-stone-100 text-stone-800',
      'Legal & Compliance': 'bg-fuchsia-100 text-fuchsia-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Active Suppliers</h2>
        <p className="text-gray-600">Search and verify supplier rates across all catalogs</p>
      </div>

      {/* Filter and Search Section */}
      <Card className="mb-6 border-2">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Supplier Filter Buttons */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Filter by Supplier</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSupplier === 'All' ? 'default' : 'outline'}
                onClick={() => setSelectedSupplier('All')}
                className={selectedSupplier === 'All' ? 'bg-[#00b4d8] hover:bg-[#0096c7] text-white' : ''}
              >
                <Building2 className="h-4 w-4 mr-2" />
                All Suppliers
              </Button>
              {allSuppliers.map(supplier => (
                <Button
                  key={supplier}
                  variant={selectedSupplier === supplier ? 'default' : 'outline'}
                  onClick={() => setSelectedSupplier(supplier)}
                  className={selectedSupplier === supplier ? 'bg-[#00b4d8] hover:bg-[#0096c7] text-white' : ''}
                >
                  {supplier}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Search Items</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by item name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
            <Package className="h-4 w-4" />
            <span className="font-medium">
              Showing {filteredItems.length} items
              {selectedSupplier !== 'All' && ` from ${selectedSupplier}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Results by Supplier */}
      {suppliers.length === 0 ? (
        <Card className="border-2">
          <CardContent className="py-16 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-lg text-gray-500 mb-2">No items found</p>
            <p className="text-sm text-gray-400">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {suppliers.map(supplier => (
            <Card key={supplier} className="border-2 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-[#00b4d8] rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{supplier}</CardTitle>
                      <CardDescription className="text-sm mt-1">
                        Live pricing data updated {new Date().toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    {itemsBySupplier[supplier].length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="w-full">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-bold w-1/5 px-3 py-3">Item Name</TableHead>
                        <TableHead className="font-bold w-1/3 px-3 py-3">Description</TableHead>
                        <TableHead className="font-bold w-[15%] px-3 py-3">Category</TableHead>
                        <TableHead className="font-bold w-[12%] px-3 py-3 text-right">Unit Price</TableHead>
                        <TableHead className="font-bold w-[10%] px-3 py-3">Unit</TableHead>
                        <TableHead className="font-bold w-[13%] px-3 py-3 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemsBySupplier[supplier].map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50 border-b">
                          <TableCell className="font-semibold text-gray-900 px-3 py-4 align-top">
                            <div className="break-words whitespace-normal">{item.itemName}</div>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600 px-3 py-4 align-top">
                            <div className="break-words whitespace-normal leading-relaxed">{item.description}</div>
                          </TableCell>
                          <TableCell className="px-3 py-4 align-top">
                            <Badge variant="outline" className={`${getCategoryColor(item.category)} whitespace-normal text-xs`}>
                              {item.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-base px-3 py-4 align-top">
                            <div className="whitespace-nowrap">
                              <span className="text-gray-500 text-sm mr-1">R</span>
                              {formatPrice(item.unitPrice)}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-gray-700 text-sm px-3 py-4 align-top">
                            <div className="break-words whitespace-normal">{item.unit}</div>
                          </TableCell>
                          <TableCell className="text-center px-3 py-4 align-top">
                            <Badge 
                              variant={item.available ? "default" : "destructive"}
                              className={`${item.available ? "bg-green-500 hover:bg-green-600" : ""} text-xs whitespace-nowrap`}
                            >
                              {item.available ? 'Available' : 'Out of Stock'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}