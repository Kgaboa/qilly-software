import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@^2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9db710f3/health", (c) => {
  return c.json({ status: "ok" });
});

// Initialize Supabase client for auth operations
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// Sign up route
app.options("/make-server-9db710f3/signup", (c) => {
  return c.text('', 204);
});

app.post("/make-server-9db710f3/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    const supabase = getSupabaseClient();
    
    // Create user with auto-confirmed email since email server isn't configured
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error for user ${email} during registration: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Check if this is the operator account
    const isOperator = email.toLowerCase() === 'operator@coregroundcivils.com';

    // Store user metadata in KV store
    await kv.set(`user:${data.user.id}`, {
      email,
      name,
      trial_used: false,
      paid_status: isOperator, // Operator gets full access
      is_operator: isOperator,
      created_at: new Date().toISOString()
    });

    return c.json({ 
      user: data.user, 
      message: isOperator ? "Operator account created successfully" : "User created successfully"
    });
  } catch (error) {
    console.log(`Server error during sign up: ${error}`);
    return c.json({ error: "Internal server error during sign up" }, 500);
  }
});

// Sync user data (for client-side signups)
app.options("/make-server-9db710f3/sync-user", (c) => {
  return c.text('', 204);
});

app.post("/make-server-9db710f3/sync-user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Sync user authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { name, email, is_operator } = body;

    // Check if user data already exists
    const existingData = await kv.get(`user:${user.id}`);
    
    if (existingData) {
      // Update existing data
      await kv.set(`user:${user.id}`, {
        ...existingData,
        name: name || existingData.name,
        email: email || existingData.email,
      });
    } else {
      // Create new user data
      await kv.set(`user:${user.id}`, {
        email: email || user.email,
        name: name || user.user_metadata?.name || 'User',
        trial_used: false,
        paid_status: is_operator || false,
        is_operator: is_operator || false,
        created_at: new Date().toISOString()
      });
    }

    return c.json({ message: "User data synced successfully" });
  } catch (error) {
    console.log(`Server error during user sync: ${error}`);
    return c.json({ error: "Internal server error during user sync" }, 500);
  }
});

// Get user profile route
app.options("/make-server-9db710f3/profile", (c) => {
  return c.text('', 204);
});

app.get("/make-server-9db710f3/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Get profile authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store
    let userData = await kv.get(`user:${user.id}`);
    
    // If no user data exists, create default data
    if (!userData) {
      const isOperator = user.email?.toLowerCase() === 'operator@test.com';
      userData = {
        email: user.email || '',
        name: user.user_metadata?.name || 'User',
        trial_used: false,
        paid_status: isOperator,
        is_operator: isOperator,
        created_at: new Date().toISOString()
      };
      await kv.set(`user:${user.id}`, userData);
    }
    
    return c.json({ 
      user: {
        id: user.id,
        email: user.email,
        ...userData
      }
    });
  } catch (error) {
    console.log(`Server error while fetching profile: ${error}`);
    return c.json({ error: "Internal server error while fetching profile" }, 500);
  }
});

// Upload and process bill route
// OPTIONS handler for CORS preflight
app.options("/make-server-9db710f3/process-bill", (c) => {
  return c.text('', 204);
});

