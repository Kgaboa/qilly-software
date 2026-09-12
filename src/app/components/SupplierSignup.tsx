import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Textarea } from '@/app/components/ui/textarea';
import { Checkbox } from '@/app/components/ui/checkbox';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import { Building2, User, Mail, Phone, MapPin, Package, FileText, Shield, DollarSign } from 'lucide-react';
import { supplierDataLayer } from '@/utils/supplierDataLayer';
import { SupplierPricingTiers } from '@/app/components/SupplierPricingTiers';

interface SupplierSignupProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function SupplierSignup({ onSuccess, onBack }: SupplierSignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'pricing' | 'signup'>('pricing');
  const [selectedTier, setSelectedTier] = useState<string>('free');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const [signupData, setSignupData] = useState({
    // Company Information
    companyName: '',
    registrationNumber: '',
    vatNumber: '',
    
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
    productCategories: [] as string[],
    yearsInBusiness: '',
    bbbeeLevel: '',
    hasCertification: false,
    
    // Account
    password: '',
    confirmPassword: '',
    
    // POPIA Consent
    privacyConsent: false,
    agreeToTerms: false,
  });

  const provinces = [
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

  const productCategories = [
    'Building Materials',
    'Cement & Concrete',
    'Steel & Reinforcement',
    'Plumbing & Water',
    'Electrical Equipment',
    'Roofing Materials',
    'Timber & Wood',
    'Paints & Finishes',
    'Hardware & Tools',
    'Road Construction',
    'Other'
  ];

  const toggleCategory = (category: string) => {
    setSignupData(prev => ({
      ...prev,
      productCategories: prev.productCategories.includes(category)
        ? prev.productCategories.filter(c => c !== category)
        : [...prev.productCategories, category]
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    if (signupData.productCategories.length === 0) {
      setError('Please select at least one product category');
      setIsLoading(false);
      return;
    }

    if (!signupData.privacyConsent || !signupData.agreeToTerms) {
      setError('Please accept both Privacy Policy and Terms of Service');
      setIsLoading(false);
      return;
    }

    // Use Supabase for supplier registration
    try {
      // Calculate subscription dates
      const subscriptionStartDate = new Date().toISOString();
      const nextBillingDate = new Date();
      if (billingCycle === 'monthly') {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      } else {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      }

      // 1. Create user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            user_type: 'supplier',
            company_name: signupData.companyName,
          }
        }
      });

      if (authError) {
        // Handle specific error cases
        if (authError.message.includes('User already registered')) {
          setError('This email is already registered. Please use the login page or try a different email.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and confirm your account before logging in.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }
      if (!authData.user) {
        setError('Failed to create user account. Please try again.');
        setIsLoading(false);
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
        console.log('✅ POPIA consent saved for supplier');
      } catch (consentError) {
        console.error('Consent logging error:', consentError);
        // Don't block signup if consent logging fails
      }

      // 2. Insert supplier data into suppliers table
      const supplierData = {
        user_id: authData.user.id,
        company_name: signupData.companyName,
        registration_number: signupData.registrationNumber,
        vat_number: signupData.vatNumber || null,
        contact_person: signupData.contactPerson,
        email: signupData.email,
        phone: signupData.phone,
        street_address: signupData.streetAddress,
        city: signupData.city,
        province: signupData.province,
        postal_code: signupData.postalCode,
        product_categories: signupData.productCategories,
        years_in_business: signupData.yearsInBusiness ? parseInt(signupData.yearsInBusiness) : 0,
        bbbee_level: signupData.bbbeeLevel || null,
        has_certification: signupData.hasCertification,
        status: 'pending',
        subscription_tier: selectedTier,
        billing_cycle: billingCycle,
        subscription_status: selectedTier === 'free' ? 'active' : 'trial',
        subscription_start_date: subscriptionStartDate,
        next_billing_date: nextBillingDate.toISOString(),
        payment_method: selectedTier === 'free' ? null : 'Pending Setup',
        popia_consent_given: true,
        popia_consent_date: new Date().toISOString(),
        popia_consent_version: '1.0',
        terms_consent_given: true,
        terms_consent_date: new Date().toISOString(),
        terms_consent_version: '1.0',
      };

      const { data: supplierRecord, error: supplierError } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (supplierError) {
        console.error('Supplier insert error:', supplierError);
        // Handle specific database errors
        if (supplierError.code === 'PGRST204') {
          setError('Database schema error. Please contact support at support@qilly.co.za');
        } else if (supplierError.message.includes('duplicate key')) {
          setError('A supplier account with this email already exists.');
        } else {
          setError(`Failed to create supplier profile: ${supplierError.message}`);
        }
        // Clean up auth user if supplier creation fails
        await supabase.auth.signOut();
        setIsLoading(false);
        return;
      }

      console.log('✅ Supplier record created:', supplierRecord);
      
      const tierName = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
      toast.success(`Supplier account created successfully! ${tierName} tier selected. Pending admin approval.`);
      
      // Sign out the user (they need admin approval before logging in)
      await supabase.auth.signOut();
      
      setTimeout(() => onSuccess(), 1500);
    } catch (err) {
      console.error('Signup error:', err);
      
      // Better error messages for users
      let userMessage = 'An error occurred during signup. Please try again.';
      
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          userMessage = 'This email is already registered. Please use the login page.';
        } else if (err.message.includes('PGRST204')) {
          userMessage = 'Database configuration error. Please contact support@qilly.co.za';
        } else if (err.message.includes('duplicate key')) {
          userMessage = 'A supplier account with this information already exists.';
        } else if (err.message.includes('network')) {
          userMessage = 'Network error. Please check your connection and try again.';
        } else {
          userMessage = err.message;
        }
      }
      
      setError(userMessage);
      toast.error(userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="shadow-lg border-2 border-blue-100">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardTitle className="text-3xl flex items-center gap-2">
            <Building2 className="w-8 h-8" />
            Supplier Registration
          </CardTitle>
          <CardDescription className="text-blue-100">
            Join the Qilly platform and connect with construction projects across South Africa
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSignup} className="space-y-8">
            {/* Pricing Tiers */}
            {currentStep === 'pricing' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Tiers
                </h3>
                <SupplierPricingTiers 
                  onTierSelect={(tierId) => {
                    setSelectedTier(tierId);
                    setCurrentStep('signup');
                  }} 
                />
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                </div>
              </div>
            )}

            {/* Signup Form */}
            {currentStep === 'signup' && (
              <>
                {/* Selected Tier Summary */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600">Selected Package:</p>
                      <p className="text-xl font-bold text-blue-900 capitalize">{selectedTier} Tier</p>
                      {selectedTier !== 'free' && (
                        <p className="text-sm text-slate-600">
                          Billing: {billingCycle === 'monthly' ? 'Monthly' : 'Annual'}
                        </p>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStep('pricing')}
                      className="border-blue-300 hover:bg-blue-100"
                    >
                      Change Package
                    </Button>
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        value={signupData.companyName}
                        onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNumber">Registration Number *</Label>
                      <Input
                        id="registrationNumber"
                        value={signupData.registrationNumber}
                        onChange={(e) => setSignupData({ ...signupData, registrationNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vatNumber">VAT Number</Label>
                      <Input
                        id="vatNumber"
                        value={signupData.vatNumber}
                        onChange={(e) => setSignupData({ ...signupData, vatNumber: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Person
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Full Name *</Label>
                      <Input
                        id="contactPerson"
                        value={signupData.contactPerson}
                        onChange={(e) => setSignupData({ ...signupData, contactPerson: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Business Address
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="streetAddress">Street Address *</Label>
                      <Input
                        id="streetAddress"
                        value={signupData.streetAddress}
                        onChange={(e) => setSignupData({ ...signupData, streetAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={signupData.city}
                        onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Province *</Label>
                      <Select
                        value={signupData.province}
                        onValueChange={(value) => setSignupData({ ...signupData, province: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          {provinces.map((province) => (
                            <SelectItem key={province} value={province}>
                              {province}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code *</Label>
                      <Input
                        id="postalCode"
                        value={signupData.postalCode}
                        onChange={(e) => setSignupData({ ...signupData, postalCode: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Business Details
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Categories * (Select all that apply)</Label>
                      <div className="grid md:grid-cols-3 gap-3 p-4 border rounded-lg bg-gray-50">
                        {productCategories.map((category) => (
                          <div key={category} className="flex items-center space-x-2">
                            <Checkbox
                              id={category}
                              checked={signupData.productCategories.includes(category)}
                              onCheckedChange={() => toggleCategory(category)}
                            />
                            <label
                              htmlFor={category}
                              className="text-sm cursor-pointer"
                            >
                              {category}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                        <Input
                          id="yearsInBusiness"
                          type="number"
                          min="0"
                          value={signupData.yearsInBusiness}
                          onChange={(e) => setSignupData({ ...signupData, yearsInBusiness: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bbbeeLevel">BBBEE Level (if applicable)</Label>
                        <Select
                          value={signupData.bbbeeLevel}
                          onValueChange={(value) => setSignupData({ ...signupData, bbbeeLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select BBBEE level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Level 1">Level 1</SelectItem>
                            <SelectItem value="Level 2">Level 2</SelectItem>
                            <SelectItem value="Level 3">Level 3</SelectItem>
                            <SelectItem value="Level 4">Level 4</SelectItem>
                            <SelectItem value="Level 5">Level 5</SelectItem>
                            <SelectItem value="Level 6">Level 6</SelectItem>
                            <SelectItem value="Level 7">Level 7</SelectItem>
                            <SelectItem value="Level 8">Level 8</SelectItem>
                            <SelectItem value="Non-Compliant">Non-Compliant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasCertification"
                        checked={signupData.hasCertification}
                        onCheckedChange={(checked) => setSignupData({ ...signupData, hasCertification: checked as boolean })}
                      />
                      <label htmlFor="hasCertification" className="text-sm cursor-pointer">
                        I have relevant industry certifications (SANS, SABS, etc.)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Account Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Security
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                        minLength={8}
                      />
                      <p className="text-xs text-gray-500">Minimum 8 characters</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        required
                        minLength={8}
                      />
                    </div>
                  </div>
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
                    <label htmlFor="privacy-consent" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                      I agree to the Privacy Policy and understand how my personal information will be collected, used, and protected under POPIA (Act 4 of 2013).
                    </label>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                    <Checkbox
                      id="terms-consent"
                      checked={signupData.agreeToTerms}
                      onCheckedChange={(checked) => setSignupData({ ...signupData, agreeToTerms: checked as boolean })}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms-consent" className="text-xs text-gray-700 cursor-pointer leading-relaxed">
                      I agree to the Terms of Service, including supplier subscription billing, accurate pricing updates, product catalog maintenance, and compliance with South African construction standards.
                    </label>
                  </div>
                </div>

                {(!signupData.privacyConsent || !signupData.agreeToTerms) && (
                  <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-lg border border-amber-300 text-center">
                    ⚠️ Please accept both Privacy Policy and Terms of Service to continue
                  </div>
                )}

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Back to Login
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading || !signupData.privacyConsent || !signupData.agreeToTerms}
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                  >
                    {isLoading ? 'Creating Account...' : 'Register as Supplier'}
                  </Button>
                </div>

                <p className="text-xs text-center text-gray-500">
                  Your account will be reviewed by our admin team. You'll receive an email once approved.
                </p>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}