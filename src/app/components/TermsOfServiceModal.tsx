import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { FileText } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfServiceModal({ isOpen, onClose }: TermsOfServiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            Terms of Service
          </DialogTitle>
          <DialogDescription>
            Qilly Construction Billing System - Contractor Agreement
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Introduction */}
            <section>
              <h3 className="font-semibold text-base mb-2">1. Agreement to Terms</h3>
              <p className="text-gray-700 leading-relaxed">
                By registering for and using Qilly ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service. Qilly (Pty) Ltd ("Company", "we", "us") reserves the right to modify these Terms at any time.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h3 className="font-semibold text-base mb-2">2. Service Description</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Qilly provides an automated construction billing system that:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Generates Bills of Quantities (BOQs) based on BuildAid 2025/2026 standards</li>
                <li>Prices BOQs using live South African supplier data</li>
                <li>Ensures compliance with SANS 1200 standards</li>
                <li>Integrates with eTender platform (ENTERPRISE tier)</li>
                <li>Provides carbon tracking for green building projects (ENTERPRISE tier)</li>
                <li>Detects potential collusion in pricing (ENTERPRISE tier)</li>
              </ul>
            </section>

            {/* Subscription Tiers */}
            <section>
              <h3 className="font-semibold text-base mb-2">3. Subscription Tiers and Billing</h3>
              
              <div className="space-y-3 ml-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">FREE Tier (Training Mode)</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Unlimited BOQs for training purposes only</li>
                    <li>Mock/encrypted pricing data (not for commercial use)</li>
                    <li>Requires contractor CIDB approval</li>
                    <li>No billing or payment required</li>
                    <li>Cannot be used for live tender submissions</li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">PROFESSIONAL Tier - R2,999/month</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>10 BOQs per month with live pricing</li>
                    <li>SANS 1200 compliant documents</li>
                    <li>Basic supplier integration</li>
                    <li>Email support (24-48hr response)</li>
                    <li>Payment required before account activation</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">ENTERPRISE Tier - R8,999/month</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>30 BOQs per month with live pricing</li>
                    <li>eTender integration for automatic submissions</li>
                    <li>Collusion detection and alerts</li>
                    <li>Green building & carbon tracking</li>
                    <li>Priority support (4-8hr response)</li>
                    <li>Payment required before account activation</li>
                  </ul>
                </div>

                <div className="bg-amber-50 p-3 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">CUSTOM Tier - Contact Sales</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Unlimited BOQs and custom features</li>
                    <li>White-label solution available</li>
                    <li>Custom integrations and on-premise deployment</li>
                    <li>24/7 support with dedicated account manager</li>
                    <li>Custom pricing and billing arrangements</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h3 className="font-semibold text-base mb-2">4. Payment Terms</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Billing Cycle:</strong> Monthly or annual (annual saves 2 months)</li>
                <li><strong>Payment Methods:</strong> Bank transfer, Stitch, PayFast</li>
                <li><strong>Payment Approval:</strong> Manual bank transfers require admin verification (1-2 business days)</li>
                <li><strong>Auto-Renewal:</strong> Subscriptions auto-renew unless cancelled 7 days before billing date</li>
                <li><strong>Refunds:</strong> No refunds for partial months; cancellation effective at end of billing period</li>
                <li><strong>Late Payment:</strong> 7-day grace period, then account suspended until payment received</li>
                <li><strong>Price Changes:</strong> 30-day notice for price increases</li>
              </ul>
            </section>

            {/* CIDB Compliance */}
            <section>
              <h3 className="font-semibold text-base mb-2">5. CIDB Registration and Compliance</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                All contractors must:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Provide valid CIDB registration number and grade</li>
                <li>Maintain active CIDB registration throughout service use</li>
                <li>Notify Qilly of any changes to CIDB status within 7 days</li>
                <li>Acknowledge that Qilly may verify CIDB registration with CIDB</li>
                <li>Accept that invalid CIDB registration may result in account suspension</li>
              </ul>
            </section>

            {/* Data Accuracy */}
            <section>
              <h3 className="font-semibold text-base mb-2">6. Data Accuracy and Validation</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                You agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Provide accurate and truthful information during registration</li>
                <li>Update your company information promptly when changes occur</li>
                <li>Verify all BOQ outputs before submission to clients or tenders</li>
                <li>Acknowledge that Qilly validates contractor details for auto-verification</li>
                <li>Accept that invalid or fraudulent information may result in account termination</li>
              </ul>
            </section>

            {/* Acceptable Use */}
            <section>
              <h3 className="font-semibold text-base mb-2">7. Acceptable Use Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                You agree NOT to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Use FREE tier BOQs for commercial tender submissions</li>
                <li>Share account credentials with unauthorized users</li>
                <li>Attempt to reverse-engineer or copy the Qilly platform</li>
                <li>Use the Service for fraudulent or illegal activities</li>
                <li>Manipulate pricing data or engage in collusion</li>
                <li>Exceed monthly BOQ limits by creating multiple accounts</li>
                <li>Scrape or extract supplier pricing data without authorization</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="font-semibold text-base mb-2">8. Intellectual Property</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Qilly Owns:</strong> All platform code, algorithms, BOQ templates, and supplier integrations.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>You Own:</strong> Your company data, project information, and generated BOQs (but not the templates).
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>License:</strong> Qilly grants you a non-exclusive, non-transferable license to use the Service for your business operations during your active subscription.
              </p>
            </section>

            {/* Warranties and Disclaimers */}
            <section>
              <h3 className="font-semibold text-base mb-2">9. Warranties and Disclaimers</h3>
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>⚠️ IMPORTANT DISCLAIMER:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm ml-4">
                  <li>Qilly provides pricing based on supplier data, but does NOT guarantee accuracy</li>
                  <li>You are responsible for verifying all BOQ outputs before use</li>
                  <li>Qilly is NOT liable for pricing errors, supplier changes, or tender rejections</li>
                  <li>The Service is provided "AS IS" without warranties of merchantability</li>
                  <li>Qilly does NOT guarantee uptime, though we target 99.5% availability</li>
                </ul>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="font-semibold text-base mb-2">10. Limitation of Liability</h3>
              <p className="text-gray-700 leading-relaxed">
                Qilly's total liability for any claim shall not exceed the amount you paid in the previous 12 months. We are NOT liable for indirect, consequential, or punitive damages, including lost profits or business opportunities.
              </p>
            </section>

            {/* Account Termination */}
            <section>
              <h3 className="font-semibold text-base mb-2">11. Account Termination</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>You may terminate:</strong> By cancelling your subscription with 7 days notice.
              </p>
              <p className="text-gray-700 leading-relaxed mb-2">
                <strong>We may terminate if you:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Violate these Terms of Service</li>
                <li>Provide fraudulent information</li>
                <li>Fail to pay invoices within 30 days</li>
                <li>Engage in abusive or illegal activities</li>
                <li>Lose CIDB registration status</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className="font-semibold text-base mb-2">12. Governing Law</h3>
              <p className="text-gray-700 leading-relaxed">
                These Terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of Johannesburg, Gauteng.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="font-semibold text-base mb-2">13. Contact Information</h3>
              <div className="ml-4 space-y-1 text-gray-700">
                <p><strong>Company:</strong> Qilly (Pty) Ltd</p>
                <p><strong>Email:</strong> support@qilly.co.za</p>
                <p><strong>Phone:</strong> +27 11 123 4567</p>
                <p><strong>Address:</strong> Johannesburg, South Africa</p>
              </div>
            </section>

            {/* Effective Date */}
            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-base mb-2">Effective Date</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Version:</strong> 1.0<br />
                <strong>Last Updated:</strong> March 13, 2026<br />
                <strong>Effective Date:</strong> March 13, 2026
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                By using Qilly's services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