app.post("/make-server-9db710f3/process-bill", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Process bill authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data
    const userData = await kv.get(`user:${user.id}`);
    
    // Check if user has available pricing attempts
    if (!userData.paid_status && userData.trial_used) {
      return c.json({ error: "Free trial already used. Please upgrade to continue." }, 403);
    }

    const body = await c.req.json();
    const { billData, projectSettings } = body;

    if (!billData || !Array.isArray(billData)) {
      return c.json({ error: "Valid bill data required" }, 400);
    }

    console.log('Processing bill with project settings:', projectSettings);

    // Get province code for pricing adjustments
    const provinceCode = projectSettings?.province || 'GP';
    
    // Provincial pricing factors
    const provincialFactors: Record<string, number> = {
      'GP': 1.00,  // Gauteng (baseline)
      'WC': 1.05,  // Western Cape
      'KZN': 1.03, // KwaZulu-Natal
      'EC': 1.08,  // Eastern Cape
      'FS': 1.06,  // Free State
      'LP': 1.07,  // Limpopo
      'MP': 1.04,  // Mpumalanga
      'NC': 1.09,  // Northern Cape
      'NW': 1.05   // North West
    };

    const provincialFactor = provincialFactors[provinceCode] || 1.00;

    // CIDB Grading factors (overhead and complexity)
    const cidbFactors: Record<string, number> = {
      'GB1': 1.02,  // Small projects, +2% overhead
      'GB2': 1.04,  // +4% overhead
      'GB3': 1.06,  // +6% overhead
      'GB4': 1.08,  // +8% overhead
      'GB5': 1.10,  // +10% overhead
      'GB6': 1.12,  // +12% overhead
      'GB7': 1.15,  // Large complex projects, +15% overhead
      'GB8': 1.18,  // +18% overhead
      'GB9': 1.20   // Mega projects, +20% overhead
    };
    
    const cidbFactor = cidbFactors[projectSettings?.cidbGrading || 'GB4'] || 1.08;

    // Duration factors (longer projects may get volume discounts or cost escalation)
    const durationMonths = parseInt(projectSettings?.duration || '6');
    let durationFactor = 1.00;
    if (durationMonths <= 3) {
      durationFactor = 1.05; // Short projects, premium pricing
    } else if (durationMonths <= 6) {
      durationFactor = 1.00; // Standard
    } else if (durationMonths <= 12) {
      durationFactor = 0.98; // Slight discount for longer commitment
    } else {
      durationFactor = 0.95; // Volume discount for long projects
    }

    // Machinery type factors
    const machineryFactors: Record<string, number> = {
      'owned': 0.95,   // 5% savings from owned equipment
      'rented': 1.08,  // 8% premium for rental costs
      'mixed': 1.02    // 2% premium for mixed setup
    };
    
    const machineryFactor = machineryFactors[projectSettings?.machineryType || 'rented'] || 1.08;

    // Profit margin (applied as final markup)
    const profitMargin = parseFloat(projectSettings?.profitMargin || '15') / 100;

    console.log('Pricing factors:', {
      provincial: provincialFactor,
      cidb: cidbFactor,
      duration: durationFactor,
      machinery: machineryFactor,
      profitMargin: profitMargin
    });

    // Get all suppliers
    const suppliers = await kv.getByPrefix('supplier:');
    
    if (!suppliers || suppliers.length === 0) {
      return c.json({ error: "No suppliers configured. Please contact administrator." }, 400);
    }

    // Process bill with supplier pricing
    const pricedItems = billData.map(item => {
      const supplierPrices = suppliers.map(supplier => {
        // Find matching item in supplier catalog
        const supplierItem = supplier.items?.find(
          (si: any) => si.code === item.code || si.name.toLowerCase() === item.name.toLowerCase()
        );

        if (!supplierItem) return null;

        const quantity = parseFloat(item.quantity) || 0;
        const baseUnitPrice = parseFloat(supplierItem.price) || 0;
        
        // Apply all project setting factors
        // Step 1: Base price × Provincial factor
        let adjustedPrice = baseUnitPrice * provincialFactor;
        
        // Step 2: × CIDB grading factor (overhead)
        adjustedPrice = adjustedPrice * cidbFactor;
        
        // Step 3: × Duration factor (volume discount/premium)
        adjustedPrice = adjustedPrice * durationFactor;
        
        // Step 4: × Machinery type factor
        adjustedPrice = adjustedPrice * machineryFactor;
        
        // Step 5: Add profit margin
        const finalUnitPrice = adjustedPrice * (1 + profitMargin);
        
        const totalPrice = quantity * finalUnitPrice;

        return {
          supplier: supplier.name,
          unitPrice: finalUnitPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
          province: provinceCode,
          available: true
        };
      }).filter(Boolean);

      // Find best price
      const bestPrice = supplierPrices.reduce((best, current) => {
        const currentTotal = parseFloat(current.totalPrice);
        const bestTotal = best ? parseFloat(best.totalPrice) : Infinity;
        return currentTotal < bestTotal ? current : best;
      }, null as any);

      return {
        ...item,
        supplierPrices,
        selectedSupplier: bestPrice?.supplier || 'N/A',
        selectedProvince: provinceCode,
        unitPrice: bestPrice?.unitPrice || '0.00',
        totalPrice: bestPrice?.totalPrice || '0.00'
      };
    });

    // Calculate overall total
    const overallTotal = pricedItems.reduce((sum, item) => 
      sum + parseFloat(item.totalPrice || '0'), 0
    ).toFixed(2);

    // Save processed bill
    const billId = crypto.randomUUID();
    await kv.set(`bill:${user.id}:${billId}`, {
      id: billId,
      userId: user.id,
      items: pricedItems,
      overallTotal,
      projectSettings: projectSettings || null,
      createdAt: new Date().toISOString(),
      status: 'processed'
    });

    // Mark trial as used if not paid
    if (!userData.paid_status) {
      await kv.set(`user:${user.id}`, {
        ...userData,
        trial_used: true
      });
    }

    return c.json({ 
      billId,
      items: pricedItems,
      overallTotal,
      projectSettings: projectSettings || null,
      message: "Bill processed successfully"
    });
  } catch (error) {
    console.log(`Server error while processing bill: ${error}`);
    return c.json({ error: "Internal server error while processing bill" }, 500);
  }
});

