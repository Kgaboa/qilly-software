import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { Hammer, User, Mail, Phone, MapPin, FileText, Shield, DollarSign, Award, Building2, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { ContractorPricingTiers } from '@/app/components/ContractorPricingTiers';
import { TierSelectionStep } from '@/app/components/TierSelectionStep';
import { PaymentStep } from '@/app/components/PaymentStep';
import { PrivacyPolicy } from '@/app/components/PrivacyPolicy';
import { TermsOfService } from '@/app/components/TermsOfService';

interface ContractorSignupProps {
  onSuccess: () => void;
  onBack: () => void;
}

// ============================================
// CONSTANTS - Moved outside component for performance
// ============================================

const PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
];

const PROJECT_TYPES = [
  'Residential Building',
  'Commercial Building',
  'Industrial Construction',
  'Infrastructure Development',
  'Road Construction',
  'Bridge Construction',
  'Water & Sanitation',
  'Electrical Works',
  'Mechanical Works',
  'Renovation & Refurbishment',
  'Landscaping & Earthworks'
];

// CIDB Classes - FULL LIST restored now that we're using native select (no freeze)
const CIDB_CLASSES = [
  { code: 'GB', name: 'General Building' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'EB', name: 'Electrical Engineering' },
  { code: 'EP', name: 'Electrical Specialised' },
  { code: 'ME', name: 'Mechanical Engineering' },
  { code: 'SB', name: 'Specialist Building' },
  { code: 'SC', name: 'Specialist Civil' },
  { code: 'SD', name: 'Specialist Demolition' },
  { code: 'SE', name: 'Specialist Electrical' },
  { code: 'SF', name: 'Specialist Fire' },
  { code: 'SG', name: 'Specialist Geotechnical' },
  { code: 'SH', name: 'Specialist Handling' },
  { code: 'SI', name: 'Specialist Insulation' },
  { code: 'SJ', name: 'Specialist Joinery' },
  { code: 'SK', name: 'Specialist Kitchens' },
  { code: 'SL', name: 'Specialist Landscaping' },
  { code: 'SM', name: 'Specialist Mechanical' },
  { code: 'SN', name: 'Specialist Painting' },
  { code: 'SO', name: 'Specialist Piling' },
  { code: 'SP', name: 'Specialist Plumbing' },
  { code: 'SQ', name: 'Specialist Quantity Surveying' },
];

