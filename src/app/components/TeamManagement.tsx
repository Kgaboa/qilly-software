/**
 * Team Management Component
 * 
 * Allows Enterprise and Custom tier contractors to:
 * - View team members
 * - Invite new members
 * - Manage roles
 * - Remove members
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert';
import {
  UserPlus,
  Users,
  Mail,
  Trash2,
  Crown,
  Shield,
  Briefcase,
  Eye,
  AlertCircle,
  Copy,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  getTeamMembers, 
  inviteTeamMember, 
  removeTeamMember,
  updateTeamMemberRole,
  getPendingInvitations,
  getOrganizationByEmail,
  type TeamMember,
  type TeamInvitation,
  type UserRole
} from '@/utils/database/teams';
import type { SubscriptionTier } from '@/utils/tierAccess';

interface TeamManagementProps {
  contractorEmail: string;
  subscriptionTier: SubscriptionTier;
}

const roleIcons: Record<UserRole, any> = {
  owner: Crown,
  admin: Shield,
  project_manager: Briefcase,
  viewer: Eye
};

const roleColors: Record<UserRole, string> = {
  owner: 'bg-purple-100 text-purple-800 border-purple-200',
  admin: 'bg-blue-100 text-blue-800 border-blue-200',
  project_manager: 'bg-green-100 text-green-800 border-green-200',
  viewer: 'bg-gray-100 text-gray-800 border-gray-200'
};

const roleDescriptions: Record<UserRole, string> = {
  owner: 'Full access including billing and user management',
  admin: 'Full access except billing management',
  project_manager: 'Can create, edit, and manage BOQs',
  viewer: 'Read-only access to BOQs and reports'
};

export function TeamManagement({ contractorEmail, subscriptionTier }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<TeamInvitation[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('viewer');
  const [organizationId, setOrganizationId] = useState<string>('');
  const [maxUsers, setMaxUsers] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeamData();
  }, [contractorEmail]);

  const loadTeamData = async () => {
    setIsLoading(true);
    try {
      // Get organization details
      const org = await getOrganizationByEmail(contractorEmail);
      if (!org) {
        toast.error('Organization not found');
        setIsLoading(false);
        return;
      }

      setOrganizationId(org.id);
      setMaxUsers(org.max_users);

      // Load team members and pending invitations
      const [members, invites] = await Promise.all([
        getTeamMembers(org.id),
        getPendingInvitations(org.id)
      ]);

      setTeamMembers(members);
      setPendingInvites(invites);
    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
    }
    setIsLoading(false);
  };

  const handleInviteSubmit = async () => {
    if (!inviteEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Check if already a member
    if (teamMembers.some(m => m.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error('This user is already a team member');
      return;
    }

    // Check if already invited
    if (pendingInvites.some(i => i.email.toLowerCase() === inviteEmail.toLowerCase())) {
      toast.error('An invitation has already been sent to this email');
      return;
    }

    try {
      const invitation = await inviteTeamMember(
        organizationId,
        inviteEmail.trim().toLowerCase(),
        inviteRole,
        contractorEmail
      );

      if (!invitation) {
        toast.error('Failed to send invitation');
        return;
      }

      // Generate invitation link
      const inviteLink = `${window.location.origin}/accept-invite?token=${invitation.token}`;
      
      toast.success(
        <div>
          <p className="font-semibold">Invitation sent to {inviteEmail}!</p>
          <p className="text-sm text-gray-600 mt-1">They'll receive an email with the invitation link.</p>
        </div>
      );

      // Show invitation link (for testing/manual sharing)
      console.log('📧 Invitation link:', inviteLink);

      setShowInviteDialog(false);
      setInviteEmail('');
      setInviteRole('viewer');
      
      loadTeamData(); // Reload to show pending invite
    } catch (error: any) {
      console.error('Error inviting team member:', error);
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Are you sure you want to remove ${memberEmail} from the team?`)) {
      return;
    }

    const success = await removeTeamMember(memberId);
    if (success) {
      toast.success('Team member removed');
      loadTeamData();
    } else {
      toast.error('Failed to remove team member');
    }
  };

  const copyInviteLink = (token: string) => {
    const link = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Invitation link copied to clipboard!');
  };

  const currentMemberCount = teamMembers.length + pendingInvites.length;
  const canInviteMore = currentMemberCount < maxUsers;

  // Check if user can access team management
  const canManageTeam = subscriptionTier === 'enterprise' || subscriptionTier === 'custom';

  if (!canManageTeam) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            Team Collaboration
          </CardTitle>
          <CardDescription>
            Multi-user access for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-blue-50 border-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <AlertTitle className="text-blue-900">Upgrade to Enterprise</AlertTitle>
            <AlertDescription className="text-blue-800">
              Team collaboration with up to 5 concurrent users is available on the Enterprise tier.
              <br /><br />
              <strong>Benefits:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>5 team members with role-based permissions</li>
                <li>Owner, Admin, Project Manager, and Viewer roles</li>
                <li>Real-time collaboration on BOQs</li>
                <li>Activity tracking and audit logs</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{currentMemberCount}/{maxUsers}</div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {maxUsers - currentMemberCount} {maxUsers - currentMemberCount === 1 ? 'slot' : 'slots'} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Active Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">{teamMembers.length}</div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Invites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-yellow-600">{pendingInvites.length}</div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Members Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Team Members
              </CardTitle>
              <CardDescription>
                Manage your team's access and roles
              </CardDescription>
            </div>
            <Button 
              onClick={() => setShowInviteDialog(true)}
              disabled={!canInviteMore}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!canInviteMore && (
            <Alert className="mb-4 bg-amber-50 border-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <AlertTitle className="text-amber-900">Team Limit Reached</AlertTitle>
              <AlertDescription className="text-amber-800">
                You've reached your maximum of {maxUsers} team members. 
                {subscriptionTier === 'enterprise' && (
                  <span> Upgrade to Custom tier for unlimited users.</span>
                )}
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 animate-pulse" />
              <p>Loading team members...</p>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No team members yet</p>
              <p className="text-sm text-gray-400 mt-1">Invite your first team member to get started</p>
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const RoleIcon = roleIcons[member.role];
                    const isOwner = member.email === contractorEmail;

                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="font-semibold text-blue-700">
                                {member.name?.charAt(0).toUpperCase() || member.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="font-semibold">{member.name || 'Unnamed User'}</div>
                              <div className="text-sm text-gray-500">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${roleColors[member.role]} border font-medium`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {member.accepted_at 
                            ? new Date(member.accepted_at).toLocaleDateString()
                            : 'Invited'}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {member.last_login 
                            ? new Date(member.last_login).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          {isOwner ? (
                            <Badge variant="outline" className="text-purple-700 border-purple-300">
                              You
                            </Badge>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveMember(member.id, member.email)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Pending Invitations ({pendingInvites.length})
            </CardTitle>
            <CardDescription>
              Invitations waiting to be accepted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Invited</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvites.map((invite) => {
                    const RoleIcon = roleIcons[invite.role];
                    const expiresIn = Math.ceil(
                      (new Date(invite.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <TableRow key={invite.id}>
                        <TableCell className="font-medium">{invite.email}</TableCell>
                        <TableCell>
                          <Badge className={`${roleColors[invite.role]} border`}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {invite.role.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(invite.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {expiresIn > 0 ? (
                            <span>{expiresIn} {expiresIn === 1 ? 'day' : 'days'}</span>
                          ) : (
                            <span className="text-red-600">Expired</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyInviteLink(invite.token)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Link
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team on Qilly
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="invite-role">Role</Label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option value="viewer">Viewer - Read-only access</option>
                <option value="project_manager">Project Manager - Create & edit BOQs</option>
                <option value="admin">Admin - Full access (no billing)</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                {roleDescriptions[inviteRole]}
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Mail className="w-4 h-4 text-blue-600" />
              <AlertDescription className="text-blue-800 text-sm">
                The invitation will be sent to the email address above. They'll have 7 days to accept it.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteSubmit} className="bg-blue-600 hover:bg-blue-700">
              <Mail className="w-4 h-4 mr-2" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