// Get user bills
app.get("/make-server-9db710f3/bills", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Get bills authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const bills = await kv.getByPrefix(`bill:${user.id}:`);
    
    return c.json({ bills: bills || [] });
  } catch (error) {
    console.log(`Server error while fetching bills: ${error}`);
    return c.json({ error: "Internal server error while fetching bills" }, 500);
  }
});

// Get single bill
app.get("/make-server-9db710f3/bills/:billId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Get bill authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const billId = c.req.param('billId');
    const bill = await kv.get(`bill:${user.id}:${billId}`);
    
    if (!bill) {
      return c.json({ error: "Bill not found" }, 404);
    }

    return c.json({ bill });
  } catch (error) {
    console.log(`Server error while fetching bill: ${error}`);
    return c.json({ error: "Internal server error while fetching bill" }, 500);
  }
});

// Get suppliers (public - for comparison)
app.get("/make-server-9db710f3/suppliers", async (c) => {
  try {
    const suppliers = await kv.getByPrefix('supplier:');
    
    // Return basic supplier info without sensitive pricing details
    const publicSuppliers = suppliers.map(s => ({
      id: s.id,
      name: s.name,
      categories: s.categories || []
    }));

    return c.json({ suppliers: publicSuppliers });
  } catch (error) {
    console.log(`Server error while fetching suppliers: ${error}`);
    return c.json({ error: "Internal server error while fetching suppliers" }, 500);
  }
});

// Admin route to add/update suppliers
app.post("/make-server-9db710f3/admin/suppliers", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Admin suppliers authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { supplierId, name, items, categories } = body;

    if (!name || !items) {
      return c.json({ error: "Supplier name and items are required" }, 400);
    }

    const id = supplierId || crypto.randomUUID();
    
    await kv.set(`supplier:${id}`, {
      id,
      name,
      items,
      categories: categories || [],
      updatedAt: new Date().toISOString()
    });

    return c.json({ 
      message: "Supplier saved successfully",
      supplierId: id
    });
  } catch (error) {
    console.log(`Server error while saving supplier: ${error}`);
    return c.json({ error: "Internal server error while saving supplier" }, 500);
  }
});