// CIDB Grades - Simple 1-9 selection
const CIDB_GRADE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export function ContractorSignup({ onSuccess, onBack }: ContractorSignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Multi-step flow: details → tier → payment → submitting → confirmed
  const [currentStep, setCurrentStep] = useState<'details' | 'tier' | 'payment' | 'submitting' | 'confirmed'>('details');
  const [confirmedDetails, setConfirmedDetails] = useState<{
    email: string;
    companyName: string;
    contactPerson: string;
    tierName: string;
    tierPrice: number;
    paymentReference: string;
  } | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>('FREE');
  const [selectedTierName, setSelectedTierName] = useState<string>('Free');
  const [selectedTierPrice, setSelectedTierPrice] = useState<number>(0);
  const [paymentDetails, setPaymentDetails] = useState<{
    method: 'manual' | 'stitch' | 'payfast';
    reference: string;
    amount: number;
  } | null>(null);
  
  // Collapsible sections state - COLLAPSED by default to prevent freeze
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    contact: false,
    address: false,
    business: false,
    security: false,
  });

  // Policy modal states
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  // Scroll to top helper function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const [signupData, setSignupData] = useState({
    // Company Information
    companyName: '',
    cidbRegistrationNumber: '',
    cidbClass: '', // NEW: CIDB Class (GB, CE, etc.)
    cidbGradeNumber: '', // NEW: CIDB Grade Number (1-9)
    cidbGrade: '', // Combined value for database
    
    // Contact Person
    contactPerson: '',
    email: '',
    phone: '',
    
    // Address
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    
    // Business Details
    projectTypes: [] as string[],
    operatingProvinces: [] as string[],
    yearsInBusiness: '',
    annualTurnover: '',
    bbbeeLevel: '',
    hasCertification: false,
    
    // Account
    password: '',
    confirmPassword: '',
    
    // POPIA Consent
    privacyConsent: false,
    agreeToTerms: false,
  });

  const toggleProjectType = (type: string) => {
    setSignupData(prev => ({
      ...prev,
      projectTypes: prev.projectTypes.includes(type)
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type]
    }));
  };

  const toggleOperatingProvince = (province: string) => {
    setSignupData(prev => ({
      ...prev,
      operatingProvinces: prev.operatingProvinces.includes(province)
        ? prev.operatingProvinces.filter(p => p !== province)
        : [...prev.operatingProvinces, province]
    }));
  };

  // Handle tier selection
  const handleTierSelect = (tierId: string, tierName: string, tierPrice: number) => {
    setSelectedTier(tierId);
    setSelectedTierName(tierName);
    setSelectedTierPrice(tierPrice);
    
    // Check if payment is required for this tier
    const requiresPayment = tierId === 'PROFESSIONAL' || tierId === 'ENTERPRISE';
    
    if (requiresPayment) {
      setCurrentStep('payment');
      scrollToTop();
    } else {
      // FREE or CUSTOM - proceed directly to submission
      handleFinalSubmit(null);
    }
  };

  // Handle details form completion
  const handleDetailsComplete = () => {
    // Validate form before proceeding
    const errors: string[] = [];

    if (!signupData.companyName) {
      errors.push('Company Name is required');
    }

    if (!signupData.email) {
      errors.push('Email Address is required');
    }

    if (!signupData.phone) {
      errors.push('Phone Number is required');
    }

    if (signupData.projectTypes.length === 0) {
      errors.push('Please select at least one project type');
    }

    if (signupData.operatingProvinces.length === 0) {
      errors.push('Please select at least one operating province');
    }

    if (!signupData.privacyConsent || !signupData.agreeToTerms) {
      errors.push('Please accept both Privacy Policy and Terms of Service');
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      scrollToTop();
      return;
    }

    // All validated - proceed to tier selection
    setCurrentStep('tier');
    scrollToTop();
  };

  // Handle payment completion
  const handlePaymentComplete = (details: {
    method: 'manual' | 'stitch' | 'payfast';
    reference: string;
    amount: number;
  }) => {
    setPaymentDetails(details);
    handleFinalSubmit(details);
  };

  // Final submission with all data
  const handleFinalSubmit = async (payment: typeof paymentDetails) => {
    setCurrentStep('submitting');
    setIsLoading(true);
    setError(null);

    try {
      const subscriptionStartDate = new Date().toISOString();

      // 1. Create user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            user_type: 'contractor',
            company_name: signupData.companyName,
          }
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        
        // Handle specific error cases with user-friendly messages
        if (authError.message.includes('User already registered') || authError.message.includes('already registered')) {
          setError('⚠️ This email is already registered. Please login instead, or use a different email address.');
          toast.error('Email Already Registered', {
            description: 'This email is already in use. Please login or use a different email.',
          });
          setEmailAlreadyExists(true);
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before logging in.');
          toast.error('Email Not Confirmed', {
            description: 'Please verify your email address before continuing.',
          });
        } else if (authError.message.includes('Invalid email')) {
          setError('Please enter a valid email address.');
          toast.error('Invalid Email', {
            description: 'The email address format is invalid.',
          });
        } else if (authError.message.includes('Password')) {
          setError('Password must be at least 6 characters long.');
          toast.error('Invalid Password', {
            description: 'Please choose a stronger password.',
          });
        } else {
          setError(`Signup failed: ${authError.message}`);
          toast.error('Signup Failed', {
            description: authError.message,
          });
        }
        
        setIsLoading(false);
        setCurrentStep('details');
        scrollToTop();
        return;
      }
      if (!authData.user) {
        setError('Failed to create user account. Please try again.');
        setIsLoading(false);
        setCurrentStep('details');
        return;
      }

      console.log('✅ User account created:', authData.user.id);

      // Save POPIA consent to audit log
      try {
        const consentTimestamp = new Date().toISOString();
        await supabase.from('consent_audit_log').insert([
          {
            user_id: authData.user.id,
            consent_type: 'privacy',
            consent_given: true,
            policy_version: '1.0',
            created_at: consentTimestamp,
          },
          {
            user_id: authData.user.id,
            consent_type: 'terms',
            consent_given: true,
            policy_version: '1.0',
            created_at: consentTimestamp,
          },
        ]);
        console.log('✅ POPIA consent saved for contractor');
      } catch (consentError) {
        console.error('Consent logging error:', consentError);
      }

      // 2. Insert contractor data into contractors table
      const contractorData = {
        user_id: authData.user.id,
        company_name: signupData.companyName,
        cidb_registration_number: signupData.cidbRegistrationNumber || null,
        cidb_grade: signupData.cidbGrade || null,
        contact_person: signupData.contactPerson,
        email: signupData.email,
        phone: signupData.phone,
        street_address: signupData.streetAddress,
        city: signupData.city,
        province: signupData.province,
        postal_code: signupData.postalCode,
        project_types: signupData.projectTypes,
        operating_provinces: signupData.operatingProvinces,
        years_in_business: signupData.yearsInBusiness ? parseInt(signupData.yearsInBusiness) : 0,
        annual_turnover: signupData.annualTurnover ? parseFloat(signupData.annualTurnover) : 0,
        bbbee_level: signupData.bbbeeLevel || null,
        has_certification: signupData.hasCertification,
        // ─── PAYMENT-GATED STATUS LOGIC ───────────────────────────────────────
        // FREE tier:                        approved immediately, no payment needed.
        // PROFESSIONAL/ENTERPRISE + Stitch: approved immediately, payment auto-verified.
        // PROFESSIONAL/ENTERPRISE + PayFast:approved immediately, payment auto-verified.
        // PROFESSIONAL/ENTERPRISE + Manual: PENDING until admin verifies EFT proof.
        // ──────────────────────────────────────────────────────────────────────
        status: (() => {
          if (selectedTier === 'FREE' || selectedTierPrice === 0) return 'approved';
          if (payment?.method === 'manual') return 'pending';  // awaits admin EFT verification
          return 'approved'; // stitch / payfast = instant verification
        })(),
        payment_approved: (() => {
          if (selectedTier === 'FREE' || selectedTierPrice === 0) return true;   // no payment needed
          if (payment?.method === 'manual') return false; // awaits admin verification
          return true;  // stitch / payfast auto-verified
        })(),
        subscription_tier: selectedTier.toLowerCase(),
        billing_cycle: 'monthly',
        subscription_status: 'active',
        subscription_start_date: subscriptionStartDate,
        next_billing_date: null,
        payment_method: payment?.method === 'manual' ? null : (payment?.method || null),
        payment_reference: payment?.reference || null,
        payment_amount: payment?.amount || selectedTierPrice,
        popia_consent_given: true,
        popia_consent_date: new Date().toISOString(),
        popia_consent_version: '1.0',
        terms_consent_given: true,
        terms_consent_date: new Date().toISOString(),
        terms_consent_version: '1.0',
      };

      const { data: contractorRecord, error: contractorError } = await supabase
        .from('contractors')
        .insert([contractorData])
        .select()
        .single();

      if (contractorError) {
        console.error('❌ Contractor insert error:', contractorError);
        console.error('❌ Full error details:', JSON.stringify(contractorError, null, 2));
        console.error('❌ Error code:', contractorError.code);
        console.error('❌ Error message:', contractorError.message);
        console.error('❌ Error details:', contractorError.details);
        console.error('❌ Error hint:', contractorError.hint);

        let userMsg: string;
        if (contractorError.code === 'PGRST204') {
          userMsg = 'Database schema error — column missing. Contact support@qilly.co.za';
        } else if (contractorError.message.includes('duplicate key')) {
          userMsg = 'A contractor account with this email already exists.';
        } else if (
          contractorError.code === '42501' ||
          contractorError.message.toLowerCase().includes('row-level security') ||
          contractorError.message.toLowerCase().includes('rls') ||
          contractorError.message.toLowerCase().includes('violates row level')
        ) {
          userMsg =
            'Registration blocked by database policy (RLS). ' +
            'This is a known issue with manual EFT accounts. ' +
            'Contact support@qilly.co.za — include error code 42501.';
        } else {
          userMsg = `Failed to create contractor profile: [${contractorError.code}] ${contractorError.message}`;
        }

        setError(userMsg);
        // Show a persistent toast so Selenium screenshots capture the exact error
        toast.error('Registration Failed', {
          description: `${userMsg}${contractorError.hint ? ` | Hint: ${contractorError.hint}` : ''}`,
          duration: 15000,
        });

        await supabase.auth.signOut();
        setIsLoading(false);
        setCurrentStep('details');
        return;
      }

      console.log('✅ Contractor record created successfully!');

      // Sign out — contractor must log in after admin approval
      await supabase.auth.signOut();

      // Show confirmation screen with full details
      setConfirmedDetails({
        email: signupData.email,
        companyName: signupData.companyName,
        contactPerson: signupData.contactPerson,
        tierName: selectedTierName,
        tierPrice: selectedTierPrice,
        paymentReference: payment?.reference || '',
      });
      setCurrentStep('confirmed');
    } catch (err) {
      console.error('Signup error:', err);
      
      let userMessage = 'An error occurred during signup. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          userMessage = 'This email is already registered. Please use the login page.';
        } else if (err.message.includes('PGRST204')) {
          userMessage = 'Database configuration error. Please contact support@qilly.co.za';
        } else if (err.message.includes('duplicate key')) {
          userMessage = 'A contractor account with this information already exists.';
        } else if (err.message.includes('network')) {
          userMessage = 'Network error. Please check your connection and try again.';
        } else {
          userMessage = err.message;
        }
      }
      
      setError(userMessage);
      toast.error(userMessage);
      setCurrentStep('details');
    } finally {
      setIsLoading(false);
    }
  };

  // Render appropriate step
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-2 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Step 1: Tier Selection */}
      {currentStep === 'tier' && (
        <TierSelectionStep
          onTierSelect={handleTierSelect}
          onBack={onBack}
        />
      )}

      {/* Step 1: Company Details Form */}
      {currentStep === 'details' && (
        <Card className="shadow-xl border-2 border-blue-100 w-full max-w-6xl my-2">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              Contractor Registration
            </CardTitle>
            <CardDescription className="text-blue-100 text-xs">
              Step 1 of 3: Company Details & Verification
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3">
            <form onSubmit={(e) => { e.preventDefault(); handleDetailsComplete(); }} className="space-y-3">
              {/* Signup Form - Single Column Sequential Layout */}
              <div className="space-y-6">
                {/* Sequential Form Sections */}
                <div className="space-y-5">
                  {/* Company Information */}
                  <div className="space-y-3 p-5 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer pb-2 border-b"
                      onClick={() => toggleSection('company')}
                    >
                      <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Company Information
                      </h3>
                      {expandedSections.company ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {expandedSections.company && (
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="companyName" className="text-sm font-medium">Company Name *</Label>
                          <Input
                            id="companyName"
                            value={signupData.companyName}
                            onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                            placeholder="ABC Construction"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cidbRegistrationNumber" className="text-sm font-medium">
                            CIDB Registration Number <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="cidbRegistrationNumber"
                            value={signupData.cidbRegistrationNumber}
                            onChange={(e) => setSignupData({ ...signupData, cidbRegistrationNumber: e.target.value })}
                            placeholder="CIDB/CR2023/12345"
                            required
                            className="h-10"
                          />
                        </div>
                        
                        {/* CIDB Class - First Dropdown */}
                        <div className="space-y-2">
                          <Label htmlFor="cidbClass" className="text-sm font-medium">
                            CIDB Class <span className="text-red-500">*</span>
                          </Label>
                          <select
                            id="cidbClass"
                            value={signupData.cidbClass}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSignupData(prev => {
                                const className = CIDB_CLASSES.find(c => c.code === value)?.name || '';
                                const gradeNum = prev.cidbGradeNumber;
                                return {
                                  ...prev,
                                  cidbClass: value,
                                  cidbGrade: gradeNum ? `${value}${gradeNum} - ${className} (Grade ${gradeNum})` : ''
                                };
                              });
                            }}
                            required
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select CIDB class</option>
                            {CIDB_CLASSES.map((cls) => (
                              <option key={cls.code} value={cls.code}>
                                {cls.code} - {cls.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* CIDB Grade Number - Second Dropdown */}
                        <div className="space-y-2">
                          <Label htmlFor="cidbGradeNumber" className="text-sm font-medium">
                            CIDB Grade Number <span className="text-red-500">*</span>
                          </Label>
                          <select
                            id="cidbGradeNumber"
                            value={signupData.cidbGradeNumber}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSignupData(prev => {
                                const classCode = prev.cidbClass;
                                const className = CIDB_CLASSES.find(c => c.code === classCode)?.name || '';
                                return {
                                  ...prev,
                                  cidbGradeNumber: value,
                                  cidbGrade: classCode ? `${classCode}${value} - ${className} (Grade ${value})` : ''
                                };
                              });
                            }}
                            required
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select grade number (1-9)</option>
                            {CIDB_GRADE_NUMBERS.map((num) => (
                              <option key={num} value={num}>
                                Grade {num}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Combined CIDB Grade Display */}
                        {signupData.cidbGrade && (
                          <div className="md:col-span-2 p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-blue-700">Your CIDB Grade:</span> {signupData.cidbGrade}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Contact Person */}
                  <div className="space-y-3 p-5 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer pb-2 border-b"
                      onClick={() => toggleSection('contact')}
                    >
                      <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <User className="w-5 h-5 text-blue-600" />
                        Contact Person
                      </h3>
                      {expandedSections.contact ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {expandedSections.contact && (
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson" className="text-sm font-medium">Full Name *</Label>
                          <Input
                            id="contactPerson"
                            value={signupData.contactPerson}
                            onChange={(e) => setSignupData({ ...signupData, contactPerson: e.target.value })}
                            placeholder="Thabo Mokoena"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            placeholder="thabo@abc.co.za"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="phone" className="text-sm font-medium">Phone Number *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            placeholder="+27 11 123 4567"
                            required
                            className="h-10"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-3 p-5 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer pb-2 border-b"
                      onClick={() => toggleSection('address')}
                    >
                      <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        Business Address
                      </h3>
                      {expandedSections.address ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {expandedSections.address && (
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="streetAddress" className="text-sm font-medium">Street Address *</Label>
                          <Input
                            id="streetAddress"
                            value={signupData.streetAddress}
                            onChange={(e) => setSignupData({ ...signupData, streetAddress: e.target.value })}
                            placeholder="123 Main Street"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                          <Input
                            id="city"
                            value={signupData.city}
                            onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                            placeholder="Johannesburg"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode" className="text-sm font-medium">Postal Code *</Label>
                          <Input
                            id="postalCode"
                            value={signupData.postalCode}
                            onChange={(e) => setSignupData({ ...signupData, postalCode: e.target.value })}
                            placeholder="2001"
                            required
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="province" className="text-sm font-medium">Province *</Label>
                          <select
                            id="province"
                            value={signupData.province}
                            onChange={(e) => setSignupData({ ...signupData, province: e.target.value })}
                            required
                            className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select province</option>
                            {PROVINCES.map((province) => (
                              <option key={province} value={province}>
                                {province}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business Details */}
                  <div className="space-y-3 p-5 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer pb-2 border-b"
                      onClick={() => toggleSection('business')}
                    >
                      <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Business Details
                      </h3>
                      {expandedSections.business ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {expandedSections.business && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Project Types * 
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              ({signupData.projectTypes.length} selected)
                            </span>
                          </Label>
                          <div className="grid sm:grid-cols-2 gap-2 p-4 border-2 rounded-lg bg-white max-h-48 overflow-y-auto">
                            {PROJECT_TYPES.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={type}
                                  checked={signupData.projectTypes.includes(type)}
                                  onCheckedChange={() => toggleProjectType(type)}
                                  className="h-4 w-4"
                                />
                                <label
                                  htmlFor={type}
                                  className="text-sm cursor-pointer"
                                >
                                  {type}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">
                            Operating Provinces * 
                            <span className="ml-2 text-xs text-blue-600 font-normal">
                              ({signupData.operatingProvinces.length} selected)
                            </span>
                          </Label>
                          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 p-4 border-2 rounded-lg bg-white">
                            {PROVINCES.map((province) => (
                              <div key={province} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`province-${province}`}
                                  checked={signupData.operatingProvinces.includes(province)}
                                  onCheckedChange={() => toggleOperatingProvince(province)}
                                  className="h-4 w-4"
                                />
                                <label
                                  htmlFor={`province-${province}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {province}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="yearsInBusiness" className="text-sm font-medium">Years in Business *</Label>
                            <Input
                              id="yearsInBusiness"
                              type="number"
                              min="0"
                              value={signupData.yearsInBusiness}
                              onChange={(e) => setSignupData({ ...signupData, yearsInBusiness: e.target.value })}
                              required
                              className="h-10"
                              placeholder="5"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="annualTurnover" className="text-sm font-medium flex items-center gap-1">
                              Annual Turnover (ZAR) *
                              <span className="text-xs text-gray-500 font-normal">(for BBBEE calculation)</span>
                            </Label>
                            <select
                              id="annualTurnover"
                              value={signupData.annualTurnover}
                              onChange={(e) => setSignupData({ ...signupData, annualTurnover: e.target.value })}
                              required
                              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select turnover range</option>
                              <option value="0">Under R10M (EME - No BBBEE fees)</option>
                              <option value="15000000">R10M - R50M (QSE - R23.5k BBBEE)</option>
                              <option value="75000000">Over R50M (Generic - R70k BBBEE)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bbbeeLevel" className="text-sm font-medium">BBBEE Level</Label>
                            <select
                              id="bbbeeLevel"
                              value={signupData.bbbeeLevel}
                              onChange={(e) => setSignupData({ ...signupData, bbbeeLevel: e.target.value })}
                              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select level</option>
                              {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6', 'Level 7', 'Level 8', 'Non-Compliant'].map((level) => (
                                <option key={level} value={level}>
                                  {level}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox
                            id="hasCertification"
                            checked={signupData.hasCertification}
                            onCheckedChange={(checked) => setSignupData({ ...signupData, hasCertification: checked as boolean })}
                            className="h-4 w-4"
                          />
                          <label htmlFor="hasCertification" className="text-sm cursor-pointer">
                            I have industry certifications
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Security */}
                  <div className="space-y-3 p-5 border-2 rounded-lg bg-gradient-to-br from-white to-gray-50 shadow-sm">
                    <div
                      className="flex items-center justify-between cursor-pointer pb-2 border-b"
                      onClick={() => toggleSection('security')}
                    >
                      <h3 className="text-base font-semibold flex items-center gap-2 text-gray-800">
                        <Shield className="w-5 h-5 text-blue-600" />
                        Account Security
                      </h3>
                      {expandedSections.security ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                    </div>
                    {expandedSections.security && (
                      <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                          <Input
                            id="password"
                            type="password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                            minLength={8}
                            className="h-10"
                            placeholder="Min 8 characters"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password *</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                            required
                            minLength={8}
                            className="h-10"
                            placeholder="Re-enter password"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* POPIA Consent Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <Checkbox
                        id="privacy-consent"
                        checked={signupData.privacyConsent}
                        onCheckedChange={(checked) => setSignupData({ ...signupData, privacyConsent: checked as boolean })}
                        className="mt-0.5"
                      />
                      <label htmlFor="privacy-consent" className="text-xs text-gray-700 leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowPrivacyPolicy(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          Privacy Policy
                        </button>{' '}
                        and understand how my personal information will be collected, used, and protected under POPIA (Act 4 of 2013).
                      </label>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <Checkbox
                        id="terms-consent"
                        checked={signupData.agreeToTerms}
                        onCheckedChange={(checked) => setSignupData({ ...signupData, agreeToTerms: checked as boolean })}
                        className="mt-0.5"
                      />
                      <label htmlFor="terms-consent" className="text-xs text-gray-700 leading-relaxed">
                        I agree to the{' '}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowTermsOfService(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 underline font-medium"
                        >
                          Terms of Service
                        </button>
                        , including contractor subscription billing, accurate BOQ generation, SANS 1200 compliance, and CIDB registration verification.
                      </label>
                    </div>
                  </div>

                  {validationErrors.length > 0 && (
                    <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-300 text-center">
                      ⚠️ Please fix the following issues:
                      <ul className="list-disc list-inside">
                        {validationErrors.map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {emailAlreadyExists && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 space-y-3">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h4 className="text-base font-bold text-red-900 mb-2">Email Already Registered</h4>
                          <p className="text-sm text-red-800 mb-3">
                            The email address <strong>{signupData.email}</strong> is already registered in our system.
                          </p>
                          <p className="text-xs text-red-700 mb-4">
                            You have two options:
                          </p>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <Button
                              type="button"
                              onClick={onBack}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Go to Login Page
                            </Button>
                            <Button
                              type="button"
                              onClick={() => {
                                setEmailAlreadyExists(false);
                                setError(null);
                                setSignupData({ ...signupData, email: '' });
                              }}
                              variant="outline"
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              Use Different Email
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {error && !emailAlreadyExists && (
                    <div className="text-sm text-red-700 bg-red-50 p-4 rounded-lg border-2 border-red-200">
                      <p className="font-medium">Error:</p>
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onBack}
                      disabled={isLoading}
                      className="h-11 order-2 sm:order-1"
                    >
                      Back to Login
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading || !signupData.privacyConsent || !signupData.agreeToTerms}
                      className="bg-blue-600 hover:bg-blue-700 h-11 order-1 sm:order-2"
                    >
                      {isLoading ? 'Validating...' : 'Continue to Tier Selection'}
                    </Button>
                  </div>

                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment Form */}
      {currentStep === 'payment' && (
        <PaymentStep
          tier={selectedTier}
          tierName={selectedTierName}
          price={selectedTierPrice}
          companyName={signupData.companyName}
          onPaymentComplete={handlePaymentComplete}
          onBack={() => setCurrentStep('details')}
        />
      )}

      {/* Step 4: Submitting */}
      {currentStep === 'submitting' && (
        <Card className="shadow-xl border-2 border-blue-100 w-full max-w-6xl my-2">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hammer className="w-5 h-5" />
              Contractor Registration - {selectedTierName} Tier
            </CardTitle>
            <CardDescription className="text-blue-100 text-xs">
              Step 4 of 4: Submitting
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-3 pb-3">
            <div className="space-y-3">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold text-blue-700">Submitting...</span> Your account is being created and will be pending admin approval. You'll be notified once approved and can then access all Qilly features!
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Application Confirmed */}
      {currentStep === 'confirmed' && confirmedDetails && (
        <div className="w-full max-w-lg mx-auto">
          {/* Success header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-9 h-9 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Application Received!</h2>
            <p className="text-slate-600 text-sm">
              Thank you, <strong>{confirmedDetails.contactPerson}</strong>. Your application has been submitted successfully.
            </p>
          </div>

          {/* Summary card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm divide-y divide-slate-100 mb-4">
            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Application Summary</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="font-semibold text-slate-800">{confirmedDetails.companyName}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Login Email</p>
                  <p className="font-semibold text-slate-800 break-all">{confirmedDetails.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tier</p>
                  <p className="font-semibold text-blue-700">{confirmedDetails.tierName} — R{confirmedDetails.tierPrice.toLocaleString()}/month</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span className="inline-flex items-center gap-1 text-amber-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                    Pending Admin Approval
                  </span>
                </div>
              </div>
            </div>

            {confirmedDetails.paymentReference && (
              <div className="px-5 py-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Reference</p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 font-mono text-base font-bold text-blue-700 tracking-wider">
                  {confirmedDetails.paymentReference}
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Keep this reference. Our admin will use it to verify your EFT payment.
                </p>
              </div>
            )}

            <div className="px-5 py-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Banking Details (Standard Bank)</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><p className="text-xs text-slate-500">Account Name</p><p className="font-semibold">Assure Tech Solution</p></div>
                <div><p className="text-xs text-slate-500">Account Number</p><p className="font-semibold text-blue-700">1026 1862 306</p></div>
                <div><p className="text-xs text-slate-500">Branch Code</p><p className="font-semibold">00051001</p></div>
                <div><p className="text-xs text-slate-500">Amount</p><p className="font-semibold text-green-700">R{confirmedDetails.tierPrice.toLocaleString()}.00</p></div>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-5">
            <p className="text-xs font-semibold text-blue-800 uppercase tracking-wider mb-3">What Happens Next</p>
            <ol className="space-y-2">
              {[
                'Our admin verifies your EFT payment (usually within 24 hours)',
                'Your account is approved and activated',
                'Log in with your registered email and password to access Qilly',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-blue-900">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Contact + CTA */}
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-500">
              Questions? Email <a href="mailto:billing@qilly.co.za" className="text-blue-600 font-medium hover:underline">billing@qilly.co.za</a> or call <a href="tel:+27837582645" className="text-blue-600 font-medium hover:underline">+27 83 758 2645</a>
            </p>
            <button
              onClick={onSuccess}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            <PrivacyPolicy onBack={() => setShowPrivacyPolicy(false)} />
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl">
            <TermsOfService onBack={() => setShowTermsOfService(false)} />
          </div>
        </div>
      )}
    </div>
  );
}