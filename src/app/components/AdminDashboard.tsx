import { TestingGuidelines } from '@/app/components/TestingGuidelines';
import { SubscriptionTesting } from '@/app/components/SubscriptionTesting';
import { PaymentMethodComparison } from '@/app/components/PaymentMethodComparison';
import { PaymentVerification } from '@/app/components/PaymentVerification';
import { PaymentAudit } from '@/app/components/PaymentAudit';
import { DeveloperTools } from '@/app/components/DeveloperTools';
import { PerformanceTestLauncher } from '@/app/components/PerformanceTestLauncher';
import { PerformanceTestModal } from '@/app/components/PerformanceTestModal';
import { UIAutomationLauncher } from '@/app/components/UIAutomationLauncher';
import { UIAutomationModal } from '@/app/components/UIAutomationModal';
import { EnvironmentSwitcher } from '@/app/components/EnvironmentSwitcher';
import { DocumentationDownload } from '@/app/components/DocumentationDownload';
import { DatabaseSetup } from '@/app/components/DatabaseSetup';
import { SupplierIntegration } from '@/app/components/SupplierIntegration';
import { PaymentIntegration } from '@/app/components/PaymentIntegration';
import { UserSessionViewer } from '@/app/components/UserSessionViewer';
import { ETenderInvestorBrief } from '@/app/components/ETenderInvestorBrief';
import { PartnerApplicationManagement } from '@/app/components/PartnerApplicationManagement';
import { CapitalRaisingGuide } from '@/app/components/CapitalRaisingGuide';
import { SupplierLegalAudit } from '@/app/components/SupplierLegalAudit';
import { SupplierCoverageCompliance } from '@/app/components/SupplierCoverageCompliance';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { supplierDataLayer, Supplier } from '@/utils/supplierDataLayer';
import { EnvironmentBadge } from '@/app/components/EnvironmentBadge';
import { DatabaseInspector } from '@/app/components/DatabaseInspector';
import { SupplierPricingTiers } from '@/app/components/SupplierPricingTiers';
import { SupplierEngagement } from '@/app/components/SupplierEngagement';
import { ProposalPage } from '@/app/components/ProposalPage';
import { DeploymentResources } from '@/app/components/DeploymentResources';
import { SupplierVisibilityDiagnostic } from '@/app/components/SupplierVisibilityDiagnostic';
import { getEnvironmentConfig, getEnvironmentDisplay, getCurrentEnvironment } from '@/utils/environment';
import { getSupabaseConfig } from '@/utils/supabase/info';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Package,
  User,
  LogOut,
  Search,
  Filter,
  Eye,
  AlertCircle,
  Database,
  DollarSign,
  FileText,
  Users,
  Rocket,
  ClipboardCheck,
  CreditCard,
  Settings,
  BookOpen,
  Network,
  Handshake
} from 'lucide-react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';

interface AdminDashboardProps {
  onLogout: () => void;
  onCapitalRaising?: () => void;
}

