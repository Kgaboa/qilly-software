import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Upload, Sparkles, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { PROVINCES } from '@/utils/provincialPricing';
import { SubscriptionUpgradeModal } from '@/app/components/payments/SubscriptionUpgradeModal';
import { supabase } from '@/utils/supabase';

interface HowItWorksProps {
  onNavigateToDashboard?: () => void;
  contractorData?: any;
}

export function HowItWorks({ onNavigateToDashboard, contractorData }: HowItWorksProps = {}) {
  const [showTrialForm, setShowTrialForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isSubmittingTrial, setIsSubmittingTrial] = useState(false);
  
  // Handler for upgrade success
  const handleUpgradeSuccess = async () => {
    setShowUpgradeModal(false);
    toast.success('Subscription upgraded successfully! Reloading your account...');
    // Reload page to reflect new tier
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  const [trialFormData, setTrialFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    province: '',
    businessType: 'supplier', // supplier or contractor
    productCategories: '',
    monthlyVolume: '',
    message: ''
  });

  const handleTrialFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingTrial(true);

    try {
      const trialData = {
        company_name: trialFormData.companyName,
        contact_person: trialFormData.contactPerson,
        email: trialFormData.email,
        phone: trialFormData.phone,
        province: trialFormData.province,
        business_type: trialFormData.businessType,
        product_categories: trialFormData.productCategories,
        monthly_volume: trialFormData.monthlyVolume,
        message: trialFormData.message,
        status: 'active_trial',
        trial_started: new Date().toISOString(),
        trial_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        id: Date.now().toString(),
        submitted_at: new Date().toISOString()
      };

      // Store trial signup in localStorage
      const localTrials = JSON.parse(localStorage.getItem('free_trial_signups') || '[]');
      localTrials.push(trialData);
      localStorage.setItem('free_trial_signups', JSON.stringify(localTrials));
      
      // Log for management review
      console.log('New Free Trial Signup:', {
        timestamp: new Date().toISOString(),
        ...trialData
      });

      toast.success('Welcome to Qilly! Your 30-day free trial has started. Check your email for login details.');

      setShowTrialForm(false);
      setTrialFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        province: '',
        businessType: 'supplier',
        productCategories: '',
        monthlyVolume: '',
        message: ''
      });

      if (onNavigateToDashboard) {
        onNavigateToDashboard();
      }
    } catch (error) {
      console.error('Error submitting trial form:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmittingTrial(false);
    }
  };

  const steps = [
    {
      number: '01',
      title: 'Import Your Bill',
      icon: Upload,
      description: 'Upload your blank, unpriced bill of quantities in any common format. Our system automatically recognizes and parses the document structure.'
    },
    {
      number: '02',
      title: 'Click Generate',
      icon: Sparkles,
      description: 'Our intelligent pricing engine fetches live prices from suppliers and manufacturers, applying the correct formulas and rates automatically.'
    },
    {
      number: '03',
      title: 'Save & Download',
      icon: Download,
      description: 'Your fully priced document is ready. Download it to your device, make any adjustments, and submit your competitive bid with confidence.'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center py-12 bg-gradient-to-br from-[#00b4d8]/10 to-white rounded-lg border">
        <h1 className="text-4xl font-bold mb-4">As Easy as 1, 2, 3</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Our streamlined process takes the complexity out of bill pricing. Focus on winning bids, 
          not crunching numbers.
        </p>
      </div>

      {/* Steps */}
      <div className="space-y-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isImportStep = step.title === 'Import Your Bill';
          const isGenerateStep = step.title === 'Click Generate';
          
          return (
            <Card 
              key={index} 
              className={`border-2 hover:border-[#00b4d8] transition-colors overflow-hidden ${
                (isImportStep || isGenerateStep) && onNavigateToDashboard ? 'cursor-pointer hover:shadow-lg' : ''
              }`}
              onClick={(isImportStep || isGenerateStep) && onNavigateToDashboard ? () => {
                onNavigateToDashboard();
                if (isImportStep) {
                  toast.success('Navigating to Dashboard - Upload your BOQ file to get started!');
                } else if (isGenerateStep) {
                  toast.success('Navigating to Dashboard - Upload a file and click Generate to price your BOQ!');
                }
              } : undefined}
            >
              <div className="flex flex-col md:flex-row">
                {/* Step Number */}
                <div className="bg-[#00b4d8] p-8 flex items-center justify-center md:w-48">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-white">{step.number}</div>
                  </div>
                </div>
                
                {/* Step Content */}
                <div className="flex-1 p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#00b4d8]/20 rounded-lg flex-shrink-0">
                      <Icon className="h-8 w-8 text-[#00b4d8]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold mb-3">{step.title}</h2>
                        {isImportStep && onNavigateToDashboard && (
                          <Button 
                            className="bg-[#00b4d8] hover:bg-[#0096c7]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToDashboard();
                              toast.success('Navigating to Dashboard - Upload your BOQ file to get started!');
                            }}
                          >
                            Go to Upload
                          </Button>
                        )}
                        {isGenerateStep && onNavigateToDashboard && (
                          <Button 
                            className="bg-[#00b4d8] hover:bg-[#0096c7]"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToDashboard();
                              toast.success('Navigating to Dashboard - Upload a file and click Generate to price your BOQ!');
                            }}
                          >
                            Go to Generate
                          </Button>
                        )}
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Additional Info */}
      <Card className="bg-gradient-to-br from-[#00b4d8]/10 to-white border-2">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Why Our Process Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">⚡ Lightning Fast</h3>
              <p className="text-gray-600">
                Complete bill pricing in under 5 minutes. What used to take hours now takes moments.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">🎯 100% Accurate</h3>
              <p className="text-gray-600">
                Automated calculations eliminate human error. Every price and total is verified and correct.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">📊 Live Data</h3>
              <p className="text-gray-600">
                Access real-time pricing from multiple suppliers. Always get the most current rates available.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">💼 Professional</h3>
              <p className="text-gray-600">
                Generate professional, formatted bills ready for submission. Impress clients with polished documents.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA - Conditionally shows upgrade or trial based on contractor status */}
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">
          {contractorData 
            ? 'Upgrade your account to unlock unlimited BOQ pricing and advanced features.'
            : 'Join hundreds of construction businesses already using Qilly.'
          }
        </p>
        <button 
          className="px-8 py-4 bg-[#00b4d8] text-white font-semibold rounded-lg hover:bg-[#0096c7] transition-colors text-lg" 
          onClick={() => contractorData ? setShowUpgradeModal(true) : setShowTrialForm(true)}
        >
          {contractorData ? 'Upgrade to Paid Account' : 'Start Your Free Trial'}
        </button>
      </div>

      {/* Trial Form Dialog */}
      <Dialog open={showTrialForm} onOpenChange={setShowTrialForm}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-[#00b4d8]">Start Your 30-Day Free Trial</DialogTitle>
            <DialogDescription>
              Get full access to Qilly's intelligent pricing engine. No credit card required. 
              Start pricing bills in minutes and see why construction businesses across South Africa trust Qilly.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleTrialFormSubmit} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Your Company (Pty) Ltd"
                  value={trialFormData.companyName}
                  onChange={(e) => setTrialFormData({ ...trialFormData, companyName: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person *</Label>
                <Input
                  id="contactPerson"
                  placeholder="John Doe"
                  value={trialFormData.contactPerson}
                  onChange={(e) => setTrialFormData({ ...trialFormData, contactPerson: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@yourcompany.co.za"
                  value={trialFormData.email}
                  onChange={(e) => setTrialFormData({ ...trialFormData, email: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+27 XX XXX XXXX"
                  value={trialFormData.phone}
                  onChange={(e) => setTrialFormData({ ...trialFormData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Primary Province *</Label>
                <select
                  id="province"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  value={trialFormData.province}
                  onChange={(e) => setTrialFormData({ ...trialFormData, province: e.target.value })}
                  required
                >
                  <option value="">Select Province</option>
                  {PROVINCES.map((province) => (
                    <option key={province.code} value={province.code}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">I am a *</Label>
                <select
                  id="businessType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                  value={trialFormData.businessType}
                  onChange={(e) => setTrialFormData({ ...trialFormData, businessType: e.target.value })}
                  required
                >
                  <option value="supplier">Supplier / Manufacturer</option>
                  <option value="contractor">Contractor / Builder</option>
                  <option value="consultant">Consultant / QS</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCategories">
                {trialFormData.businessType === 'supplier' ? 'Product Categories *' : 'Specialization / Focus Area *'}
              </Label>
              <Input
                id="productCategories"
                placeholder={
                  trialFormData.businessType === 'supplier' 
                    ? "e.g., Cement, Steel, Electrical, etc." 
                    : "e.g., Ground Civils, Building, Roads, etc."
                }
                value={trialFormData.productCategories}
                onChange={(e) => setTrialFormData({ ...trialFormData, productCategories: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyVolume">Estimated Monthly Bill Volume *</Label>
              <select
                id="monthlyVolume"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00b4d8] focus:border-transparent"
                value={trialFormData.monthlyVolume}
                onChange={(e) => setTrialFormData({ ...trialFormData, monthlyVolume: e.target.value })}
                required
              >
                <option value="">Select Volume</option>
                <option value="1-5">1-5 bills per month</option>
                <option value="6-10">6-10 bills per month</option>
                <option value="11-20">11-20 bills per month</option>
                <option value="21-50">21-50 bills per month</option>
                <option value="50+">50+ bills per month</option>
              </select>
              
              {/* Recommended Pricing Plan based on volume */}
              {trialFormData.monthlyVolume && (
                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <p className="text-xs font-semibold text-[#00b4d8] mb-1">💡 Recommended Plan After Trial:</p>
                  {(trialFormData.monthlyVolume === '1-5' || trialFormData.monthlyVolume === '6-10') && (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800">Pay Per Bill - R42/bill</p>
                      <p className="text-xs text-gray-600">Best for your volume: Pay only when you use, no monthly commitment</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trialFormData.monthlyVolume === '1-5' && '≈ R42 - R210/month based on usage'}
                        {trialFormData.monthlyVolume === '6-10' && '≈ R252 - R420/month based on usage'}
                      </p>
                    </div>
                  )}
                  {(trialFormData.monthlyVolume === '11-20' || trialFormData.monthlyVolume === '21-50' || trialFormData.monthlyVolume === '50+') && (
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-green-700">Professional Plan - R1,999/month</p>
                      <p className="text-xs text-gray-600">Best value for your volume: Unlimited bill processing</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {trialFormData.monthlyVolume === '11-20' && 'Save up to R5,481/month vs. pay-per-bill (at 20 bills)'}
                        {trialFormData.monthlyVolume === '21-50' && 'Save up to R8,481/month vs. pay-per-bill (at 50 bills)'}
                        {trialFormData.monthlyVolume === '50+' && 'Unlimited bills - significant savings for high volume'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your business needs, specific requirements, or any questions you have..."
                rows={3}
                value={trialFormData.message}
                onChange={(e) => setTrialFormData({ ...trialFormData, message: e.target.value })}
              />
            </div>

            {/* Trial Benefits Highlight */}
            <div className="bg-[#00b4d8]/10 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-[#00b4d8] mb-2">Your Free Trial Includes:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Unlimited bill pricing for 30 days</li>
                <li>✓ Access to all {PROVINCES.length} provincial pricing databases</li>
                <li>✓ Real-time supplier rates from 40+ trusted suppliers</li>
                <li>✓ Professional export formats (Excel, PDF)</li>
                <li>✓ Full technical support</li>
                <li>✓ No credit card required - cancel anytime</li>
              </ul>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTrialForm(false)}
                disabled={isSubmittingTrial}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00b4d8] hover:bg-[#0096c7]"
                disabled={isSubmittingTrial}
              >
                {isSubmittingTrial ? 'Starting Your Trial...' : 'Start Free Trial Now'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Subscription Upgrade Modal - Only shown for contractors */}
      {contractorData && (
        <SubscriptionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={handleUpgradeSuccess}
          userId={contractorData.id || ''}
          userEmail={contractorData.email || ''}
          userName={contractorData.contact_person || contractorData.company_name || ''}
        />
      )}
    </div>
  );
}
