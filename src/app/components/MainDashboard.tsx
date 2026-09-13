import { useState, useEffect, useRef } from 'react';
import { BillUpload } from '@/app/components/BillUpload';
import { BillHistory } from '@/app/components/BillHistory';
import { RegionalPricedBillView } from '@/app/components/RegionalPricedBillView';
import { Features } from '@/app/components/Features';
import { Suppliers } from '@/app/components/Suppliers';
import { HowItWorks } from '@/app/components/HowItWorks';
import ProvincialPricingPage from '@/app/pages/ProvincialPricingPage';
import { BoqTemplateLibrary } from '@/app/components/BoqTemplateLibrary';
import { TechStackRecommendations } from '@/app/components/TechStackRecommendations';
import { SystemArchitecture } from '@/app/components/SystemArchitecture';
import { EnhancedMatchingDemo } from '@/app/components/EnhancedMatchingDemo';
import { InvestorPitchDeckGenerator } from '@/app/components/InvestorPitchDeckGenerator';
import { CatalogManager } from '@/app/components/CatalogManager';
import { SubscriptionUpgradeModal } from '@/app/components/payments/SubscriptionUpgradeModal';
import { TeamManagement } from '@/app/components/TeamManagement';
import { supabase } from '@/utils/supabase';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { FileUp, FileDown, TrendingDown, FileImage, Coins, User, LogOut, Users, Sparkles } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { getMunicipalitiesByProvince } from '@/utils/regionalOptimization';
import { getTierFeatures, type SubscriptionTier } from '@/utils/tierAccess';
import { ArrowUpCircle, ChevronDown } from 'lucide-react';
import { getProfessionalContractors } from '@/utils/database/contractors';

interface MainDashboardProps {
  accessToken: string;
  onLogout: () => void;
}

