import { priceBill, priceBillWithProvince, calculateBillTotal, applyProjectSettings } from './pricingEngine';
import { priceRegionalBill } from './regionalPricingEngine';
import { getProjectId, getAnonKey } from './supabase/info';
import { getCurrentEnvironment } from './environment';
import { getSupabaseClient } from './supabase/client';

// Edge Function name is 'server' (from /supabase/functions/server/index.tsx)
// Use getProjectId() to ensure environment-aware configuration
const getApiBaseUrl = () => `https://${getProjectId()}.supabase.co/functions/v1/server/make-server-9db710f3`;

// Check if Supabase is properly configured
const isSupabaseConfigured = () => {
  const projectId = getProjectId();
  const anonKey = getAnonKey();
  return projectId && anonKey && 
    !projectId.includes('placeholder') && 
    !anonKey.includes('placeholder');
};

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  accessToken?: string;
}

async function apiRequest(endpoint: string, options: FetchOptions = {}) {
  const { method = 'GET', body, accessToken } = options;
  
  // Skip actual API requests if not properly configured
  if (!isSupabaseConfigured()) {
    console.log('Backend not configured - using demo mode');
    throw new Error('DEMO_MODE');
  }
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'apikey': getAnonKey(), // CRITICAL: Required for Supabase gateway authorization
    ...options.headers,
  };
  
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Create a timeout promise
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
  });

  try {
    const fetchPromise = fetch(`${getApiBaseUrl()}${endpoint}`, config);
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  } catch (fetchError: any) {
    const env = getCurrentEnvironment();
    
    // If it's a network error, timeout, or fetch error
    if (fetchError.name === 'TypeError' || 
        fetchError.message?.includes('timeout') ||
        fetchError.message?.includes('fetch') ||
        fetchError.message?.includes('Network') ||
        fetchError.message?.includes('Failed to fetch')) {
      
      // Only allow demo mode fallback in DEVELOPMENT
      if (env === 'development' || env === 'demo') {
        // Silent fallback to demo mode - no console.error needed
        throw new Error('DEMO_MODE');
      }
      
      // In SIT/UAT/PRODUCTION, fail loudly with proper error message
      console.error(`❌ [${env}] Supabase edge function unreachable:`, fetchError.message);
      throw new Error(`Supabase edge function is unreachable in ${env} environment. Please check your Supabase configuration and CORS settings.`);
    }
    
    // Log unexpected errors for debugging
    console.error('Unexpected API error:', fetchError);
    throw fetchError;
  }
}

// Check if we're in demo mode
function isDemoMode(accessToken?: string): boolean {
  return sessionStorage.getItem('demo_mode') === 'true' || 
         (accessToken?.startsWith('demo_operator_token') ?? false) ||
         !isSupabaseConfigured();
}

// Mock data for demo mode
const mockDemoData = {
  profile: {
    user: {
      id: 'demo_user',
      email: 'demo@operator.com',
      name: 'Demo Operator',
      trial_used: false,
      paid_status: false, // Changed to false to test subscription flow
      is_operator: true,
      created_at: new Date().toISOString()
    }
  },
  suppliers: {
    suppliers: [
      { id: 'buco', name: 'Buco', categories: ['Hardware', 'Building Materials'] },
      { id: 'macsteel', name: 'Macsteel', categories: ['Steel', 'Metal'] },
      { id: 'lafarge', name: 'Lafarge', categories: ['Cement', 'Concrete'] }
    ]
  },
  bills: {
    bills: []
  }
};

