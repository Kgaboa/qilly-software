import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Clock, Mail, Phone, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ManualUpgradeProps {
  amount: number;
  tier: string;
  cycle: string;
  userId: string;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
}

export function ManualUpgrade({ 
  amount, 
  tier, 
  cycle, 
  userId, 
  userEmail, 
  userName,
  onSuccess 
}: ManualUpgradeProps) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSales = async () => {
    setIsSubmitting(true);

    try {
      // Save upgrade request to localStorage
      const requests = JSON.parse(localStorage.getItem('upgrade_requests') || '[]');
      const request = {
        id: `REQ-${Date.now()}`,
        userId,
        userEmail,
        userName,
        tier,
        cycle,
        amount,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      requests.push(request);
      localStorage.setItem('upgrade_requests', JSON.stringify(requests));

      // In production, send email to sales team
      // await emailService.sendSalesRequest(request);
      
      console.log('Sales request created:', request);
      
      toast.success('Request sent! Our sales team will contact you within 24 hours.');
      onSuccess();
    } catch (error) {
      console.error('Failed to send request:', error);
      toast.error('Failed to send request. Please try emailing us directly at sales@qilly.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-amber-500">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-600" />
              Contact Sales Team
            </CardTitle>
            <CardDescription>
              Speak to our team • Custom pricing • Enterprise solutions • Bulk discounts
            </CardDescription>
          </div>
          <Badge className="bg-amber-500 text-white text-lg px-4 py-2">
            Custom
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Selected Plan Summary */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Selected Plan</div>
            <div className="text-3xl font-bold text-amber-600">
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </div>
            <div className="text-xl font-semibold text-gray-900 mt-2">
              R {amount.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              {cycle.charAt(0).toUpperCase() + cycle.slice(1)} Billing
            </div>
          </div>

          {/* Why Contact Sales */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              Why Contact Our Sales Team?
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Volume Discounts:</strong> Get special pricing for multiple users or departments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Custom Solutions:</strong> Tailored features for government departments</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Flexible Payment:</strong> Purchase orders, annual invoicing, and more</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>Implementation Support:</strong> Dedicated onboarding and training</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span><strong>SLA Guarantees:</strong> Custom service level agreements</span>
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="message">Your Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us about your requirements, number of users, specific needs, or any questions you have..."
                rows={5}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps us prepare for our call with you
              </p>
            </div>
          </div>

          {/* Contact Info Display */}
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Your Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-600" />
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold">{userName}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            onClick={handleContactSales}
            disabled={isSubmitting}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Request...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Contact Sales Team
              </>
            )}
          </Button>

          {/* Response Time */}
          <Alert className="bg-green-50 border-green-300">
            <Clock className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-sm text-green-800">
              <strong>Fast Response:</strong> Our sales team will contact you within 24 hours 
              during business days. For urgent requests, email us directly at sales@qilly.com 
              or call +27 (0)11 XXX XXXX.
            </AlertDescription>
          </Alert>

          {/* Alternative Contact Methods */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-sm">Alternative Contact Methods</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-600" />
                <span className="text-gray-600">Email:</span>
                <a href="mailto:sales@qilly.com" className="text-blue-600 hover:underline font-semibold">
                  sales@qilly.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Phone:</span>
                <a href="tel:+27011XXXXXXX" className="text-green-600 hover:underline font-semibold">
                  +27 (0)11 XXX XXXX
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600">Hours:</span>
                <span className="font-semibold">Mon-Fri, 8:00 AM - 5:00 PM SAST</span>
              </div>
            </div>
          </div>

          {/* DHS/Government Notice */}
          {tier === 'custom' && (
            <Alert className="bg-purple-50 border-purple-300">
              <AlertCircle className="w-4 h-4 text-purple-600" />
              <AlertDescription className="text-sm text-purple-800">
                <strong>Government Departments:</strong> We have special pricing and implementation 
                packages for Department of Human Settlements and other government entities. Our team 
                can help with procurement processes, compliance documentation, and bulk licensing.
              </AlertDescription>
            </Alert>
          )}

          {/* Features Preview */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-sm">What You Get</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>Unlimited BOQ pricing</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>All 9 provinces</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>Compliance tracking</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>Priority support</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>Custom integrations</span>
              </div>
              <div className="flex items-start gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-600 mt-0.5" />
                <span>Dedicated support</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            By contacting sales, you'll receive personalized assistance to find the perfect solution for your needs.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
