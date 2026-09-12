import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';
import { Textarea } from '@/app/components/ui/textarea';
import { toast } from 'sonner';
import { supplierDataLayer, Supplier } from '@/utils/supplierDataLayer';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { utils, writeFile } from 'xlsx';
import { 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Shield,
  Sparkles,
  Mail,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
  Play,
  FileText,
  BarChart3,
  Zap,
  Send,
  Copy,
  Percent,
  Calculator
} from 'lucide-react';

type SubscriptionTier = 'free' | 'professional' | 'enterprise' | 'custom';
type BillingCycle = 'monthly' | 'annual';
type SubscriptionStatus = 'active' | 'cancelled' | 'past_due' | 'trial';
type PaymentStatus = 'success' | 'failed' | 'pending' | 'refunded';

interface TestSubscription {
  id: string;
  companyName: string;
  subscription_tier: SubscriptionTier;
  billing_cycle: BillingCycle;
  subscription_status: SubscriptionStatus;
  subscription_start_date: string;
  next_billing_date: string;
  payment_method: string;
  monthlyRevenue: number;
  payments: PaymentRecord[];
  emails: EmailRecord[];
}

interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  status: PaymentStatus;
  method: string;
  description: string;
}

interface EmailRecord {
  id: string;
  date: string;
  type: string;
  subject: string;
  content: string;
  status: 'sent' | 'failed' | 'queued';
}

interface WebhookEvent {
  id: string;
  timestamp: string;
  event: string;
  payload: any;
  status: 'success' | 'failed';
}

