import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { 
  RefreshCw, 
  Trash2, 
  Zap, 
  AlertTriangle, 
  CheckCircle,
  Database,
  User,
  CreditCard,
  Code,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export function DeveloperTools() {
  const [userEmail, setUserEmail] = useState('');
  const [selectedTier, setSelectedTier] = useState<'free' | 'professional' | 'enterprise' | 'custom'>('professional');
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'annual'>('monthly');

  // Reset trial for current user
  const resetCurrentUserTrial = () => {
    const email = sessionStorage.getItem('demo_email');
    if (!email) {
      toast.error('No user logged in');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex >= 0) {
      users[userIndex].boq_count = 0;
      users[userIndex].subscription_tier = 'free';
      users[userIndex].subscription_status = 'trial';
      users[userIndex].paid_status = false;
      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success('Trial reset! You can now process 1 free BOQ again.');
    } else {
      toast.error('User not found');
    }
  };

  // Reset trial for specific user
  const resetSpecificUserTrial = () => {
    if (!userEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === userEmail);

    if (userIndex >= 0) {
      users[userIndex].boq_count = 0;
      users[userIndex].subscription_tier = 'free';
      users[userIndex].subscription_status = 'trial';
      users[userIndex].paid_status = false;
      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`Trial reset for ${userEmail}`);
      setUserEmail('');
    } else {
      toast.error('User not found');
    }
  };

  // Manually activate subscription for current user
  const activateSubscription = () => {
    const email = sessionStorage.getItem('demo_email');
    if (!email) {
      toast.error('No user logged in');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex >= 0) {
      users[userIndex].subscription_tier = selectedTier;
      users[userIndex].subscription_status = 'active';
      users[userIndex].subscription_cycle = selectedCycle;
      users[userIndex].paid_status = true;
      users[userIndex].boq_count = 0;
      users[userIndex].next_billing_date = new Date(
        Date.now() + (selectedCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ).toISOString();
      users[userIndex].last_payment_date = new Date().toISOString();
      users[userIndex].payment_method = 'dev-manual';
      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`${selectedTier.toUpperCase()} subscription activated!`);
    } else {
      toast.error('User not found');
    }
  };

  // Manually activate subscription for specific user
  const activateSpecificUserSubscription = () => {
    if (!userEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === userEmail);

    if (userIndex >= 0) {
      users[userIndex].subscription_tier = selectedTier;
      users[userIndex].subscription_status = 'active';
      users[userIndex].subscription_cycle = selectedCycle;
      users[userIndex].paid_status = true;
      users[userIndex].boq_count = 0;
      users[userIndex].next_billing_date = new Date(
        Date.now() + (selectedCycle === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000
      ).toISOString();
      users[userIndex].last_payment_date = new Date().toISOString();
      users[userIndex].payment_method = 'dev-manual';
      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`${selectedTier.toUpperCase()} subscription activated for ${userEmail}`);
      setUserEmail('');
    } else {
      toast.error('User not found');
    }
  };

  // Clear all payment data
  const clearAllPayments = () => {
    if (confirm('Are you sure? This will clear all payment history, invoices, and requests.')) {
      localStorage.removeItem('pending_invoices');
      localStorage.removeItem('upgrade_requests');
      localStorage.removeItem('stitch_payments');
      localStorage.removeItem('payfast_payments');
      toast.success('All payment data cleared');
    }
  };

  // View current user info
  const viewCurrentUser = () => {
    const email = sessionStorage.getItem('demo_email');
    if (!email) {
      toast.error('No user logged in');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const user = users.find((u: any) => u.email === email);

    if (user) {
      console.log('Current User:', user);
      const info = `
Email: ${user.email}
Tier: ${user.subscription_tier || 'free'}
Status: ${user.subscription_status || 'trial'}
BOQ Count: ${user.boq_count || 0}
Paid: ${user.paid_status ? 'Yes' : 'No'}
      `.trim();
      toast.success('User info logged to console');
      alert(info);
    }
  };

  // Get all users
  const getAllUsers = () => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    console.log('All Users:', users);
    toast.success(`Found ${users.length} users - check console`);
  };

  // Clear all users (dangerous!)
  const clearAllUsers = () => {
    if (confirm('⚠️ DANGER: This will delete ALL users. Are you absolutely sure?')) {
      if (confirm('This cannot be undone. Proceed?')) {
        localStorage.removeItem('demo_users');
        toast.success('All users cleared');
      }
    }
  };

  // Simulate BOQ count
  const simulateBOQUsage = (count: number) => {
    const email = sessionStorage.getItem('demo_email');
    if (!email) {
      toast.error('No user logged in');
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex >= 0) {
      users[userIndex].boq_count = count;
      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`BOQ count set to ${count}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Alert className="bg-red-50 border-red-300">
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <AlertDescription className="text-red-800">
          <strong>Developer Tools - Use with Caution!</strong> These tools directly manipulate localStorage
          and can affect subscription testing. Use only in development/demo environments.
        </AlertDescription>
      </Alert>

      {/* Current User Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-6 h-6 text-blue-600" />
            Current User Quick Actions
          </CardTitle>
          <CardDescription>
            Manage the currently logged-in user's subscription and trial state
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* User Info */}
          <div className="flex gap-3">
            <Button onClick={viewCurrentUser} variant="outline" className="flex-1">
              <User className="w-4 h-4 mr-2" />
              View Current User
            </Button>
            <Button onClick={getAllUsers} variant="outline" className="flex-1">
              <Database className="w-4 h-4 mr-2" />
              List All Users
            </Button>
          </div>

          {/* Trial Reset */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-yellow-600" />
              Reset Free Trial
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Reset BOQ count to 0 and revert to free trial status. Use this to test the free trial block again.
            </p>
            <Button 
              onClick={resetCurrentUserTrial}
              className="bg-yellow-600 hover:bg-yellow-700 w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset My Trial (Set BOQ Count = 0)
            </Button>
          </div>

          {/* Subscription Activation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              Manually Activate Subscription
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Instantly activate a paid subscription without going through payment flow. Use this to test subscription features.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <Label className="text-xs">Tier</Label>
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">Cycle</Label>
                <select
                  value={selectedCycle}
                  onChange={(e) => setSelectedCycle(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="monthly">Monthly</option>
                  <option value="annual">Annual</option>
                </select>
              </div>
            </div>
            
            <Button 
              onClick={activateSubscription}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Activate {selectedTier.toUpperCase()} Now
            </Button>
          </div>

          {/* BOQ Simulation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-600" />
              Simulate BOQ Usage
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Set BOQ count to test different scenarios (free users are blocked after 1 BOQ)
            </p>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                onClick={() => simulateBOQUsage(0)}
                variant="outline"
                size="sm"
              >
                0 BOQs
              </Button>
              <Button 
                onClick={() => simulateBOQUsage(1)}
                variant="outline"
                size="sm"
              >
                1 BOQ
              </Button>
              <Button 
                onClick={() => simulateBOQUsage(5)}
                variant="outline"
                size="sm"
              >
                5 BOQs
              </Button>
              <Button 
                onClick={() => simulateBOQUsage(10)}
                variant="outline"
                size="sm"
              >
                10 BOQs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specific User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-purple-600" />
            Manage Specific User
          </CardTitle>
          <CardDescription>
            Reset trial or activate subscription for any user by email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>User Email</Label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tier</Label>
              <select
                value={selectedTier}
                onChange={(e) => setSelectedTier(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Cycle</Label>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={resetSpecificUserTrial}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Trial
            </Button>
            <Button 
              onClick={activateSpecificUserSubscription}
              className="bg-green-600 hover:bg-green-700 flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Activate Subscription
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Payment Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-orange-600" />
            Payment Data Management
          </CardTitle>
          <CardDescription>
            Clear payment history, invoices, and upgrade requests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-orange-600" />
              Clear All Payments
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Removes all pending invoices (EFT), upgrade requests (sales), and payment history.
              User subscriptions remain intact.
            </p>
            <Button 
              onClick={clearAllPayments}
              variant="outline"
              className="w-full border-orange-400 text-orange-700 hover:bg-orange-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Payment Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-6 h-6" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600">
            Destructive actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Delete All Users
            </h4>
            <p className="text-sm text-red-800 mb-3">
              ⚠️ This will permanently delete ALL users from localStorage. You will need to re-register.
              This action cannot be undone!
            </p>
            <Button 
              onClick={clearAllUsers}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete All Users (DANGER!)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card className="bg-blue-50 border-blue-300">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            Testing Workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>
              <strong>Test Free Trial Block:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Reset your trial using "Reset My Trial"</li>
                <li>Process 1 BOQ (should succeed)</li>
                <li>Try to process another BOQ (should be blocked and show upgrade modal)</li>
              </ul>
            </li>
            <li className="mt-3">
              <strong>Test Subscription Features:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Use "Activate Subscription" to get a paid plan</li>
                <li>Process multiple BOQs (should work unlimited)</li>
                <li>Test different tier features</li>
              </ul>
            </li>
            <li className="mt-3">
              <strong>Test Payment Flows:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Reset trial, trigger upgrade modal</li>
                <li>Try EFT payment (creates invoice in admin panel)</li>
                <li>Try Contact Sales (creates request in admin panel)</li>
                <li>Go to Admin → Payment Verification to verify/reject</li>
              </ul>
            </li>
            <li className="mt-3">
              <strong>After Testing:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>Reset trial to start fresh</li>
                <li>Or activate subscription to continue testing paid features</li>
              </ul>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
