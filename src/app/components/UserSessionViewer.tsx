/**
 * User Session Viewer Component
 * Shows the currently logged-in user and their subscription status
 * Provides quick actions to manage user accounts
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { toast } from 'sonner';
import { 
  User, 
  Crown, 
  RefreshCw, 
  UserCog, 
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Mail,
  Calendar,
  DollarSign,
  Award
} from 'lucide-react';

interface UserData {
  email: string;
  subscription_tier?: string;
  subscription_status?: string;
  boq_count?: number;
  paid_status?: boolean;
  payment_method?: string;
  subscription_expires_at?: string;
  created_at?: string;
  [key: string]: any;
}

export function UserSessionViewer() {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    migrateOldUserData(); // Migrate old localStorage format to new format
    loadUserData();
  }, [refreshKey]);

  // Migrate old user data format to new demo_users array
  const migrateOldUserData = () => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const currentEmail = sessionStorage.getItem('demo_email');
    
    // Check if current session user exists in demo_users
    if (currentEmail && !users.find((u: UserData) => u.email === currentEmail)) {
      // User not in demo_users - might be using old system
      // Check old localStorage keys
      const oldTrialUsed = localStorage.getItem('demo_trial_used') === 'true';
      const oldPaidStatus = localStorage.getItem('demo_paid_status') === 'true';
      
      // Get BOQ count from sessionStorage
      const bills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
      const boqCount = bills.length;
      
      // Create user entry in new format
      const newUser: UserData = {
        email: currentEmail,
        subscription_tier: oldPaidStatus ? 'professional' : 'free',
        subscription_status: oldPaidStatus ? 'active' : 'trial',
        boq_count: boqCount,
        paid_status: oldPaidStatus,
        created_at: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem('demo_users', JSON.stringify(users));
      console.log(`✅ Migrated user ${currentEmail} to demo_users`);
    }
  };

  const loadUserData = () => {
    const email = sessionStorage.getItem('demo_email');
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    
    setAllUsers(users);
    
    if (email) {
      const user = users.find((u: UserData) => u.email === email);
      setCurrentUser(user || null);
    } else {
      setCurrentUser(null);
    }
  };

  const refresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('User session refreshed');
  };

  const scanForAllUsers = () => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    
    // Scan for users in old format (demo_email in sessionStorage only)
    const currentEmail = sessionStorage.getItem('demo_email');
    if (currentEmail && !users.find((u: UserData) => u.email === currentEmail)) {
      const oldTrialUsed = localStorage.getItem('demo_trial_used') === 'true';
      const oldPaidStatus = localStorage.getItem('demo_paid_status') === 'true';
      const bills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
      
      users.push({
        email: currentEmail,
        subscription_tier: oldPaidStatus ? 'professional' : 'free',
        subscription_status: oldPaidStatus ? 'active' : 'trial',
        boq_count: bills.length,
        paid_status: oldPaidStatus,
        created_at: new Date().toISOString(),
      });
    }
    
    // Scan for supplier emails (from demo_suppliers)
    const suppliers = JSON.parse(localStorage.getItem('demo_suppliers') || '[]');
    suppliers.forEach((supplier: any) => {
      const supplierEmail = supplier.email || supplier.contact_email;
      if (supplierEmail && !users.find((u: UserData) => u.email === supplierEmail)) {
        users.push({
          email: supplierEmail,
          subscription_tier: 'free',
          subscription_status: 'trial',
          boq_count: 0,
          paid_status: false,
          created_at: new Date().toISOString(),
        });
      }
    });
    
    localStorage.setItem('demo_users', JSON.stringify(users));
    toast.success(`Scan complete! Found ${users.length} total users.`);
    refresh();
  };

  const switchUser = (email: string) => {
    sessionStorage.setItem('demo_email', email);
    toast.success(`Switched to user: ${email}`);
    refresh();
  };

  const upgradeUserByEmail = (email: string) => {
    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: UserData) => u.email === email);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        subscription_tier: 'professional',
        subscription_status: 'active',
        paid_status: true,
        payment_method: 'manual_activation',
        subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };

      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`✅ ${email} upgraded to Professional!`);
      refresh();
    }
  };

  const resetUserToTrial = (email: string) => {
    if (!confirm(`Reset ${email} back to free trial?`)) {
      return;
    }

    const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
    const userIndex = users.findIndex((u: UserData) => u.email === email);

    if (userIndex >= 0) {
      users[userIndex] = {
        ...users[userIndex],
        subscription_tier: 'free',
        subscription_status: 'trial',
        paid_status: false,
        boq_count: 0,
        payment_method: undefined,
        subscription_expires_at: undefined,
      };

      localStorage.setItem('demo_users', JSON.stringify(users));
      toast.success(`${email} reset to free trial`);
      refresh();
    }
  };

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'professional':
      case 'premium':
        return <Badge className="bg-purple-600 hover:bg-purple-700">
          <Crown className="w-3 h-3 mr-1" />
          Professional
        </Badge>;
      case 'starter':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Starter</Badge>;
      case 'enterprise':
        return <Badge className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700">
          <Award className="w-3 h-3 mr-1" />
          Enterprise
        </Badge>;
      default:
        return <Badge variant="secondary">Free Trial</Badge>;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'trial':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'expired':
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <Card className="border-2 border-yellow-300 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <UserCog className="w-6 h-6" />
              Admin User Management
            </CardTitle>
            <CardDescription className="text-yellow-700">
              No active user session detected. Manage users below without logging in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900 font-semibold mb-2">
                  💡 Pro Tip: Admin Mode
                </p>
                <p className="text-sm text-blue-800">
                  You don't need to log in as a user to upgrade them! As an admin, you can manage any user's subscription 
                  directly from this page. This allows you to test the user experience in a separate browser tab while 
                  managing their account here.
                </p>
              </div>
              
              {allUsers.length > 0 ? (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Found {allUsers.length} user(s) • Manage subscriptions below:
                  </p>
                  <div className="space-y-3">
                    {allUsers.map((user, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 mb-1">{user.email}</p>
                            <div className="flex items-center gap-3 text-sm mb-3">
                              <div>{getTierBadge(user.subscription_tier)}</div>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600 capitalize flex items-center gap-1">
                                {getStatusIcon(user.subscription_status)}
                                {user.subscription_status || 'trial'}
                              </span>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">
                                {user.boq_count || 0} BOQs used
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => upgradeUserByEmail(user.email)}
                                className="bg-purple-600 hover:bg-purple-700"
                                disabled={user.subscription_tier === 'professional'}
                              >
                                <Crown className="w-3 h-3 mr-1" />
                                {user.subscription_tier === 'professional' 
                                  ? 'Already Pro' 
                                  : 'Upgrade to Pro'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resetUserToTrial(user.email)}
                                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                              >
                                <RefreshCw className="w-3 h-3 mr-1" />
                                Reset to Trial
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => switchUser(user.email)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                <User className="w-3 h-3 mr-1" />
                                Login as User
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-800 mb-3">
                    No users found in localStorage.
                  </p>
                  <Button onClick={scanForAllUsers} className="w-full bg-blue-600 hover:bg-blue-700">
                    <UserCog className="w-4 h-4 mr-2" />
                    Scan for Missing Users
                  </Button>
                  <p className="text-xs text-gray-600 mt-2">
                    This will search sessionStorage and localStorage for any users that haven't been migrated yet.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button onClick={refresh} variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button onClick={scanForAllUsers} variant="outline" className="w-full">
                  <UserCog className="w-4 h-4 mr-2" />
                  Scan for Users
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Details */}
        {allUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🔧 Technical Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs font-mono bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <span className="text-gray-600">Session Storage (demo_email):</span>
                  <span className="ml-2 text-red-600">empty (no user logged in)</span>
                </div>
                <div>
                  <span className="text-gray-600">Local Storage Users Count:</span>
                  <span className="ml-2 text-gray-900">{allUsers.length}</span>
                </div>
                <div>
                  <span className="text-gray-600">All Users:</span>
                  <pre className="mt-2 bg-white p-2 rounded border border-gray-300 overflow-x-auto max-h-60">
                    {JSON.stringify(allUsers, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current User Card */}
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-6 h-6 text-green-600" />
              Active User Session
            </div>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </CardTitle>
          <CardDescription>
            Currently logged in as <strong>{currentUser.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Email</p>
                  <p className="font-semibold text-gray-900">{currentUser.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Subscription Tier</p>
                  <div className="mt-1">
                    {getTierBadge(currentUser.subscription_tier)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {getStatusIcon(currentUser.subscription_status)}
                <div>
                  <p className="text-xs text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900 capitalize">
                    {currentUser.subscription_status || 'trial'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-600">Payment Status</p>
                  <div className="flex items-center gap-2">
                    {currentUser.paid_status ? (
                      <Badge className="bg-green-600">Paid</Badge>
                    ) : (
                      <Badge variant="secondary">Unpaid</Badge>
                    )}
                    {currentUser.payment_method && (
                      <span className="text-xs text-gray-600">
                        via {currentUser.payment_method}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Usage Stats */}
            <div className="space-y-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">BOQ Count</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currentUser.boq_count || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {currentUser.subscription_tier === 'free' || currentUser.subscription_tier === 'trial' || !currentUser.subscription_tier
                    ? `${3 - (currentUser.boq_count || 0)} free BOQs remaining`
                    : 'Unlimited BOQs'}
                </p>
              </div>

              {currentUser.subscription_expires_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Expires</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(currentUser.subscription_expires_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {currentUser.created_at && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-600">Account Created</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(currentUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                onClick={() => upgradeUserByEmail(currentUser.email)}
                className="bg-purple-600 hover:bg-purple-700"
                disabled={currentUser.subscription_tier === 'professional'}
              >
                <Crown className="w-4 h-4 mr-2" />
                {currentUser.subscription_tier === 'professional' 
                  ? 'Already Professional' 
                  : 'Upgrade to Professional'}
              </Button>
              <Button
                onClick={() => resetUserToTrial(currentUser.email)}
                variant="outline"
                className="border-yellow-500 text-yellow-700 hover:bg-yellow-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset to Trial
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Users List */}
      {allUsers.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5" />
              All Users ({allUsers.length})
            </CardTitle>
            <CardDescription>
              Switch between different user accounts for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {allUsers.map((user, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 flex items-center justify-between ${
                    user.email === currentUser.email
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">{user.email}</p>
                      {user.email === currentUser.email && (
                        <Badge className="bg-green-600">Active</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div>{getTierBadge(user.subscription_tier)}</div>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600 capitalize">
                        {user.subscription_status || 'trial'}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">
                        {user.boq_count || 0} BOQs
                      </span>
                    </div>
                  </div>
                  {user.email !== currentUser.email && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => switchUser(user.email)}
                    >
                      Switch
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technical Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">🔧 Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs font-mono bg-gray-50 p-4 rounded border border-gray-200">
            <div>
              <span className="text-gray-600">Session Storage (demo_email):</span>
              <span className="ml-2 text-gray-900">{sessionStorage.getItem('demo_email')}</span>
            </div>
            <div>
              <span className="text-gray-600">Local Storage Users Count:</span>
              <span className="ml-2 text-gray-900">{allUsers.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Current User Object:</span>
              <pre className="mt-2 bg-white p-2 rounded border border-gray-300 overflow-x-auto">
                {JSON.stringify(currentUser, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}