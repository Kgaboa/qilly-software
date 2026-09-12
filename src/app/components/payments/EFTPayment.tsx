import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Copy, Download, AlertTriangle, CheckCircle, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

interface EFTPaymentProps {
  amount: number;
  tier: string;
  cycle: string;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
}

export function EFTPayment({ 
  amount, 
  tier, 
  cycle, 
  userId, 
  userEmail, 
  userName,
  onSuccess 
}: EFTPaymentProps) {
  const [referenceNumber, setReferenceNumber] = useState('');
  const [invoiceId, setInvoiceId] = useState('');

  useEffect(() => {
    generateInvoice();
  }, [amount, tier, cycle]);

  const generateInvoice = () => {
    // Generate unique reference number
    const timestamp = Date.now().toString().slice(-8);
    const userPart = userId.substring(0, 6).toUpperCase();
    const ref = `QILLY-${new Date().getFullYear()}-${userPart}-${timestamp}`;
    setReferenceNumber(ref);

    const invId = `INV-${timestamp}`;
    setInvoiceId(invId);

    // Save to localStorage for admin verification
    const invoices = JSON.parse(localStorage.getItem('pending_invoices') || '[]');
    invoices.push({
      id: invId,
      reference: ref,
      userId,
      userEmail,
      userName,
      amount,
      tier,
      cycle,
      status: 'pending',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    });
    localStorage.setItem('pending_invoices', JSON.stringify(invoices));

    // Send notification email (simulated in demo)
    console.log('Invoice created:', { ref, amount, userEmail });
    
    // In production, send actual email
    // await emailService.sendInvoice({ userEmail, ref, amount, tier, cycle });
  };

  const copyToClipboard = (text: string, label: string) => {
    // Use fallback method that works in Figma Make environment
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        toast.success(`${label} copied to clipboard!`);
      } else {
        toast.error('Copy failed. Please copy manually.');
      }
    } catch (err) {
      toast.error('Copy failed. Please copy manually.');
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Qilly Invoice', 20, 20);
    doc.setFontSize(12);
    doc.text('Construction Billing Intelligence', 20, 30);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice ID: ${invoiceId}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 52);
    doc.text(`Due Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}`, 20, 59);
    
    // Customer details
    doc.text('Bill To:', 20, 75);
    doc.text(userName, 20, 82);
    doc.text(userEmail, 20, 89);
    
    // Line items
    doc.text('Description', 20, 110);
    doc.text('Amount', 150, 110);
    doc.line(20, 112, 190, 112);
    
    const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
    const cycleName = cycle.charAt(0).toUpperCase() + cycle.slice(1);
    doc.text(`${tierName} Plan - ${cycleName} Billing`, 20, 120);
    doc.text(`R ${amount.toLocaleString()}`, 150, 120);
    
    doc.line(20, 125, 190, 125);
    doc.setFontSize(12);
    doc.text('Total Due:', 120, 135);
    doc.text(`R ${amount.toLocaleString()}`, 150, 135);
    
    // Payment instructions
    doc.setFontSize(10);
    doc.text('Payment Instructions:', 20, 155);
    doc.text('Bank: FNB', 20, 165);
    doc.text('Account Name: Qilly (Pty) Ltd', 20, 172);
    doc.text('Account Number: 62XXXXXXXXX', 20, 179);
    doc.text('Branch Code: 250655', 20, 186);
    doc.text('Reference: ' + referenceNumber, 20, 193);
    
    doc.setFontSize(8);
    doc.setTextColor(255, 0, 0);
    doc.text('IMPORTANT: Please use the reference number above when making payment.', 20, 205);
    doc.text('Without this reference, we cannot verify your payment automatically.', 20, 210);
    
    doc.save(`Qilly-Invoice-${invoiceId}.pdf`);
    toast.success('Invoice PDF downloaded!');
  };

  const bankDetails = {
    bank: 'FNB',
    accountName: 'Qilly (Pty) Ltd',
    accountNumber: '62XXXXXXXXX',
    branchCode: '250655',
    swiftCode: 'FIRNZAJJ'
  };

  return (
    <Card className="border-2 border-green-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-green-600" />
              Pay via Bank Transfer (EFT)
            </CardTitle>
            <CardDescription>
              Zero transaction fees • 1-2 business days processing • Government preferred
            </CardDescription>
          </div>
          <Badge className="bg-green-500 text-white text-lg px-4 py-2">
            FREE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Amount */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Total Amount Due</div>
            <div className="text-4xl font-bold text-blue-600">
              R {amount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {tier.charAt(0).toUpperCase() + tier.slice(1)} Plan • {cycle.charAt(0).toUpperCase() + cycle.slice(1)} Billing
            </div>
            <div className="text-sm text-gray-500 mt-1">
              Due: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </div>
          </div>

          {/* CRITICAL: Reference Number */}
          <div className="bg-red-50 border-2 border-red-300 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-red-900 text-lg">CRITICAL: Use This Reference</h3>
            </div>
            <div className="bg-white p-4 rounded border-2 border-red-400 mb-3">
              <div className="text-xs text-gray-600 mb-1">Payment Reference</div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-2xl font-bold text-red-900">
                  {referenceNumber}
                </div>
                <Button 
                  onClick={() => copyToClipboard(referenceNumber, 'Reference number')}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-sm text-red-800 font-semibold">
              ⚠️ Without this exact reference, we cannot verify your payment automatically and activation will be delayed.
            </p>
          </div>

          {/* Bank Details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Bank Account Details</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Bank</div>
                  <div className="font-semibold text-lg">{bankDetails.bank}</div>
                </div>
                <div>
                  <div className="text-gray-600">Account Name</div>
                  <div className="font-semibold">{bankDetails.accountName}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-gray-600 mb-1">Account Number</div>
                  <div className="flex items-center justify-between bg-white p-3 rounded border">
                    <div className="font-mono font-semibold text-lg">{bankDetails.accountNumber}</div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => copyToClipboard(bankDetails.accountNumber, 'Account number')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Branch Code</div>
                  <div className="font-mono font-semibold">{bankDetails.branchCode}</div>
                </div>
                <div>
                  <div className="text-gray-600">SWIFT Code</div>
                  <div className="font-mono font-semibold">{bankDetails.swiftCode}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Payment Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>Log into your online banking or visit your bank branch</li>
              <li>Add Qilly as a new beneficiary using the details above</li>
              <li>Make a payment of <strong>R{amount.toLocaleString()}</strong></li>
              <li>Use reference: <strong className="text-red-600">{referenceNumber}</strong></li>
              <li>Payment will be verified within 24 hours on business days</li>
              <li>You'll receive email confirmation once verified</li>
              <li>Your account will be activated automatically</li>
            </ol>
          </div>

          {/* Download Invoice */}
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={downloadPDF}
            size="lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Invoice PDF
          </Button>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">R0</div>
              <div className="text-xs text-gray-600">Transaction Fee</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1-2</div>
              <div className="text-xs text-gray-600">Business Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">100%</div>
              <div className="text-xs text-gray-600">Secure</div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            Once we verify your payment, you'll receive a confirmation email and your subscription will be activated immediately.
            For urgent queries, contact support@qilly.com with your reference number.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}