/**
 * Supplier Data Layer
 * 
 * This module provides a unified interface for supplier data operations
 * that automatically switches between localStorage (demo) and Supabase (production)
 */

import { supabase } from './supabase';
import { isLikelyProduction } from './environment';

export interface Supplier {
  id: string;
  user_id: string;
  company_name: string;
  registration_number: string;
  vat_number: string;
  contact_person: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  product_categories: string[];
  years_in_business: number;
  bbbee_level: string;
  has_certification: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  approved_at?: string;
  rejected_at?: string;
  notes?: string;
  // Subscription fields
  subscription_tier: 'free' | 'professional' | 'enterprise' | 'custom';
  billing_cycle?: 'monthly' | 'annual';
  subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial';
  subscription_start_date?: string;
  next_billing_date?: string;
  payment_method?: string;
}

export interface CreateSupplierData {
  company_name: string;
  registration_number: string;
  vat_number: string;
  contact_person: string;
  email: string;
  phone: string;
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  product_categories: string[];
  years_in_business: number;
  bbbee_level: string;
  has_certification: boolean;
  // Subscription data
  subscription_tier: 'free' | 'professional' | 'enterprise' | 'custom';
  billing_cycle?: 'monthly' | 'annual';
}

class SupplierDataLayer {
  private useProduction: boolean = false;

  constructor() {
    this.detectMode();
  }

  private detectMode() {
    this.useProduction = isLikelyProduction();
    console.log(`[Supplier Data Layer] Mode: ${this.useProduction ? 'PRODUCTION' : 'DEMO'}`);
  }

  /**
   * Create a new supplier
   */
  async create(data: CreateSupplierData, userId?: string): Promise<Supplier> {
    if (this.useProduction) {
      return this.createInProduction(data, userId);
    } else {
      return this.createInDemo(data);
    }
  }

  /**
   * Get all suppliers
   */
  async getAll(): Promise<Supplier[]> {
    if (this.useProduction) {
      return this.getAllFromProduction();
    } else {
      return this.getAllFromDemo();
    }
  }

  /**
   * Get supplier by ID
   */
  async getById(id: string): Promise<Supplier | null> {
    if (this.useProduction) {
      return this.getByIdFromProduction(id);
    } else {
      return this.getByIdFromDemo(id);
    }
  }

  /**
   * Update supplier status
   */
  async updateStatus(
    id: string,
    status: 'approved' | 'rejected'
  ): Promise<Supplier> {
    if (this.useProduction) {
      return this.updateStatusInProduction(id, status);
    } else {
      return this.updateStatusInDemo(id, status);
    }
  }

  /**
   * Delete supplier
   */
  async delete(id: string): Promise<void> {
    if (this.useProduction) {
      return this.deleteFromProduction(id);
    } else {
      return this.deleteFromDemo(id);
    }
  }

  /**
   * Update supplier subscription
   */
  async updateSubscription(
    id: string,
    subscriptionData: {
      subscription_tier: 'free' | 'professional' | 'enterprise' | 'custom';
      billing_cycle?: 'monthly' | 'annual';
      subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial';
      payment_method?: string;
    }
  ): Promise<Supplier> {
    if (this.useProduction) {
      return this.updateSubscriptionInProduction(id, subscriptionData);
    } else {
      return this.updateSubscriptionInDemo(id, subscriptionData);
    }
  }

  // ==================== PRODUCTION METHODS (Supabase) ====================

  private async createInProduction(
    data: CreateSupplierData,
    userId?: string
  ): Promise<Supplier> {
    try {
      const supplierData = {
        user_id: userId || `user_${Date.now()}`,
        ...data,
        status: 'pending' as const,
        created_at: new Date().toISOString(),
      };

      const { data: result, error } = await supabase
        .from('suppliers')
        .insert([supplierData])
        .select()
        .single();

      if (error) {
        // Silently fall back to demo mode
        return this.createInDemo(data);
      }

      return result;
    } catch (err) {
      // Silently fall back to demo mode
      return this.createInDemo(data);
    }
  }

