import { supabase } from './supabase';

// Database schema uses EFFICIENT_PROVINCIAL_PRICING.sql
// Column names: multiplier (not pricing_factor), province_code is TEXT like 'gauteng'
export interface ProvincialPricingFactor {
  province_code: string;       // e.g., 'gauteng', 'western-cape'
  province_name: string;        // e.g., 'Gauteng', 'Western Cape'
  short_name: string;           // e.g., 'GP', 'WC'
  multiplier: number;           // e.g., 1.00, 1.05
  major_city: string;           // e.g., 'Johannesburg', 'Cape Town'
  logistics_notes: string | null;
  last_updated: string;
}

/**
 * Fetch all provincial pricing factors from Supabase database
 */
export async function fetchProvincialPricingFactors(): Promise<ProvincialPricingFactor[]> {
  try {
    const { data, error } = await supabase
      .from('provincial_price_multipliers')
      .select('*')
      .order('short_name');

    if (error) {
      console.error('Error fetching provincial pricing factors:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No provincial pricing factors found in database. Using fallback data.');
      return [];
    }

    console.log(`✅ Loaded ${data.length} provincial pricing factors from Supabase database`);
    return data.map((item: any) => ({
      province_code: item.province_code,
      province_name: item.province_name,
      short_name: item.short_name,
      multiplier: parseFloat(item.multiplier),
      major_city: item.major_city,
      logistics_notes: item.logistics_notes,
      last_updated: item.last_updated
    }));
  } catch (err) {
    console.error('Failed to fetch provincial pricing factors:', err);
    return [];
  }
}

/**
 * Fetch a specific provincial pricing factor by province code (short name like 'GP')
 */
export async function fetchProvincialPricingFactor(provinceShortName: string): Promise<ProvincialPricingFactor | null> {
  try {
    const { data, error } = await supabase
      .from('provincial_price_multipliers')
      .select('*')
      .eq('short_name', provinceShortName.toUpperCase())
      .single();

    if (error) {
      console.error(`Error fetching pricing factor for ${provinceShortName}:`, error);
      return null;
    }

    if (!data) {
      console.warn(`⚠️ No pricing factor found for province ${provinceShortName}`);
      return null;
    }

    return {
      province_code: data.province_code,
      province_name: data.province_name,
      short_name: data.short_name,
      multiplier: parseFloat(data.multiplier),
      major_city: data.major_city,
      logistics_notes: data.logistics_notes,
      last_updated: data.last_updated
    };
  } catch (err) {
    console.error(`Failed to fetch pricing factor for ${provinceShortName}:`, err);
    return null;
  }
}

/**
 * Update a provincial pricing factor
 */
export async function updateProvincialPricingFactor(
  provinceShortName: string,
  updates: Partial<Pick<ProvincialPricingFactor, 'multiplier' | 'logistics_notes'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('provincial_price_multipliers')
      .update({
        ...updates,
        last_updated: new Date().toISOString()
      })
      .eq('short_name', provinceShortName.toUpperCase());

    if (error) {
      console.error(`Error updating pricing factor for ${provinceShortName}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Updated pricing factor for ${provinceShortName}`);
    return { success: true };
  } catch (err: any) {
    console.error(`Failed to update pricing factor for ${provinceShortName}:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Calculate provincial price using database factor
 */
export function calculateProvincialPriceFromFactor(
  basePrice: number,
  factor: ProvincialPricingFactor
): number {
  return basePrice * factor.multiplier;
}