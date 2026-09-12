import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import {
  Building2,
  Code,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Phone,
  FileText,
  TrendingUp,
  Users,
  AlertCircle,
  Handshake,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';

interface PartnerApplication {
  id: string;
  type: 'construction' | 'software';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  details: {
    cidb?: string;
    annualProjects?: string;
    annualQSFees?: string;
    projectTypes?: string;
    platformType?: string;
    userBase?: string;
    integrationTimeline?: string;
    techStack?: string;
    message?: string;
  };
}

export function PartnerApplicationManagement() {
  const [applications, setApplications] = useState<PartnerApplication[]>([
    {
      id: 'APP-001',
      type: 'construction',
      status: 'pending',
      submittedAt: '2026-03-13T09:30:00',
      company: 'Murray & Roberts Construction',
      contact: 'John van der Merwe',
      email: 'john.vandermerwe@murrob.com',
      phone: '+27 11 456 7890',
      details: {
        cidb: 'GB9CE',
        annualProjects: '35',
        annualQSFees: 'R1,800,000',
        projectTypes: 'Road Construction, Commercial Buildings, Infrastructure',
        message: 'We spend R1.8M annually on QS fees across 35+ projects. Looking to reduce costs by 85% with Qilly.',
      },
    },
    {
      id: 'APP-002',
      type: 'software',
      status: 'pending',
      submittedAt: '2026-03-14T14:15:00',
      company: 'Procore Technologies',
      contact: 'Sarah Johnson',
      email: 'sarah.johnson@procore.com',
      phone: '+1 415 555 0123',
      details: {
        platformType: 'Construction Management Software',
        userBase: '12,500',
        integrationTimeline: 'Q2 2026',
        techStack: 'React, Node.js, AWS, PostgreSQL',
        message: 'Interested in white-label integration. We have 12.5K active users in South Africa and want to add automated BOQ pricing to our platform.',
      },
    },
    {
      id: 'APP-003',
      type: 'software',
      status: 'pending',
      submittedAt: '2026-03-15T10:45:00',
      company: 'Buildsmart SA',
      contact: 'Thabo Mbeki',
      email: 'thabo@buildsmart.co.za',
      phone: '+27 21 789 4560',
      details: {
        platformType: 'Project Management & Tendering Platform',
        userBase: '3,200',
        integrationTimeline: 'Q3 2026',
        techStack: 'Vue.js, Laravel, MySQL',
        message: 'We focus on the South African construction market and want to integrate Qilly\'s BOQ engine as a core feature.',
      },
    },
    {
      id: 'APP-004',
      type: 'construction',
      status: 'approved',
      submittedAt: '2026-03-10T11:20:00',
      company: 'WBHO Construction',
      contact: 'Michael Steyn',
      email: 'michael.steyn@wbho.co.za',
      phone: '+27 11 123 4567',
      details: {
        cidb: 'GB9',
        annualProjects: '48',
        annualQSFees: 'R2,500,000',
        projectTypes: 'Civil Engineering, Mining, Commercial Development',
        message: 'Approved and onboarded. Credentials sent.',
      },
    },
    {
      id: 'APP-005',
      type: 'construction',
      status: 'rejected',
      submittedAt: '2026-03-08T16:30:00',
      company: 'Small Builders Ltd',
      contact: 'Jane Doe',
      email: 'jane@smallbuilders.co.za',
      phone: '+27 82 555 1234',
      details: {
        cidb: 'GB3',
        annualProjects: '5',
        annualQSFees: 'R50,000',
        projectTypes: 'Residential Renovations',
        message: 'Rejected - Not suitable for Custom tier. Recommended Professional tier instead.',
      },
    },
  ]);

  const [selectedApp, setSelectedApp] = useState<PartnerApplication | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalCredentials, setApprovalCredentials] = useState({
    email: '',
    tempPassword: '',
  });

  const pendingApps = applications.filter((app) => app.status === 'pending');
  const approvedApps = applications.filter((app) => app.status === 'approved');
  const rejectedApps = applications.filter((app) => app.status === 'rejected');

  const handleApprove = (app: PartnerApplication) => {
    setSelectedApp(app);
    setApprovalCredentials({
      email: app.email,
      tempPassword: 'Partner' + Math.random().toString(36).substring(2, 8) + '!',
    });
    setShowApprovalDialog(true);
  };

  const confirmApproval = () => {
    if (!selectedApp) return;

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id ? { ...app, status: 'approved' as const } : app
      )
    );

    toast.success(
      `✅ ${selectedApp.company} approved! Credentials sent to ${approvalCredentials.email}`,
      {
        description: 'Partner can now login to their Custom tier account.',
        duration: 5000,
      }
    );

    setShowApprovalDialog(false);
    setSelectedApp(null);
  };

  const handleReject = (app: PartnerApplication) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'rejected' as const } : a))
    );
    toast.error(`Application from ${app.company} rejected`);
  };

  const renderApplicationCard = (app: PartnerApplication) => (
    <Card key={app.id} className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {app.type === 'construction' ? (
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
            ) : (
              <div className="p-2 bg-purple-100 rounded-lg">
                <Code className="h-5 w-5 text-purple-600" />
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{app.company}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Clock className="h-3 w-3" />
                {new Date(app.submittedAt).toLocaleString('en-ZA', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </CardDescription>
            </div>
          </div>
          <Badge
            className={
              app.status === 'pending'
                ? 'bg-yellow-500'
                : app.status === 'approved'
                ? 'bg-green-500'
                : 'bg-red-500'
            }
          >
            {app.status === 'pending' ? (
              <Clock className="h-3 w-3 mr-1" />
            ) : app.status === 'approved' ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {app.status.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{app.contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{app.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{app.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">{app.id}</span>
          </div>
        </div>

        {app.type === 'construction' && (
          <div className="bg-blue-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">CIDB Grading:</span>
              <span className="font-semibold">{app.details.cidb}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual Projects:</span>
              <span className="font-semibold">{app.details.annualProjects}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Annual QS Fees:</span>
              <span className="font-semibold text-green-700">{app.details.annualQSFees}</span>
            </div>
            <div>
              <span className="text-gray-600">Project Types:</span>
              <p className="font-semibold mt-1">{app.details.projectTypes}</p>
            </div>
          </div>
        )}

        {app.type === 'software' && (
          <div className="bg-purple-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Platform Type:</span>
              <span className="font-semibold">{app.details.platformType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User Base:</span>
              <span className="font-semibold text-purple-700">
                {app.details.userBase} users
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Timeline:</span>
              <span className="font-semibold">{app.details.integrationTimeline}</span>
            </div>
            <div>
              <span className="text-gray-600">Tech Stack:</span>
              <p className="font-semibold mt-1">{app.details.techStack}</p>
            </div>
          </div>
        )}

        {app.details.message && (
          <div className="border-l-4 border-gray-300 pl-3">
            <p className="text-sm text-gray-700 italic">{app.details.message}</p>
          </div>
        )}

        {app.status === 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleApprove(app)}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Send Credentials
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
              onClick={() => handleReject(app)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        )}

        {app.status === 'approved' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              ✅ Approved - Credentials sent to {app.email}
            </AlertDescription>
          </Alert>
        )}

        {app.status === 'rejected' && (
          <Alert className="bg-red-50 border-red-200">
            <XCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              ❌ Application rejected
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <Handshake className="h-7 w-7" />
            Partner Application Management
          </CardTitle>
          <CardDescription className="text-blue-100">
            Review and approve partner applications for Custom tier accounts
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingApps.length}</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">{approvedApps.length}</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{rejectedApps.length}</p>
              </div>
              <XCircle className="h-10 w-10 text-red-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">
            Pending ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-6">
          {pendingApps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pending applications</p>
              </CardContent>
            </Card>
          ) : (
            pendingApps.map(renderApplicationCard)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4 mt-6">
          {approvedApps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No approved applications yet</p>
              </CardContent>
            </Card>
          ) : (
            approvedApps.map(renderApplicationCard)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-6">
          {rejectedApps.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No rejected applications</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApps.map(renderApplicationCard)
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Approve Partner Application
            </DialogTitle>
            <DialogDescription>
              Create Custom tier account and send credentials to the partner
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Partner Details</AlertTitle>
                <AlertDescription className="text-blue-800">
                  <strong>Company:</strong> {selectedApp.company}<br />
                  <strong>Contact:</strong> {selectedApp.contact}<br />
                  <strong>Type:</strong>{' '}
                  {selectedApp.type === 'construction'
                    ? 'Construction Firm Partnership'
                    : 'Software Platform (White-Label)'}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div>
                  <Label>Partner Email (Username)</Label>
                  <Input value={approvalCredentials.email} disabled />
                </div>
                <div>
                  <Label>Temporary Password</Label>
                  <Input value={approvalCredentials.tempPassword} disabled />
                  <p className="text-xs text-gray-500 mt-1">
                    Partner will be required to change this on first login
                  </p>
                </div>
              </div>

              <Alert className="bg-green-50 border-green-200">
                <Send className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Email Will Be Sent</AlertTitle>
                <AlertDescription className="text-green-800 text-sm">
                  <strong>Subject:</strong> Welcome to Qilly Partner Program - Your Credentials
                  <br />
                  <strong>Content:</strong>
                  <ul className="list-disc ml-5 mt-2 space-y-1">
                    <li>Welcome message and partnership benefits</li>
                    <li>Login credentials (email + temp password)</li>
                    <li>Link to Partner Portal</li>
                    <li>Next steps: API integration, white-label setup</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmApproval}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Send Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}