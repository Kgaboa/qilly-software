import { supabase } from './supabase';

export interface DatabaseProduct {
  id: string;
  supplier_id: string;
  supplier_name: string;
  product_code: string;
  description: string;
  unit: string;
  unit_price: number;
  category: string | null;
  is_available: boolean;
  last_updated: string;
}

export interface SupplierWithProducts {
  id: string;
  name: string;
  category: string;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  products: DatabaseProduct[];
}

/**
 * Fetch all products from Supabase database with supplier information
 */
export async function fetchAllDatabaseProducts(): Promise<DatabaseProduct[]> {
  try {
    const { data, error } = await supabase
      .from('supplier_products')
      .select(`
        id,
        product_code,
        description,
        unit,
        unit_price,
        category,
        is_available,
        last_updated,
        supplier_id
      `)
      .eq('is_available', true)
      .order('description');

    if (error) {
      console.error('Error fetching database products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('ℹ️ No products found in database. Using local catalog.');
      return [];
    }

    // Transform data - use supplier_id as supplier_name for now
    const products: DatabaseProduct[] = data.map((item: any) => ({
      id: item.id,
      supplier_id: item.supplier_id,
      supplier_name: item.supplier_id || 'Unknown Supplier', // Use supplier_id as name
      product_code: item.product_code,
      description: item.description,
      unit: item.unit,
      unit_price: parseFloat(item.unit_price),
      category: item.category,
      is_available: item.is_available,
      last_updated: item.last_updated
    }));

    console.log(`✅ Loaded ${products.length} products from Supabase database`);
    return products;
  } catch (err) {
    console.error('Failed to fetch database products:', err);
    return [];
  }
}

/**
 * Fetch suppliers with their products using nested query
 * If foreign key relationship doesn't exist, falls back to manual join
 */
export async function fetchSuppliersWithProducts(): Promise<SupplierWithProducts[]> {
  try {
    // Try nested query first (requires foreign key relationship)
    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        id,
        company_name,
        product_categories,
        email,
        phone,
        website,
        supplier_products (
          id,
          product_code,
          description,
          unit,
          unit_price,
          category,
          is_available,
          last_updated
        )
      `)
      .order('company_name');

    // If relationship error (PGRST200), fall back to manual approach
    if (error?.code === 'PGRST200') {
      console.warn('⚠️ Foreign key relationship not found. Using fallback method...');
      return await fetchSuppliersWithProductsFallback();
    }

    if (error) {
      console.error('Error fetching suppliers with products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('ℹ️ No suppliers found in database. Using local catalog.');
      return [];
    }

    const suppliers: SupplierWithProducts[] = data.map((supplier: any) => ({
      id: supplier.id,
      name: supplier.company_name,
      category: supplier.product_categories?.[0] || 'MATERIAL SUPPLIER', // Use first category from array
      contact_email: supplier.email,
      contact_phone: supplier.phone,
      website: supplier.website,
      products: (supplier.supplier_products || []).map((product: any) => ({
        id: product.id,
        supplier_id: supplier.id,
        supplier_name: supplier.company_name,
        product_code: product.product_code,
        description: product.description,
        unit: product.unit,
        unit_price: parseFloat(product.unit_price),
        category: product.category,
        is_available: product.is_available,
        last_updated: product.last_updated
      }))
    }));

    console.log(`✅ Loaded ${suppliers.length} suppliers with products from database`);
    return suppliers;
  } catch (err) {
    console.error('Failed to fetch suppliers with products:', err);
    return [];
  }
}

/**
 * Fetch suppliers with their products using manual join
 * This is a fallback method if the foreign key relationship is not set up
 */
export async function fetchSuppliersWithProductsFallback(): Promise<SupplierWithProducts[]> {
  try {
    const { data: suppliersData, error: suppliersError } = await supabase
      .from('suppliers')
      .select(`
        id,
        company_name,
        product_categories,
        email,
        phone,
        website
      `)
      .order('company_name');

    if (suppliersError) {
      console.error('Error fetching suppliers:', suppliersError);
      return [];
    }

    const { data: productsData, error: productsError } = await supabase
      .from('supplier_products')
      .select(`
        id,
        product_code,
        description,
        unit,
        unit_price,
        category,
        is_available,
        last_updated,
        supplier_id
      `)
      .eq('is_available', true)
      .order('description');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return [];
    }

    const suppliers: SupplierWithProducts[] = (suppliersData || []).map((supplier: any) => ({
      id: supplier.id,
      name: supplier.company_name,
      category: supplier.product_categories?.[0] || 'MATERIAL SUPPLIER', // Use first category from array
      contact_email: supplier.email,
      contact_phone: supplier.phone,
      website: supplier.website,
      products: (productsData || []).filter((product: any) => product.supplier_id === supplier.id).map((product: any) => ({
        id: product.id,
        supplier_id: supplier.id,
        supplier_name: supplier.company_name,
        product_code: product.product_code,
        description: product.description,
        unit: product.unit,
        unit_price: parseFloat(product.unit_price),
        category: product.category,
        is_available: product.is_available,
        last_updated: product.last_updated
      }))
    }));

    console.log(`✅ Loaded ${suppliers.length} suppliers with products from database`);
    return suppliers;
  } catch (err) {
    console.error('Failed to fetch suppliers with products:', err);
    return [];
  }
}

/**
 * Fetch products for a specific supplier
 */
export async function fetchSupplierProducts(supplierId: string): Promise<DatabaseProduct[]> {
  try {
    const { data, error } = await supabase
      .from('supplier_products')
      .select(`
        id,
        product_code,
        description,
        unit,
        unit_price,
        category,
        is_available,
        last_updated,
        suppliers!inner (
          id,
          company_name
        )
      `)
      .eq('supplier_id', supplierId)
      .eq('is_available', true)
      .order('description');

    if (error) {
      console.error('Error fetching supplier products:', error);
      return [];
    }

    const products: DatabaseProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      supplier_id: item.suppliers.id,
      supplier_name: item.suppliers.company_name, // Changed from name
      product_code: item.product_code,
      description: item.description,
      unit: item.unit,
      unit_price: parseFloat(item.unit_price),
      category: item.category,
      is_available: item.is_available,
      last_updated: item.last_updated
    }));

    return products;
  } catch (err) {
    console.error('Failed to fetch supplier products:', err);
    return [];
  }
}

/**
 * Search products across all suppliers
 */
export async function searchDatabaseProducts(query: string): Promise<DatabaseProduct[]> {
  if (!query.trim()) return [];

  try {
    const { data, error } = await supabase
      .from('supplier_products')
      .select(`
        id,
        product_code,
        description,
        unit,
        unit_price,
        category,
        is_available,
        last_updated,
        suppliers!inner (
          id,
          company_name
        )
      `)
      .eq('is_available', true)
      .or(`description.ilike.%${query}%,product_code.ilike.%${query}%,category.ilike.%${query}%`)
      .order('description')
      .limit(100);

    if (error) {
      console.error('Error searching database products:', error);
      return [];
    }

    const products: DatabaseProduct[] = (data || []).map((item: any) => ({
      id: item.id,
      supplier_id: item.suppliers.id,
      supplier_name: item.suppliers.company_name, // Changed from name
      product_code: item.product_code,
      description: item.description,
      unit: item.unit,
      unit_price: parseFloat(item.unit_price),
      category: item.category,
      is_available: item.is_available,
      last_updated: item.last_updated
    }));

    return products;
  } catch (err) {
    console.error('Failed to search database products:', err);
    return [];
  }
}

/**
 * Get unique supplier names from database
 */
export async function getUniqueDatabaseSuppliers(): Promise<string[]> {
  try {
    const { data, error} = await supabase
      .from('suppliers')
      .select('company_name') // Changed from 'name'
      .order('company_name'); // Changed from 'name'

    if (error) {
      console.error('Error fetching suppliers:', error);
      return [];
    }

    return (data || []).map((s: any) => s.company_name); // Changed from s.name
  } catch (err) {
    console.error('Failed to fetch suppliers:', err);
    return [];
  }
}