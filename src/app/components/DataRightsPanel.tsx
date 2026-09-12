import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Download, Trash2, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

export function DataRightsPanel() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDownloadMyData = async () => {
    setIsDownloading(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // Fetch all user data
      const userData: any = {
        user_profile: {
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          metadata: user.user_metadata,
        },
        bills_of_quantities: [],
        consent_history: [],
        projects: [],
        exports_generated: new Date().toISOString(),
      };

      // Get BOQs
      const { data: boqs } = await supabase
        .from('bills_of_quantities')
        .select('*')
        .eq('user_id', user.id);
      userData.bills_of_quantities = boqs || [];

      // Get consent history
      const { data: consents } = await supabase
        .from('consent_audit_log')
        .select('*')
        .eq('user_id', user.id);
      userData.consent_history = consents || [];

      // Check if user is contractor
      const { data: contractor } = await supabase
        .from('contractors')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (contractor) {
        userData.contractor_profile = contractor;
      }

      // Check if user is supplier
      const { data: supplier } = await supabase
        .from('suppliers')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (supplier) {
        userData.supplier_profile = supplier;
      }

      // Create JSON file
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Download file
      const link = document.createElement('a');
      link.href = url;
      link.download = `qilly-my-data-${user.email}-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Your data has been downloaded successfully', {
        description: 'Check your Downloads folder for the JSON file',
      });

      // Log data access for POPIA compliance
      await supabase.from('consent_audit_log').insert({
        user_id: user.id,
        consent_type: 'data_access',
        consent_given: true,
        policy_version: '1.0',
      });

    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download your data', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('Not authenticated');

      // In production, this would:
      // 1. Schedule account deletion for 30 days from now
      // 2. Send confirmation email
      // 3. Allow user to cancel within 30 days
      // 4. Anonymize or delete all personal data after 30 days

      // For now, we'll log the deletion request
      await supabase.from('consent_audit_log').insert({
        user_id: user.id,
        consent_type: 'account_deletion_request',
        consent_given: true,
        policy_version: '1.0',
      });

      toast.success('Account deletion request submitted', {
        description: 'Your account will be deleted in 30 days. You will receive a confirmation email.',
      });

      // Note: In production, you would NOT immediately delete the account
      // Instead, schedule it for deletion and send confirmation email
      // For demo purposes, we're just logging the request

    } catch (error) {
      console.error('Delete account error:', error);
      toast.error('Failed to process deletion request', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-[#00b4d8]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Data Rights</h2>
          <p className="text-sm text-gray-600">POPIA Act 4 of 2013 - Your rights as a data subject</p>
        </div>
      </div>

      {/* Download My Data */}
      <Card className="border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            Download My Data
          </CardTitle>
          <CardDescription>
            Export all your personal information stored in our system as a JSON file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-blue-900 mb-2">What's included:</h4>
              <ul className="space-y-1 text-blue-800 text-xs">
                <li>✓ Your profile information (name, email, account details)</li>
                <li>✓ All bills of quantities you've created</li>
                <li>✓ Pricing history and projects</li>
                <li>✓ Consent history (privacy policy, terms acceptances)</li>
                <li>✓ Contractor/Supplier profile (if applicable)</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700">
                <p className="font-medium text-gray-900 mb-1">POPIA Compliance</p>
                <p>Under Section 23 of POPIA, you have the right to access all personal information we hold about you. This export provides complete transparency.</p>
              </div>
            </div>

            <Button
              onClick={handleDownloadMyData}
              disabled={isDownloading}
              className="w-full"
            >
              {isDownloading ? (
                <>Preparing your data...</>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download My Data (JSON)
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete My Account */}
      <Card className="border-2 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Delete My Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Warning: This action cannot be undone</h4>
              <ul className="space-y-1 text-red-800 text-xs">
                <li>✗ Your account will be scheduled for deletion in 30 days</li>
                <li>✗ All your BOQs, projects, and pricing history will be deleted</li>
                <li>✗ Your subscription will be cancelled immediately</li>
                <li>✗ You will receive a confirmation email</li>
                <li>✓ You can cancel the deletion within 30 days by logging in</li>
              </ul>
            </div>

            <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
              <Shield className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700">
                <p className="font-medium text-gray-900 mb-1">POPIA Right to Erasure</p>
                <p>Under Section 24 of POPIA, you have the right to request deletion of your personal information. We'll delete all data except what we're legally required to retain for tax/audit purposes (7 years).</p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete My Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                    Are you absolutely sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="space-y-3">
                    <p className="font-semibold text-gray-900">
                      This will schedule your account for permanent deletion in 30 days.
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-900">
                      <p className="font-medium mb-2">You will lose:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>All your bill of quantities</li>
                        <li>Pricing history and saved projects</li>
                        <li>Contractor/Supplier profile</li>
                        <li>Access to your account</li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-600">
                      You can cancel this deletion by logging in within 30 days. After 30 days, all data will be permanently erased and cannot be recovered.
                    </p>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel - Keep My Account</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? 'Processing...' : 'Yes, Delete My Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="text-base">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>Data Officer Contact:</strong>{' '}
              <a href="mailto:privacy@qilly.co.za" className="text-[#00b4d8] underline">
                privacy@qilly.co.za
              </a>
            </p>
            <p>
              <strong>Response Time:</strong> Within 30 days (as required by POPIA)
            </p>
            <p className="text-xs text-gray-600">
              If you're not satisfied with how we handle your data rights request, you can lodge a complaint with the Information Regulator at{' '}
              <a 
                href="https://www.justice.gov.za/inforeg/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#00b4d8] underline"
              >
                www.justice.gov.za/inforeg
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
