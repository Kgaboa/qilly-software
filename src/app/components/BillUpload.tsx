import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/app/components/ui/table';
import { Plus, Trash2, Upload, AlertCircle, FileUp, CheckCircle, Lock } from 'lucide-react';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { municipalities, getMunicipalitiesByProvince, type Municipality } from '@/utils/regionalOptimization';
import { SubscriptionUpgradeModal } from '@/app/components/payments/SubscriptionUpgradeModal';
import { supabase } from '@/utils/supabase';
import { resolveImportedBoqRow, type BoqRowType } from '@/utils/boqImport';

// Helper function to convert province full names to codes
const provinceNameToCode = (provinceName: string): string => {
  const mapping: Record<string, string> = {
    'gauteng': 'GP',
    'western cape': 'WC',
    'kwazulu-natal': 'KZN',
    'kzn': 'KZN',
    'eastern cape': 'EC',
    'free state': 'FS',
    'mpumalanga': 'MP',
    'limpopo': 'LP',
    'north west': 'NW',
    'northwest': 'NW',
    'northern cape': 'NC',
    // Also support codes as-is
    'gp': 'GP',
    'wc': 'WC',
    'ec': 'EC',
    'fs': 'FS',
    'mp': 'MP',
    'lp': 'LP',
    'nw': 'NW',
    'nc': 'NC'
  };
  
  const normalized = provinceName.toLowerCase().trim();
  return mapping[normalized] || 'GP'; // Default to GP if not found
};

// Helper function to convert CIDB grade full names to codes
const cidbGradeToCode = (grade: string): string => {
  if (!grade) return 'GB4';
  
  // If already in correct format (GB1-GB9), return as-is
  if (/^GB[1-9]$/i.test(grade)) {
    return grade.toUpperCase();
  }
  
  // Extract number from "Grade 4 CE" → "GB4"
  const match = grade.match(/Grade\s*(\d)/i) || grade.match(/GB?(\d)/i);
  if (match) {
    return `GB${match[1]}`;
  }
  
  return 'GB4'; // Default
};

// CIDB Classes - matching ContractorSignup
const CIDB_CLASSES = [
  { code: 'GB', name: 'General Building' },
  { code: 'CE', name: 'Civil Engineering' },
  { code: 'EB', name: 'Electrical Engineering' },
  { code: 'ME', name: 'Mechanical Engineering' },
];

// CIDB Grade Numbers - 1-9
const CIDB_GRADE_NUMBERS = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const BOQ_PAGE_SIZE = 75;
const CIDB_SUGGESTED_MARGINS: Record<string, string> = {
  '1': '15', '2': '13', '3': '12', '4': '10', '5': '9',
  '6': '8', '7': '7', '8': '6', '9': '5'
};

interface BillItem {
  code: string;
  name: string;
  description: string;
  quantity: string;
  unit: string;
  isRateOnly: boolean;
  buildAidRef?: string; // BuildAid 2025/2026 page reference (optional)
  sansCode?: string; // SANS 1200 standard code (optional)
  rowType?: BoqRowType;
}

interface BillUploadProps {
  onProcess: (billData: BillItem[], projectSettings?: ProjectSettings) => void;
  isLoading: boolean;
  canProcess: boolean;
  preloadedItems?: BillItem[];
  onBackToTemplates?: () => void;
  isContractor?: boolean;
  canUploadBOQ?: boolean; // ✅ NEW: Controls file upload and add item functionality
}

interface ProjectSettings {
  province: string;
  municipality?: string;
  profitMargin: string;
  pcHandlingMargin: string;
  cidbGrading: string;
  duration: string;
  machineryType: string;
  isTrainingTemplate?: boolean;
}

