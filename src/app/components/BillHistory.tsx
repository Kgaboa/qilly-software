import { ProgrammeCashflow } from './ProgrammeCashflow';
import { AllowablesWorkspace } from './AllowablesWorkspace';
import { deriveHistoricalDraftGroups } from '@/utils/boqProgramme';
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
  planningMode?: 'programme' | 'cashflow' | 'allowables' | null;
}

export function BillHistory({ accessToken, planningMode = null }: BillHistoryProps) {
  const [bills, setBills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [detailsBill, setDetailsBill] = useState<any>(null);
  const [itemFilter, setItemFilter] = useState('');
  const [planningMonths, setPlanningMonths] = useState(12);
  const [programmeLevel, setProgrammeLevel] = useState<'high' | 'detailed'>('high');
  const [historyFilter, setHistoryFilter] = useState('');

  const historicalDraft = selectedBill ? deriveHistoricalDraftGroups(selectedBill.items || []) : null;

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
            project_settings,
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
            projectDuration: bill.project_settings?.duration,
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

  useEffect(() => {
    if (!selectedBill) return;
    const duration = Number(selectedBill.projectDuration);
    setPlanningMonths(Number.isInteger(duration) && duration >= 1 && duration <= 36 ? duration : 12);
  }, [selectedBill?.id]);

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

  const filteredBills = bills.filter(bill => !historyFilter || [bill.projectName, bill.billNumber, bill.id, bill.status].some(value => String(value || '').toLowerCase().includes(historyFilter.toLowerCase())));

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{planningMode ? 'Select historical priced BOQ' : 'Bill History'}</CardTitle>
          <CardDescription>
            {planningMode ? 'Select a priced BOQ below to open its planning scenario. Only BOQs with a positive priced total are eligible.' : 'View and download previously processed bills'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {planningMode && <div className="mb-3 flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3">
            <label htmlFor="historical-boq-picker" className="text-sm font-medium">Priced BOQ</label>
            <select id="historical-boq-picker" aria-label="Historical priced BOQ" className="min-w-0 flex-1 rounded border border-slate-300 bg-white p-2 text-sm"
              value={selectedBill?.id || ''} onChange={event => setSelectedBill(bills.find(b => b.id === event.target.value) || null)}>
              <option value="">Choose a historical priced BOQ</option>
              {bills.filter(b => Number(b.overallTotal) > 0).map(b => <option key={b.id} value={b.id}>{b.projectName || b.billNumber || b.id} — R{formatNumber(b.overallTotal)}</option>)}
            </select>
            <input aria-label="Filter historical BOQs" value={historyFilter} onChange={event => setHistoryFilter(event.target.value)} placeholder="Filter by project, ID or status" className="w-full rounded border border-slate-300 bg-white p-2 text-sm sm:w-60" />
          </div>}
          <details open={!planningMode} className="rounded-lg border border-slate-200">
            <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700">{planningMode ? `Browse historical BOQ records (${filteredBills.length})` : `All historical BOQs (${filteredBills.length})`}</summary>
          <div className="max-h-72 overflow-auto"><Table>
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
              {filteredBills.map((bill) => (
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
                        onClick={() => { if (planningMode) setSelectedBill(bill); else { setDetailsBill(bill); setItemFilter(''); } }}
                        disabled={Boolean(planningMode) && !(Number(bill.overallTotal) > 0)}
                      >
                        {planningMode ? 'Select for planning' : 'View details'}
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
          </Table></div></details>
        </CardContent>
      </Card>

      {planningMode && selectedBill && Number(selectedBill.overallTotal) > 0 && (
        <section aria-label={planningMode === 'programme' ? 'Selected BOQ programme' : 'Selected BOQ cashflow'} className="space-y-3">
          <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4">
            <h3 className="font-semibold text-[#0077b6]">{planningMode === 'programme' ? 'Programme of Works' : planningMode === 'allowables' ? 'Allowables & Margin' : 'Cash Flow & S-Curve'}</h3>
            <p className="text-sm text-slate-700">BOQ: {selectedBill.projectName || selectedBill.billNumber || selectedBill.id} · Priced value: R{formatNumber(selectedBill.overallTotal)}</p>
            <Button variant="outline" size="sm" className="mt-2 bg-white" onClick={() => { setDetailsBill(selectedBill); setItemFilter(''); }}>View BOQ line-item details</Button>
            <p className="text-xs text-slate-600">Illustrative scenario only. Confirm programme duration, sequencing and commercial assumptions before approval.</p>
          </div>
          <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            Project duration (months)
            <input aria-label="Project duration in months" type="number" min={1} max={36} step={1} value={planningMonths}
              onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= 1 && value <= 36) setPlanningMonths(value); }}
              className="w-24 rounded-lg border border-cyan-200 bg-white px-3 py-2" />
            <span className="text-xs font-normal text-slate-600">{Number.isInteger(Number(selectedBill.projectDuration)) && Number(selectedBill.projectDuration) >= 1 && Number(selectedBill.projectDuration) <= 36 ? 'Defaulted from saved BOQ project settings; editable for scenario planning.' : 'Saved duration unavailable; 12-month scenario default requires confirmation.'}</span>
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
          <label className="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
            Programme level
            <select aria-label="Programme level" value={programmeLevel} onChange={event => setProgrammeLevel(event.target.value as 'high' | 'detailed')}
              className="rounded-lg border border-cyan-200 bg-white px-3 py-2">
              <option value="high">High level</option>
              <option value="detailed">Detailed</option>
            </select>
          </label>
          <p className="text-xs text-slate-600">Duration is configurable from 1 to 36 months. Where available, the original duration is loaded from the selected BOQ project settings.</p>
          <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Historical BOQ work packages are provisional groupings of line items with positive, reconciled quantity × rate totals. Pricing approval evidence and activity sequencing are not available in this history record. Review each work package and confirm its value, timing and dependencies before approving a baseline.
          </p>
          {planningMode === 'allowables' ? <AllowablesWorkspace key={selectedBill.id} boqId={selectedBill.id} items={selectedBill.items || []} originalTotal={Number(selectedBill.overallTotal)} /> : <ProgrammeCashflow key={selectedBill.id + '-' + planningMonths + '-' + programmeLevel} projectValue={Number(selectedBill.overallTotal)} durationMonths={planningMonths} programmeLevel={programmeLevel} focusAllowables={planningMode === 'allowables'}
            boqGroups={historicalDraft?.groups || []}
            eligibleValue={historicalDraft?.eligibleTotal || 0}
            excludedCount={historicalDraft?.excludedCount || 0} />}
        </section>
      )}
      {planningMode && selectedBill && !(Number(selectedBill.overallTotal) > 0) && (
        <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm">A priced BOQ with a positive total is required to generate a planning scenario.</p>
      )}
      {/* Bill Details */}
      {detailsBill && (
        <details key={detailsBill.id} className="rounded-lg border border-slate-200 bg-white shadow-sm" aria-label="Historical BOQ details">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-slate-700">Bill Details · {detailsBill.projectName || detailsBill.billNumber || detailsBill.id} · {(detailsBill.items || []).length} items</summary>
        <div className="max-h-[65vh] overflow-auto border-t border-slate-200">
        <Card className="flex min-h-0 flex-col border-0 shadow-none">
          <CardHeader>
            <div className="flex items-center justify-between gap-3"><CardTitle>Historical BOQ details</CardTitle><Button variant="outline" size="sm" onClick={() => setDetailsBill(null)}>Hide details</Button></div>
            <CardDescription>ID: {detailsBill.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <input aria-label="Search BOQ line items" value={itemFilter} onChange={event => setItemFilter(event.target.value)} placeholder="Search item number, description or supplier" className="mb-3 w-full rounded-lg border border-slate-300 p-2 text-sm" />
            {/* Searchable, scroll-contained historical line items */}
            <div className="max-h-[55vh] w-full overflow-auto">
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
                  {(detailsBill.items || []).filter((item: any) => !itemFilter || [item.code, item.name, item.description, item.selectedSupplier].some(value => String(value || '').toLowerCase().includes(itemFilter.toLowerCase()))).map((item: any, index: number) => (
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
                  R{formatNumber(detailsBill.overallTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
        </details>
      )}
    </div>
  );
}