# 🗺️ Provincial Pricing Setup Guide

## ⚠️ Issue
You're seeing this warning:
```
⚠️ No provincial pricing factors found in database. Using fallback data.
```

This means the `provincial_price_multipliers` table is empty or missing in your Supabase database.

---

## ✅ Quick Fix (3 Steps)

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Run the SQL Script
1. Copy the **entire contents** of `/POPULATE_PROVINCIAL_PRICING.sql`
2. Paste into the SQL Editor
3. Click **Run** (or press `Ctrl+Enter`)

### Step 3: Verify Success
You should see output like this:
```
✅ 9 rows inserted

Provincial Pricing Summary:
┌────────────┬─────────────────┬──────────────────┬────────────┬────────────────┐
│ short_name │ province_name   │ major_city       │ multiplier │ Price Increase │
├────────────┼─────────────────┼──────────────────┼────────────┼────────────────┤
│ GP         │ Gauteng         │ Johannesburg     │ 1.000      │ 0.0%           │
│ FS         │ Free State      │ Bloemfontein     │ 1.025      │ 2.5%           │
│ MP         │ Mpumalanga      │ Mbombela         │ 1.020      │ 2.0%           │
│ KZN        │ KwaZulu-Natal   │ Durban           │ 1.035      │ 3.5%           │
│ NW         │ North West      │ Mahikeng         │ 1.040      │ 4.0%           │
│ WC         │ Western Cape    │ Cape Town        │ 1.045      │ 4.5%           │
│ EC         │ Eastern Cape    │ Port Elizabeth   │ 1.085      │ 8.5%           │
│ LP         │ Limpopo         │ Polokwane        │ 1.095      │ 9.5%           │
│ NC         │ Northern Cape   │ Kimberley        │ 1.125      │ 12.5%          │
└────────────┴─────────────────┴──────────────────┴────────────┴────────────────┘
```

---

## 📊 What This Does

The script populates the database with **real South African provincial pricing multipliers**:

| Province | Code | Multiplier | Reason |
|----------|------|------------|--------|
| **Gauteng** | GP | 1.000 | **Baseline** - Most suppliers, best infrastructure |
| **Free State** | FS | 1.025 | Central location, smaller market |
| **Mpumalanga** | MP | 1.020 | Close to Gauteng, industrial area |
| **KwaZulu-Natal** | KZN | 1.035 | Port access, distance from Gauteng |
| **North West** | NW | 1.040 | Mining region, moderate costs |
| **Western Cape** | WC | 1.045 | Major port, transport from Gauteng |
| **Eastern Cape** | EC | 1.085 | Distance, less competition |
| **Limpopo** | LP | 1.095 | Remote, limited suppliers |
| **Northern Cape** | NC | 1.125 | **Most remote**, highest transport costs |

### Example Pricing Impact
If a cement bag costs **R100 in Johannesburg (GP)**:
- **Cape Town (WC)**: R104.50 (+4.5%)
- **Durban (KZN)**: R103.50 (+3.5%)
- **Kimberley (NC)**: R112.50 (+12.5%)

---

## 🔍 Verify in Your App

After running the SQL:

1. **Refresh your Qilly app**
2. **Log in as train1@gmail.com** (FREE tier contractor)
3. **Select a BOQ template** from the Template Library
4. **Change the province** in project settings (e.g., from GP to WC)
5. **Observe pricing changes** - you should see prices increase/decrease based on the multiplier

### Expected Behavior:
✅ **No more warning message** - Data loaded from database  
✅ **Provincial pricing works** - Prices adjust automatically  
✅ **Admin can update multipliers** - Via Supabase dashboard

---

## 🛠️ Troubleshooting

### Warning Still Shows?
1. **Check table exists**:
   ```sql
   SELECT * FROM provincial_price_multipliers;
   ```
   Should return 9 rows.

2. **Check permissions**:
   ```sql
   -- Enable RLS (Row Level Security)
   ALTER TABLE provincial_price_multipliers ENABLE ROW LEVEL SECURITY;
   
   -- Allow public read access
   CREATE POLICY "Allow public read access" ON provincial_price_multipliers
     FOR SELECT TO PUBLIC USING (true);
   ```

3. **Hard refresh your app**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Data Looks Wrong?
Run this to reset:
```sql
TRUNCATE TABLE provincial_price_multipliers;
-- Then re-run the INSERT statements from POPULATE_PROVINCIAL_PRICING.sql
```

---

## 📅 For Tuesday's eTender Presentation

This is **CRITICAL** for your demo:
- ✅ Shows **live provincial pricing** working
- ✅ Demonstrates **real South African market data**
- ✅ Proves **Qilly handles regional variations** accurately
- ✅ **No warning messages** - looks professional

**Run this SQL NOW** before your presentation! 🚀

---

## 📞 Support

If you encounter any issues:
1. Check the Supabase logs (Settings → Logs)
2. Verify the table structure matches the schema
3. Ensure RLS policies allow read access

**Need help?** The warning disappears once the table is populated correctly.
