import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Search,
  AlertTriangle,
  RefreshCw,
  Zap,
  CreditCard,
  FileText
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/utils/supabase';

// ─────────────────────────────────────────────────────────────────────────────
// PaymentVerification v2 — PROP-DRIVEN (no independent Supabase query)
//
// Root cause of "no records" bug (2026-03-19):
//   • PaymentVerification was making its own separate Supabase query
//     (.neq('subscription_tier','free')) that repeatedly failed with
//     ERR_CONNECTION_CLOSED because AdminDashboard had already opened a
//     connection on the same contractors table.
//   • A 30-second setInterval kept retrying, resetting payments state to []
//     each time, so manual EFT contractors never appeared.
//
// Fix: AdminDashboard now passes its already-loaded contractors array as a
//   prop.  PaymentVerification filters and displays that data.  Approve /
//   reject still write to Supabase directly, then call onRefresh() so
//   AdminDashboard reloads all contractors — keeping a single source of truth.
//
// Payment method values:
//   'bank_transfer' — new registrations (was 'manual' before 2026-03-19 fix)
//   'manual'        — legacy records already in DB (treated identically)
//   'stitch'        — Stitch Instant EFT (auto-approved)
//   'payfast'       — PayFast (auto-approved)
// ─────────────────────────────────────────────────────────────────────────────

interface ContractorPayment {
  id: string;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  subscription_tier: string;
  payment_method: 'bank_transfer' | 'manual' | 'stitch' | 'payfast' | null;
  payment_reference: string | null;
  payment_amount: number | null;
  payment_approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at: string | null;
}

// ── Helper: is this an EFT (manual bank transfer) record? ───────────────────
function isEFT(p: ContractorPayment) {
  return p.payment_method === 'bank_transfer' || p.payment_method === 'manual';
}

interface PaymentVerificationProps {
  /** All contractors already loaded by AdminDashboard (any tier). */
  contractors: any[];
  /** Called after an approve/reject action so AdminDashboard can reload. */
  onRefresh: () => Promise<void>;
}