export function SubscriptionTesting() {
  const [testSuppliers, setTestSuppliers] = useState<TestSubscription[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [webhookEvents, setWebhookEvents] = useState<WebhookEvent[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<TestSubscription | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showWebhookDialog, setShowWebhookDialog] = useState(false);
  const [showProrationDialog, setShowProrationDialog] = useState(false);

  // Filters
  const [filterTier, setFilterTier] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCycle, setFilterCycle] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    subscription_tier: 'free' as SubscriptionTier,
    billing_cycle: 'monthly' as BillingCycle,
    subscription_status: 'trial' as SubscriptionStatus,
    payment_method: 'Credit Card',
  });

  // Proration calculator
  const [prorationData, setProrationData] = useState({
    currentTier: 'professional' as SubscriptionTier,
    newTier: 'enterprise' as SubscriptionTier,
    daysRemaining: 15,
    totalDays: 30,
  });

  // Pricing tiers
  const tierPricing = {
    free: { monthly: 0, annual: 0 },
    professional: { monthly: 1999, annual: 19990 },
    enterprise: { monthly: 4999, annual: 49990 },
    custom: { monthly: 9999, annual: 99990 }
  };

  // Load test data on mount
  useEffect(() => {
    const saved = localStorage.getItem('qilly_test_subscriptions');
    if (saved) {
      setTestSuppliers(JSON.parse(saved));
    }
  }, []);

  // Save test data on change
  useEffect(() => {
    if (testSuppliers.length > 0) {
      localStorage.setItem('qilly_test_subscriptions', JSON.stringify(testSuppliers));
    }
  }, [testSuppliers]);

  // ===== 1. PAYMENT TESTING =====
  const simulatePayment = (subscription: TestSubscription, status: PaymentStatus) => {
    const amount = tierPricing[subscription.subscription_tier][subscription.billing_cycle];
    const payment: PaymentRecord = {
      id: `PAY-${Date.now()}`,
      date: new Date().toISOString(),
      amount: subscription.billing_cycle === 'monthly' ? amount : amount / 12,
      status,
      method: subscription.payment_method,
      description: `${subscription.subscription_tier} subscription - ${subscription.billing_cycle}`
    };

    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { 
            ...s, 
            payments: [...(s.payments || []), payment],
            subscription_status: status === 'success' ? 'active' : status === 'failed' ? 'past_due' : s.subscription_status
          } 
        : s
    ));

    toast.success(`Payment ${status}: R${payment.amount.toLocaleString()}`);
    
    // Trigger webhook
    triggerWebhook('payment.' + status, {
      subscription_id: subscription.id,
      payment
    });

    // Send email
    sendEmail(subscription, status === 'success' ? 'payment_success' : 'payment_failed');
  };

  const refundPayment = (subscription: TestSubscription, paymentId: string) => {
    setTestSuppliers(testSuppliers.map(s => {
      if (s.id === subscription.id) {
        const payments = s.payments.map(p => 
          p.id === paymentId ? { ...p, status: 'refunded' as PaymentStatus } : p
        );
        return { ...s, payments };
      }
      return s;
    }));

    toast.success('Payment refunded successfully');
    triggerWebhook('payment.refunded', { subscription_id: subscription.id, payment_id: paymentId });
    sendEmail(subscription, 'refund_processed');
  };

  // ===== 2. BILLING CYCLE TESTING =====
  const advanceBillingDate = (subscription: TestSubscription, days: number) => {
    const currentDate = new Date(subscription.next_billing_date);
    currentDate.setDate(currentDate.getDate() + days);

    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { ...s, next_billing_date: currentDate.toISOString() }
        : s
    ));

    toast.success(`Billing date advanced by ${days} days`);
  };

  const simulateRenewal = (subscription: TestSubscription) => {
    const nextDate = new Date(subscription.next_billing_date);
    
    if (subscription.billing_cycle === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    } else {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
    }

    simulatePayment(subscription, 'success');
    
    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { ...s, next_billing_date: nextDate.toISOString() }
        : s
    ));

    toast.success('Subscription renewed successfully!');
    sendEmail(subscription, 'subscription_renewed');
  };

  const applyGracePeriod = (subscription: TestSubscription) => {
    const graceDate = new Date(subscription.next_billing_date);
    graceDate.setDate(graceDate.getDate() + 3);

    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { 
            ...s, 
            subscription_status: 'past_due',
            next_billing_date: graceDate.toISOString()
          }
        : s
    ));

    toast.warning('Grace period applied (3 days)');
    sendEmail(subscription, 'payment_past_due');
  };

  // ===== 3. SUBSCRIPTION ANALYTICS =====
  const calculateAnalytics = () => {
    const total = testSuppliers.length;
    const active = testSuppliers.filter(s => s.subscription_status === 'active').length;
    const trial = testSuppliers.filter(s => s.subscription_status === 'trial').length;
    const pastDue = testSuppliers.filter(s => s.subscription_status === 'past_due').length;
    const cancelled = testSuppliers.filter(s => s.subscription_status === 'cancelled').length;

    const mrr = testSuppliers.reduce((sum, s) => sum + s.monthlyRevenue, 0);
    const arr = mrr * 12;

    const churnRate = total > 0 ? (cancelled / total) * 100 : 0;
    const avgLTV = mrr > 0 ? (mrr / total) * 24 : 0; // Assuming 24 month lifetime

    // Revenue by tier
    const revenueByTier = {
      free: testSuppliers.filter(s => s.subscription_tier === 'free').length,
      professional: testSuppliers.filter(s => s.subscription_tier === 'professional').length,
      enterprise: testSuppliers.filter(s => s.subscription_tier === 'enterprise').length,
      custom: testSuppliers.filter(s => s.subscription_tier === 'custom').length,
    };

    // Monthly growth (simulated)
    const monthlyData = [
      { month: 'Jan', revenue: mrr * 0.6, subscribers: Math.floor(total * 0.6) },
      { month: 'Feb', revenue: mrr * 0.7, subscribers: Math.floor(total * 0.7) },
      { month: 'Mar', revenue: mrr * 0.8, subscribers: Math.floor(total * 0.8) },
      { month: 'Apr', revenue: mrr * 0.9, subscribers: Math.floor(total * 0.9) },
      { month: 'May', revenue: mrr, subscribers: total },
    ];

    return {
      total,
      active,
      trial,
      pastDue,
      cancelled,
      mrr,
      arr,
      churnRate,
      avgLTV,
      revenueByTier,
      monthlyData
    };
  };

  // ===== 4. EMAIL NOTIFICATIONS TESTING =====
  const sendEmail = (subscription: TestSubscription, type: string) => {
    const emailTemplates: Record<string, { subject: string; content: string }> = {
      trial_expiring: {
        subject: `Your Qilly trial expires in 3 days`,
        content: `Hi ${subscription.companyName},\n\nYour trial period is ending soon. Upgrade to continue accessing premium features.\n\nTrial ends: ${new Date(subscription.next_billing_date).toLocaleDateString()}`
      },
      payment_due: {
        subject: `Payment due for your Qilly subscription`,
        content: `Hi ${subscription.companyName},\n\nYour next payment of R${subscription.monthlyRevenue.toLocaleString()} is due on ${new Date(subscription.next_billing_date).toLocaleDateString()}.`
      },
      payment_failed: {
        subject: `Payment failed for your Qilly subscription`,
        content: `Hi ${subscription.companyName},\n\nWe couldn't process your payment. Please update your payment method to avoid service interruption.`
      },
      payment_success: {
        subject: `Payment received - Thank you!`,
        content: `Hi ${subscription.companyName},\n\nThank you for your payment of R${subscription.monthlyRevenue.toLocaleString()}. Your subscription is active until ${new Date(subscription.next_billing_date).toLocaleDateString()}.`
      },
      subscription_cancelled: {
        subject: `Your Qilly subscription has been cancelled`,
        content: `Hi ${subscription.companyName},\n\nYour subscription has been cancelled. You'll continue to have access until ${new Date(subscription.next_billing_date).toLocaleDateString()}.`
      },
      subscription_renewed: {
        subject: `Your Qilly subscription has been renewed`,
        content: `Hi ${subscription.companyName},\n\nYour ${subscription.subscription_tier} subscription has been renewed. Next billing: ${new Date(subscription.next_billing_date).toLocaleDateString()}.`
      },
      payment_past_due: {
        subject: `Payment overdue - Grace period active`,
        content: `Hi ${subscription.companyName},\n\nYour payment is overdue. We've applied a 3-day grace period. Please update your payment to avoid cancellation.`
      },
      refund_processed: {
        subject: `Refund processed for your Qilly subscription`,
        content: `Hi ${subscription.companyName},\n\nYour refund has been processed and will appear in your account within 5-7 business days.`
      }
    };

    const template = emailTemplates[type] || { subject: 'Notification', content: 'Email content' };
    
    const email: EmailRecord = {
      id: `EMAIL-${Date.now()}`,
      date: new Date().toISOString(),
      type,
      subject: template.subject,
      content: template.content,
      status: 'sent'
    };

    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { ...s, emails: [...(s.emails || []), email] }
        : s
    ));

    toast.success(`Email sent: ${template.subject}`);
  };

  // ===== 5. BULK OPERATIONS =====
  const createBulkSubscriptions = (count: number) => {
    setIsCreating(true);

    const tiers: SubscriptionTier[] = ['free', 'professional', 'enterprise', 'custom'];
    const statuses: SubscriptionStatus[] = ['trial', 'active', 'past_due', 'cancelled'];
    const cycles: BillingCycle[] = ['monthly', 'annual'];
    const methods = ['Credit Card', 'Debit Card', 'EFT', 'PayFast'];

    const newSubscriptions: TestSubscription[] = [];

    for (let i = 0; i < count; i++) {
      const tier = tiers[Math.floor(Math.random() * tiers.length)];
      const cycle = cycles[Math.floor(Math.random() * cycles.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90));

      const nextBilling = new Date(startDate);
      if (cycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      } else {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      }

      const revenue = tierPricing[tier][cycle];

      newSubscriptions.push({
        id: `SUB-${Date.now()}-${i}`,
        companyName: `Test Company ${Date.now()}-${i}`,
        subscription_tier: tier,
        billing_cycle: cycle,
        subscription_status: status,
        subscription_start_date: startDate.toISOString(),
        next_billing_date: nextBilling.toISOString(),
        payment_method: method,
        monthlyRevenue: cycle === 'monthly' ? revenue : revenue / 12,
        payments: [],
        emails: []
      });
    }

    setTestSuppliers([...testSuppliers, ...newSubscriptions]);
    setIsCreating(false);
    toast.success(`Created ${count} test subscriptions`);
  };

  const exportToExcel = () => {
    const data = testSuppliers.map(s => ({
      Company: s.companyName,
      Tier: s.subscription_tier,
      'Billing Cycle': s.billing_cycle,
      Status: s.subscription_status,
      'Start Date': new Date(s.subscription_start_date).toLocaleDateString(),
      'Next Billing': new Date(s.next_billing_date).toLocaleDateString(),
      'Payment Method': s.payment_method,
      'Monthly Revenue': s.monthlyRevenue,
      'Total Payments': s.payments?.length || 0,
      'Emails Sent': s.emails?.length || 0
    }));

    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Subscriptions');
    writeFile(wb, 'qilly-subscriptions-export.xlsx');
    
    toast.success('Exported to Excel');
  };

  // ===== 7. ADVANCED FILTERS & SEARCH =====
  const getFilteredSubscriptions = () => {
    return testSuppliers.filter(s => {
      if (filterTier !== 'all' && s.subscription_tier !== filterTier) return false;
      if (filterStatus !== 'all' && s.subscription_status !== filterStatus) return false;
      if (filterCycle !== 'all' && s.billing_cycle !== filterCycle) return false;
      if (searchQuery && !s.companyName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  // ===== 8. WEBHOOK/INTEGRATION TESTING =====
  const triggerWebhook = (event: string, payload: any) => {
    const webhook: WebhookEvent = {
      id: `WH-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event,
      payload,
      status: Math.random() > 0.1 ? 'success' : 'failed' // 90% success rate
    };

    setWebhookEvents([webhook, ...webhookEvents].slice(0, 50)); // Keep last 50
    
    console.log('📡 Webhook triggered:', webhook);
  };

  // ===== 9. COMPLIANCE & REPORTING =====
  const generateReport = (type: 'revenue' | 'tax' | 'audit') => {
    const analytics = calculateAnalytics();

    if (type === 'revenue') {
      const report = {
        title: 'Revenue Report',
        period: new Date().toLocaleDateString(),
        mrr: analytics.mrr,
        arr: analytics.arr,
        totalSubscribers: analytics.total,
        activeSubscribers: analytics.active,
        churnRate: analytics.churnRate.toFixed(2) + '%',
      };
      
      console.log('📊 Revenue Report:', report);
      toast.success('Revenue report generated');
      
      return report;
    } else if (type === 'tax') {
      const vatRate = 0.15; // 15% VAT in South Africa
      const totalRevenue = analytics.mrr;
      const vatAmount = totalRevenue * vatRate;
      
      const report = {
        title: 'VAT Report',
        period: new Date().toLocaleDateString(),
        totalRevenue,
        vatRate: '15%',
        vatAmount,
        netRevenue: totalRevenue - vatAmount,
      };
      
      console.log('💰 VAT Report:', report);
      toast.success('VAT report generated');
      
      return report;
    } else {
      const report = {
        title: 'Audit Trail',
        totalSubscriptions: analytics.total,
        totalPayments: testSuppliers.reduce((sum, s) => sum + (s.payments?.length || 0), 0),
        totalEmails: testSuppliers.reduce((sum, s) => sum + (s.emails?.length || 0), 0),
        totalWebhooks: webhookEvents.length,
      };
      
      console.log('📋 Audit Report:', report);
      toast.success('Audit report generated');
      
      return report;
    }
  };

  // ===== 10. PRORATION TESTING =====
  const calculateProration = () => {
    const currentPrice = tierPricing[prorationData.currentTier].monthly;
    const newPrice = tierPricing[prorationData.newTier].monthly;
    
    const daysInMonth = prorationData.totalDays;
    const daysRemaining = prorationData.daysRemaining;
    
    const unusedCredit = (currentPrice / daysInMonth) * daysRemaining;
    const newCharge = (newPrice / daysInMonth) * daysRemaining;
    const prorationAmount = newCharge - unusedCredit;
    
    return {
      currentPrice,
      newPrice,
      unusedCredit: Math.round(unusedCredit),
      newCharge: Math.round(newCharge),
      prorationAmount: Math.round(prorationAmount),
      effectiveDate: new Date().toLocaleDateString()
    };
  };

  const applyProration = (subscription: TestSubscription, newTier: SubscriptionTier) => {
    const currentPrice = tierPricing[subscription.subscription_tier].monthly;
    const newPrice = tierPricing[newTier].monthly;
    
    const nextBilling = new Date(subscription.next_billing_date);
    const today = new Date();
    const daysRemaining = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const daysInMonth = 30;
    
    const unusedCredit = (currentPrice / daysInMonth) * daysRemaining;
    const newCharge = (newPrice / daysInMonth) * daysRemaining;
    const prorationAmount = Math.round(newCharge - unusedCredit);
    
    // Create prorated payment
    const payment: PaymentRecord = {
      id: `PAY-PRORATE-${Date.now()}`,
      date: new Date().toISOString(),
      amount: prorationAmount,
      status: 'success',
      method: subscription.payment_method,
      description: `Proration: ${subscription.subscription_tier} → ${newTier} (${daysRemaining} days)`
    };
    
    setTestSuppliers(testSuppliers.map(s => 
      s.id === subscription.id 
        ? { 
            ...s, 
            subscription_tier: newTier,
            monthlyRevenue: tierPricing[newTier].monthly,
            payments: [...(s.payments || []), payment]
          }
        : s
    ));
    
    toast.success(`Proration applied: R${prorationAmount.toLocaleString()}`);
    triggerWebhook('subscription.upgraded', {
      subscription_id: subscription.id,
      from_tier: subscription.subscription_tier,
      to_tier: newTier,
      proration_amount: prorationAmount
    });
    sendEmail(subscription, 'subscription_renewed');
  };

  // Create test supplier
  const createTestSupplier = async () => {
    if (!formData.companyName.trim()) {
      toast.error('Please enter a company name');
      return;
    }

    setIsCreating(true);

    try {
      const startDate = new Date();
      const nextBilling = new Date();
      
      if (formData.billing_cycle === 'monthly') {
        nextBilling.setMonth(nextBilling.getMonth() + 1);
      } else {
        nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      }

      const revenue = tierPricing[formData.subscription_tier][formData.billing_cycle];

      const newTest: TestSubscription = {
        id: `SUB-${Date.now()}`,
        companyName: formData.companyName,
        subscription_tier: formData.subscription_tier,
        billing_cycle: formData.billing_cycle,
        subscription_status: formData.subscription_status,
        subscription_start_date: startDate.toISOString(),
        next_billing_date: nextBilling.toISOString(),
        payment_method: formData.payment_method,
        monthlyRevenue: formData.billing_cycle === 'monthly' ? revenue : revenue / 12,
        payments: [],
        emails: []
      };

      setTestSuppliers([...testSuppliers, newTest]);
      toast.success(`Test supplier "${formData.companyName}" created!`);

      setFormData({
        companyName: '',
        subscription_tier: 'free',
        billing_cycle: 'monthly',
        subscription_status: 'trial',
        payment_method: 'Credit Card',
      });

    } catch (error) {
      console.error('Error creating test supplier:', error);
      toast.error('Failed to create test supplier');
    } finally {
      setIsCreating(false);
    }
  };

  const analytics = calculateAnalytics();
  const filteredSubscriptions = getFilteredSubscriptions();

  const COLORS = ['#00b4d8', '#0077b6', '#023e8a', '#03045e'];

  const getTierBadge = (tier: SubscriptionTier) => {
    const variants = {
      free: { className: 'bg-slate-100 text-slate-700', icon: Shield },
      professional: { className: 'bg-blue-100 text-blue-700', icon: TrendingUp },
      enterprise: { className: 'bg-purple-100 text-purple-700', icon: Sparkles },
      custom: { className: 'bg-amber-100 text-amber-700', icon: DollarSign }
    };

    const { className, icon: Icon } = variants[tier];

    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </Badge>
    );
  };

  const getStatusBadge = (status: SubscriptionStatus) => {
    const variants = {
      active: { className: 'bg-green-500 text-white', icon: CheckCircle2 },
      trial: { className: 'bg-blue-500 text-white', icon: Clock },
      past_due: { className: 'bg-orange-500 text-white', icon: AlertTriangle },
      cancelled: { className: 'bg-gray-500 text-white', icon: XCircle }
    };

    const { className, icon: Icon } = variants[status];

    return (
      <Badge className={className}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Advanced Subscription Testing Dashboard
        </h2>
        <p className="text-gray-600 mt-1">
          Comprehensive testing for payments, billing, analytics, and compliance
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="compliance">Reports</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Total Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">MRR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  R {analytics.mrr.toLocaleString()}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ARR: R {analytics.arr.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{analytics.active}</div>
                <p className="text-xs text-gray-500 mt-1">Trial: {analytics.trial}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600">Churn Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {analytics.churnRate.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Avg LTV: R {Math.round(analytics.avgLTV).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Advanced Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Company name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label>Tier</Label>
                  <Select value={filterTier} onValueChange={setFilterTier}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tiers</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Billing Cycle</Label>
                  <Select value={filterCycle} onValueChange={setFilterCycle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cycles</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setFilterTier('all');
                    setFilterStatus('all');
                    setFilterCycle('all');
                    setSearchQuery('');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                <div className="flex-1" />
                <Button variant="outline" size="sm" onClick={exportToExcel}>
                  <Download className="w-4 h-4 mr-2" />
                  Export to Excel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Bulk Operations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Bulk Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Button onClick={() => createBulkSubscriptions(10)}>
                  Create 10 Random
                </Button>
                <Button onClick={() => createBulkSubscriptions(50)}>
                  Create 50 Random
                </Button>
                <Button onClick={() => createBulkSubscriptions(100)}>
                  Create 100 Random
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setTestSuppliers([]);
                    localStorage.removeItem('qilly_test_subscriptions');
                    toast.success('All test data cleared');
                  }}
                >
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Create Single Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>Create Test Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input
                    id="companyName"
                    placeholder="e.g., Acme Construction"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Tier</Label>
                  <Select
                    value={formData.subscription_tier}
                    onValueChange={(value) => setFormData({ ...formData, subscription_tier: value as SubscriptionTier })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="professional">Professional (R1,999/mo)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (R4,999/mo)</SelectItem>
                      <SelectItem value="custom">Custom (R9,999/mo)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Billing Cycle</Label>
                  <Select
                    value={formData.billing_cycle}
                    onValueChange={(value) => setFormData({ ...formData, billing_cycle: value as BillingCycle })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="annual">Annual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.subscription_status}
                    onValueChange={(value) => setFormData({ ...formData, subscription_status: value as SubscriptionStatus })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trial">Trial</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3">
                  <Button onClick={createTestSupplier} disabled={isCreating} className="w-full">
                    {isCreating ? 'Creating...' : 'Create Test Subscription'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          {filteredSubscriptions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Subscriptions ({filteredSubscriptions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead>Cycle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>MRR</TableHead>
                        <TableHead>Next Billing</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubscriptions.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell className="font-medium">{sub.companyName}</TableCell>
                          <TableCell>{getTierBadge(sub.subscription_tier)}</TableCell>
                          <TableCell className="capitalize">{sub.billing_cycle}</TableCell>
                          <TableCell>{getStatusBadge(sub.subscription_status)}</TableCell>
                          <TableCell className="font-semibold">
                            R {sub.monthlyRevenue.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(sub.next_billing_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubscription(sub);
                                  setShowProrationDialog(true);
                                }}
                                title="Upgrade with proration"
                              >
                                <Calculator className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => simulatePayment(sub, 'success')}
                                title="Process payment"
                              >
                                <DollarSign className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubscription(sub);
                                  setShowEmailDialog(true);
                                }}
                                title="View emails"
                              >
                                <Mail className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ANALYTICS TAB */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#00b4d8" name="Revenue (R)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Subscriber Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="subscribers" fill="#0077b6" name="Subscribers" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue by Tier */}
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions by Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Free', value: analytics.revenueByTier.free },
                        { name: 'Professional', value: analytics.revenueByTier.professional },
                        { name: 'Enterprise', value: analytics.revenueByTier.enterprise },
                        { name: 'Custom', value: analytics.revenueByTier.custom },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2, 3].map((index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Active
                    </span>
                    <span className="font-bold">{analytics.active}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      Trial
                    </span>
                    <span className="font-bold">{analytics.trial}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      Past Due
                    </span>
                    <span className="font-bold">{analytics.pastDue}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-gray-600" />
                      Cancelled
                    </span>
                    <span className="font-bold">{analytics.cancelled}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PAYMENTS TAB */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Testing</CardTitle>
              <CardDescription>Simulate payments, failures, retries, and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredSubscriptions.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Create subscriptions first to test payments
                </p>
              ) : (
                <div className="space-y-4">
                  {filteredSubscriptions.map((sub) => (
                    <Card key={sub.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold">{sub.companyName}</h3>
                            <p className="text-sm text-gray-500">
                              Next payment: R{sub.monthlyRevenue.toLocaleString()} on{' '}
                              {new Date(sub.next_billing_date).toLocaleDateString()}
                            </p>
                          </div>
                          {getTierBadge(sub.subscription_tier)}
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-50 hover:bg-green-100"
                            onClick={() => simulatePayment(sub, 'success')}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Success
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-50 hover:bg-red-100"
                            onClick={() => simulatePayment(sub, 'failed')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Failed
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => simulateRenewal(sub)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Renew
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => applyGracePeriod(sub)}
                          >
                            <Clock className="w-4 h-4 mr-1" />
                            Grace Period
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => advanceBillingDate(sub, 7)}
                          >
                            <Calendar className="w-4 h-4 mr-1" />
                            +7 Days
                          </Button>
                        </div>

                        {/* Payment History */}
                        {sub.payments && sub.payments.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Payment History</h4>
                            <div className="space-y-1">
                              {sub.payments.slice(0, 3).map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {new Date(payment.date).toLocaleDateString()} - R{payment.amount.toLocaleString()}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      className={
                                        payment.status === 'success' ? 'bg-green-500' :
                                        payment.status === 'failed' ? 'bg-red-500' :
                                        payment.status === 'refunded' ? 'bg-gray-500' :
                                        'bg-yellow-500'
                                      }
                                    >
                                      {payment.status}
                                    </Badge>
                                    {payment.status === 'success' && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => refundPayment(sub, payment.id)}
                                      >
                                        Refund
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* EMAILS TAB */}
        <TabsContent value="emails" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications Testing</CardTitle>
              <CardDescription>Test automated email triggers and templates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {filteredSubscriptions.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => sendEmail(filteredSubscriptions[0], 'trial_expiring')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Trial Expiring
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sendEmail(filteredSubscriptions[0], 'payment_due')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Payment Due
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sendEmail(filteredSubscriptions[0], 'payment_failed')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Payment Failed
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => sendEmail(filteredSubscriptions[0], 'subscription_cancelled')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Cancelled
                    </Button>
                  </>
                )}
              </div>

              {/* Email History */}
              <div className="space-y-3">
                <h3 className="font-semibold">Recent Emails</h3>
                {testSuppliers.flatMap(s => (s.emails || []).map(e => ({ ...e, company: s.companyName })))
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((email) => (
                    <Card key={email.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="font-semibold">{email.subject}</span>
                              <Badge className={email.status === 'sent' ? 'bg-green-500' : 'bg-red-500'}>
                                {email.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">
                              To: {email.company} • {new Date(email.date).toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{email.content}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              try {
                                const textArea = document.createElement('textarea');
                                textArea.value = email.content;
                                textArea.style.position = 'fixed';
                                textArea.style.left = '-999999px';
                                textArea.style.top = '-999999px';
                                document.body.appendChild(textArea);
                                textArea.focus();
                                textArea.select();
                                const successful = document.execCommand('copy');
                                document.body.removeChild(textArea);
                                if (successful) {
                                  toast.success('Email copied to clipboard');
                                } else {
                                  toast.error('Copy failed. Please copy manually.');
                                }
                              } catch (err) {
                                toast.error('Copy failed. Please copy manually.');
                              }
                            }}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WEBHOOKS TAB */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Testing</CardTitle>
              <CardDescription>Simulate webhook events and integration testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2 mb-4">
                  <Button
                    size="sm"
                    onClick={() => triggerWebhook('subscription.created', { id: 'test', tier: 'professional' })}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Subscription Created
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => triggerWebhook('subscription.updated', { id: 'test', changes: ['tier'] })}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Subscription Updated
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => triggerWebhook('payment.success', { amount: 1999 })}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Payment Success
                  </Button>
                </div>

                <h3 className="font-semibold">Webhook Event Log ({webhookEvents.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {webhookEvents.map((webhook) => (
                    <Card key={webhook.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-4 h-4 text-blue-500" />
                              <span className="font-mono text-sm font-semibold">{webhook.event}</span>
                              <Badge className={webhook.status === 'success' ? 'bg-green-500' : 'bg-red-500'}>
                                {webhook.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">
                              {new Date(webhook.timestamp).toLocaleString()}
                            </p>
                            <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                              {JSON.stringify(webhook.payload, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPLIANCE TAB */}
        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance & Reporting</CardTitle>
              <CardDescription>Generate reports for revenue, tax, and audit compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    const report = generateReport('revenue');
                    console.table(report);
                  }}
                >
                  <BarChart3 className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Revenue Report</div>
                    <div className="text-xs text-gray-500">MRR, ARR, Churn</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    const report = generateReport('tax');
                    console.table(report);
                  }}
                >
                  <Percent className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">VAT Report</div>
                    <div className="text-xs text-gray-500">15% South African VAT</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center gap-2"
                  onClick={() => {
                    const report = generateReport('audit');
                    console.table(report);
                  }}
                >
                  <FileText className="w-8 h-8" />
                  <div className="text-center">
                    <div className="font-semibold">Audit Trail</div>
                    <div className="text-xs text-gray-500">All Activities</div>
                  </div>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">
                    {testSuppliers.reduce((sum, s) => sum + (s.payments?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Payments</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">
                    {testSuppliers.reduce((sum, s) => sum + (s.emails?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Emails Sent</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">{webhookEvents.length}</div>
                  <div className="text-sm text-gray-600">Webhook Events</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded">
                  <div className="text-2xl font-bold">
                    R{Math.round(analytics.mrr * 0.15).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">VAT (15%)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Proration Calculator */}
          <Card>
            <CardHeader>
              <CardTitle>Proration Calculator</CardTitle>
              <CardDescription>Calculate prorated charges for mid-cycle upgrades/downgrades</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Current Tier</Label>
                  <Select
                    value={prorationData.currentTier}
                    onValueChange={(value) => setProrationData({ ...prorationData, currentTier: value as SubscriptionTier })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>New Tier</Label>
                  <Select
                    value={prorationData.newTier}
                    onValueChange={(value) => setProrationData({ ...prorationData, newTier: value as SubscriptionTier })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Days Remaining</Label>
                  <Input
                    type="number"
                    value={prorationData.daysRemaining}
                    onChange={(e) => setProrationData({ ...prorationData, daysRemaining: parseInt(e.target.value) })}
                  />
                </div>

                <div>
                  <Label>Total Days</Label>
                  <Input
                    type="number"
                    value={prorationData.totalDays}
                    onChange={(e) => setProrationData({ ...prorationData, totalDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              {(() => {
                const calc = calculateProration();
                return (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Proration Breakdown</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>Current Price:</div>
                      <div className="font-semibold">R{calc.currentPrice.toLocaleString()}/month</div>
                      
                      <div>New Price:</div>
                      <div className="font-semibold">R{calc.newPrice.toLocaleString()}/month</div>
                      
                      <div>Unused Credit:</div>
                      <div className="text-green-600 font-semibold">-R{calc.unusedCredit.toLocaleString()}</div>
                      
                      <div>New Charge:</div>
                      <div className="font-semibold">R{calc.newCharge.toLocaleString()}</div>
                      
                      <div className="text-lg pt-2 border-t">Amount to Charge:</div>
                      <div className="text-lg font-bold pt-2 border-t text-blue-600">
                        R{calc.prorationAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Proration Dialog */}
      <Dialog open={showProrationDialog} onOpenChange={setShowProrationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade with Proration</DialogTitle>
            <DialogDescription>
              {selectedSubscription?.companyName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label>Select New Tier</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {(['professional', 'enterprise', 'custom'] as SubscriptionTier[]).map((tier) => (
                  <Button
                    key={tier}
                    variant="outline"
                    onClick={() => {
                      if (selectedSubscription) {
                        applyProration(selectedSubscription, tier);
                        setShowProrationDialog(false);
                      }
                    }}
                    disabled={selectedSubscription?.subscription_tier === tier}
                  >
                    {tier.charAt(0).toUpperCase() + tier.slice(1)}
                    <br />
                    <span className="text-xs">
                      R{tierPricing[tier].monthly.toLocaleString()}/mo
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
