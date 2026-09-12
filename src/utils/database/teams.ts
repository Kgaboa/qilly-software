/**
 * Team & Multi-User Database Operations
 * 
 * Handles team member invitations, role management, and organization access control.
 * Implements multi-user functionality for Enterprise and Custom tiers.
 */

import { supabase } from '@/utils/supabase';
import { nanoid } from 'nanoid';

export type UserRole = 'owner' | 'admin' | 'project_manager' | 'viewer';

export interface TeamMember {
  id: string;
  email: string;
  name?: string;
  organization_id: string;
  role: UserRole;
  invited_by: string;
  invited_at: string;
  accepted_at?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  organization_id: string;
  role: UserRole;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export interface Organization {
  id: string;
  name: string;
  owner_email: string;
  subscription_tier: string;
  max_users: number;
  created_at: string;
  updated_at: string;
}

/**
 * Get organization by contractor email
 */
export async function getOrganizationByEmail(email: string): Promise<Organization | null> {
  try {
    // First, check if contractor has an organization_id
    const { data: contractor } = await supabase
      .from('contractors')
      .select('organization_id')
      .eq('email', email)
      .single();

    if (!contractor?.organization_id) {
      // Create default organization for this contractor
      return await createDefaultOrganization(email);
    }

    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', contractor.organization_id)
      .single();

    if (error) {
      console.error('Error fetching organization:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching organization:', error);
    return null;
  }
}

/**
 * Create default organization for a contractor
 */
async function createDefaultOrganization(email: string): Promise<Organization | null> {
  try {
    const { data: contractor } = await supabase
      .from('contractors')
      .select('company_name, subscription_tier')
      .eq('email', email)
      .single();

    if (!contractor) return null;

    const maxUsers = getMaxUsersForTier(contractor.subscription_tier);

    const { data: org, error } = await supabase
      .from('organizations')
      .insert([{
        name: contractor.company_name || email,
        owner_email: email,
        subscription_tier: contractor.subscription_tier,
        max_users: maxUsers,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating organization:', error);
      return null;
    }

    // Update contractor with organization_id
    await supabase
      .from('contractors')
      .update({ organization_id: org.id })
      .eq('email', email);

    return org;
  } catch (error) {
    console.error('Unexpected error creating organization:', error);
    return null;
  }
}

/**
 * Get max users based on subscription tier
 */
function getMaxUsersForTier(tier: string): number {
  switch (tier) {
    case 'free':
    case 'professional':
      return 1;
    case 'enterprise':
      return 5;
    case 'custom':
      return 999;
    default:
      return 1;
  }
}

/**
 * Get all team members for an organization
 */
export async function getTeamMembers(organizationId: string): Promise<TeamMember[]> {
  try {
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching team members:', error);
    return [];
  }
}

/**
 * Invite a team member
 */
export async function inviteTeamMember(
  organizationId: string,
  email: string,
  role: UserRole,
  invitedBy: string
): Promise<TeamInvitation | null> {
  try {
    // Check if organization has reached max users
    const { data: org } = await supabase
      .from('organizations')
      .select('max_users')
      .eq('id', organizationId)
      .single();

    const currentMembers = await getTeamMembers(organizationId);
    
    if (currentMembers.length >= (org?.max_users || 1)) {
      throw new Error('Maximum team members reached for your subscription tier');
    }

    // Generate invitation token
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days

    const { data, error } = await supabase
      .from('team_invitations')
      .insert([{
        email,
        organization_id: organizationId,
        role,
        invited_by: invitedBy,
        token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating invitation:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error inviting team member:', error);
    return null;
  }
}

/**
 * Accept team invitation
 */
export async function acceptInvitation(token: string, userId: string): Promise<boolean> {
  try {
    // Get invitation
    const { data: invitation, error: invError } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('token', token)
      .is('accepted_at', null)
      .single();

    if (invError || !invitation) {
      console.error('Invalid or expired invitation');
      return false;
    }

    // Check if invitation expired
    if (new Date(invitation.expires_at) < new Date()) {
      console.error('Invitation expired');
      return false;
    }

    // Create team member
    const { error: memberError } = await supabase
      .from('team_members')
      .insert([{
        id: userId,
        email: invitation.email,
        organization_id: invitation.organization_id,
        role: invitation.role,
        invited_by: invitation.invited_by,
        invited_at: invitation.created_at,
        accepted_at: new Date().toISOString(),
        is_active: true,
        created_at: new Date().toISOString()
      }]);

    if (memberError) {
      console.error('Error creating team member:', memberError);
      return false;
    }

    // Mark invitation as accepted
    await supabase
      .from('team_invitations')
      .update({ accepted_at: new Date().toISOString() })
      .eq('token', token);

    return true;
  } catch (error) {
    console.error('Unexpected error accepting invitation:', error);
    return false;
  }
}

/**
 * Remove team member
 */
export async function removeTeamMember(memberId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({ is_active: false })
      .eq('id', memberId);

    if (error) {
      console.error('Error removing team member:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error removing team member:', error);
    return false;
  }
}

/**
 * Update team member role
 */
export async function updateTeamMemberRole(memberId: string, role: UserRole): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('team_members')
      .update({ role })
      .eq('id', memberId);

    if (error) {
      console.error('Error updating team member role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating team member role:', error);
    return false;
  }
}

/**
 * Check if user has permission for an action
 */
export function hasPermission(role: UserRole, action: string): boolean {
  const permissions: Record<UserRole, string[]> = {
    owner: ['all'],
    admin: ['create_boq', 'edit_boq', 'delete_boq', 'view_boq', 'export', 'invite_users', 'view_invoices'],
    project_manager: ['create_boq', 'edit_boq', 'view_boq', 'export'],
    viewer: ['view_boq', 'export']
  };

  const userPermissions = permissions[role] || [];
  return userPermissions.includes('all') || userPermissions.includes(action);
}

/**
 * Get pending invitations for an organization
 */
export async function getPendingInvitations(organizationId: string): Promise<TeamInvitation[]> {
  try {
    const { data, error } = await supabase
      .from('team_invitations')
      .select('*')
      .eq('organization_id', organizationId)
      .is('accepted_at', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pending invitations:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching pending invitations:', error);
    return [];
  }
}
