import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { 
  DollarSign, 
  Search, 
  Filter,
  Download,
  RefreshCw,
  CreditCard,
  Calendar,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface PaymentRecord {
  id: string;
  contractor_id: string;
  company_name: string;
  email: string;
  subscription_tier: string;
  payment_method: string | null;
  payment_reference: string | null;
  payment_amount: number;
  payment_approved: boolean;
  subscription_start_date: string;
  created_at: string;
  status: string;
}

export function PaymentAudit() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [emailSearch, setEmailSearch] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [payments, emailSearch, paymentTypeFilter, paymentStatusFilter, dateFrom, dateTo, tierFilter]);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('contractors')
        .select('id, user_id, company_name, email, subscription_tier, payment_method, payment_reference, payment_amount, payment_approved, subscription_start_date, created_at, status')
        .order('created_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('Error loading payments:', error);
        toast.error('Failed to load payment records');
        return;
      }

      const paymentRecords: PaymentRecord[] = (data || []).map((contractor: any) => ({
        id: contractor.id,
        contractor_id: contractor.user_id,
        company_name: contractor.company_name,
        email: contractor.email,
        subscription_tier: contractor.subscription_tier || 'free',
        payment_method: contractor.payment_method,
        payment_reference: contractor.payment_reference,
        payment_amount: contractor.payment_amount || 0,
        payment_approved: contractor.payment_approved || false,
        subscription_start_date: contractor.subscription_start_date,
        created_at: contractor.created_at,
        status: contractor.status,
      }));

      setPayments(paymentRecords);
    } catch (err) {
      console.error('Payment load error:', err);
      toast.error('An error occurred while loading payments');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...payments];

    // Email search
    if (emailSearch.trim()) {
      filtered = filtered.filter(p => 
        p.email.toLowerCase().includes(emailSearch.toLowerCase()) ||
        p.company_name.toLowerCase().includes(emailSearch.toLowerCase())
      );
    }

    // Payment type filter
    if (paymentTypeFilter !== 'all') {
      filtered = filtered.filter(p => p.payment_method === paymentTypeFilter);
    }

    // Payment status filter
    if (paymentStatusFilter === 'approved') {
      filtered = filtered.filter(p => p.payment_approved === true);
    } else if (paymentStatusFilter === 'pending') {
      filtered = filtered.filter(p => p.payment_approved === false && p.payment_method);
    } else if (paymentStatusFilter === 'free') {
      filtered = filtered.filter(p => !p.payment_method || p.subscription_tier === 'free');
    }

    // Tier filter
    if (tierFilter !== 'all') {
      filtered = filtered.filter(p => p.subscription_tier === tierFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(p => new Date(p.created_at) >= new Date(dateFrom));
    }
    if (dateTo) {
      const endDate = new Date(dateTo);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(p => new Date(p.created_at) <= endDate);
    }

    setFilteredPayments(filtered);
  };

  const clearFilters = () => {
    setEmailSearch('');
    setPaymentTypeFilter('all');
    setPaymentStatusFilter('all');
    setDateFrom('');
    setDateTo('');
    setTierFilter('all');
  };

  const exportToCSV = () => {
    if (filteredPayments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    const headers = [
      'Company Name',
      'Email',
      'Tier',
      'Payment Method',
      'Payment Reference',
      'Amount (ZAR)',
      'Payment Status',
      'Registration Date',
      'Account Status'
    ];

    const rows = filteredPayments.map(p => [
      p.company_name,
      p.email,
      p.subscription_tier.toUpperCase(),
      p.payment_method || 'N/A',
      p.payment_reference || 'N/A',
      p.payment_amount.toFixed(2),
      p.payment_approved ? 'Approved' : (p.payment_method ? 'Pending' : 'Free Tier'),
      new Date(p.created_at).toLocaleDateString(),
      p.status
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qilly-payment-audit-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Payment audit exported successfully');
  };

  const getPaymentStatusBadge = (payment: PaymentRecord) => {
    if (!payment.payment_method || payment.subscription_tier === 'free') {
      return (
        <Badge className="bg-gray-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Free Tier
        </Badge>
      );
    }

    if (payment.payment_approved) {
      return (
        <Badge className="bg-green-500 text-white">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    }

    return (
      <Badge className="bg-yellow-500 text-white">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const colors: Record<string, string> = {
      free: 'bg-gray-400 text-white',
      professional: 'bg-blue-500 text-white',
      enterprise: 'bg-purple-600 text-white',
      custom: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    };

    return (
      <Badge className={colors[tier.toLowerCase()] || 'bg-gray-400 text-white'}>
        {tier.toUpperCase()}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return <span className="text-gray-400 text-xs">No Payment</span>;

    const icons = {
      manual: <CreditCard className="w-3 h-3 mr-1" />,
      stitch: <CreditCard className="w-3 h-3 mr-1" />,
      payfast: <CreditCard className="w-3 h-3 mr-1" />,
    };

    const labels = {
      manual: 'Manual/EFT',
      stitch: 'Stitch',
      payfast: 'PayFast',
    };

    return (
      <Badge variant="outline" className="bg-blue-50">
        {icons[method as keyof typeof icons]}
        {labels[method as keyof typeof labels] || method}
      </Badge>
    );
  };

  // Calculate stats
  const stats = {
    totalPayments: filteredPayments.filter(p => p.payment_method).length,
    approvedPayments: filteredPayments.filter(p => p.payment_approved).length,
    pendingPayments: filteredPayments.filter(p => p.payment_method && !p.payment_approved).length,
    totalRevenue: filteredPayments.filter(p => p.payment_approved).reduce((sum, p) => sum + p.payment_amount, 0),
    freeAccounts: filteredPayments.filter(p => !p.payment_method || p.subscription_tier === 'free').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-green-600" />
            Payment Audit Trail
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Complete payment history with filtering and export capabilities
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadPayments} variant="outline" size="sm" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={exportToCSV} variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approvedPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Free Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats.freeAccounts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              R{stats.totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {/* Email Search */}
            <div className="space-y-2">
              <Label htmlFor="email-search" className="text-sm flex items-center gap-1">
                <Mail className="w-4 h-4" />
                Email / Company
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email-search"
                  placeholder="Search by email or company..."
                  value={emailSearch}
                  onChange={(e) => setEmailSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label htmlFor="payment-type" className="text-sm flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                Payment Method
              </Label>
              <select
                id="payment-type"
                value={paymentTypeFilter}
                onChange={(e) => setPaymentTypeFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Methods</option>
                <option value="manual">Manual/EFT</option>
                <option value="stitch">Stitch</option>
                <option value="payfast">PayFast</option>
              </select>
            </div>

            {/* Payment Status */}
            <div className="space-y-2">
              <Label htmlFor="payment-status" className="text-sm flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Payment Status
              </Label>
              <select
                id="payment-status"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="free">Free Tier</option>
              </select>
            </div>

            {/* Subscription Tier */}
            <div className="space-y-2">
              <Label htmlFor="tier-filter" className="text-sm flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Subscription Tier
              </Label>
              <select
                id="tier-filter"
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tiers</option>
                <option value="free">Free</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label htmlFor="date-from" className="text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                From Date
              </Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label htmlFor="date-to" className="text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                To Date
              </Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>
                Showing {filteredPayments.length} of {payments.length} total records
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-12 h-12 mx-auto mb-3 text-gray-400 animate-spin" />
              <p>Loading payment records...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No payment records found</p>
              <Button onClick={clearFilters} variant="link" size="sm" className="mt-2">
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-semibold">
                          {payment.company_name}
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-gray-400" />
                            {payment.email}
                          </div>
                        </TableCell>
                        <TableCell>{getTierBadge(payment.subscription_tier)}</TableCell>
                        <TableCell>{getPaymentMethodBadge(payment.payment_method)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.payment_reference || (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {payment.payment_amount > 0 ? (
                            `R${payment.payment_amount.toLocaleString()}`
                          ) : (
                            <span className="text-gray-400">R0</span>
                          )}
                        </TableCell>
                        <TableCell>{getPaymentStatusBadge(payment)}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(payment.created_at).toLocaleDateString('en-ZA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}