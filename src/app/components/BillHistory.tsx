import { ProgrammeCashflow } from './ProgrammeCashflow';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Badge } from '@/app/components/ui/badge';
import { FileText, Calendar, Coins, Loader2 } from 'lucide-react';
import { api } from '@/utils/api';
import { getSupabaseClient } from '@/utils/supabase/client';
import { getCurrentEnvironment } from '@/utils/environment';
import * as XLSX from 'xlsx';

interface BillHistoryProps {
  accessToken: string;
  planningMode?: 'programme' | 'cashflow' | null;
}

export function BillHistory({ accessToken, planningMode = null }: BillHistoryProps) {
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [planningMonths, setPlanningMonths] = useState(12);

  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    setHistoryError('');
    try {
      // ✅ FIX: Fetch directly from Supabase database instead of sessionStorage
      const supabase = getSupabaseClient(getCurrentEnvironment());
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        console.log('📊 Fetching bill history from Supabase for user:', user.email);
        
        const { data: billsData, error } = await supabase
          .from('bills')
          .select(`
            id,
            bill_number,
            project_name,
            total_cost,
            status,
            created_at,
            bill_items (
              id,
              description,
              unit,
              quantity,
              unit_price,
              total_price,
              supplier_name
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('❌ Error fetching bills from Supabase:', error);
          setHistoryError('Historical BOQs could not be loaded from the database. Check access and retry.');
          setBills([]);
        } else {
          console.log(`✅ Fetched ${billsData?.length || 0} bills from Supabase`);
          
          // Transform Supabase data to match expected format
          const transformedBills = (billsData || []).map(bill => ({
            id: bill.id,
            billNumber: bill.bill_number,
            projectName: bill.project_name,
            overallTotal: bill.total_cost,
            status: bill.status,
            createdAt: bill.created_at,
            items: (bill.bill_items || []).map((item: any) => ({
              code: item.id,
              name: item.description,
              description: item.description,
              unit: item.unit,
              quantity: item.quantity,
              unitPrice: item.unit_price,
              totalPrice: item.total_price,
              selectedSupplier: item.supplier_name || 'N/A'
            }))
          }));
          
          setBills(transformedBills);
        }
      } else {
        setHistoryError('Sign in to view your historical priced BOQs.');
        setBills([]);
      }
    } catch (error: any) {
      // Only log unexpected errors (DEMO_MODE is expected)
      if (error?.message !== 'DEMO_MODE') {
        console.error('Error fetching bills:', error);
      }
      
      setHistoryError('Unable to load historical priced BOQs. Please retry.');
      setBills([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = (bill: any) => {
    // Create CSV content
    let csvContent = 'Code,Item Name,Description,Quantity,Unit,Rate,Supplier,Unit Price,Total Price\n';
    
    bill.items.forEach((item: any) => {
      const row = [
        item.code,
        `"${item.name}"`,
        `"${item.description}"`,
        item.quantity,
        item.unit,
        item.rate || '0',
        item.selectedSupplier,
        item.unitPrice,
        item.totalPrice
      ].join(',');
      csvContent += row + '\n';
    });
    
    csvContent += `\n,,,,,,Total:,,R${formatNumber(bill.overallTotal)}`;

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `priced-bill-${bill.id}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadExcel = (bill: any) => {
    // Create a workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Code', 'Item Name', 'Description', 'Quantity', 'Unit', 'Rate', 'Supplier', 'Unit Price', 'Total Price'],
      ...bill.items.map((item: any) => [
        item.code,
        item.name,
        item.description,
        item.quantity,
        item.unit,
        item.rate || '0',
        item.selectedSupplier,
        item.unitPrice,
        item.totalPrice
      ]),
      [],
      ['Total:', '', '', '', '', '', '', '', `R${formatNumber(bill.overallTotal)}`]
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bill Details');

    // Download
    XLSX.writeFile(workbook, `priced-bill-${bill.id}.xlsx`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{historyError ? 'BOQ history unavailable' : 'No Bills Yet'}</h3>
            <p className="text-gray-600">
              {historyError || 'No historical BOQs were found for this account. Upload and process your first bill to see it here.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bill History</CardTitle>
          <CardDescription>
            {planningMode ? 'Select a priced BOQ below to open its planning scenario. Only BOQs with a positive priced total are eligible.' : 'View and download previously processed bills'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {planningMode && <TableHead>Select BOQ</TableHead>}
                <TableHead>Bill ID</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} className={planningMode && selectedBill?.id === bill.id ? 'bg-cyan-50' : ''}>
                  {planningMode && <TableCell>
                    <input type="radio" name="planning-bill" aria-label={`Select priced BOQ ${bill.projectName || bill.billNumber || bill.id}`}
                      checked={selectedBill?.id === bill.id}
                      disabled={!(Number(bill.overallTotal) > 0)}
                      onChange={() => setSelectedBill(bill)} />
                  </TableCell>}
                  <TableCell className="font-mono text-sm">
                    <div>{String(bill.id).replace(/^demo-/, '').substring(0, 8)}...</div>
                    {planningMode && <div className="font-sans text-xs text-slate-600">{bill.projectName || bill.billNumber || 'Unnamed BOQ'}</div>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      {bill.items?.length || 0} items
                    </div>
                  </TableCell>
                  <TableCell className="font-bold text-green-600">
                    R{formatNumber(bill.overallTotal)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(bill.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {bill.status || 'processed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedBill(selectedBill?.id === bill.id ? null : bill)}
                        disabled={Boolean(planningMode) && !(Number(bill.overallTotal) > 0)}
                      >
                        {selectedBill?.id === bill.id ? 'Hide' : planningMode ? 'Select for planning' : 'View'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(bill)}
                      >
                        Download CSV
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadExcel(bill)}
                      >
                        Download Excel
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {planningMode && selectedBill && Number(selectedBill.overallTotal) > 0 && (
        <section aria-label={planningMode === 'programme' ? 'Selected BOQ programme' : 'Selected BOQ cashflow'} className="space-y-3">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <h3 className="font-semibold text-[#0077b6]">{planningMode === 'programme' ? 'Programme of Works' : 'Cash Flow & S-Curve'}</h3>
            <p className="text-sm text-slate-700">BOQ: {selectedBill.projectName || selectedBill.billNumber || selectedBill.id} · Priced value: R{formatNumber(selectedBill.overallTotal)}</p>
            <p className="text-xs text-slate-600">Illustrative scenario only. Confirm programme duration, sequencing and commercial assumptions before approval.</p>
          </div>
          <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            Project duration (months)
            <input aria-label="Project duration in months" type="number" min={1} max={36} step={1} value={planningMonths}
              onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 1 && value <= 36) setPlanningMonths(value); }}
              className="w-24 rounded-lg border border-cyan-200 bg-white px-3 py-2" />
            <span className="text-xs font-normal text-slate-600">Confirm against the project programme; default is illustrative.</span>
          </label>
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm" aria-label="Historical BOQ planning input summary">
            <h4 className="font-semibold text-slate-800">BOQ planning inputs</h4>
            <p className="text-slate-700">
              {Array.isArray(selectedBill.items) ? selectedBill.items.length : 0} historical line items ·
              Priced total R{formatNumber(selectedBill.overallTotal)}
            </p>
            {Array.isArray(selectedBill.items) && selectedBill.items.length > 0 && (
              <p className="text-xs text-slate-600">
                Recorded line-item value: R{formatNumber(selectedBill.items.reduce((sum: number, item: any) => sum + (Number(item.totalPrice) || 0), 0))}
                {' · '}Difference from bill total: R{formatNumber(Number(selectedBill.overallTotal) - selectedBill.items.reduce((sum: number, item: any) => sum + (Number(item.totalPrice) || 0), 0))}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-600">Line-item totals are informational and may differ from the bill total because of allowances, adjustments or incomplete historical records.</p>
          </div>
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            BOQ-driven work-group allocation is not yet available for this historical bill: the history record does not contain verified pricing decisions and acceptance evidence. The programme below uses an editable illustrative allocation, not automatically approved BOQ groups.
          </p>
          <ProgrammeCashflow key={selectedBill.id + '-' + planningMonths} projectValue={Number(selectedBill.overallTotal)} durationMonths={planningMonths} />
        </section>
      )}
      {planningMode && selectedBill && !(Number(selectedBill.overallTotal) > 0) && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">A priced BOQ with a positive total is required to generate a planning scenario.</p>
      )}
      {/* Bill Details */}
      {selectedBill && (
        <Card>
          <CardHeader>
            <CardTitle>Bill Details</CardTitle>
            <CardDescription>ID: {selectedBill.id}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Compact responsive table - no horizontal scroll needed */}
            <div className="w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">ITEM NO</TableHead>
                    <TableHead className="min-w-[180px]">Item</TableHead>
                    <TableHead className="text-right w-[60px]">Qty</TableHead>
                    <TableHead className="w-[50px]">Unit</TableHead>
                    <TableHead className="w-[100px]">Supplier</TableHead>
                    <TableHead className="text-right w-[100px]">Unit Price</TableHead>
                    <TableHead className="text-right w-[110px]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedBill.items?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-mono text-xs">{item.code}</TableCell>
                      <TableCell className="min-w-[180px]">
                        <div className="text-sm">
                          <p className="font-medium truncate max-w-[200px]" title={item.name}>{item.name}</p>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]" title={item.description}>{item.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-sm">{item.quantity}</TableCell>
                      <TableCell className="text-sm">{item.unit}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-xs px-2 py-0.5">{item.selectedSupplier}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        R{formatNumber(item.unitPrice)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-sm">
                        R{formatNumber(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 pt-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-2xl font-bold text-green-600">
                  R{formatNumber(selectedBill.overallTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}