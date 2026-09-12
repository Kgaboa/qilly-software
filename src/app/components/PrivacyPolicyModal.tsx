import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Shield } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" />
            Privacy Policy - POPIA Compliance
          </DialogTitle>
          <DialogDescription>
            Protection of Personal Information Act (POPIA), Act 4 of 2013
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Introduction */}
            <section>
              <h3 className="font-semibold text-base mb-2">1. Introduction</h3>
              <p className="text-gray-700 leading-relaxed">
                Qilly (Pty) Ltd ("we", "us", "our") is committed to protecting your personal information in accordance with the Protection of Personal Information Act (POPIA), Act 4 of 2013. This Privacy Policy explains how we collect, use, store, and protect your personal information.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h3 className="font-semibold text-base mb-2">2. Information We Collect</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We collect the following personal information from contractors:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Company name and registration details</li>
                <li>CIDB registration number and grade</li>
                <li>Contact person name, email, and phone number</li>
                <li>Business address (street, city, province, postal code)</li>
                <li>Project types and operating provinces</li>
                <li>Years in business and annual turnover</li>
                <li>BBBEE level and certification status</li>
                <li>Payment information and transaction records</li>
                <li>Account credentials (encrypted passwords)</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h3 className="font-semibold text-base mb-2">3. How We Use Your Information</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                Your personal information is used for the following purposes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Account creation and authentication</li>
                <li>Bill of Quantities (BOQ) generation and pricing</li>
                <li>Subscription billing and payment processing</li>
                <li>CIDB compliance verification</li>
                <li>SANS 1200 standard compliance reporting</li>
                <li>eTender integration (ENTERPRISE tier only)</li>
                <li>Customer support and communication</li>
                <li>Platform improvements and analytics</li>
              </ul>
            </section>

            {/* Legal Basis for Processing */}
            <section>
              <h3 className="font-semibold text-base mb-2">4. Legal Basis for Processing</h3>
              <p className="text-gray-700 leading-relaxed">
                We process your personal information based on:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Consent:</strong> You have explicitly consented to the processing</li>
                <li><strong>Contract:</strong> Processing is necessary for service delivery</li>
                <li><strong>Legal Obligation:</strong> CIDB and SANS compliance requirements</li>
                <li><strong>Legitimate Interest:</strong> Fraud prevention and platform security</li>
              </ul>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h3 className="font-semibold text-base mb-2">5. Data Sharing and Disclosure</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>eTender:</strong> For tender submissions (ENTERPRISE tier with consent)</li>
                <li><strong>Payment Processors:</strong> For subscription billing (Stitch/PayFast)</li>
                <li><strong>CIDB:</strong> For verification purposes only</li>
                <li><strong>Legal Authorities:</strong> When required by South African law</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>We do NOT:</strong> Sell your data to third parties or use it for marketing without consent.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h3 className="font-semibold text-base mb-2">6. Data Security</h3>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Encrypted password storage (bcrypt hashing)</li>
                <li>Encrypted pricing data for FREE tier users</li>
                <li>Role-based access control (RBAC)</li>
                <li>Regular security audits and updates</li>
                <li>Secure cloud infrastructure (Supabase)</li>
              </ul>
            </section>

            {/* Data Retention */}
            <section>
              <h3 className="font-semibold text-base mb-2">7. Data Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Active Accounts:</strong> Duration of subscription + 7 years (tax compliance)</li>
                <li><strong>Inactive Accounts:</strong> 12 months, then archived</li>
                <li><strong>Payment Records:</strong> 7 years (legal requirement)</li>
                <li><strong>POPIA Consent Logs:</strong> Permanent audit trail</li>
              </ul>
            </section>

            {/* Your Rights Under POPIA */}
            <section>
              <h3 className="font-semibold text-base mb-2">8. Your Rights Under POPIA</h3>
              <p className="text-gray-700 leading-relaxed mb-2">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update incorrect or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion (subject to legal obligations)</li>
                <li><strong>Objection:</strong> Object to certain processing activities</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent at any time</li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h3 className="font-semibold text-base mb-2">9. Cookies and Tracking</h3>
              <p className="text-gray-700 leading-relaxed">
                We use essential cookies for:
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Authentication and session management</li>
                <li>User preferences and settings</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-2">
                We do NOT use third-party tracking cookies or analytics without consent.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="font-semibold text-base mb-2">10. Contact Information</h3>
              <p className="text-gray-700 leading-relaxed">
                <strong>Information Officer:</strong>
              </p>
              <div className="ml-4 mt-2 space-y-1 text-gray-700">
                <p>Qilly (Pty) Ltd</p>
                <p>Email: privacy@qilly.co.za</p>
                <p>Phone: +27 11 123 4567</p>
                <p>Address: Johannesburg, South Africa</p>
              </div>
              <p className="text-gray-700 leading-relaxed mt-3">
                <strong>Information Regulator:</strong>
              </p>
              <div className="ml-4 mt-2 space-y-1 text-gray-700">
                <p>Email: inforeg@justice.gov.za</p>
                <p>Phone: +27 10 023 5207</p>
                <p>Website: www.justice.gov.za/inforeg</p>
              </div>
            </section>

            {/* Changes to Policy */}
            <section>
              <h3 className="font-semibold text-base mb-2">11. Changes to This Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or legal requirements. We will notify you of significant changes via email or platform notification.
              </p>
              <p className="text-gray-700 leading-relaxed mt-2">
                <strong>Current Version:</strong> 1.0<br />
                <strong>Last Updated:</strong> March 13, 2026<br />
                <strong>Effective Date:</strong> March 13, 2026
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-base mb-2">Acknowledgment</h3>
              <p className="text-gray-700 leading-relaxed">
                By using Qilly's services and consenting to this Privacy Policy, you acknowledge that you have read, understood, and agree to the collection, use, and disclosure of your personal information as described in this policy, in compliance with POPIA Act 4 of 2013.
              </p>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