export function PaymentVerification({ contractors, onRefresh }: PaymentVerificationProps) {
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedPayment, setSelectedPayment] = useState<ContractorPayment | null>(null);
  const [showDialog, setShowDialog]       = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isActioning, setIsActioning]     = useState(false);
  const [isRefreshing, setIsRefreshing]   = useState(false);
  const [activeFilter, setActiveFilter]   = useState<'all' | 'eft-pending' | 'eft-verified' | 'instant'>('all');

  // ── Derive paid-tier payments from prop (no Supabase query needed) ─────────
  const payments: ContractorPayment[] = (contractors || [])
    .filter(c => c.subscription_tier && c.subscription_tier.toLowerCase() !== 'free')
    .map(c => ({
      id:                 c.id,
      company_name:       c.company_name,
      contact_person:     c.contact_person,
      email:              c.email,
      phone:              c.phone,
      subscription_tier:  c.subscription_tier,
      payment_method:     c.payment_method,
      payment_reference:  c.payment_reference,
      payment_amount:     c.payment_amount,
      payment_approved:   c.payment_approved,
      status:             c.status,
      created_at:         c.created_at,
      approved_at:        c.approved_at,
    }));

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('Payment records refreshed.');
    } catch {
      toast.error('Refresh failed — check your connection.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // ── Admin approves an EFT payment → unlocks contractor login ──────────────
  const handleApproveEFT = async (payment: ContractorPayment) => {
    setIsActioning(true);
    try {
      const { error } = await supabase
        .from('contractors')
        .update({
          status:           'approved',
          payment_approved:  true,
          approved_at:      new Date().toISOString(),
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast.success(
        `✅ EFT Payment Verified! ${payment.company_name} can now login ` +
        `with ${payment.subscription_tier?.toUpperCase()} tier access.`
      );
      setShowDialog(false);
      setSelectedPayment(null);
      await onRefresh(); // reload AdminDashboard's contractors → props update
    } catch (err: any) {
      console.error('Approve EFT error:', err);
      toast.error(`Failed to approve: ${err?.message || 'Check console for details.'}`);
    } finally {
      setIsActioning(false);
    }
  };

  // ── Admin rejects an EFT payment ──────────────────────────────────────────
  const handleRejectEFT = async (payment: ContractorPayment) => {
    if (!rejectionReason.trim()) {
      toast.error('Please enter a rejection reason before rejecting.');
      return;
    }
    setIsActioning(true);
    try {
      const { error } = await supabase
        .from('contractors')
        .update({
          status:           'rejected',
          payment_approved:  false,
          rejection_reason:  rejectionReason.trim(),
        })
        .eq('id', payment.id);

      if (error) throw error;

      toast.success(`EFT payment rejected for ${payment.company_name}. Reason recorded.`);
      setShowDialog(false);
      setSelectedPayment(null);
      setRejectionReason('');
      await onRefresh();
    } catch (err: any) {
      console.error('Reject EFT error:', err);
      toast.error(`Failed to reject: ${err?.message || 'Check console for details.'}`);
    } finally {
      setIsActioning(false);
    }
  };

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = payments.filter(p => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      p.company_name?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term) ||
      (p.payment_reference ?? '').toLowerCase().includes(term);

    let matchFilter = true;
    if (activeFilter === 'eft-pending')  matchFilter = isEFT(p) && p.status === 'pending';
    if (activeFilter === 'eft-verified') matchFilter = isEFT(p) && p.status === 'approved';
    if (activeFilter === 'instant')      matchFilter = p.payment_method === 'stitch' || p.payment_method === 'payfast';

    return matchSearch && matchFilter;
  });

  // ── Badges ────────────────────────────────────────────────────────────────
  const getPaymentBadge = (p: ContractorPayment) => {
    if (p.payment_method === 'stitch' || p.payment_method === 'payfast') {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300 border flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Auto-Approved
        </Badge>
      );
    }
    if (isEFT(p)) {
      if (p.status === 'approved') {
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-300 border flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            EFT Verified
          </Badge>
        );
      }
      if (p.status === 'rejected') {
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300 border flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            EFT Rejected
          </Badge>
        );
      }
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-300 border flex items-center gap-1">
          <Clock className="w-3 h-3" />
          EFT Pending
        </Badge>
      );
    }
    return <Badge variant="outline">Unknown</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const t = (tier || '').toLowerCase();
    if (t === 'professional') return <Badge className="bg-blue-100 text-blue-700 border border-blue-300">Professional — R2,999</Badge>;
    if (t === 'enterprise')   return <Badge className="bg-purple-100 text-purple-700 border border-purple-300">Enterprise — R8,999</Badge>;
    return <Badge variant="outline" className="capitalize">{tier}</Badge>;
  };

  // ── Counts ────────────────────────────────────────────────────────────────
  const eftPending   = payments.filter(p => isEFT(p) && p.status === 'pending').length;
  const eftVerified  = payments.filter(p => isEFT(p) && p.status === 'approved').length;
  const instantCount = payments.filter(p => p.payment_method === 'stitch' || p.payment_method === 'payfast').length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <Card className="border-2 border-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-blue-600" />
                Payment Verification
                {eftPending > 0 && (
                  <Badge className="bg-amber-500 text-white ml-1">{eftPending} pending</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Showing {payments.length} paid-tier contractors from the live database.
                EFT (Manual Bank Transfer) payments require admin verification before the contractor can login.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* ── Summary stats ── */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
              <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
              <div className="text-3xl font-bold text-amber-700">{eftPending}</div>
              <div className="text-sm text-amber-600">EFT Awaiting Verification</div>
              {eftPending > 0 && (
                <div className="text-xs text-amber-500 mt-1">⚠️ Action required</div>
              )}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <Zap className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <div className="text-3xl font-bold text-green-700">{instantCount}</div>
              <div className="text-sm text-green-600">Stitch / PayFast Auto-Approved</div>
              <div className="text-xs text-green-500 mt-1">✅ No action needed</div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <CheckCircle className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <div className="text-3xl font-bold text-blue-700">{eftVerified}</div>
              <div className="text-sm text-blue-600">EFT Manually Verified</div>
              <div className="text-xs text-blue-500 mt-1">✅ Contractors have login access</div>
            </div>
          </div>

          {/* ── Important info banner ── */}
          <Alert className="mb-4 border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800 text-sm">
              <strong>Payment Flow:</strong>
              <ul className="mt-1 space-y-0.5 list-disc list-inside">
                <li><strong>Stitch / PayFast:</strong> Auto-approved at registration — contractor can login immediately.</li>
                <li><strong>Manual Bank Transfer (EFT):</strong> Contractor submits a reference number.  Status = <em>Pending</em> until you click <strong>Review EFT → Verify &amp; Approve</strong> — which sets payment_approved = true and unlocks their login.</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* ── Search + filter ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by company, email or reference..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {([
                ['all',          'All'],
                ['eft-pending',  `EFT Pending (${eftPending})`],
                ['eft-verified', 'EFT Verified'],
                ['instant',      'Auto-Approved'],
              ] as const).map(([val, label]) => (
                <Button
                  key={val}
                  size="sm"
                  variant={activeFilter === val ? 'default' : 'outline'}
                  onClick={() => setActiveFilter(val)}
                  className={activeFilter === 'eft-pending' && val === 'eft-pending' ? 'bg-amber-600 hover:bg-amber-700' : ''}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* ── Table ── */}
          {payments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-gray-500">
              <FileText className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No paid-tier contractors found</p>
              <p className="text-sm mt-1 text-gray-400">
                New Manual EFT registrations will appear here immediately.<br />
                Click <strong>Refresh</strong> if you just created a contractor.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Now
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed rounded-lg text-gray-500">
              <p className="font-medium">No records match your filter</p>
              <p className="text-sm mt-1">
                {activeFilter === 'eft-pending'
                  ? 'No EFT payments awaiting verification ✅'
                  : 'Try a different filter or search term.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Company</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow
                      key={p.id}
                      className={isEFT(p) && p.status === 'pending'
                        ? 'bg-amber-50 hover:bg-amber-100'
                        : 'hover:bg-gray-50'}
                    >
                      <TableCell className="font-medium">{p.company_name}</TableCell>
                      <TableCell className="text-sm text-gray-600">{p.email}</TableCell>
                      <TableCell>{getTierBadge(p.subscription_tier)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize text-xs">
                          {p.payment_method === 'stitch'        ? '⚡ Stitch'    :
                           p.payment_method === 'payfast'       ? '💳 PayFast'   :
                           isEFT(p)                             ? '🏦 EFT'       : 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-xs max-w-[130px] truncate">
                        {p.payment_reference || '—'}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-700">
                        {p.payment_amount ? `R${Number(p.payment_amount).toLocaleString()}` : '—'}
                      </TableCell>
                      <TableCell>{getPaymentBadge(p)}</TableCell>
                      <TableCell className="text-right">
                        {isEFT(p) && p.status === 'pending' ? (
                          <Button
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700 text-white"
                            onClick={() => { setSelectedPayment(p); setShowDialog(true); }}
                          >
                            Review EFT
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setSelectedPayment(p); setShowDialog(true); }}
                          >
                            View
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Detail / Approval Dialog ── */}
      {selectedPayment && (
        <Dialog open={showDialog} onOpenChange={open => {
          setShowDialog(open);
          if (!open) { setSelectedPayment(null); setRejectionReason(''); }
        }}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                {isEFT(selectedPayment) && selectedPayment.status === 'pending'
                  ? `Verify EFT Payment — ${selectedPayment.company_name}`
                  : `Payment Record — ${selectedPayment.company_name}`}
              </DialogTitle>
              <DialogDescription>
                {isEFT(selectedPayment) && selectedPayment.status === 'pending'
                  ? 'Check your bank statement for this EFT reference, then approve or reject below.'
                  : 'Payment record details (read-only).'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Status banner */}
              <div className={`p-3 rounded-lg flex items-center gap-3 ${
                isEFT(selectedPayment) && selectedPayment.status === 'pending'
                  ? 'bg-amber-50 border border-amber-300'
                  : 'bg-green-50 border border-green-300'
              }`}>
                {getPaymentBadge(selectedPayment)}
                <span className="text-sm text-gray-700">
                  {isEFT(selectedPayment) && selectedPayment.status === 'pending'
                    ? 'EFT payment submitted — awaiting your bank verification'
                    : isEFT(selectedPayment)
                      ? 'EFT payment has been verified by admin'
                      : `${selectedPayment.payment_method === 'stitch' ? 'Stitch' : 'PayFast'} payment auto-verified at registration`}
                </span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-gray-500">Company</Label>
                  <p className="font-medium">{selectedPayment.company_name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Contact</Label>
                  <p>{selectedPayment.contact_person}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="font-mono text-xs">{selectedPayment.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Phone</Label>
                  <p>{selectedPayment.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Subscription Tier</Label>
                  <div className="mt-1">{getTierBadge(selectedPayment.subscription_tier)}</div>
                </div>
                <div>
                  <Label className="text-gray-500">Payment Method</Label>
                  <p className="capitalize font-medium">
                    {selectedPayment.payment_method === 'stitch'  ? '⚡ Stitch (Instant EFT)' :
                     selectedPayment.payment_method === 'payfast' ? '💳 PayFast (Card)'        :
                     isEFT(selectedPayment)                       ? '🏦 Manual Bank Transfer'  : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-500">Payment Reference</Label>
                  <p className="font-mono bg-gray-100 px-3 py-2 rounded text-sm mt-1">
                    {selectedPayment.payment_reference || 'No reference provided'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Amount</Label>
                  <p className="text-2xl font-bold text-blue-600">
                    {selectedPayment.payment_amount ? `R${Number(selectedPayment.payment_amount).toLocaleString()}` : '—'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-500">Registered On</Label>
                  <p>{new Date(selectedPayment.created_at).toLocaleDateString('en-ZA', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}</p>
                </div>
              </div>

              {/* EFT Pending: approve/reject controls */}
              {isEFT(selectedPayment) && selectedPayment.status === 'pending' && (
                <div className="border-t pt-4 space-y-4">
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-amber-800 text-sm">
                      <strong>Verification Checklist:</strong>
                      <ol className="list-decimal list-inside mt-1 space-y-0.5">
                        <li>Log into Standard Bank Online Banking</li>
                        <li>Check for incoming payment of <strong>R{selectedPayment.payment_amount?.toLocaleString()}</strong></li>
                        <li>Confirm reference: <strong className="font-mono">{selectedPayment.payment_reference}</strong></li>
                        <li>If confirmed ✅ click <strong>Verify &amp; Approve</strong> below</li>
                        <li>If not found ❌ enter a reason and click <strong>Reject</strong></li>
                      </ol>
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="rejection-reason" className="text-gray-700">
                      Rejection Reason <span className="text-gray-400">(required only if rejecting)</span>
                    </Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="e.g. Payment not received, incorrect reference used..."
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              )}

              {/* Already approved */}
              {selectedPayment.status === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800">Payment Approved</p>
                    <p className="text-sm text-green-700">
                      {selectedPayment.approved_at
                        ? `Approved on ${new Date(selectedPayment.approved_at).toLocaleDateString('en-ZA')}`
                        : 'Auto-approved at registration'}
                    </p>
                    <p className="text-sm text-green-600 mt-1">Contractor has full login access.</p>
                  </div>
                </div>
              )}

              {/* Rejected */}
              {selectedPayment.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-red-800">Payment Rejected</p>
                    <p className="text-sm text-red-600 mt-1">Login access is blocked for this contractor.</p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2 flex-wrap">
              {isEFT(selectedPayment) && selectedPayment.status === 'pending' ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleRejectEFT(selectedPayment)}
                    disabled={isActioning || !rejectionReason.trim()}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject EFT
                  </Button>
                  <Button
                    onClick={() => handleApproveEFT(selectedPayment)}
                    disabled={isActioning}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isActioning ? 'Verifying...' : 'Verify & Approve EFT ✓'}
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setShowDialog(false)}>Close</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