// Get supplier details (for admin)
app.get("/make-server-9db710f3/admin/suppliers/:supplierId", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: "Authorization header required" }, 401);
    }

    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      console.log(`Get supplier authorization error: ${error?.message}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const supplierId = c.req.param('supplierId');
    const supplier = await kv.get(`supplier:${supplierId}`);
    
    if (!supplier) {
      return c.json({ error: "Supplier not found" }, 404);
    }

    return c.json({ supplier });
  } catch (error) {
    console.log(`Server error while fetching supplier: ${error}`);
    return c.json({ error: "Internal server error while fetching supplier" }, 500);
  }
});

// Initialize demo data (for testing)
app.post("/make-server-9db710f3/init-demo", async (c) => {
  try {
    // Check if suppliers already exist
    const existingSuppliers = await kv.getByPrefix('supplier:');
    
    // Add demo suppliers if they don't exist
    if (!existingSuppliers || existingSuppliers.length === 0) {
      const demoSuppliers = [
        {
          id: 'buco',
          name: 'Buco',
          categories: ['Hardware', 'Building Materials'],
          items: [
            { code: 'CEM001', name: 'Cement 50kg', price: '89.99', unit: 'bag' },
            { code: 'BRK001', name: 'Clay Brick', price: '2.50', unit: 'unit' },
            { code: 'SND001', name: 'Building Sand', price: '450.00', unit: 'ton' },
          ]
        },
        {
          id: 'macsteel',
          name: 'Macsteel',
          categories: ['Steel', 'Metal'],
          items: [
            { code: 'STL001', name: 'Steel Rod 12mm', price: '75.00', unit: 'meter' },
            { code: 'STL002', name: 'Steel Beam H-Section', price: '850.00', unit: 'meter' },
            { code: 'WRE001', name: 'Wire Mesh', price: '320.00', unit: 'roll' },
          ]
        },
        {
          id: 'lafarge',
          name: 'Lafarge',
          categories: ['Cement', 'Concrete'],
          items: [
            { code: 'CEM001', name: 'Cement 50kg', price: '92.50', unit: 'bag' },
            { code: 'CON001', name: 'Ready Mix Concrete', price: '1200.00', unit: 'm3' },
          ]
        }
      ];

      for (const supplier of demoSuppliers) {
        await kv.set(`supplier:${supplier.id}`, {
          ...supplier,
          updatedAt: new Date().toISOString()
        });
      }
      
      return c.json({ 
        message: "Demo suppliers initialized successfully",
        suppliers: demoSuppliers.length,
        note: "Operator account should be created via Supabase signup"
      });
    }

    return c.json({ 
      message: "Demo suppliers already initialized",
      note: "Use operator@coregroundcivils.com to sign up"
    });
  } catch (error) {
    console.log(`Server error while initializing demo data: ${error}`);
    return c.json({ error: "Internal server error while initializing demo data" }, 500);
  }
});

// Operator signup endpoint
app.post("/make-server-9db710f3/create-operator", async (c) => {
  try {
    const operatorEmail = 'operator@coregroundcivils.com';
    const operatorPassword = 'Operator123!';
    
    // Use the regular signup process to create operator
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase.auth.admin.createUser({
      email: operatorEmail,
      password: operatorPassword,
      email_confirm: true,
      user_metadata: {
        name: 'System Operator'
      }
    });

    if (error) {
      return c.json({ 
        error: error.message,
        note: "You can also create the operator account manually via signup"
      }, 400);
    }

    // Store operator metadata
    if (data.user) {
      await kv.set(`user:${data.user.id}`, {
        email: operatorEmail,
        name: 'System Operator',
        trial_used: false,
        paid_status: true,
        is_operator: true,
        created_at: new Date().toISOString()
      });
    }

    return c.json({ 
      message: "Operator account created",
      email: operatorEmail
    });
  } catch (error) {
    console.log(`Error creating operator: ${error}`);
    return c.json({ 
      error: "Failed to create operator account",
      note: "Please create manually via signup with email: operator@coregroundcivils.com"
    }, 500);
  }
});

Deno.serve(app.fetch);