  private async getAllFromProduction(): Promise<Supplier[]> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('[Production] Supabase unavailable, falling back to demo mode');
        // Silently fall back to demo mode instead of throwing
        return this.getAllFromDemo();
      }

      return data || [];
    } catch (err) {
      console.log('[Production] Network error, falling back to demo mode');
      return this.getAllFromDemo();
    }
  }

  private async getByIdFromProduction(id: string): Promise<Supplier | null> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Silently fall back to demo mode
        return this.getByIdFromDemo(id);
      }

      return data;
    } catch (err) {
      // Silently fall back to demo mode
      return this.getByIdFromDemo(id);
    }
  }

  private async updateStatusInProduction(
    id: string,
    status: 'approved' | 'rejected'
  ): Promise<Supplier> {
    try {
      const updateData: any = {
        status,
      };

      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('suppliers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Fall back to demo mode
        return this.updateStatusInDemo(id, status);
      }

      return data;
    } catch (err) {
      // Fall back to demo mode
      return this.updateStatusInDemo(id, status);
    }
  }

  private async deleteFromProduction(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);

      if (error) {
        // Fall back to demo mode
        return this.deleteFromDemo(id);
      }
    } catch (err) {
      // Fall back to demo mode
      return this.deleteFromDemo(id);
    }
  }

  private async updateSubscriptionInProduction(
    id: string,
    subscriptionData: {
      subscription_tier: 'free' | 'professional' | 'enterprise' | 'custom';
      billing_cycle?: 'monthly' | 'annual';
      subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial';
      payment_method?: string;
    }
  ): Promise<Supplier> {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .update(subscriptionData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        // Fall back to demo mode
        return this.updateSubscriptionInDemo(id, subscriptionData);
      }

      return data;
    } catch (err) {
      // Fall back to demo mode
      return this.updateSubscriptionInDemo(id, subscriptionData);
    }
  }

  // ==================== DEMO METHODS (localStorage) ====================

  private async createInDemo(data: CreateSupplierData): Promise<Supplier> {
    const supplier: Supplier = {
      id: `demo_${Date.now()}`,
      user_id: `user_${Date.now()}`,
      ...data,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    const suppliers = this.getSuppliers();
    suppliers.push(supplier);
    this.setSuppliers(suppliers);

    return supplier;
  }

  private async getAllFromDemo(): Promise<Supplier[]> {
    return this.getSuppliers();
  }

  private async getByIdFromDemo(id: string): Promise<Supplier | null> {
    const suppliers = this.getSuppliers();
    return suppliers.find((s) => s.id === id) || null;
  }

  private async updateStatusInDemo(
    id: string,
    status: 'approved' | 'rejected'
  ): Promise<Supplier> {
    const suppliers = this.getSuppliers();
    const index = suppliers.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Supplier not found');
    }

    suppliers[index] = {
      ...suppliers[index],
      status,
      ...(status === 'approved' && { approved_at: new Date().toISOString() }),
      ...(status === 'rejected' && { rejected_at: new Date().toISOString() }),
    };

    this.setSuppliers(suppliers);
    return suppliers[index];
  }

  private async deleteFromDemo(id: string): Promise<void> {
    const suppliers = this.getSuppliers().filter((s) => s.id !== id);
    this.setSuppliers(suppliers);
  }

  private async updateSubscriptionInDemo(
    id: string,
    subscriptionData: {
      subscription_tier: 'free' | 'professional' | 'enterprise' | 'custom';
      billing_cycle?: 'monthly' | 'annual';
      subscription_status?: 'active' | 'cancelled' | 'past_due' | 'trial';
      payment_method?: string;
    }
  ): Promise<Supplier> {
    const suppliers = this.getSuppliers();
    const index = suppliers.findIndex((s) => s.id === id);

    if (index === -1) {
      throw new Error('Supplier not found');
    }

    suppliers[index] = {
      ...suppliers[index],
      ...subscriptionData,
    };

    this.setSuppliers(suppliers);
    return suppliers[index];
  }

  // ==================== DEMO STORAGE HELPERS ====================

  private getSuppliers(): Supplier[] {
    try {
      return JSON.parse(localStorage.getItem('demo_suppliers') || '[]');
    } catch {
      return [];
    }
  }

  private setSuppliers(suppliers: Supplier[]): void {
    localStorage.setItem('demo_suppliers', JSON.stringify(suppliers));
  }

  // ==================== MIGRATION UTILITIES ====================

  /**
   * Migrate demo data to production (Supabase)
   * This should be called once when transitioning from demo to production
   */
  async migrateDemoToProduction(): Promise<{
    success: boolean;
    migrated: number;
    errors: string[];
  }> {
    const demoSuppliers = this.getSuppliers();
    const errors: string[] = [];
    let migrated = 0;

    console.log(`[Migration] Starting migration of ${demoSuppliers.length} suppliers...`);

    for (const supplier of demoSuppliers) {
      try {
        const { error } = await supabase.from('suppliers').insert([
          {
            // Don't include the demo ID, let Supabase generate a new one
            user_id: supplier.user_id,
            company_name: supplier.company_name,
            registration_number: supplier.registration_number,
            vat_number: supplier.vat_number,
            contact_person: supplier.contact_person,
            email: supplier.email,
            phone: supplier.phone,
            street_address: supplier.street_address,
            city: supplier.city,
            province: supplier.province,
            postal_code: supplier.postal_code,
            product_categories: supplier.product_categories,
            years_in_business: supplier.years_in_business,
            bbbee_level: supplier.bbbee_level,
            has_certification: supplier.has_certification,
            status: supplier.status,
            created_at: supplier.created_at,
            approved_at: supplier.approved_at,
            rejected_at: supplier.rejected_at,
            notes: supplier.notes,
            // Subscription fields
            subscription_tier: supplier.subscription_tier,
            billing_cycle: supplier.billing_cycle,
            subscription_status: supplier.subscription_status,
            subscription_start_date: supplier.subscription_start_date,
            next_billing_date: supplier.next_billing_date,
            payment_method: supplier.payment_method,
          },
        ]);

        if (error) {
          errors.push(`${supplier.company_name}: ${error.message}`);
        } else {
          migrated++;
        }
      } catch (err) {
        errors.push(`${supplier.company_name}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    const success = migrated > 0 && errors.length === 0;
    
    console.log(`[Migration] Complete. Migrated: ${migrated}, Errors: ${errors.length}`);
    
    return { success, migrated, errors };
  }

  /**
   * Clear demo data (use after successful migration)
   */
  clearDemoData(): void {
    localStorage.removeItem('demo_suppliers');
    console.log('[Migration] Demo data cleared');
  }
}

// Export singleton instance
export const supplierDataLayer = new SupplierDataLayer();