export function BillUpload({ onProcess, isLoading, canProcess, preloadedItems, onBackToTemplates, isContractor, canUploadBOQ }: BillUploadProps) {
  const [items, setItems] = useState<BillItem[]>([
    { code: '', name: '', description: '', quantity: '', unit: '', isRateOnly: false, buildAidRef: '', sansCode: '' }
  ]);
  
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ id: '', email: '', name: '' });
  const [contractorData, setContractorData] = useState<any>(null);
  const [isLoadingContractor, setIsLoadingContractor] = useState(true);
  const [isFromTemplate, setIsFromTemplate] = useState(false); // ✅ Track if items are from template
  const [itemPage, setItemPage] = useState(0);

  // Load contractor data from Supabase (not localStorage/sessionStorage)
  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();

    const loadContractorFromSupabase = async () => {
      if (!isContractor) {
        setIsLoadingContractor(false);
        return;
      }

      try {
        // Get current authenticated user with timeout protection
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (!isMounted) return; // Component unmounted, stop processing
        
        if (authError) {
          console.warn('⚠️ Auth error:', authError.message);
          setIsLoadingContractor(false);
          return;
        }
        
        if (!user) {
          console.warn('⚠️ No authenticated user found');
          setIsLoadingContractor(false);
          return;
        }

        console.log('🔍 Loading contractor data for user:', user.email);

        // Fetch contractor data from Supabase contractors table
        const { data: contractors, error } = await supabase
          .from('contractors')
          .select('*')
          .eq('email', user.email)
          .limit(1)
          .abortSignal(abortController.signal);

        if (!isMounted) return; // Component unmounted, stop processing

        if (error) {
          console.error('❌ Error loading contractor data:', error);
          setIsLoadingContractor(false);
          return;
        }

        if (!contractors || contractors.length === 0) {
          console.log('ℹ️  No contractor record found for this user (not a contractor account)');
          setIsLoadingContractor(false);
          return;
        }

        const contractorData = contractors[0];
        
        console.log('✅ Contractor data loaded from Supabase:', contractorData);
        console.log('  📍 Province (single):', contractorData.province);
        console.log('  📍 Operating provinces (array):', contractorData.operating_provinces);
        console.log('  🏗️ CIDB grade:', contractorData.cidb_grade);
        
        setContractorData(contractorData);
        
        // Determine province to use - prioritize operating_provinces array, fallback to single province
        let defaultProvince = 'GP';
        if (contractorData.operating_provinces && contractorData.operating_provinces.length > 0) {
          const rawProvince = contractorData.operating_provinces[0];
          defaultProvince = provinceNameToCode(rawProvince);
          console.log(`  ✅ Using operating_provinces[0]: "${rawProvince}" → "${defaultProvince}"`);
        } else if (contractorData.province) {
          const rawProvince = contractorData.province;
          defaultProvince = provinceNameToCode(rawProvince);
          console.log(`  ✅ Using single province field: "${rawProvince}" → "${defaultProvince}"`);
        } else {
          console.log('  ⚠️ No province data found, defaulting to GP');
        }
        
        const municipalities = getMunicipalitiesByProvince(defaultProvince);
        console.log(`  📋 Available municipalities for "${defaultProvince}":`, municipalities.length, 'found');
        
        const defaultMunicipality = municipalities[0]?.code || 'JHB';
        
        // Convert CIDB grade to code format
        const rawCidb = contractorData.cidb_grade || 'GB4';
        const defaultCidb = cidbGradeToCode(rawCidb);
        console.log(`  🏗️ CIDB grade: "${rawCidb}" → "${defaultCidb}"`);
        
        console.log('  🎯 Setting defaults:');
        console.log('    - Province:', defaultProvince);
        console.log('    - Municipality:', defaultMunicipality);
        console.log('    - CIDB:', defaultCidb);
        
        setProjectSettings(prev => ({
          ...prev,
          province: defaultProvince,
          municipality: defaultMunicipality,
          cidbGrading: defaultCidb,
          profitMargin: CIDB_SUGGESTED_MARGINS[defaultCidb.slice(-1)] || prev.profitMargin,
        }));
        
        console.log('  ✅ Project settings state updated');
        
        // Also set user info
        setUserInfo({
          id: contractorData.id || '',
          email: contractorData.email || '',
          name: contractorData.contact_person || ''
        });
      } catch (err: any) {
        if (err.name === 'AbortError') {
          console.log('🔄 Contractor data request was aborted (component unmounted)');
          return;
        }
        console.error('❌ Failed to load contractor data:', err);
      } finally {
        if (isMounted) {
          setIsLoadingContractor(false);
        }
      }
    };

    loadContractorFromSupabase();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [isContractor]);

  // Load preloaded items from template (if any)
  useEffect(() => {
    if (preloadedItems && preloadedItems.length > 0) {
      setItems(preloadedItems);
      setIsFileUploaded(true);
      setIsFromTemplate(true); // ✅ Mark as template items
      toast.success(`Template loaded! ${preloadedItems.length} items ready. Configure project settings and generate pricing.`);
    }
  }, [preloadedItems]);

  const [projectSettings, setProjectSettings] = useState<ProjectSettings>({
    province: 'GP',
    municipality: 'JHB',
    profitMargin: '10',
    pcHandlingMargin: '3',
    cidbGrading: 'GB4',
    duration: '6',
    machineryType: 'rented'
  });

  // Separate state for CIDB Class and Grade Number (to avoid dropdown freeze)
  const [cidbClass, setCidbClass] = useState<string>('GB');
  const [cidbGradeNumber, setCidbGradeNumber] = useState<string>('4');

  // Sync combined cidbGrading whenever class or grade changes
  useEffect(() => {
    const combined = `${cidbClass}${cidbGradeNumber}`;
    setProjectSettings(prev => {
      if (combined !== prev.cidbGrading) {
        console.log(`🏗️ CIDB updated: ${cidbClass} + ${cidbGradeNumber} = ${combined}`);
        return { ...prev, cidbGrading: combined };
      }
      return prev; // ✅ Avoid unnecessary re-renders
    });
  }, [cidbClass, cidbGradeNumber]);

  // Update separate CIDB fields when projectSettings.cidbGrading changes externally (e.g., from contractor data)
  // Only depend on cidbGrading to avoid circular dependency
  useEffect(() => {
    const match = projectSettings.cidbGrading.match(/^([A-Z]+)(\d)$/);
    if (match) {
      const [_, classCode, gradeNum] = match;
      setCidbClass(prev => classCode !== prev ? classCode : prev);
      setCidbGradeNumber(prev => gradeNum !== prev ? gradeNum : prev);
    }
  }, [projectSettings.cidbGrading]); // ✅ Only depend on cidbGrading, not the state we're setting

  useEffect(() => {
    const lastPage = Math.max(0, Math.ceil(items.length / BOQ_PAGE_SIZE) - 1);
    if (itemPage > lastPage) setItemPage(lastPage);
  }, [items.length, itemPage]);

  const totalItemPages = Math.max(1, Math.ceil(items.length / BOQ_PAGE_SIZE));
  const visibleItemStart = itemPage * BOQ_PAGE_SIZE;
  const visibleItems = items.slice(visibleItemStart, visibleItemStart + BOQ_PAGE_SIZE);

  // Debug: Log project settings whenever they change
  useEffect(() => {
    console.log('📋 Project Settings Updated:', projectSettings);
  }, [projectSettings]);

  // Get municipalities for selected province
  const availableMunicipalities = getMunicipalitiesByProvince(projectSettings.province);

  // Update municipality when province changes (only depend on province to avoid circular dependency)
  useEffect(() => {
    const munics = getMunicipalitiesByProvince(projectSettings.province);
    setProjectSettings(prev => {
      // Only update if current municipality is not valid for the new province
      if (munics.length > 0 && !munics.find(m => m.code === prev.municipality)) {
        console.log('  Province changed, updating municipality to:', munics[0].code);
        return { ...prev, municipality: munics[0].code };
      }
      return prev; // No change needed
    });
  }, [projectSettings.province]); // ✅ Only depend on province, not municipality

  const addItem = () => {
    if (isFromTemplate) {
      toast.error('Cannot add items to a template. Templates are read-only.');
      return;
    }
    setItems([...items, { code: '', name: '', description: '', quantity: '', unit: '', isRateOnly: false, buildAidRef: '', sansCode: '' }]);
  };

  const removeItem = (index: number) => {
    if (isFromTemplate) {
      toast.error('Cannot remove items from a template. Templates are read-only.');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof BillItem, value: string) => {
    if (isFromTemplate) {
      toast.error('Template items are locked and cannot be edited.');
      return;
    }
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-set quantity to 1 for special unit types
    if (field === 'unit') {
      const unitLower = value.toLowerCase().trim();
      const isLumpSum = unitLower === 'lump sum' || unitLower === 'lumpsum' || unitLower === 'lump' || unitLower === 'ls' || unitLower === 'sum';
      const isPCSum = unitLower.includes('prime cost') || unitLower.includes('pc sum') || unitLower === 'pc';
      const isProvisionalSum = unitLower.includes('provisional sum') || unitLower === 'provisional sum' || unitLower === 'prov';
      
      if (isLumpSum || isPCSum || isProvisionalSum) {
        newItems[index].quantity = '1';
      }
    }
    
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Helper function to check if item is a summary row
    const isSummaryRow = (item: BillItem) => {
      if (!item.name) return false;
      const nameLower = item.name.toLowerCase().trim();
      return nameLower.includes('total carried forward to summary') ||
             nameLower.includes('total carried to summary') ||
             nameLower.includes('carried forward to summary');
    };
    
    // Filter out items where both unit and quantity are blank (headers/blank rows)
    // BUT keep summary rows even if they have blank UNIT/QUANTITY
    const validItems = items.filter(item => {
      if (item.rowType === 'heading' || item.rowType === 'subheading') {
        return Boolean(item.name?.trim());
      }
      // Always keep summary rows
      if (isSummaryRow(item)) {
        console.log(`✅ KEEPING SUMMARY ROW in submit: "${item.name}" (Code: ${item.code})`);
        return true;
      }
      // For regular items, require name and unit
      return item.name && item.name.trim() !== '' && item.unit;
    }).map(item => ({
      ...item,
      quantity: item.rowType === 'heading' || item.rowType === 'subheading'
        ? ''
        : item.quantity || '0'
    }));

    if (validItems.length === 0) {
      toast.error('Please add at least one item with a name and unit');
      return;
    }

    console.log('Submitting bill with items:', validItems);
    console.log('Project settings:', projectSettings);
    onProcess(validItems, { ...projectSettings, isTrainingTemplate: isFromTemplate });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Prevent upload if viewing template items
    if (isFromTemplate) {
      toast.error('Cannot upload files when viewing a template. Templates are read-only.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      
      // Auto-parse the file
      try {
        const lines = text.trim().split('\n');
        const parsedItems: BillItem[] = [];

        // Detect header row and column positions - scan rows 0 to 10
        let headerIndex = -1;
        let columnMap: { itemNo: number; description: number; unit: number; quantity: number; rate: number; amount: number } = {
          itemNo: -1, description: -1, unit: -1, quantity: -1, rate: -1, amount: -1
        };

        // Try to detect header row in first 10 rows (rows 0-10)
        for (let i = 0; i < Math.min(11, lines.length); i++) {
          const parts = lines[i].split(',').map(p => p.trim().replace(/^\"|\"$/g, ''));
          
          // Skip completely empty rows
          if (parts.every(p => !p)) continue;
          
          // Convert to lowercase and clean for comparison
          const partsLower = parts.map(p => p.toLowerCase().replace(/[^a-z0-9]/g, ''));
          
          // Check if this row contains the required BOQ header keywords (flexible matching)
          const hasItemNo = partsLower.some(p => 
            p.includes('itemno') || (p.includes('item') && p.includes('no')) || 
            p === 'no' || p.includes('itemnumber') || p.includes('code') || p === 'item'
          );
          const hasDescription = partsLower.some(p => 
            p.includes('description') || p.includes('desc') || p === 'itemname' ||
            p === 'name' || p.includes('particulars') || p.includes('details')
          );
          const hasUnit = partsLower.some(p => 
            p.includes('unit') || p === 'uom' || p === 'u' || p === 'units'
          );
          const hasQuantity = partsLower.some(p => 
            p.includes('quantity') || p.includes('qty') || p === 'quan' || p === 'q'
          );
          
          // If we found at least 2 of the 4 key columns, this is likely our header row
          const foundColumns = [hasItemNo, hasDescription, hasUnit, hasQuantity].filter(Boolean).length;
          if (foundColumns >= 2) {
            headerIndex = i;
            console.log(`✅ CSV Header detected at row ${i}. Found columns: ItemNo=${hasItemNo}, Description=${hasDescription}, Unit=${hasUnit}, Quantity=${hasQuantity}`);
            
            // Map column positions based on exact header names
            parts.forEach((header, index) => {
              const headerClean = header.toLowerCase().replace(/[^a-z0-9]/g, '');
              
              // ITEM NO column
              if (headerClean.includes('itemno') || 
                  (headerClean.includes('item') && headerClean.includes('no')) || 
                  headerClean === 'no' || 
                  headerClean.includes('itemnumber') ||
                  headerClean === 'code') {
                columnMap.itemNo = index;
              }
              // DESCRIPTION column (most important for supplier matching)
              if (headerClean.includes('description') || 
                  headerClean === 'desc' ||
                  (headerClean === 'item' && !headerClean.includes('no'))) {
                columnMap.description = index;
              }
              // UNIT column
              if (headerClean.includes('unit') || headerClean === 'uom' || headerClean === 'u') {
                columnMap.unit = index;
              }
              // QUANTITY column - DO NOT include 'amount' (amount = qty × rate)
              if (headerClean.includes('quantity') || headerClean === 'qty' || headerClean.includes('quan')) {
                columnMap.quantity = index;
              }
              // RATE column
              if (headerClean.includes('rate') || 
                  headerClean.includes('unitprice') || 
                  headerClean.includes('price')) {
                columnMap.rate = index;
              }
              // AMOUNT column (calculated: quantity × rate)
              if (headerClean.includes('amount') || 
                  headerClean === 'total' || 
                  headerClean.includes('totalamount') || 
                  headerClean === 'value') {
                columnMap.amount = index;
              }
            });
            
            console.log(`✅ Found CSV header row at index ${i}:`, columnMap);
            break;
          }
        }

        // If we didn't find headers, try default positions
        if (headerIndex === -1) {
          console.warn('No header row found, using default column positions');
          columnMap = { itemNo: 0, description: 1, unit: 2, quantity: 3, rate: 4, amount: 5 };
          headerIndex = 0;
        }

        const startIndex = headerIndex + 1;

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue; // Skip empty lines
          
          const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
          
          if (parts.length < 2) continue; // Need at least 2 columns
          
          // Extract fields using detected column positions
          const description = columnMap.description >= 0 ? (parts[columnMap.description] || '') : '';
          const unit = columnMap.unit >= 0 ? (parts[columnMap.unit] || '') : '';
          const itemNo = columnMap.itemNo >= 0 ? (parts[columnMap.itemNo] || '') : '';
          
          // Map BOQ QUANTITY column to system Qty field
          const rawQty = columnMap.quantity >= 0 ? (parts[columnMap.quantity] || '') : '';
          let qty = rawQty;
          let isRateOnly = false;
          
          // Check if this is a "Rate Only" item
          if (qty && /^rate\s*only$/i.test(qty.trim())) {
            isRateOnly = true;
            qty = '1'; // Set quantity to 1 for pricing purposes
          }
          // Clean up qty only if it has a value (remove commas, spaces, currency symbols)
          else if (qty && qty.trim() !== '' && qty !== 'undefined') {
            qty = qty.replace(/[R$,\s]/g, '').trim();
          } else {
            qty = ''; // Keep it blank if no valid quantity
          }
          
          // Debug logging for quantity parsing
          if (rawQty !== qty || rawQty) {
            console.log(`CSV Row ${i}: Raw qty="${rawQty}" → Cleaned qty="${qty}"${isRateOnly ? ' [RATE ONLY]' : ''}`);
          }
          
          // Check if this is a summary row (TOTAL CARRIED FORWARD TO SUMMARY)
          const isSummaryRow = description && (
            description.toLowerCase().includes('total carried forward to summary') ||
            description.toLowerCase().includes('total carried to summary') ||
            description.toLowerCase().includes('carried forward to summary')
          );
          
          if (isSummaryRow) {
            console.log(`✅ CSV SUMMARY ROW DETECTED at line ${i}: "${description}" (Code: ${itemNo})`);
          }
          
          // Skip rows with section headers or subtotals (typically have no unit)
          // UNLESS it's a summary row
          if ((!unit || unit.trim() === '') && !isSummaryRow) continue;
          
          // Skip header rows that might have been missed - check if description contains header keywords
          if (description && description.trim()) {
            const descLower = description.toLowerCase().trim();
            if (descLower === 'description' || descLower === 'item description' || 
                descLower === 'description of work' || descLower === 'desc' ||
                descLower === 'item' || descLower === 'item name') {
              console.log(`Skipping header row at line ${i}: "${description}"`);
              continue;
            }
          }
          
          // Include rows that have DESCRIPTION and UNIT (required for pricing)
          // OR rows that are summary rows (which may have blank UNIT/QUANTITY)
          if ((description && description.trim() && unit && unit.trim()) || isSummaryRow) {
            parsedItems.push({
              code: itemNo.trim() || '', // Map BOQ ITEM NO to code field
              name: description.trim(), // Map BOQ DESCRIPTION to name field (used for supplier search)
              description: '', // Leave description empty to avoid duplication
              quantity: qty, // Map BOQ QUANTITY to system Qty field (may be blank for summary rows)
              unit: unit ? unit.trim() : '', // May be blank for summary rows
              isRateOnly, // Flag for special handling in pricing
              buildAidRef: '', // Can be filled manually after import
              sansCode: '', // Can be filled manually after import
            });
          }
        }

        if (parsedItems.length > 0) {
          setItems(parsedItems);
          setIsFileUploaded(true);
          toast.success(`CSV imported successfully! ${parsedItems.length} items loaded.`);
          console.log('CSV Column Map:', columnMap);
          console.log('Parsed CSV BOQ items:', parsedItems);
          
          // Log summary of what was parsed
          const summaryRows = parsedItems.filter(item => 
            item.name.toLowerCase().includes('total carried forward to summary') ||
            item.name.toLowerCase().includes('total carried to summary') ||
            item.name.toLowerCase().includes('carried forward to summary')
          );
          console.log(`📊 CSV Parsing Summary: ${parsedItems.length} total items, ${summaryRows.length} summary rows`);
          if (summaryRows.length > 0) {
            summaryRows.forEach((row, idx) => {
              const position = parsedItems.indexOf(row) + 1;
              console.log(`   Summary Row ${idx + 1}: Position ${position}, Code: "${row.code}", Name: "${row.name}"`);
            });
          }
        } else {
          toast.error('No valid items found in CSV file. Ensure the file has "DESCRIPTION" and "UNIT" columns with data.');
        }
      } catch (error) {
        console.error('CSV parsing error:', error);
        toast.error('Error parsing CSV file. Please check format.');
      }
    };
    reader.readAsText(file);
    
    // Reset the file input
    e.target.value = '';
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Prevent upload if viewing template items
    if (isFromTemplate) {
      toast.error('Cannot upload files when viewing a template. Templates are read-only.');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const allParsedItems: BillItem[] = [];
        let totalSheets = 0;

        // Process all sheets in the workbook
        for (const sheetName of workbook.SheetNames) {
          totalSheets++;
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' }) as any[][];

          if (jsonData.length === 0) continue;

          // Detect header row and column positions. Consultant BOQs often have
          // cover content before the table, so inspect the first 50 rows.
          let headerIndex = -1;
          let columnMap: { itemNo: number; description: number; unit: number; quantity: number; rate: number; amount: number } = {
            itemNo: -1, description: -1, unit: -1, quantity: -1, rate: -1, amount: -1
          };

          for (let i = 0; i < Math.min(50, jsonData.length); i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;

            // Convert to strings, clean, and compare flexibly
            const rowStrings = row.map((cell: any) => String(cell || '').trim());
            
            // Skip completely empty rows
            if (rowStrings.every(s => !s)) continue;
            
            const rowLower = rowStrings.map((s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, ''));
            
            // Check if this row contains the required BOQ header keywords (flexible matching)
            const hasItemNo = rowLower.some((cell: string) => 
              cell.includes('itemno') || (cell.includes('item') && cell.includes('no')) || 
              cell === 'no' || cell.includes('itemnumber') || cell.includes('code') || cell === 'item'
            );
            const hasDescription = rowLower.some((cell: string) => 
              cell.includes('description') || cell.includes('desc') || cell === 'itemname' ||
              cell === 'name' || cell.includes('particulars') || cell.includes('details')
            );
            const hasUnit = rowLower.some((cell: string) => 
              cell.includes('unit') || cell === 'uom' || cell === 'u' || cell === 'units'
            );
            const hasQuantity = rowLower.some((cell: string) => 
              cell.includes('quantity') || cell.includes('qty') || cell === 'quan' || cell === 'q'
            );
            
            // If we found at least 2 of the 4 key columns, this is likely our header row
            const foundColumns = [hasItemNo, hasDescription, hasUnit, hasQuantity].filter(Boolean).length;
            if (foundColumns >= 2) {
              headerIndex = i;
              console.log(`✅ Excel Header detected at row ${i}. Found columns: ItemNo=${hasItemNo}, Description=${hasDescription}, Unit=${hasUnit}, Quantity=${hasQuantity}`);
              
              // Map column positions based on header names
              rowStrings.forEach((header: string, index: number) => {
                const headerClean = header.toLowerCase().replace(/[^a-z0-9]/g, '');
                
                // ITEM NO column
                if (headerClean.includes('itemno') || 
                    (headerClean.includes('item') && headerClean.includes('no')) || 
                    headerClean === 'no' || 
                    headerClean.includes('itemnumber') ||
                    headerClean === 'code') {
                  columnMap.itemNo = index;
                }
                // DESCRIPTION column (most important for supplier matching)
                if (headerClean.includes('description') || 
                    headerClean === 'desc' ||
                    (headerClean === 'item' && !headerClean.includes('no'))) {
                  columnMap.description = index;
                }
                // UNIT column
                if (headerClean.includes('unit') || headerClean === 'uom' || headerClean === 'u') {
                  columnMap.unit = index;
                }
                // QUANTITY column - DO NOT include 'amount' (amount = qty × rate)
                if (headerClean.includes('quantity') || headerClean === 'qty' || headerClean.includes('quan')) {
                  columnMap.quantity = index;
                }
                // RATE column
                if (headerClean.includes('rate') || 
                    headerClean.includes('unitprice') || 
                    headerClean.includes('price')) {
                  columnMap.rate = index;
                }
                // AMOUNT column (calculated: quantity × rate)
                if (headerClean.includes('amount') || 
                    headerClean === 'total' || 
                    headerClean.includes('totalamount') || 
                    headerClean === 'value') {
                  columnMap.amount = index;
                }
              });
              
              console.log(`✅ Found Excel header row at index ${i}:`, columnMap);
              break;
            }
          }

          // If we didn't find headers, try default positions
          if (headerIndex === -1) {
            console.warn('No header row found, using default column positions');
            columnMap = { itemNo: 0, description: 1, unit: 2, quantity: 3, rate: 4, amount: 5 };
            headerIndex = 0;
          }

          const startIndex = headerIndex + 1;

          // Parse each row starting after the header
          for (let i = startIndex; i < jsonData.length; i++) {
            const row = jsonData[i];
            if (!row || row.length === 0) continue;

            // Convert all cells to strings and trim
            const parts = row.map((cell: any) => String(cell || '').trim());
            
            // Skip completely empty rows
            if (parts.every((p: string) => !p || p === 'undefined')) continue;

            const resolved = resolveImportedBoqRow(parts, columnMap);
            const description = resolved.description;
            const unit = resolved.unit;
            const itemNo = resolved.code;
            const qty = resolved.quantity;
            const isRateOnly = /^rate\s*only$/i.test(String(columnMap.quantity >= 0 ? parts[columnMap.quantity] : '').trim());
            
            // Check if this is a summary row (TOTAL CARRIED FORWARD TO SUMMARY)
            const isSummaryRow = description && (
              description.toLowerCase().includes('total carried forward to summary') ||
              description.toLowerCase().includes('total carried to summary') ||
              description.toLowerCase().includes('carried forward to summary')
            );
            
            if (isSummaryRow) {
              console.log(`✅ EXCEL SUMMARY ROW DETECTED at line ${i}: "${description}" (Code: ${itemNo})`);
            }
            
            // Skip header rows that might have been missed - check if description contains header keywords
            if (description && description.trim()) {
              const descLower = description.toLowerCase().trim();
              if (descLower === 'description' || descLower === 'item description' || 
                  descLower === 'description of work' || descLower === 'desc' ||
                  descLower === 'item' || descLower === 'item name') {
                console.log(`Skipping header row at line ${i}: "${description}"`);
                continue;
              }
            }
            
            // Preserve headings/subheadings for document structure, but price
            // only rows classified as actual items.
            if (description && description.trim()) {
              allParsedItems.push({
                code: itemNo.trim() || '', // Map BOQ ITEM NO to code field
                name: description.trim(), // Map BOQ DESCRIPTION to name field (used for supplier search)
                description: '', // Leave description empty to avoid duplication
                quantity: qty, // Map BOQ QUANTITY to system Qty field (may be blank for summary rows)
                unit: unit ? unit.trim() : '', // May be blank for summary rows
                isRateOnly, // Flag for special handling in pricing
                rowType: isSummaryRow ? 'summary' : resolved.rowType,
              });
            }
          }
          
          // Log column map for this sheet
          console.log(`Sheet "${sheetName}" - Column Map:`, columnMap);
        }

        if (allParsedItems.length > 0) {
          setItems(allParsedItems);
          setIsFileUploaded(true);
          if (totalSheets > 1) {
            toast.success(`Excel imported successfully! ${allParsedItems.length} items loaded from ${totalSheets} sheets.`);
          } else {
            toast.success(`Excel imported successfully! ${allParsedItems.length} items loaded.`);
          }
          console.log('Parsed Excel BOQ items:', allParsedItems);
          
          // Log summary of what was parsed
          const summaryRows = allParsedItems.filter(item => 
            item.name.toLowerCase().includes('total carried forward to summary') ||
            item.name.toLowerCase().includes('total carried to summary') ||
            item.name.toLowerCase().includes('carried forward to summary')
          );
          console.log(`📊 Excel Parsing Summary: ${allParsedItems.length} total items, ${summaryRows.length} summary rows`);
          if (summaryRows.length > 0) {
            summaryRows.forEach((row, idx) => {
              const position = allParsedItems.indexOf(row) + 1;
              console.log(`   Summary Row ${idx + 1}: Position ${position}, Code: "${row.code}", Name: "${row.name}"`);
            });
          }
        } else {
          toast.error('No valid items found in Excel file. Ensure the file has "DESCRIPTION" and "UNIT" columns with data.');
        }
      } catch (error) {
        console.error('Excel parsing error:', error);
        toast.error('Error parsing Excel file. Please check format.');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset the file input
    e.target.value = '';
  };

  if (!canProcess) {
    return (
      <>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-16 w-16 text-amber-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Free Trial Used</h3>
              <p className="text-gray-600 mb-4">
                You've used your free trial pricing. Upgrade to a paid account to continue pricing bills.
              </p>
              <Button onClick={() => setShowUpgradeModal(true)}>
                Upgrade to Paid Account
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <SubscriptionUpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          onUpgradeSuccess={() => {
            setShowUpgradeModal(false);
            window.location.reload();
          }}
          userId={userInfo.id}
          userEmail={userInfo.email}
          userName={userInfo.name}
        />
      </>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Upload Bill of Quantities</CardTitle>
            <CardDescription>
              Configure your project settings below (applied to all pricing), then import your unpriced Bill of Quantity.
            </CardDescription>
          </div>
          {/* Back to Templates button for contractors */}
          {isContractor && onBackToTemplates && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onBackToTemplates}
              className="flex items-center gap-2"
            >
              ← Back to Templates
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Read-only template training banner */}
          {isFromTemplate && (
            <div className="w-full p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg shadow-sm">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🎓</div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-amber-900 mb-1">
                    Training Mode: Template Items Loaded (Read-Only)
                  </p>
                  <p className="text-xs text-amber-800 mb-2">
                    You're viewing a <strong>pre-loaded Qilly training template</strong>. The template BOQ and project settings are <strong>locked and cannot be edited</strong>. Click "Generate Priced BOQ" to explore Qilly's pricing workflow.
                  </p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-amber-700">
                      🔒 Template items locked (read-only)
                    </span>
                    <span className="text-amber-700">
                      🔒 Project settings locked
                    </span>
                    <span className="text-amber-700">
                      ✅ Can generate pricing
                    </span>
                  </div>
                  {!canUploadBOQ && (
                    <div className="mt-3 pt-3 border-t border-amber-300">
                      <p className="text-xs text-amber-800">
                        <strong>Want to upload your own BOQs?</strong> Upgrade to <strong className="text-amber-900">PROFESSIONAL</strong> or higher.{' '}
                        <a href="mailto:support@qilly.co.za" className="underline font-semibold hover:text-amber-950">Contact sales</a>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Loading Indicator for Contractor Data */}
          {isContractor && isLoadingContractor && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-sm text-blue-700 font-medium">Loading your contractor profile...</p>
            </div>
          )}

          {/* Show contractor data once loaded */}
          {isContractor && !isLoadingContractor && contractorData && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">
                ✅ Profile loaded: {contractorData.company_name} | 
                Province: {contractorData.province || contractorData.operating_provinces?.[0] || 'Not set'} | 
                CIDB: {contractorData.cidb_grade || 'Not set'}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Current Selection: Province={projectSettings.province}, Municipality={projectSettings.municipality}
              </p>
            </div>
          )}

          {/* Project Settings Section */}
          <Card className="border-2 border-[#00b4d8]/20 bg-gradient-to-r from-[#00b4d8]/5 to-blue-50/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-[#00b4d8]">
                Project Settings {isFromTemplate ? '(Locked for training template)' : isContractor && '(Auto-filled from your profile)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isFromTemplate && (
                <div className="flex items-center gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800">
                  <Lock className="h-4 w-4 shrink-0" />
                  These settings are fixed for this training template.
                </div>
              )}
              <fieldset
                disabled={isFromTemplate}
                className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 ${isFromTemplate ? 'opacity-70' : ''}`}
              >
                {/* Province Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="province" className="text-xs font-medium">
                    Province
                  </Label>
                  <select
                    id="province"
                    value={projectSettings.province}
                    onChange={(e) => {
                      console.log('Province changed to:', e.target.value);
                      setProjectSettings(prev => ({ ...prev, province: e.target.value }));
                    }}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="GP">Gauteng (GP)</option>
                    <option value="WC">Western Cape (WC)</option>
                    <option value="KZN">KwaZulu-Natal (KZN)</option>
                    <option value="EC">Eastern Cape (EC)</option>
                    <option value="FS">Free State (FS)</option>
                    <option value="MP">Mpumalanga (MP)</option>
                    <option value="LP">Limpopo (LP)</option>
                    <option value="NW">North West (NW)</option>
                    <option value="NC">Northern Cape (NC)</option>
                  </select>
                </div>

                {/* Municipality Selection */}
                <div className="space-y-1.5">
                  <Label htmlFor="municipality" className="text-xs font-medium">
                    Municipality
                  </Label>
                  <select
                    id="municipality"
                    value={projectSettings.municipality}
                    onChange={(e) => {
                      console.log('Municipality changed to:', e.target.value);
                      setProjectSettings(prev => ({ ...prev, municipality: e.target.value }));
                    }}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {availableMunicipalities.map(municipality => (
                      <option key={municipality.code} value={municipality.code}>
                        {municipality.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profit Margin */}
                <div className="space-y-1.5">
                  <Label htmlFor="profitMargin" className="text-xs font-medium">
                    Profit Margin (%)
                  </Label>
                  <select
                    id="profitMargin"
                    value={projectSettings.profitMargin}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, profitMargin: e.target.value }))}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 25 }, (_, index) => index + 1).map(margin => (
                      <option key={margin} value={margin.toString()}>{margin}%</option>
                    ))}
                  </select>
                </div>

                {/* Prime Cost handling margin */}
                <div className="space-y-1.5">
                  <Label htmlFor="pcHandlingMargin" className="text-xs font-medium">
                    PC Handling (%)
                  </Label>
                  <select
                    id="pcHandlingMargin"
                    value={projectSettings.pcHandlingMargin}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, pcHandlingMargin: e.target.value }))}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 23 }, (_, index) => index + 3).map(margin => (
                      <option key={margin} value={margin.toString()}>{margin}%</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-500">Starts at 3%; adjustable upward.</p>
                </div>

                {/* CIDB Class */}
                <div className="space-y-1.5">
                  <Label htmlFor="cidbClass" className="text-xs font-medium">
                    CIDB Class{isContractor && contractorData && <span className="text-green-600 ml-1">(from profile)</span>}
                  </Label>
                  <select
                    id="cidbClass"
                    value={cidbClass}
                    onChange={(e) => {
                      console.log('CIDB Class changed to:', e.target.value);
                      setCidbClass(e.target.value);
                    }}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CIDB_CLASSES.map(cls => (
                      <option key={cls.code} value={cls.code}>
                        {cls.code} - {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* CIDB Grade Number */}
                <div className="space-y-1.5">
                  <Label htmlFor="cidbGrade" className="text-xs font-medium">
                    Grade Number
                  </Label>
                  <select
                    id="cidbGrade"
                    value={cidbGradeNumber}
                    onChange={(e) => {
                      console.log('CIDB Grade Number changed to:', e.target.value);
                      const grade = e.target.value;
                      setCidbGradeNumber(grade);
                      setProjectSettings(prev => ({
                        ...prev,
                        profitMargin: CIDB_SUGGESTED_MARGINS[grade] || prev.profitMargin
                      }));
                    }}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CIDB_GRADE_NUMBERS.map(num => (
                      <option key={num} value={num}>
                        Grade {num}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Project Duration */}
                <div className="space-y-1.5">
                  <Label htmlFor="duration" className="text-xs font-medium">
                    Project Duration (months)
                  </Label>
                  <select
                    id="duration"
                    value={projectSettings.duration}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Array.from({ length: 36 }, (_, index) => index + 1).map(months => (
                      <option key={months} value={months.toString()}>
                        {months} {months === 1 ? 'month' : 'months'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Machinery Type */}
                <div className="space-y-1.5">
                  <Label htmlFor="machineryType" className="text-xs font-medium">
                    Machinery Type
                  </Label>
                  <select
                    id="machineryType"
                    value={projectSettings.machineryType}
                    onChange={(e) => setProjectSettings(prev => ({ ...prev, machineryType: e.target.value }))}
                    className="w-full h-8 px-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="rented">Rented</option>
                    <option value="owned">Owned</option>
                  </select>
                </div>
              </fieldset>
            </CardContent>
          </Card>

          {/* File Upload Buttons */}
          <div className="flex gap-2 mb-4">
            <div className="relative group">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('excel-file-upload')?.click()}
                disabled={!canUploadBOQ || isFromTemplate}
                className={!canUploadBOQ || isFromTemplate ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import BOQ excel file
              </Button>
              {(!canUploadBOQ || isFromTemplate) && (
                <span className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isFromTemplate ? 'File import is locked for training templates' : 'Upgrade to PROFESSIONAL to upload BOQs'}
                </span>
              )}
            </div>
            <input
              id="excel-file-upload"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleExcelUpload}
              className="hidden"
            />
          </div>

          {/* Template Lock Notice */}
          {isFromTemplate && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-300 rounded-md text-sm text-amber-800 mb-3">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span>
                <strong>Training template locked.</strong> BOQ rows and project settings are read-only. Generate pricing to explore the workflow.
              </span>
            </div>
          )}

          {/* BuildAid Compliance Info */}
          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 mb-3">
            <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="block mb-1">BuildAid 2025/2026 Compliance</strong>
              <p className="text-xs text-blue-700">
                The <strong>BuildAid Ref</strong> and <strong>SANS Code</strong> columns help track compliance with industry standards.
                These are optional but recommended for professional BOQs. Example: "p.42 §M001" for BuildAid reference, "SANS 1200 F" for standard code.
              </p>
            </div>
          </div>

          {items.length > BOQ_PAGE_SIZE && (
            <div className="mb-3 flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
              <span>
                Showing {visibleItemStart + 1}-{Math.min(visibleItemStart + BOQ_PAGE_SIZE, items.length)} of {items.length} items
              </span>
              <div className="flex items-center gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => setItemPage(page => Math.max(0, page - 1))} disabled={itemPage === 0}>
                  Previous
                </Button>
                <span>Page {itemPage + 1} of {totalItemPages}</span>
                <Button type="button" size="sm" variant="outline" onClick={() => setItemPage(page => Math.min(totalItemPages - 1, page + 1))} disabled={itemPage >= totalItemPages - 1}>
                  Next
                </Button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[120px]">
                    <div className="flex items-center gap-2">
                      ITEM NO *
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[200px]">
                    <div className="flex items-center gap-2">
                      Description
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[140px]">
                    <div className="flex items-center gap-2 text-xs">
                      BuildAid Ref
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="min-w-[110px]">
                    <div className="flex items-center gap-2 text-xs">
                      SANS Code
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-[90px]">
                    <div className="flex items-center gap-2">
                      Qty *
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-[90px]">
                    <div className="flex items-center gap-2">
                      Unit
                      {isFromTemplate && <Lock className="w-3 h-3 text-amber-600" />}
                    </div>
                  </TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleItems.map((item, pageIndex) => {
                  const index = visibleItemStart + pageIndex;
                  return (
                  <TableRow key={index}>
                    <TableCell className="p-2">
                      <Input
                        placeholder=""
                        value={item.code}
                        onChange={(e) => updateItem(index, 'code', e.target.value)}
                        className="text-sm h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : ""}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder=""
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        required
                        className="text-sm h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : ""}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="p.42 §M001"
                        value={item.buildAidRef || ''}
                        onChange={(e) => updateItem(index, 'buildAidRef', e.target.value)}
                        className="text-xs h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : "BuildAid 2025/2026 page reference (optional)"}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder="SANS 1200 F"
                        value={item.sansCode || ''}
                        onChange={(e) => updateItem(index, 'sansCode', e.target.value)}
                        className="text-xs h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : "SANS standard code (optional)"}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        type="number"
                        placeholder=""
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        min="0"
                        step="any"
                        className="text-sm h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : ""}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Input
                        placeholder=""
                        value={item.unit}
                        onChange={(e) => updateItem(index, 'unit', e.target.value)}
                        className="text-sm h-9"
                        disabled={isFromTemplate}
                        title={isFromTemplate ? "Template items are locked" : ""}
                      />
                    </TableCell>
                    <TableCell className="p-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1 || isFromTemplate}
                        title={isFromTemplate ? "Cannot delete template items" : ""}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Add Row button at the bottom of the table */}
          <div className="flex justify-start pt-3">
            <div className="relative group">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={addItem}
                className={!canUploadBOQ || isFromTemplate ? 'gap-2 opacity-50 cursor-not-allowed' : 'gap-2'}
                disabled={!canUploadBOQ || isFromTemplate}
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
              {(!canUploadBOQ || isFromTemplate) && (
                <span className="absolute -top-8 left-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {isFromTemplate ? 'Rows are locked for training templates' : 'Upgrade to PROFESSIONAL to add items'}
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            {items.length > 1 || (items.length === 1 && items[0].name) ? (
              <div className="flex items-center gap-4 mr-auto">
                <div className="flex items-center gap-2 text-sm">
                  {isFileUploaded ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{items.filter(i => i.name && i.unit).length} items ready for pricing</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                      <span className="font-medium text-amber-600">Please upload a BOQ file to generate pricing</span>
                    </>
                  )}
                </div>
              </div>
            ) : null}
            <Button 
              type="submit" 
              disabled={isLoading || !isFileUploaded} 
              size="lg"
              className={!isFileUploaded ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Upload className="h-4 w-4 mr-2" />
              {isLoading ? 'Processing...' : 'Generate Priced BOQ'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
