/**
 * Contractor Database Operations
 * 
 * Handles all contractor-related database operations using Supabase.
 * This replaces localStorage with proper database persistence.
 */

import { supabase } from '@/utils/supabase';
import type { SubscriptionTier } from '@/utils/tierAccess';

export interface Contractor {
  id: string;
  email: string;
  company_name?: string;
  contact_person?: string;
  phone?: string;
  cidb_grade?: string;
  subscription_tier: SubscriptionTier;
  subscription_status: 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_cycle: 'monthly' | 'annual';
  paid_status: boolean;
  boq_count: number;
  boq_limit: number;
  last_payment_date?: string;
  next_billing_date?: string;
  payment_method?: 'eft' | 'card' | 'payfast' | 'stitch';
  created_at: string;
  updated_at: string;
  organization_id?: string;
}

export interface ContractorUpdate {
  subscription_tier?: SubscriptionTier;
  subscription_status?: 'trial' | 'active' | 'cancelled' | 'expired';
  subscription_cycle?: 'monthly' | 'annual';
  paid_status?: boolean;
  boq_count?: number;
  last_payment_date?: string;
  next_billing_date?: string;
  payment_method?: string;
}

/**
 * Get contractor by email
 */
export async function getContractorByEmail(email: string): Promise<Contractor | null> {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching contractor:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching contractor:', error);
    return null;
  }
}

/**
 * Get contractor by ID
 */
export async function getContractorById(id: string): Promise<Contractor | null> {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching contractor:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error fetching contractor:', error);
    return null;
  }
}

/**
 * Update contractor subscription details
 */
export async function updateContractorSubscription(
  email: string,
  updates: ContractorUpdate
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('contractors')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('email', email);

    if (error) {
      console.error('Error updating contractor:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error updating contractor:', error);
    return false;
  }
}

/**
 * Create new contractor
 */
export async function createContractor(contractor: Partial<Contractor>): Promise<Contractor | null> {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .insert([{
        ...contractor,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating contractor:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error creating contractor:', error);
    return null;
  }
}

/**
 * Get all contractors (admin only)
 */
export async function getAllContractors(): Promise<Contractor[]> {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contractors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching contractors:', error);
    return [];
  }
}

/**
 * Get all approved professional (and enterprise) contractors
 */
export async function getProfessionalContractors(): Promise<Contractor[]> {
  try {
    const { data, error } = await supabase
      .from('contractors')
      .select('*')
      .in('subscription_tier', ['professional', 'enterprise'])
      .eq('status', 'approved')
      .order('company_name', { ascending: true });

    if (error) {
      console.error('Error fetching professional contractors:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Unexpected error fetching professional contractors:', error);
    return [];
  }
}

/**
 * Reset BOQ count for a contractor
 */
export async function resetBOQCount(email: string): Promise<boolean> {
  return updateContractorSubscription(email, { boq_count: 0 });
}

/**
 * Increment BOQ count for a contractor
 */
export async function incrementBOQCount(email: string): Promise<boolean> {
  try {
    const contractor = await getContractorByEmail(email);
    if (!contractor) return false;

    return updateContractorSubscription(email, { 
      boq_count: (contractor.boq_count || 0) + 1 
    });
  } catch (error) {
    console.error('Error incrementing BOQ count:', error);
    return false;
  }
}