export const api = {
  // Auth
  signup: (name: string, email: string, password: string) =>
    apiRequest('/signup', {
      method: 'POST',
      body: { name, email, password },
    }),

  // User Profile
  getProfile: (accessToken: string) => {
    if (isDemoMode(accessToken)) {
      // NEW: Get user data from demo_users array
      const currentEmail = sessionStorage.getItem('demo_email') || 'demo@operator.com';
      const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const currentUser = users.find((u: any) => u.email === currentEmail);
      
      if (currentUser) {
        // User found in new storage format - use their data
        return Promise.resolve({
          user: {
            id: currentUser.id || 'demo_user',
            email: currentUser.email,
            name: currentUser.name || currentUser.email.split('@')[0],
            trial_used: (currentUser.trial_bills_remaining ?? 3) <= 0 && !currentUser.paid_status,
            trial_bills_remaining: currentUser.trial_bills_remaining ?? 3, // ✅ NEW: Include trial_bills_remaining
            paid_status: currentUser.paid_status || false,
            subscription_tier: currentUser.subscription_tier || 'free',
            subscription_status: currentUser.subscription_status || 'trial',
            boq_count: currentUser.boq_count || 0,
            is_operator: true,
            created_at: currentUser.created_at || new Date().toISOString()
          }
        });
      }
      
      // Fallback to old storage format (for backwards compatibility)
      const trialUsed = localStorage.getItem('demo_trial_used') === 'true';
      const paidStatus = localStorage.getItem('demo_paid_status') === 'true';
      
      return Promise.resolve({
        user: {
          id: 'demo_user',
          email: currentEmail,
          name: currentEmail.split('@')[0],
          trial_used: trialUsed,
          paid_status: paidStatus,
          is_operator: true,
          created_at: new Date().toISOString()
        }
      });
    }
    return apiRequest('/profile', { accessToken });
  },

  // Bills
  processBill: async (billData: any[], accessToken: string, projectSettings?: any) => {
    // Helper function to process bill in demo mode
    const processBillDemo = async () => {
      // NEW: Get user data from demo_users array
      const currentEmail = sessionStorage.getItem('demo_email') || 'demo@operator.com';
      const users = JSON.parse(localStorage.getItem('demo_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === currentEmail);
      
      let trialBillsRemaining = 3;
      let paidStatus = false;
      let boqCount = 0;
      
      if (userIndex !== -1) {
        // ✅ NEW: Use trial_bills_remaining instead of trial_used
        trialBillsRemaining = users[userIndex].trial_bills_remaining ?? 3;
        paidStatus = users[userIndex].paid_status || false;
        boqCount = users[userIndex].boq_count || 0;
      }
      
      // ✅ NEW: Check trial_bills_remaining instead of trial_used
      if (!paidStatus && trialBillsRemaining <= 0) {
        throw new Error('Trial complete. You have used all 3 free bill pricings. Please upgrade to continue.');
      }
      
      // Start timing
      const startTime = performance.now();
      
      // Simulate processing delay to show realistic timing
      return new Promise(async (resolve) => {
        setTimeout(async () => {
          // Use the regional pricing engine (includes transport costs and location optimization)
          const pricedItems = await priceRegionalBill(billData, projectSettings);
          
          // Calculate processing time
          const endTime = performance.now();
          const processingTime = endTime - startTime;
          
          // Calculate overall total from the priced items
          const overallTotal = pricedItems.reduce((sum, item) => {
            return sum + parseFloat(item.totalPrice || '0');
          }, 0);
          
          const billId = 'demo_bill_' + Date.now();
          
          // Store in session storage with project settings (limit to last 5 bills and compress data)
          try {
            const existingBills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
            
            // Compress bill data by removing unnecessary fields to reduce storage size
            const compressedItems = pricedItems.map(item => ({
              code: item.code,
              name: item.name,
              quantity: item.quantity,
              unit: item.unit,
              selectedSupplier: item.selectedSupplier,
              baseUnitPrice: item.baseUnitPrice,
              transportCost: item.transportCost,
              landedUnitPrice: item.landedUnitPrice,
              additionalFees: item.additionalFees,
              finalUnitPrice: item.finalUnitPrice,
              totalPrice: item.totalPrice,
              distance: item.distance,
              // Store only best 2 supplier quotes instead of all
              supplierPrices: item.supplierPrices?.slice(0, 2).map(quote => ({
                supplier: quote.supplier,
                branchName: quote.branchName,
                baseUnitPrice: quote.baseUnitPrice,
                landedUnitPrice: quote.landedUnitPrice,
                transportCostPerUnit: quote.transportCostPerUnit,
                distance: quote.distance,
                available: quote.available,
                isNationalBest: quote.isNationalBest,
                materialType: quote.materialType,
                totalLandedCost: quote.totalLandedCost
              })) || []
            }));
            
            existingBills.push({
              id: billId,
              items: compressedItems,
              overallTotal: overallTotal.toFixed(2),
              projectSettings: projectSettings || null,
              processingTime: processingTime, // Store processing time
              createdAt: new Date().toISOString(),
              status: 'processed'
            });
            
            // Keep only the last 5 bills to prevent storage quota issues
            const limitedBills = existingBills.slice(-5);
            sessionStorage.setItem('demo_bills', JSON.stringify(limitedBills));
          } catch (quotaError) {
            console.warn('SessionStorage quota exceeded, clearing old bills:', quotaError);
            // If quota exceeded, clear all old bills and keep only last 2
            try {
              const existingBills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
              const recentBills = existingBills.slice(-2);
              sessionStorage.setItem('demo_bills', JSON.stringify(recentBills));
              
              // Try again with current bill
              const compressedItems = pricedItems.map(item => ({
                code: item.code,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                selectedSupplier: item.selectedSupplier,
                baseUnitPrice: item.baseUnitPrice,
                transportCost: item.transportCost,
                landedUnitPrice: item.landedUnitPrice,
                additionalFees: item.additionalFees,
                finalUnitPrice: item.finalUnitPrice,
                totalPrice: item.totalPrice,
                distance: item.distance,
                supplierPrices: item.supplierPrices?.slice(0, 2).map(quote => ({
                  supplier: quote.supplier,
                  branchName: quote.branchName,
                  baseUnitPrice: quote.baseUnitPrice,
                  landedUnitPrice: quote.landedUnitPrice,
                  transportCostPerUnit: quote.transportCostPerUnit,
                  distance: quote.distance,
                  available: quote.available,
                  isNationalBest: quote.isNationalBest,
                  materialType: quote.materialType,
                  totalLandedCost: quote.totalLandedCost
                })) || []
              }));
              
              recentBills.push({
                id: billId,
                items: compressedItems,
                overallTotal: overallTotal.toFixed(2),
                projectSettings: projectSettings || null,
                processingTime: processingTime,
                createdAt: new Date().toISOString(),
                status: 'processed'
              });
              
              sessionStorage.setItem('demo_bills', JSON.stringify(recentBills));
            } catch (e) {
              console.error('Failed to store bill in sessionStorage even after cleanup:', e);
              // Last resort: clear all bills and store only current one
              try {
                sessionStorage.removeItem('demo_bills');
                const minimalItems = pricedItems.map(item => ({
                  code: item.code,
                  name: item.name,
                  quantity: item.quantity,
                  unit: item.unit,
                  selectedSupplier: item.selectedSupplier,
                  totalPrice: item.totalPrice
                }));
                
                sessionStorage.setItem('demo_bills', JSON.stringify([{
                  id: billId,
                  items: minimalItems,
                  overallTotal: overallTotal.toFixed(2),
                  projectSettings: projectSettings || null,
                  processingTime: processingTime,
                  createdAt: new Date().toISOString(),
                  status: 'processed'
                }]));
              } catch (finalError) {
                console.error('Critical: Cannot store bill data:', finalError);
                // Continue processing even if storage fails completely
              }
            }
          }
          
          // ✅ NEW: Decrement trial_bills_remaining after successful processing
          if (userIndex !== -1) {
            users[userIndex].trial_bills_remaining = trialBillsRemaining - 1;
            users[userIndex].boq_count = boqCount + 1;
            localStorage.setItem('demo_users', JSON.stringify(users));
            console.log('📋 Trial bill remaining:', trialBillsRemaining - 1, 'after successful BOQ processing');
          }
          
          // ✅ CRITICAL: Also update Supabase for real authenticated users
          try {
            const supabaseClient = getSupabaseClient(getCurrentEnvironment());
            if (supabaseClient) {
              const { data: { user: authUser } } = await supabaseClient.auth.getUser();
              if (authUser && authUser.email === currentEmail) {
                console.log('🔄 Updating trial_bills_remaining in Supabase for:', authUser.email);
                const { error: updateError } = await supabaseClient
                  .from('users')
                  .update({ 
                    trial_bills_remaining: trialBillsRemaining - 1,
                    updated_at: new Date().toISOString()
                  })
                  .eq('id', authUser.id);
                
                if (updateError) {
                  console.error('⚠️ Failed to update trial in Supabase:', updateError);
                } else {
                  console.log('✅ Supabase trial_bills_remaining updated to:', trialBillsRemaining - 1);
                }
              }
            }
          } catch (supabaseError) {
            console.warn('⚠️ Could not update Supabase trial (user may be in demo mode):', supabaseError);
          }
          
          resolve({
            billId,
            items: pricedItems,
            overallTotal: overallTotal.toFixed(2),
            projectSettings: projectSettings || null,
            processingTime: processingTime, // Include in response
            message: 'Bill processed successfully with Regional Pricing (Demo Mode)'
          });
        }, 0); // Yield once so the loading state can render without adding artificial delay
      });
    };
    
    // Check if we should use demo mode
    if (isDemoMode(accessToken)) {
      return processBillDemo();
    }
    
    // Large BOQs are processed directly in the browser. This avoids waiting for an
    // Edge Function timeout and then repeating the same 300+ item calculation.
    if (billData.length > 200) {
      console.log(`📦 Large BOQ detected (${billData.length} items) - using optimized client processing`);
      return processBillDemo();
    }

    // Try to use Supabase edge function
    // For now, allow demo fallback in all environments until edge functions are deployed
    const currentEnv = getCurrentEnvironment();
    const shouldFallbackToDemo = true; // ✅ Allow fallback in all environments
    
    try {
      return await apiRequest('/process-bill', {
        method: 'POST',
        body: { billData, projectSettings },
        accessToken,
      });
    } catch (error: any) {
      // If edge function fails, fall back to demo mode
      if (!shouldFallbackToDemo) {
        console.error(`❌ [${currentEnv.toUpperCase()}] Supabase edge function failed - NOT falling back to demo mode`);
        console.error('Error details:', error);
        throw error; // Re-throw to make the error visible
      }
      
      // Fall back to demo mode silently
      console.log(`ℹ️ [${currentEnv.toUpperCase()}] Edge function unavailable - using client-side pricing`);
      return processBillDemo();
    }
  },

  getBills: (accessToken: string) => {
    if (isDemoMode(accessToken)) {
      const bills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
      return Promise.resolve({ bills });
    }
    return apiRequest('/bills', { accessToken });
  },

  getBill: (billId: string, accessToken: string) => {
    if (isDemoMode(accessToken)) {
      const bills = JSON.parse(sessionStorage.getItem('demo_bills') || '[]');
      const bill = bills.find((b: any) => b.id === billId);
      return Promise.resolve({ bill });
    }
    return apiRequest(`/bills/${billId}`, { accessToken });
  },

  // Suppliers
  getSuppliers: () => {
    if (isDemoMode()) {
      return Promise.resolve(mockDemoData.suppliers);
    }
    return apiRequest('/suppliers');
  },

  // Admin
  saveSupplier: (supplierData: any, accessToken: string) =>
    apiRequest('/admin/suppliers', {
      method: 'POST',
      body: supplierData,
      accessToken,
    }),

  getSupplier: (supplierId: string, accessToken: string) =>
    apiRequest(`/admin/suppliers/${supplierId}`, { accessToken }),

  // Demo data
  initDemo: () => {
    // Skip API call if Supabase is not configured (use demo mode by default)
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured - running in demo mode');
      return Promise.resolve({ message: 'Demo mode enabled' });
    }
    return apiRequest('/init-demo', { method: 'POST' });
  },
};