// Admin Dashboard - Manage supplier and contractor applications
export function AdminDashboard({ onLogout, onCapitalRaising }: AdminDashboardProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [contractors, setContractors] = useState<any[]>([]);
  const [filteredContractors, setFilteredContractors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedContractor, setSelectedContractor] = useState<any | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showContractorDialog, setShowContractorDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [contractorSearchTerm, setContractorSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [contractorStatusFilter, setContractorStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [activeAdminTab, setActiveAdminTab] = useState<'suppliers' | 'contractors' | 'database' | 'billing' | 'payments' | 'engagement' | 'proposal' | 'deployment' | 'documentation' | 'testing' | 'subscriptions' | 'devtools' | 'settings' | 'supplier-api' | 'payment-gateway' | 'user-session' | 'etender' | 'partners' | 'capital-raising' | 'legal-audit' | 'coverage'>('suppliers');
  const [showPerformanceTest, setShowPerformanceTest] = useState(false);
  const [showUIAutomation, setShowUIAutomation] = useState(false);

  // Get environment config
  const envConfig = getEnvironmentConfig();
  const envDisplay = getEnvironmentDisplay();

  useEffect(() => {
    // Log environment details on admin dashboard load
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔧 ADMIN DASHBOARD - ENVIRONMENT DETECTION');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Current Environment:', envDisplay.name, envDisplay.icon);
    console.log('Environment Type:', envConfig.environment);
    console.log('Database Mode:', envConfig.useRealDatabase ? 'Real (Supabase)' : 'localStorage');
    console.log('API URL:', envConfig.apiUrl || 'localStorage (Demo Mode)');
    console.log('Dev Tools Visible:', envConfig.showDevTools);
    console.log('Testing Tabs Visible:', envConfig.showTestingTabs);
    
    // Check for localStorage override
    const localStorageEnv = localStorage.getItem('qilly_environment');
    if (localStorageEnv) {
      console.log('⚠️ ENVIRONMENT OVERRIDE DETECTED in localStorage:', localStorageEnv);
      console.log('💡 To use default environment, go to Settings tab and click "Reset to Default Environment"');
    }
    
    // Get Supabase URL from the proper config (not env vars which don't exist in Figma Make)
    const currentEnv = getCurrentEnvironment();
    const supabaseConfig = getSupabaseConfig(currentEnv);
    const supabaseUrl = supabaseConfig.projectUrl;
    console.log('Supabase URL:', supabaseUrl);
    
    if (supabaseUrl?.includes('zzdzrlglivtpawtitvgu')) {
      console.log('📊 Connected to: DEVELOPMENT database (zzdzrlglivtpawtitvgu)');
    } else if (supabaseUrl?.includes('kcptusoevqapcvptlgkd')) {
      console.log('📊 Connected to: SIT database (kcptusoevqapcvptlgkd)');
    } else {
      console.log('📊 Connected to: Unknown database');
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }, []);

  useEffect(() => {
    loadSuppliers();
    loadContractors();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [suppliers, searchTerm, statusFilter]);

  useEffect(() => {
    filterContractors();
  }, [contractors, contractorSearchTerm, contractorStatusFilter]);

  // Show notification on load if there are pending contractors
  useEffect(() => {
    if (!isLoading && contractors.length > 0) {
      const pendingCount = contractors.filter(c => c.status === 'pending').length;
      if (pendingCount > 0) {
        toast.info(`You have ${pendingCount} pending contractor${pendingCount > 1 ? 's' : ''} awaiting approval`, {
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => {
              setActiveAdminTab('contractors');
              setContractorStatusFilter('pending');
            }
          }
        });
      }
    }
  }, [isLoading]); // Only run when loading finishes, not on count changes

  const loadSuppliers = async () => {
    setIsLoading(true);
    
    try {
      // Fetch suppliers from Supabase database
      const { data: suppliersData, error: suppliersError } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (suppliersError) {
        console.error('Error loading suppliers:', suppliersError);
        toast.error('Failed to load suppliers from database');
        setSuppliers([]);
      } else {
        console.log('✅ Loaded suppliers from Supabase:', suppliersData?.length || 0);
        setSuppliers(suppliersData || []);
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);
      toast.error('Failed to load suppliers');
      setSuppliers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadContractors = async () => {
    setIsLoading(true);
    
    try {
      console.log('🔍 AdminDashboard: Loading contractors from Supabase...');
      
      // Fetch contractors from Supabase database
      const { data: contractorsData, error: contractorsError } = await supabase
        .from('contractors')
        .select('*')
        .order('created_at', { ascending: false });

      if (contractorsError) {
        console.error('❌ Error loading contractors:', contractorsError);
        console.error('❌ Error details:', JSON.stringify(contractorsError, null, 2));
        toast.error('Failed to load contractors from database');
        setContractors([]);
      } else {
        console.log('✅ Loaded contractors from Supabase:', contractorsData?.length || 0);
        if (contractorsData && contractorsData.length > 0) {
          console.log('✅ First contractor:', JSON.stringify(contractorsData[0], null, 2));
          console.log('✅ All contractor emails:', contractorsData.map(c => c.email));
        }
        setContractors(contractorsData || []);
      }
    } catch (err) {
      console.error('❌ Exception loading contractors:', err);
      toast.error('Failed to load contractors');
      setContractors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = suppliers;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        (s.company_name && s.company_name.toLowerCase().includes(term)) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.province && s.province.toLowerCase().includes(term))
      );
    }

    setFilteredSuppliers(filtered);
  };

  const filterContractors = () => {
    let filtered = contractors;

    // Filter by status
    if (contractorStatusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === contractorStatusFilter);
    }

    // Filter by search term
    if (contractorSearchTerm) {
      const term = contractorSearchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        (s.company_name && s.company_name.toLowerCase().includes(term)) ||
        (s.contact_person && s.contact_person.toLowerCase().includes(term)) ||
        (s.email && s.email.toLowerCase().includes(term)) ||
        (s.province && s.province.toLowerCase().includes(term))
      );
    }

    setFilteredContractors(filtered);
  };

  const handleApprove = async (supplier: Supplier) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('suppliers')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', supplier.id);

      if (error) throw error;

      // Update local state
      const updatedSuppliers = suppliers.map(s =>
        s.id === supplier.id ? { ...s, status: 'approved' as const, approved_at: new Date().toISOString() } : s
      );
      setSuppliers(updatedSuppliers);

      toast.success(`${supplier.company_name} has been approved!`);
      setShowDetailsDialog(false);
      
      // Reload suppliers to ensure we have latest data
      loadSuppliers();
    } catch (err) {
      console.error('Error approving supplier:', err);
      toast.error('Failed to approve supplier');
    }
  };

  const handleReject = async (supplier: Supplier) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('suppliers')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', supplier.id);

      if (error) throw error;

      // Update local state
      const updatedSuppliers = suppliers.map(s =>
        s.id === supplier.id ? { ...s, status: 'rejected' as const, rejected_at: new Date().toISOString() } : s
      );
      setSuppliers(updatedSuppliers);

      toast.success(`${supplier.company_name} has been rejected`);
      setShowDetailsDialog(false);
      
      // Reload suppliers to ensure we have latest data
      loadSuppliers();
    } catch (err) {
      console.error('Error rejecting supplier:', err);
      toast.error('Failed to reject supplier');
    }
  };

  const viewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsDialog(true);
  };

  const handleApproveContractor = async (contractor: any) => {
    try {
      // Update in Supabase — set both status AND payment_approved so the
      // contractor can pass both login gates in AuthForm.tsx
      const { error } = await supabase
        .from('contractors')
        .update({ 
          status: 'approved',
          payment_approved: true,        // ← critical: allows login for manual-EFT contractors
          approved_at: new Date().toISOString()
        })
        .eq('id', contractor.id);

      if (error) {
        console.error('Error approving contractor:', error);
        throw error;
      }

      console.log('✅ Contractor approved in Supabase');
      
      // ✅ Contractors start with FREE tier + Free Training
      // Subscription tier is set during sign-up
      // They can upgrade to paid tiers later through the upgrade modal

      // Update local state
      const updatedContractors = contractors.map(c =>
        c.id === contractor.id ? { ...c, status: 'approved', approved_at: new Date().toISOString() } : c
      );
      setContractors(updatedContractors);

      toast.success(
        `${contractor.company_name} approved! Payment verified ✓  ` +
        `Status: Approved. They can now login with ${contractor.subscription_tier?.toUpperCase() || 'FREE'} tier access.`
      );
      setShowContractorDialog(false);
      
      // Switch filter to 'all' to show the newly approved contractor
      // This prevents the contractor from "disappearing" when viewing 'pending' filter
      if (contractorStatusFilter === 'pending') {
        setContractorStatusFilter('all');
      }
      
      // Reload contractors to ensure we have latest data
      await loadContractors();
    } catch (err) {
      console.error('Error approving contractor:', err);
      toast.error('Failed to approve contractor. Please check the console for details.');
    }
  };

  const handleRejectContractor = async (contractor: any) => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from('contractors')
        .update({ 
          status: 'rejected',
          rejected_at: new Date().toISOString()
        })
        .eq('id', contractor.id);

      if (error) {
        console.error('Error rejecting contractor:', error);
        throw error;
      }

      console.log('✅ Contractor rejected in Supabase');

      // Update local state
      const updatedContractors = contractors.map(c =>
        c.id === contractor.id ? { ...c, status: 'rejected', rejected_at: new Date().toISOString() } : c
      );
      setContractors(updatedContractors);

      toast.success(`${contractor.company_name} has been rejected`);
      setShowContractorDialog(false);
      
      // Switch filter to 'all' to show the newly rejected contractor
      // This prevents the contractor from "disappearing" when viewing 'pending' filter
      if (contractorStatusFilter === 'pending') {
        setContractorStatusFilter('all');
      }
      
      // Reload contractors to ensure we have latest data
      await loadContractors();
    } catch (err) {
      console.error('Error rejecting contractor:', err);
      toast.error('Failed to reject contractor. Please check the console for details.');
    }
  };

  const viewContractorDetails = (contractor: any) => {
    setSelectedContractor(contractor);
    setShowContractorDialog(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300"><CheckCircle className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'free':
        return <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-300">Free</Badge>;
      case 'professional':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Professional</Badge>;
      case 'enterprise':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">Enterprise</Badge>;
      case 'custom':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">Custom</Badge>;
      default:
        return <Badge variant="outline">{tier || 'Free'}</Badge>;
    }
  };

  const stats = {
    total: suppliers.length,
    pending: suppliers.filter(s => s.status === 'pending').length,
    approved: suppliers.filter(s => s.status === 'approved').length,
    rejected: suppliers.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-blue-500" />
              Admin Dashboard
            </h1>
            <p className="text-slate-600 flex items-center gap-2">
              Manage supplier registrations and approvals
              <EnvironmentBadge />
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onCapitalRaising && (
              <Button
                variant="outline"
                onClick={onCapitalRaising}
                className="flex items-center gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                <span className="text-sm">💰</span>
                <span className="hidden sm:inline">Capital Raising</span>
              </Button>
            )}
            <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-sm text-slate-600">Total Suppliers</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-sm text-slate-600">Pending Review</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-sm text-slate-600">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                <p className="text-sm text-slate-600">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeAdminTab} onValueChange={(value) => setActiveAdminTab(value as 'suppliers' | 'contractors' | 'database' | 'billing' | 'payments' | 'engagement' | 'etender' | 'partners' | 'proposal' | 'deployment' | 'documentation' | 'testing' | 'subscriptions' | 'devtools' | 'settings' | 'supplier-api' | 'payment-gateway' | 'user-session' | 'capital-raising' | 'legal-audit' | 'coverage')} className="w-full">
          <TabsList className="w-full mb-6 flex flex-wrap gap-1 h-auto">
            {/* Always visible tabs */}
            <TabsTrigger value="suppliers" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Suppliers</span>
            </TabsTrigger>
            
            <TabsTrigger value="contractors" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Contractors</span>
              {contractors.filter(c => c.status === 'pending').length > 0 && (
                <Badge className="ml-1 bg-red-600 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem] h-5">
                  {contractors.filter(c => c.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            
            {/* Database - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="hidden sm:inline">Database</span>
              </TabsTrigger>
            )}
            
            {/* Supplier API Integration - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="supplier-api" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Supplier API</span>
              </TabsTrigger>
            )}
            
            {/* Payment Gateway - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="payment-gateway" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Pay Gateway</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
              {contractors.filter(c => (c.payment_method === 'bank_transfer' || c.payment_method === 'manual') && c.status === 'pending').length > 0 && (
                <Badge className="bg-amber-500 text-white text-xs px-1.5 py-0 ml-1 min-w-[18px] flex items-center justify-center">
                  {contractors.filter(c => (c.payment_method === 'bank_transfer' || c.payment_method === 'manual') && c.status === 'pending').length}
                </Badge>
              )}
            </TabsTrigger>
            
            {/* Subs Test - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span className="hidden sm:inline">Subs Test</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Engagement</span>
            </TabsTrigger>
            <TabsTrigger value="etender" className="flex items-center gap-2">
              <Network className="w-4 h-4" />
              <span className="hidden sm:inline">eTender</span>
            </TabsTrigger>
            <TabsTrigger value="partner-apps" className="flex items-center gap-2">
              <Handshake className="w-4 h-4" />
              <span className="hidden sm:inline">Partner Apps</span>
              <Badge className="ml-1 bg-yellow-500 text-white text-[10px] px-1.5 py-0.5">3</Badge>
            </TabsTrigger>
            <TabsTrigger value="proposal" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Proposal</span>
            </TabsTrigger>
            <TabsTrigger value="deployment" className="flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Deploy</span>
            </TabsTrigger>
            
            <TabsTrigger value="documentation" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Docs</span>
            </TabsTrigger>
            
            {/* Testing - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="testing" className="flex items-center gap-2">
                <ClipboardCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Testing</span>
              </TabsTrigger>
            )}
            
            {/* Dev Tools - Hidden in staging and production */}
            {envConfig.showDevTools && (
              <TabsTrigger value="devtools" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Dev Tools</span>
              </TabsTrigger>
            )}
            
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
            
            {/* User Session - Hidden in production */}
            {envConfig.showTestingTabs && (
              <TabsTrigger value="user-session" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">User Session</span>
              </TabsTrigger>
            )}

            {/* Capital Raising — always visible to admin */}
            <TabsTrigger value="capital-raising" className="flex items-center gap-2 text-amber-600 data-[state=active]:text-amber-700 data-[state=active]:bg-amber-50">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Capital</span>
            </TabsTrigger>

            {/* Legal Audit — always visible to admin */}
            <TabsTrigger value="legal-audit" className="flex items-center gap-2 text-slate-600 data-[state=active]:text-slate-800 data-[state=active]:bg-slate-50">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Legal</span>
            </TabsTrigger>

            {/* Coverage & Compliance */}
            <TabsTrigger value="coverage" className="flex items-center gap-2 text-teal-600 data-[state=active]:text-teal-800 data-[state=active]:bg-teal-50">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">Coverage</span>
            </TabsTrigger>
          </TabsList>

          {/* Suppliers Tab Content */}
          <TabsContent value="suppliers" className="space-y-6">
        {/* Diagnostic Tool - Remove this after fixing */}
        {envConfig.showDevTools && (
          <SupplierVisibilityDiagnostic />
        )}
        
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search by company, contact, email, or province..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  size="sm"
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('pending')}
                  size="sm"
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === 'approved' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('approved')}
                  size="sm"
                >
                  Approved
                </Button>
                <Button
                  variant={statusFilter === 'rejected' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('rejected')}
                  size="sm"
                >
                  Rejected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suppliers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Applications</CardTitle>
            <CardDescription>Review and manage supplier registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-600">Loading suppliers...</p>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">No suppliers found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Province</TableHead>
                      <TableHead>Tier</TableHead>
                      <TableHead>Categories</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell className="font-medium">{supplier.company_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{supplier.contact_person}</div>
                            <div className="text-gray-500">{supplier.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.province}</TableCell>
                        <TableCell>{getTierBadge(supplier.subscription_tier || 'free')}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {supplier.product_categories?.slice(0, 2).join(', ') || 'N/A'}
                            {supplier.product_categories && supplier.product_categories.length > 2 && ` +${supplier.product_categories.length - 2}`}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(supplier.status)}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(supplier.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewDetails(supplier)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        {selectedSupplier && (
          <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-2">
                  <Building2 className="w-6 h-6" />
                  {selectedSupplier.company_name}
                </DialogTitle>
                <DialogDescription>
                  Supplier Application Details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <Label className="text-sm font-semibold">Status</Label>
                  <div className="mt-2">{getStatusBadge(selectedSupplier.status)}</div>
                </div>

                {/* Subscription Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Subscription Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500">Package Tier</Label>
                      <div className="mt-1">{getTierBadge(selectedSupplier.subscription_tier || 'free')}</div>
                    </div>
                    <div>
                      <Label className="text-gray-500">Billing Cycle</Label>
                      <p className="capitalize">{selectedSupplier.billing_cycle || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Subscription Status</Label>
                      <p className="capitalize">{selectedSupplier.subscription_status || 'N/A'}</p>
                    </div>
                    {selectedSupplier.next_billing_date && (
                      <div>
                        <Label className="text-gray-500">Next Billing Date</Label>
                        <p>{new Date(selectedSupplier.next_billing_date).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500">Registration Number</Label>
                      <p>{selectedSupplier.registration_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">VAT Number</Label>
                      <p>{selectedSupplier.vat_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Years in Business</Label>
                      <p>{selectedSupplier.years_in_business || 0} years</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">BBBEE Level</Label>
                      <p>{selectedSupplier.bbbee_level || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-gray-500">Contact Person</Label>
                      <p>{selectedSupplier.contact_person}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Email</Label>
                      <p>{selectedSupplier.email}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">Phone</Label>
                      <p>{selectedSupplier.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </h3>
                  <div className="text-sm">
                    <p>{selectedSupplier.street_address}</p>
                    <p>{selectedSupplier.city}, {selectedSupplier.province} {selectedSupplier.postal_code}</p>
                  </div>
                </div>

                {/* Product Categories */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Product Categories
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.product_categories && selectedSupplier.product_categories.length > 0 ? (
                      selectedSupplier.product_categories.map((category) => (
                        <Badge key={category} variant="secondary">{category}</Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No categories listed</p>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Certifications
                  </h3>
                  <div className="text-sm">
                    {selectedSupplier.has_certification ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Has Industry Certifications
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                        No Certifications Listed
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2">
                {selectedSupplier.status === 'pending' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleReject(selectedSupplier)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedSupplier)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  </>
                )}
                {selectedSupplier.status !== 'pending' && (
                  <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                    Close
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
          </TabsContent>

          {/* Contractors Tab Content */}
          <TabsContent value="contractors" className="space-y-6">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search contractors by company name..."
                      value={contractorSearchTerm}
                      onChange={(e) => setContractorSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select value={contractorStatusFilter} onValueChange={(value: any) => setContractorStatusFilter(value)}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Contractors Table */}
            <Card>
              <CardHeader>
                <CardTitle>Contractor Applications</CardTitle>
                <CardDescription>Review and manage contractor registrations</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading contractors...</p>
                  </div>
                ) : filteredContractors.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600">No contractors found</p>
                    <p className="text-sm text-slate-500 mt-2">
                      {contractorSearchTerm || contractorStatusFilter !== 'all' 
                        ? 'Try adjusting your filters' 
                        : 'No contractor applications yet'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px]">Company</TableHead>
                          <TableHead className="min-w-[140px]">Contact</TableHead>
                          <TableHead className="hidden md:table-cell min-w-[100px]">Province</TableHead>
                          <TableHead className="hidden lg:table-cell min-w-[100px]">CIDB Grade</TableHead>
                          <TableHead className="min-w-[90px]">Status</TableHead>
                          <TableHead className="hidden sm:table-cell min-w-[130px]">Payment</TableHead>
                          <TableHead className="hidden xl:table-cell min-w-[90px]">Submitted</TableHead>
                          <TableHead className="min-w-[80px] text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredContractors.map((contractor) => (
                          <TableRow
                            key={contractor.id}
                            className={(contractor.payment_method === 'bank_transfer' || contractor.payment_method === 'manual') && contractor.status === 'pending'
                              ? 'bg-amber-50 hover:bg-amber-100'
                              : ''}
                          >
                            <TableCell className="font-medium max-w-[150px] truncate">{contractor.company_name}</TableCell>
                            <TableCell className="max-w-[140px]">
                              <div className="text-sm truncate">
                                <div className="truncate">{contractor.contact_person}</div>
                                <div className="text-gray-500 truncate text-xs">{contractor.email}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell truncate">{contractor.province}</TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <Badge variant="outline" className="text-xs">
                                {contractor.cidb_grade || 'N/A'}
                              </Badge>
                            </TableCell>
                            {/* Account status */}
                            <TableCell>{getStatusBadge(contractor.status)}</TableCell>
                            {/* Payment status — how paid and whether verified */}
                            <TableCell className="hidden sm:table-cell">
                              {!contractor.subscription_tier || contractor.subscription_tier === 'free' ? (
                                <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500">FREE</Badge>
                              ) : contractor.payment_method === 'stitch' ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">⚡ Stitch Auto ✓</Badge>
                              ) : contractor.payment_method === 'payfast' ? (
                                <Badge className="bg-green-100 text-green-800 border border-green-300 text-xs">💳 PayFast Auto ✓</Badge>
                              ) : (contractor.payment_method === 'bank_transfer' || contractor.payment_method === 'manual') && contractor.status === 'pending' ? (
                                <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs">🏦 EFT Pending ⚠️</Badge>
                              ) : (contractor.payment_method === 'bank_transfer' || contractor.payment_method === 'manual') && contractor.status === 'approved' ? (
                                <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">🏦 EFT Verified ✓</Badge>
                              ) : (
                                <Badge variant="outline" className="text-xs">—</Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden xl:table-cell text-sm text-gray-500">
                              {new Date(contractor.created_at).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewContractorDetails(contractor)}
                                className="h-8 px-2"
                              >
                                <Eye className="w-4 h-4" />
                                <span className="ml-1 hidden xl:inline">View</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contractor Details Dialog */}
            {selectedContractor && (
              <Dialog open={showContractorDialog} onOpenChange={setShowContractorDialog}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Building2 className="w-6 h-6" />
                      {selectedContractor.company_name}
                    </DialogTitle>
                    <DialogDescription>
                      Contractor Application Details
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Status + Payment Status */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-semibold">Account Status</Label>
                        <div className="mt-2">{getStatusBadge(selectedContractor.status)}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold">Payment Status</Label>
                        <div className="mt-2">
                          {selectedContractor.payment_method === 'stitch' ? (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">⚡ Stitch — Auto-Approved ✓</Badge>
                          ) : selectedContractor.payment_method === 'payfast' ? (
                            <Badge className="bg-green-100 text-green-800 border border-green-300">💳 PayFast — Auto-Approved ✓</Badge>
                          ) : (selectedContractor.payment_method === 'bank_transfer' || selectedContractor.payment_method === 'manual') && selectedContractor.status === 'pending' ? (
                            <Badge className="bg-amber-100 text-amber-800 border border-amber-300">🏦 EFT — Awaiting Verification ⚠️</Badge>
                          ) : (selectedContractor.payment_method === 'bank_transfer' || selectedContractor.payment_method === 'manual') && selectedContractor.status === 'approved' ? (
                            <Badge className="bg-blue-100 text-blue-800 border border-blue-300">🏦 EFT — Admin Verified ✓</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-500">
                              {(!selectedContractor.subscription_tier || selectedContractor.subscription_tier === 'free')
                                ? 'FREE — No payment required'
                                : '—'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Payment Details (only for paid tiers) */}
                    {selectedContractor.subscription_tier && selectedContractor.subscription_tier !== 'free' && (
                      <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                        <h3 className="font-semibold flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4" />
                          Payment Details
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <Label className="text-gray-500 text-xs">Tier</Label>
                            <div className="mt-1">{getTierBadge(selectedContractor.subscription_tier)}</div>
                          </div>
                          <div>
                            <Label className="text-gray-500 text-xs">Amount</Label>
                            <p className="font-bold text-blue-600 text-base">
                              {selectedContractor.payment_amount ? `R${Number(selectedContractor.payment_amount).toLocaleString()}` : '—'}
                            </p>
                          </div>
                          <div className="col-span-2">
                            <Label className="text-gray-500 text-xs">Payment Reference</Label>
                            <p className="font-mono bg-white border rounded px-2 py-1 text-sm mt-1">
                              {selectedContractor.payment_reference || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Company Information */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Company Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-500">Years in Business</Label>
                          <p>{selectedContractor.years_in_business || 0} years</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Annual Turnover</Label>
                          <p>
                            {selectedContractor.annual_turnover 
                              ? `R${(selectedContractor.annual_turnover / 1000000).toFixed(1)}M` 
                              : 'Not provided'}
                          </p>
                        </div>
                        <div>
                          <Label className="text-gray-500">BBBEE Level</Label>
                          <p>{selectedContractor.bbbee_level || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Has Certification</Label>
                          <p>{selectedContractor.has_certification ? 'Yes' : 'No'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">CIDB Registration</Label>
                          <p>{selectedContractor.cidb_registration_number || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">CIDB Grade</Label>
                          <p>{selectedContractor.cidb_grade || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Contact Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-gray-500">Contact Person</Label>
                          <p>{selectedContractor.contact_person}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Email</Label>
                          <p>{selectedContractor.email}</p>
                        </div>
                        <div>
                          <Label className="text-gray-500">Phone</Label>
                          <p>{selectedContractor.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-3">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Address
                      </h3>
                      <div className="text-sm">
                        <p>{selectedContractor.street_address}</p>
                        <p>{selectedContractor.city}, {selectedContractor.province} {selectedContractor.postal_code}</p>
                      </div>
                    </div>

                    {/* Construction Specializations */}
                    {selectedContractor.specializations && selectedContractor.specializations.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Construction Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedContractor.specializations.map((spec: string) => (
                            <Badge key={spec} variant="secondary">{spec}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons — shown for ANY contractor with status=pending */}
                    {selectedContractor.status === 'pending' && (
                      <div className="space-y-3 pt-4 border-t">
                        {(selectedContractor.payment_method === 'bank_transfer' || selectedContractor.payment_method === 'manual') && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                            <p className="font-semibold mb-1">⚠️ EFT Payment Verification Required</p>
                            <p>Check your FNB bank statement for reference: <strong className="font-mono">{selectedContractor.payment_reference || 'N/A'}</strong></p>
                            <p className="mt-1">Amount: <strong>R{selectedContractor.payment_amount ? Number(selectedContractor.payment_amount).toLocaleString() : '—'}</strong></p>
                            <p className="mt-1">Once the payment is confirmed in your bank, click <strong>Verify & Approve EFT</strong> below. This will unlock the contractor's login access.</p>
                          </div>
                        )}
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveContractor(selectedContractor)}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            {(selectedContractor.payment_method === 'bank_transfer' || selectedContractor.payment_method === 'manual')
                              ? 'Verify & Approve EFT ✓'
                              : 'Approve Contractor'}
                          </Button>
                          <Button
                            onClick={() => handleRejectContractor(selectedContractor)}
                            variant="destructive"
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedContractor.status === 'approved' && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-semibold">
                            {selectedContractor.payment_method === 'stitch'  ? '⚡ Stitch payment auto-approved at registration' :
                             selectedContractor.payment_method === 'payfast' ? '💳 PayFast payment auto-approved at registration' :
                             (selectedContractor.payment_method === 'bank_transfer' || selectedContractor.payment_method === 'manual') ? '🏦 EFT payment verified by admin' :
                             'Approved'}
                          </span>
                        </div>
                        {selectedContractor.approved_at && (
                          <p className="text-sm text-green-700 mt-1">
                            Approved on {new Date(selectedContractor.approved_at).toLocaleDateString('en-ZA')}
                          </p>
                        )}
                        <p className="text-sm text-green-600 mt-1">Contractor has full login access.</p>
                      </div>
                    )}

                    {selectedContractor.status === 'rejected' && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex items-center gap-2 text-red-800">
                          <XCircle className="w-5 h-5" />
                          <span className="font-semibold">Rejected</span>
                        </div>
                        <p className="text-sm text-red-700 mt-1">
                          Rejected on {selectedContractor.rejected_at ? new Date(selectedContractor.rejected_at).toLocaleDateString('en-ZA') : '—'}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          {/* Database Tab Content */}
          <TabsContent value="database" className="space-y-6">
            <DatabaseSetup environment={envDisplay.environment} />
            <DatabaseInspector />
          </TabsContent>

          {/* Supplier API Integration Tab Content */}
          <TabsContent value="supplier-api" className="space-y-6">
            <SupplierIntegration />
          </TabsContent>

          {/* Payment Gateway Integration Tab Content */}
          <TabsContent value="payment-gateway" className="space-y-6">
            <PaymentIntegration />
          </TabsContent>

          {/* Billing Tab Content */}
          <TabsContent value="billing" className="space-y-6">
            <PaymentMethodComparison />
            <SupplierPricingTiers showROI={true} />
          </TabsContent>

          {/* Payments Tab Content */}
          <TabsContent value="payments" className="space-y-6">
            {/* v2: pass already-loaded contractors — no duplicate Supabase query */}
            <PaymentVerification
              contractors={contractors}
              onRefresh={loadContractors}
            />
            <PaymentAudit />
          </TabsContent>

          {/* Engagement Tab Content */}
          <TabsContent value="engagement" className="space-y-6">
            <SupplierEngagement />
          </TabsContent>

          {/* eTender Investor Brief Tab Content */}
          <TabsContent value="etender" className="space-y-6">
            <ETenderInvestorBrief />
          </TabsContent>

          {/* Partner Applications Tab Content */}
          <TabsContent value="partner-apps" className="space-y-6">
            <PartnerApplicationManagement />
          </TabsContent>

          {/* Proposal Tab Content */}
          <TabsContent value="proposal" className="space-y-6">
            <ProposalPage />
          </TabsContent>

          {/* Deployment Tab Content */}
          <TabsContent value="deployment" className="space-y-6">
            <DeploymentResources />
            <TestingGuidelines />
          </TabsContent>

          {/* Documentation Tab Content */}
          <TabsContent value="documentation" className="space-y-6">
            <DocumentationDownload />
          </TabsContent>

          {/* Testing Tab Content */}
          <TabsContent value="testing" className="space-y-6">
            <TestingGuidelines />
          </TabsContent>

          {/* Subscriptions Tab Content */}
          <TabsContent value="subscriptions" className="space-y-6">
            <SubscriptionTesting />
          </TabsContent>

          {/* Dev Tools Tab Content */}
          <TabsContent value="devtools" className="space-y-6">
            <PerformanceTestLauncher onLaunch={() => setShowPerformanceTest(true)} />
            <UIAutomationLauncher onLaunch={() => setShowUIAutomation(true)} />
            <DeveloperTools />
          </TabsContent>

          {/* Settings Tab Content */}
          <TabsContent value="settings" className="space-y-6">
            <EnvironmentSwitcher />
          </TabsContent>
          
          {/* User Session Tab Content */}
          <TabsContent value="user-session" className="space-y-6">
            <UserSessionViewer />
          </TabsContent>

          {/* Capital Raising Tab Content */}
          <TabsContent value="capital-raising" className="-mx-8 -mb-8">
            <CapitalRaisingGuide embedded={true} />
          </TabsContent>

          {/* Legal Audit Tab Content */}
          <TabsContent value="legal-audit" className="space-y-4">
            <SupplierLegalAudit />
          </TabsContent>

          {/* Coverage & Compliance Tab Content */}
          <TabsContent value="coverage" className="space-y-4">
            <SupplierCoverageCompliance />
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Test Modal */}
      <PerformanceTestModal 
        open={showPerformanceTest} 
        onOpenChange={setShowPerformanceTest} 
      />

      {/* UI Automation Modal */}
      <UIAutomationModal 
        open={showUIAutomation} 
        onOpenChange={setShowUIAutomation} 
      />
    </div>
  );
}