export function MainDashboard({ accessToken, onLogout }: MainDashboardProps) {
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'upload' | 'drawing' | 'template-library' | 'result' | 'history' | 'team-management' | 'steel-boq'>('upload');
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'features' | 'suppliers' | 'how-it-works' | 'provincial-pricing' | 'tech-stack' | 'system-architecture' | 'enhanced-matching' | 'investor-deck'>('dashboard');
  const [processedBill, setProcessedBill] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [preloadedItems, setPreloadedItems] = useState<any[]>([]);
  const [contractorData, setContractorData] = useState<any>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [professionalContractors, setProfessionalContractors] = useState<any[]>([]);
  const [selectedContractorId, setSelectedContractorId] = useState<string>('');
  const [monthlyBoqCount, setMonthlyBoqCount] = useState<number>(0);
  
  // ✅ Check if contractor can upload BOQ based on tier and monthly quota
  const contractorTier = (contractorData?.subscription_tier?.toLowerCase() || 'free') as SubscriptionTier;
  const tierFeatures = contractorData ? getTierFeatures(contractorTier) : null;
  const canUploadBOQ = tierFeatures?.canUploadBOQ ?? true; // Non-contractors can upload
  const baseBoqQuota = tierFeatures?.boqQuota ?? null; // null = unlimited
  const currentMonth = new Date().toISOString().slice(0, 7);
  const topUpMonth = contractorData?.boq_topup_month?.slice(0, 7);
  const activeTopUpAllowance = topUpMonth === currentMonth
    ? Number(contractorData?.boq_topup_allowance || 0)
    : 0;
  const boqQuota = baseBoqQuota === null ? null : baseBoqQuota + activeTopUpAllowance;
  const quotaExceeded = boqQuota !== null && monthlyBoqCount >= boqQuota;

  const getTopUpRequestUrl = (quantity: number) => {
    const subject = encodeURIComponent(`Qilly BOQ top-up request: +${quantity} BOQs`);
    const body = encodeURIComponent(
      `Please send me payment instructions for ${quantity} additional BOQs this month.\n\n` +
      `Company: ${contractorData?.company_name || ''}\n` +
      `Account email: ${contractorData?.email || ''}\n` +
      `Current usage: ${monthlyBoqCount} of ${boqQuota ?? 'unlimited'} BOQs\n\n` +
      'The additional allowance must be activated after payment verification.'
    );
    return `mailto:billing@qilly-software.co.za?cc=billing%40qilly.co.za&subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        await fetchUserProfile();
        if (isMounted) {
          const demoMode = sessionStorage.getItem('demo_mode') === 'true';
          const userType = sessionStorage.getItem('user_type');
          setIsDemoMode(demoMode);
          await loadContractorData();

          // For operator/demo sessions load the professional contractor roster
          if (demoMode || userType === 'operator') {
            const pros = await getProfessionalContractors();
            if (isMounted) setProfessionalContractors(pros);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing dashboard:', error);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
            setIsHeaderVisible(true);
          } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsHeaderVisible(false);
          }
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadContractorData = async () => {
    try {
      const storedContractor = sessionStorage.getItem('contractor_data');
      const userType = sessionStorage.getItem('user_type');

      // Use sessionStorage for both demo and real contractor sessions
      // (AuthForm stores contractor_data for all successful contractor logins)
      if (storedContractor && userType === 'contractor') {
        const contractor = JSON.parse(storedContractor);
        console.log('✅ Contractor data loaded from session:', contractor);
        setContractorData(contractor);
        setCurrentView('template-library');
        await fetchMonthlyBoqCount(contractor.id);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('❌ No authenticated user found for contractor data');
        return;
      }
      console.log('🔍 Loading contractor data for email:', user.email);

      const { data: contractors, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('email', user.email)
        .limit(1);

      if (error) {
        console.error('❌ Error loading contractor data:', error);
        return;
      }

      if (!contractors || contractors.length === 0) {
        console.log('ℹ️  No contractor record found for this user (not a contractor account)');
        return;
      }

      const contractor = contractors[0];
      console.log('📋 Contractor record found:', contractor);

      if (contractor && contractor.status === 'approved') {
        console.log('✅ Contractor data loaded from Supabase:', contractor);
        setContractorData(contractor);
        setCurrentView('template-library');
        await fetchMonthlyBoqCount(contractor.id);
      } else if (contractor && contractor.status !== 'approved') {
        console.warn('⚠️ Contractor account found but not approved. Status:', contractor.status);
        toast.warning('Your contractor account is pending approval. Please wait for admin approval.');
      }
    } catch (err) {
      console.error('💥 Failed to load contractor data:', err);
    }
  };

  const fetchMonthlyBoqCount = async (contractorId: string) => {
    try {
      if (!contractorId || contractorId.startsWith('demo-')) return;
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      let query = supabase
        .from('bills')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth.toISOString())
        .neq('uploaded_via', 'training_template');

      // New records are linked to the contractor. The user_id fallback keeps
      // earlier BOQs (created before contractor_id was saved) in the count.
      query = authUser?.id
        ? query.or(`contractor_id.eq.${contractorId},user_id.eq.${authUser.id}`)
        : query.eq('contractor_id', contractorId);

      const { count, error } = await query;
      if (error) throw error;
      setMonthlyBoqCount(count ?? 0);
    } catch (err) {
      console.error('Failed to fetch monthly BOQ count:', err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        console.log('🔍 Loading user profile for:', authUser.email);
        
        // First, check if this is a contractor
        const { data: contractors } = await supabase
          .from('contractors')
          .select('*')
          .eq('email', authUser.email)
          .limit(1);
        
        if (contractors && contractors.length > 0) {
          const contractor = contractors[0];
          console.log('✅ Contractor account detected:', contractor.company_name);
          
          // ✅ NEW: Determine contractor subscription status with free trial model
          const isFreeTrial = contractor.subscription_tier === 'free_trial';
          const isPaidContractor = contractor.subscription_tier && 
                                   !['FREE', 'free_trial'].includes(contractor.subscription_tier) &&
                                   contractor.status === 'approved';
          
          setUser({
            name: contractor.contact_person,
            email: contractor.email,
            company: contractor.company_name,
            userType: 'contractor',
            subscription_tier: contractor.subscription_tier || 'FREE',
            paid_status: isPaidContractor,
            is_premium: isPaidContractor,
            ...contractor
          });
          return;
        }
        
        // Not a contractor - check public.users table for regular/operator users
        const { data: regularUsers } = await supabase
          .from('users')
          .select('*')
          .eq('email', authUser.email)
          .limit(1);
        
        if (regularUsers && regularUsers.length > 0) {
          const regularUser = regularUsers[0];
          console.log('✅ Regular user account detected:', regularUser.email);
          setUser({
            id: regularUser.id,
            email: regularUser.email,
            name: regularUser.full_name || authUser.user_metadata?.name || authUser.email.split('@')[0],
            role: regularUser.role || 'operator',
            userType: 'operator',
            subscription_tier: regularUser.subscription_tier || 'FREE',
            paid_status: regularUser.is_premium || false,
            is_operator: true,
            created_at: regularUser.created_at
          });
          return;
        }
        
        // User exists in auth but not in public.users - create the record
        console.log('⚠️  User exists in auth but not in public.users - this should not happen');
        console.log('📝 Creating user record in public.users table');
        
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.name || authUser.email.split('@')[0],
            role: 'operator',
            subscription_tier: 'FREE',
            created_at: new Date().toISOString()
          })
          .select()
          .single();
        
        if (insertError) {
          console.error('❌ Failed to create user record:', insertError);
          throw new Error('Failed to create user profile');
        }
        
        console.log('✅ User record created successfully:', newUser);
        setUser({
          id: newUser.id,
          email: newUser.email,
          name: newUser.full_name,
          role: newUser.role,
          userType: 'operator',
          subscription_tier: newUser.subscription_tier,
          is_operator: true,
          created_at: newUser.created_at
        });
      }
    } catch (error: any) {
      if (error?.message === 'DEMO_MODE') {
        sessionStorage.setItem('demo_mode', 'true');
        setIsDemoMode(true);
        try {
          const data = await api.getProfile(accessToken);
          setUser(data.user);
        } catch (retryError) {
          // Silent
        }
      } else {
        console.error('Unexpected error fetching profile:', error);
      }
    }
  };

  const handleBillProcess = async (billData: any[], projectSettings?: any) => {
    setIsLoading(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      // Get fresh access token to avoid 401 errors
      const { data: { session } } = await supabase.auth.getSession();
      const freshAccessToken = session?.access_token || accessToken;
      
      console.log('🔑 Token Debug:', {
        hasSession: !!session,
        hasAccessToken: !!session?.access_token,
        tokenPreview: session?.access_token?.substring(0, 30) + '...',
        expiresAt: session?.expires_at,
        expiresIn: session?.expires_at ? Math.floor((session.expires_at * 1000 - Date.now()) / 1000) : 0,
        usingFallback: !session?.access_token
      });
      
      if (authUser && contractorData) {
        console.log('🔧 Merging contractor profile data with project settings');
        projectSettings = {
          ...projectSettings,
          province: projectSettings?.province || contractorData.operating_provinces?.[0] || 'GP',
          municipality: projectSettings?.municipality || getMunicipalitiesByProvince(contractorData.operating_provinces?.[0] || 'GP')[0]?.code || 'JHB',
          cidbGrading: projectSettings?.cidbGrading || contractorData.cidb_grade || 'GB4',
          contractorId: contractorData.id,
          contractorEmail: contractorData.email,
          contractorCompany: contractorData.company_name
        };
        console.log('📋 Final project settings:', projectSettings);
      }
      const isTrainingTemplate = projectSettings?.isTrainingTemplate === true;
      const data = await api.processBill(billData, freshAccessToken, projectSettings);

      // Training templates generate a preview only. They are intentionally not
      // persisted and never consume the contractor's monthly BOQ allowance.
      if (isTrainingTemplate) {
        toast.info('Training preview generated — your monthly BOQ allowance was not used.');
      }

      if (authUser && data && !isTrainingTemplate) {
        console.log('💾 Saving bill to Supabase with project settings...');
        
        // ✅ FIX: Use UPSERT to avoid duplicate key errors
        const { error: upsertError } = await supabase
          .from('users')
          .upsert({
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || authUser.email || 'Unknown User',
            company_name: authUser.user_metadata?.company_name || null,
            subscription_tier: 'FREE'
          }, {
            onConflict: 'id', // If user exists, do nothing (don't overwrite)
            ignoreDuplicates: true
          });
        
        if (upsertError) {
          console.error('❌ Failed to ensure user record exists:', upsertError);
          if (upsertError.code === '42501') {
            toast.error('Database permissions error. Please run the FIX_INFINITE_RECURSION.sql file in your Supabase SQL Editor.', { duration: 8000 });
            return;
          }
          // Continue anyway - user might already exist
        } else {
          console.log('✅ User record verified/created');
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
        const { data: billRecord, error: billError } = await supabase
          .from('bills')
          .insert({
            user_id: authUser.id,
            contractor_id: contractorData?.id ?? null,
            project_name: `BOQ ${new Date().toLocaleDateString()}`,
            bill_number: data.billId || `BILL-${Date.now()}`,
            total_cost: parseFloat(data.overallTotal || '0'),
            project_settings: projectSettings,
            status: 'processed',
            uploaded_via: contractorData ? 'contractor' : 'manual'
          })
          .select()
          .single();
        if (billError) {
          console.error('❌ Error saving bill to Supabase:', billError);
          toast.error(`Database error: ${billError.message}`);
        } else {
          console.log('✅ Bill saved to Supabase:', billRecord);

          // Increment monthly BOQ count for quota-tracked tiers
          if (contractorData && boqQuota !== null) {
            setMonthlyBoqCount(prev => prev + 1);
          }

          // ✅ DECREMENT trial_bills_remaining for FREE tier users
          if (user?.subscription_tier === 'FREE' && user?.trial_bills_remaining > 0) {
            console.log('📉 Decrementing trial bills remaining for FREE tier user');
            const newTrialCount = Math.max(0, user.trial_bills_remaining - 1);
            
            const { error: updateError } = await supabase
              .from('users')
              .update({ 
                trial_bills_remaining: newTrialCount 
              })
              .eq('id', authUser.id);
            
            if (updateError) {
              console.error('❌ Failed to update trial_bills_remaining:', updateError);
            } else {
              console.log(`✅ Trial bills remaining updated: ${user.trial_bills_remaining} → ${newTrialCount}`);
              // Update local user state
              setUser((prevUser: any) => ({
                ...prevUser,
                trial_bills_remaining: newTrialCount,
                trial_used: newTrialCount <= 0
              }));
              
              // Show toast notification
              if (newTrialCount === 0) {
                toast.warning('You have used all your free trial bills. Upgrade to continue.', { duration: 6000 });
              } else {
                toast.success(`Bill generated! ${newTrialCount} free bill${newTrialCount === 1 ? '' : 's'} remaining.`);
              }
            }
          }
          
          if (data.items && billRecord?.id) {
            const billItems = data.items
              .filter((item: any) => {
                const hasDescription = item.name || item.description;
                const hasUnit = item.unit;
                const hasValidQuantity = item.quantity && !isNaN(parseFloat(item.quantity)) && parseFloat(item.quantity) !== 0;
                return hasDescription && hasUnit && hasValidQuantity;
              })
              .map((item: any) => {
                const quantity = parseFloat(item.quantity);
                const unitPrice = parseFloat(item.finalUnitPrice || item.baseUnitPrice || '0');
                const totalPrice = parseFloat(item.totalPrice || '0');
                return {
                  bill_id: billRecord.id,
                  description: item.name || item.description,
                  unit: item.unit,
                  quantity: isNaN(quantity) ? 1 : quantity,
                  unit_price: isNaN(unitPrice) ? 0 : unitPrice,
                  total_price: isNaN(totalPrice) ? 0 : totalPrice,
                  supplier_name: item.selectedSupplier || null,
                  supplier_id: null
                };
              });
            if (billItems.length > 0) {
              const { error: itemsError } = await supabase.from('bill_items').insert(billItems);
              if (itemsError) {
                console.error('⚠️ Error saving bill items:', itemsError);
              } else {
                console.log(`✅ ${billItems.length} bill items saved to Supabase`);
              }
            }
          }
        }
      }
      setProcessedBill(data);
      setCurrentView('result');
      await fetchUserProfile();
    } catch (error: any) {
      if (error?.message === 'DEMO_MODE') {
        // Demo mode is only allowed in DEVELOPMENT environment
        // In SIT/UAT/PRODUCTION, this error won't be thrown - proper error messages will be shown instead
        sessionStorage.setItem('demo_mode', 'true');
        setIsDemoMode(true);
        try {
          const data = await api.processBill(billData, accessToken, projectSettings);
          setProcessedBill(data);
          setCurrentView('result');
          // Only show demo mode message in development - customer-facing environments won't see this
          if (import.meta.env.MODE === 'development') {
            toast.info('Development mode - using local pricing engine');
          }
        } catch (retryError: any) {
          toast.error(retryError instanceof Error ? retryError.message : 'Failed to process bill');
        }
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to process bill');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProfessionalContractor = (id: string) => {
    setSelectedContractorId(id);
    if (!id) {
      setContractorData(null);
      return;
    }
    const chosen = professionalContractors.find(c => c.id === id);
    if (chosen) {
      setContractorData(chosen);
      toast.success(`Using ${chosen.company_name} for BOQ generation`);
    }
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  const handleBackToUpload = () => {
    if (contractorData) {
      setCurrentView('template-library');
    } else {
      setCurrentView('upload');
    }
    setProcessedBill(null);
    setPreloadedItems([]);
  };

  const handleTemplateSelect = (items: any[]) => {
    setPreloadedItems(items);
    setCurrentView('upload');
  };

  const handleManualEntry = () => {
    setPreloadedItems([]);
    setCurrentView('upload');
  };

  const handleShowTemplateLibrary = () => {
    setCurrentView('template-library');
  };

  const handlePageChange = (page: 'dashboard' | 'features' | 'suppliers' | 'how-it-works' | 'provincial-pricing' | 'tech-stack' | 'system-architecture' | 'enhanced-matching' | 'investor-deck') => {
    setCurrentPage(page);
    if (page === 'dashboard') {
      // ✅ FIX: FREE tier contractors should see template library, not upload
      if (contractorData && !canUploadBOQ) {
        setCurrentView('template-library');
      } else {
        setCurrentView('upload');
      }
      setProcessedBill(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative z-10">
        <header 
          className="sticky top-0 z-50 bg-gradient-to-r from-[#00b4d8] to-[#0077b6] border-b border-white/20 shadow-lg transition-transform duration-300 ease-in-out"
          style={{ transform: isHeaderVisible ? 'translateY(0)' : 'translateY(-100%)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#00b4d8]/95 to-[#0077b6]/95"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm">
                    <div className="h-8 flex items-center justify-center px-3">
                      <span className="text-2xl font-bold text-[#00b4d8]">Qilly</span>
                    </div>
                  </div>
                  <h1 className="text-xs font-bold text-white whitespace-nowrap">Construction Billing Intelligence</h1>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {contractorData && (
                  <Card className="bg-white/10 border-white/30 backdrop-blur-sm">
                    <CardContent className="py-2 px-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="size-10 rounded-lg bg-white/20 flex items-center justify-center">
                            <User className="size-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-white leading-tight truncate">{contractorData.company_name}</p>
                              <p className="text-xs text-white/80 leading-tight truncate mt-0.5">{contractorData.email}</p>
                            </div>
                            <div className="flex items-center gap-1.5 flex-shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={onLogout} 
                                className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-6 px-2 py-0"
                              >
                                <LogOut className="h-3.5 w-3.5 mr-1" />
                                <span className="text-xs">Logout</span>
                              </Button>
                              <div className="flex flex-col gap-1">
                                <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-none font-semibold text-xs px-2 py-0.5 h-6">
                                  {contractorData.subscription_tier?.charAt(0).toUpperCase() + contractorData.subscription_tier?.slice(1)}
                                </Badge>
                                {contractorData.subscription_tier?.toLowerCase() === 'free' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 h-5 px-2 py-0 text-[10px] font-semibold"
                                  >
                                    <ArrowUpCircle className="h-3 w-3 mr-1" />
                                    Upgrade to Pro
                                  </Button>
                                )}
                                {contractorData.subscription_tier?.toLowerCase() === 'professional' && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setShowUpgradeModal(true)}
                                    className="bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 h-5 px-2 py-0 text-[10px] font-semibold"
                                  >
                                    <ArrowUpCircle className="h-3 w-3 mr-1" />
                                    Upgrade to Enterprise
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <p className="text-xs text-white/90 leading-tight font-medium">
                              <span className="font-semibold">CIDB:</span> {contractorData.cidb_grade || 'N/A'}
                            </p>
                            <p className="text-xs text-white/90 font-medium leading-tight">
                              💰 {
                                contractorData.annual_turnover === 0 ? 'Under R10M (EME)' :
                                contractorData.annual_turnover <= 50000000 ? `R${(contractorData.annual_turnover / 1000000).toFixed(0)}M (QSE)` :
                                `R${(contractorData.annual_turnover / 1000000).toFixed(0)}M (Generic)`
                              }
                            </p>
                            <p className="text-xs text-white/90 leading-tight col-span-2 truncate">
                              <span className="font-semibold">Operating Provinces:</span> {contractorData.operating_provinces?.join(', ') || contractorData.province}
                            </p>
                            <p className="text-xs text-white/90 leading-tight col-span-2 truncate">
                              <span className="font-semibold">📋 Projects:</span> {contractorData.project_types?.join(', ') || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {user && !contractorData && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-white/80" />
                    <div className="text-right">
                      <p className="text-xs font-medium text-white">{user.name}</p>
                      <p className="text-[10px] text-white/70">{user.email}</p>
                    </div>
                    {!user.paid_status && (
                      <Badge variant={user.trial_used ? "destructive" : "secondary"} className="bg-white/20 text-white border-white/30 text-[10px]">
                        {user.trial_used ? 'Trial Used' : `Free Trial (${user.trial_bills_remaining ?? 3} bills left)`}
                      </Badge>
                    )}
                  </div>
                )}
                {user && !contractorData && professionalContractors.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <select
                        value={selectedContractorId}
                        onChange={e => handleSelectProfessionalContractor(e.target.value)}
                        className="h-7 pl-2 pr-7 text-xs bg-white/10 text-white border border-white/30 rounded-md appearance-none cursor-pointer hover:bg-white/20 focus:outline-none focus:ring-1 focus:ring-white/50 max-w-[220px]"
                      >
                        <option value="" className="text-gray-900 bg-white">— Select contractor for BOQ —</option>
                        {professionalContractors.map(c => (
                          <option key={c.id} value={c.id} className="text-gray-900 bg-white">
                            {c.company_name} ({c.subscription_tier})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-white/70 pointer-events-none" />
                    </div>
                  </div>
                )}
                {user && !contractorData && (
                  <Button variant="outline" size="sm" onClick={onLogout} className="bg-white/10 text-white border-white/30 hover:bg-white/20 h-7">
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">Logout</span>
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 pb-0 border-t border-white/20 pt-1">
              <button onClick={() => handlePageChange('dashboard')} className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-t-md ${currentPage === 'dashboard' ? 'bg-white text-[#00b4d8]' : 'text-white/90 hover:bg-white/10'}`}>Dashboard</button>
              <button onClick={() => handlePageChange('how-it-works')} className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-t-md ${currentPage === 'how-it-works' ? 'bg-white text-[#00b4d8]' : 'text-white/90 hover:bg-white/10'}`}>How It Works</button>
              {/* ✅ HIDE Supplier Catalog for Contractors - only show for non-contractors/suppliers */}
              {!contractorData && (
                <button onClick={() => handlePageChange('suppliers')} className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-t-md ${currentPage === 'suppliers' ? 'bg-white text-[#00b4d8]' : 'text-white/90 hover:bg-white/10'}`}>Supplier Catalog</button>
              )}
              <button onClick={() => handlePageChange('provincial-pricing')} className={`px-3 py-1.5 text-sm font-medium transition-colors rounded-t-md ${currentPage === 'provincial-pricing' ? 'bg-white text-[#00b4d8]' : 'text-white/90 hover:bg-white/10'}`}>Provincial Pricing</button>
              <button onClick={() => handlePageChange('enhanced-matching')} className={`px-3 py-2 text-sm font-medium transition-colors rounded-t-md ${currentPage === 'enhanced-matching' ? 'bg-white text-[#00b4d8]' : 'text-white/90 hover:bg-white/10'}`}>Item matching</button>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentPage === 'dashboard' && (
            <>
              {!contractorData && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
                      <CardTitle className="text-xs font-medium">Status</CardTitle>
                      <Coins className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-base font-bold text-[#00b4d8]">{user?.paid_status ? 'Paid Account' : 'Free Trial'}</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {user?.paid_status 
                          ? 'Unlimited pricing' 
                          : user?.trial_used 
                            ? 'Trial complete - Upgrade to continue' 
                            : `${user?.trial_bills_remaining ?? 3} free bill${(user?.trial_bills_remaining ?? 3) === 1 ? '' : 's'} remaining`
                        }
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
                      <CardTitle className="text-xs font-medium">Processing Time</CardTitle>
                      <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-base font-bold text-[#00b4d8]">{'<'} 5 min</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Automated pricing with live data</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 pt-3">
                      <CardTitle className="text-xs font-medium">Benefits</CardTitle>
                      <FileUp className="h-3.5 w-3.5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-base font-bold text-[#00b4d8]">100%</div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Accuracy - No arithmetic errors</p>
                    </CardContent>
                  </Card>
                </div>
              )}
              <div className="flex gap-2 mb-6 flex-wrap">
                {canUploadBOQ && (
                  <Button 
                    variant={currentView === 'upload' ? 'default' : 'outline'} 
                    onClick={handleBackToUpload}
                  >
                    <FileUp className="h-4 w-4 mr-2" />
                    Upload BOQ
                  </Button>
                )}
                {canUploadBOQ && (
                  <Button
                    variant="outline"
                    disabled
                    aria-label="AI Drawing Takeoff — Coming soon"
                    title="AI-assisted drawing takeoff is being prepared for a future Qilly release"
                    className="group border-violet-200 bg-gradient-to-r from-violet-50 to-fuchsia-50 text-violet-800 shadow-sm opacity-90 cursor-not-allowed"
                  >
                    <FileImage className="h-4 w-4 mr-2 text-violet-600" />
                    AI Drawing Takeoff
                    <Badge className="ml-2 border-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] px-2 py-0.5 shadow-sm">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Coming soon
                    </Badge>
                  </Button>
                )}
                {canUploadBOQ && (
                  <Button
                    variant="outline"
                    disabled
                    aria-label="Steel BOQ — Coming soon"
                    title="Dedicated steel BOQ pricing is being prepared for a future Qilly release"
                    className="border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-900 shadow-sm opacity-90 cursor-not-allowed"
                  >
                    <span className="mr-1.5 text-sm">🏗️</span>
                    Steel BOQ
                    <Badge className="ml-2 border-0 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] px-2 py-0.5 shadow-sm">
                      <Sparkles className="mr-1 h-3 w-3" />
                      Coming soon
                    </Badge>
                  </Button>
                )}
                {canUploadBOQ && (
                  <Button 
                    variant={currentView === 'history' ? 'default' : 'outline'} 
                    onClick={handleViewHistory}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    View History
                  </Button>
                )}
                {/* Team Management — disabled, coming soon */}
                <Button
                  variant="outline"
                  disabled
                  aria-label="Team Management — Coming soon"
                  title="Collaborative team management is planned for a future Qilly release"
                  className="border-sky-200 bg-gradient-to-r from-sky-50 to-cyan-50 text-sky-800 shadow-sm opacity-90 cursor-not-allowed"
                >
                  <Users className="h-4 w-4 mr-2 text-sky-600" />
                  Team Management
                  <Badge className="ml-2 border-0 bg-gradient-to-r from-sky-600 to-cyan-600 text-white text-[10px] px-2 py-0.5 shadow-sm">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Coming soon
                  </Badge>
                </Button>
                {/* FREE tier contractors: Show upgrade message */}
                {!canUploadBOQ && contractorData && (
                  <div className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
                    <p className="text-sm font-semibold text-amber-900">
                      🎓 Training Mode: Use pre-loaded BuildAid 2025/2026 templates to learn how Qilly works
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="underline font-semibold hover:text-amber-900 transition-colors"
                      >
                        Upgrade
                      </button>{' '}
                      to <strong>PROFESSIONAL</strong> or higher to upload your own BOQs and access live pricing.
                      <a href="mailto:support@qilly.co.za" className="underline ml-1 font-semibold">Contact sales</a>
                    </p>
                  </div>
                )}
                {/* Monthly BOQ quota banner */}
                {contractorData && boqQuota !== null && (
                  <div className={`w-full px-4 py-2 rounded-lg border text-sm flex items-center justify-between ${
                    quotaExceeded
                      ? 'bg-red-50 border-red-300 text-red-800'
                      : monthlyBoqCount >= boqQuota * 0.8
                      ? 'bg-amber-50 border-amber-300 text-amber-800'
                      : 'bg-blue-50 border-blue-200 text-blue-800'
                  }`}>
                    <span>
                      📊 Monthly BOQs: <strong>{monthlyBoqCount} / {boqQuota}</strong> used
                      {activeTopUpAllowance > 0 && (
                        <span className="ml-1 text-xs">
                          ({baseBoqQuota} plan + {activeTopUpAllowance} add-on)
                        </span>
                      )}
                      {quotaExceeded && ' — Monthly limit reached'}
                    </span>
                    {quotaExceeded && (
                      <div className="flex items-center gap-2 ml-3">
                        <span className="text-xs font-semibold">Buy additional:</span>
                        {[10, 25, 50].map(quantity => (
                          <a
                            key={quantity}
                            href={getTopUpRequestUrl(quantity)}
                            className="rounded bg-red-700 px-2 py-1 text-xs font-semibold text-white hover:bg-red-800"
                          >
                            +{quantity}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              {currentView === 'upload' && (canUploadBOQ || preloadedItems.length > 0) && (
                <BillUpload
                  onProcess={handleBillProcess}
                  isLoading={isLoading}
                  canProcess={(!user?.trial_used || user?.paid_status) && !quotaExceeded}
                  preloadedItems={preloadedItems}
                  onBackToTemplates={contractorData ? handleShowTemplateLibrary : undefined}
                  isContractor={!!contractorData}
                  canUploadBOQ={canUploadBOQ}
                />
              )}
              {currentView === 'template-library' && (<BoqTemplateLibrary contractorProjectTypes={contractorData?.project_types || ['Road Construction', 'Housing Development', 'Infrastructure (Water/Sewer)', 'Civil Works', 'Bridges & Structures', 'Building Construction']} onTemplateSelect={handleTemplateSelect} onManualEntry={handleManualEntry} onBack={handleBackToUpload} canUploadBOQ={canUploadBOQ} contractorTier={contractorTier} />)}
              {currentView === 'result' && processedBill && (<RegionalPricedBillView bill={processedBill} contractorData={contractorData} processingTime={processedBill.processingTime} onBack={handleBackToUpload} />)}
              {currentView === 'history' && (<BillHistory accessToken={accessToken} />)}
              {currentView === 'team-management' && contractorData && (
                <TeamManagement
                  contractorEmail={contractorData.email || user?.email || ''}
                  subscriptionTier={contractorTier}
                />
              )}
              {isDemoMode && user?.is_operator && currentView === 'upload' && (<div className="mt-6"><CatalogManager /></div>)}
            </>
          )}
          {currentPage === 'features' && (<Features />)}
          {currentPage === 'suppliers' && (<Suppliers />)}
          {currentPage === 'how-it-works' && (<HowItWorks onNavigateToDashboard={() => handlePageChange('dashboard')} contractorData={contractorData} />)}
          {currentPage === 'provincial-pricing' && (<ProvincialPricingPage contractorData={contractorData} />)}
          {currentPage === 'enhanced-matching' && (<EnhancedMatchingDemo contractorData={contractorData} />)}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-end items-center gap-4 text-xs text-gray-600">
              <p>All copy rights reserved</p>
              <span className="text-gray-400">|</span>
              <p>Powered by <span className="font-semibold text-[#00b4d8]">Assure Tech Solutions</span></p>
            </div>
          </div>
        </footer>
      </div>
      {showUpgradeModal && contractorData && (
        <SubscriptionUpgradeModal 
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={() => {
            setShowUpgradeModal(false);
            window.location.reload();
          }}
          userId={contractorData.id || ''}
          userEmail={contractorData.email || ''}
          userName={contractorData.contact_person || contractorData.company_name || ''}
        />
      )}
    </div>
  );
}