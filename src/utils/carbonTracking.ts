// Carbon Tracking Utility for Green Building Features
// Based on BuildAid 2025/2026 standards and South African construction materials

export interface CarbonData {
  carbonPerUnit: number; // kgCO2e per unit
  totalCarbon: number; // total kgCO2e for this item
  greenAlternative?: {
    name: string;
    carbonPerUnit: number;
    totalCarbon: number;
    carbonSavings: number;
    carbonSavingsPercent: number;
    unitPricePremium: number;
    totalPricePremium: number;
    pricePremiumPercent: number;
    supplierName: string;
    costPerTonneCO2eSaved: number; // R/tCO₂e saved (ROI metric)
  };
  greenScore: 'A+' | 'A' | 'B' | 'C' | 'D';
  category: 'concrete' | 'steel' | 'timber' | 'masonry' | 'finishes' | 'other';
}

// Carbon emission factors (kgCO2e per unit) - South African averages
const carbonCoefficients: Record<string, number> = {
  // Concrete & Cement
  'cement': 0.92, // kgCO2e/kg for OPC 42.5N
  'concrete': 150, // kgCO2e/m³ for standard concrete
  'readymix': 165, // kgCO2e/m³
  
  // Steel & Reinforcement
  'steel': 2.1, // kgCO2e/kg
  'reinforcement': 2.1,
  'rebar': 2.1,
  'y12': 2.1,
  'y10': 2.1,
  'r6': 2.1,
  
  // Bricks & Masonry
  'brick': 0.24, // kgCO2e/brick
  'block': 0.35, // kgCO2e/block
  'maxi brick': 0.32,
  
  // Timber
  'timber': 0.12, // kgCO2e/kg (low carbon material)
  'wood': 0.12,
  
  // Sand & Aggregates
  'sand': 5, // kgCO2e/m³
  'aggregate': 4.5,
  'stone': 5,
  
  // Finishes
  'paint': 2.5, // kgCO2e/liter
  'plaster': 45, // kgCO2e/m²
  'tiles': 18, // kgCO2e/m²
};

// Green alternatives with carbon savings and green supplier mappings
// These suppliers are in the catalog with green/eco certifications
const greenAlternatives: Record<string, any> = {
  'cement': {
    name: 'CEM II/B-V with 30% Fly Ash',
    carbonReduction: 0.29, // 29% reduction
    pricePremium: 0.076, // 7.6% more expensive (fallback if supplier not found)
    supplierName: 'PPC Eco-Cement',
    catalogSuppliers: ['PPC', 'AfriSam', 'Sephaku'], // Green-certified suppliers in catalog
  },
  'concrete': {
    name: 'Eco-Concrete with Recycled Aggregates',
    carbonReduction: 0.25,
    pricePremium: 0.05,
    supplierName: 'AfriSam Green',
    catalogSuppliers: ['AfriSam', 'Lafarge', 'Raumix'], // Suppliers offering green concrete
  },
  'steel': {
    name: 'Recycled Steel (60% recycled content)',
    carbonReduction: 0.35,
    pricePremium: 0.02,
    supplierName: 'ArcelorMittal Recycled',
    catalogSuppliers: ['ArcelorMittal', 'Macsteel', 'Cape Gate'], // Steel recyclers
  },
  'brick': {
    name: 'Clay Brick with Bio-Fuel Firing',
    carbonReduction: 0.22,
    pricePremium: 0.08,
    supplierName: 'Corobrik Green',
    catalogSuppliers: ['Corobrik', 'Midland Brick', 'Clay Brick'], // Green brick suppliers
  },
};

export function calculateItemCarbon(
  item: any
): CarbonData {
  const description = (item.description || item.name || '').toLowerCase();
  const quantity = parseFloat(item.quantity) || 0;
  const unitPrice = parseFloat(item.finalUnitPrice || item.baseUnitPrice || 0);
  const totalPrice = parseFloat(item.totalPrice) || 0;
  const transportCost = parseFloat(item.transportCost || 0);
  const supplierName = item.supplierName || '';
  const materialCostOnly = totalPrice - transportCost; // Separate material from transport
  
  // Determine carbon coefficient based on description keywords
  let carbonPerUnit = 10; // default fallback
  let category: CarbonData['category'] = 'other';
  let matchedMaterial = '';
  
  // Match material type
  for (const [material, coefficient] of Object.entries(carbonCoefficients)) {
    if (description.includes(material)) {
      carbonPerUnit = coefficient;
      matchedMaterial = material;
      
      // Determine category
      if (['cement', 'concrete', 'readymix'].includes(material)) {
        category = 'concrete';
      } else if (['steel', 'reinforcement', 'rebar', 'y12', 'y10', 'r6'].includes(material)) {
        category = 'steel';
      } else if (['brick', 'block', 'maxi brick'].includes(material)) {
        category = 'masonry';
      } else if (['timber', 'wood'].includes(material)) {
        category = 'timber';
      } else if (['paint', 'plaster', 'tiles'].includes(material)) {
        category = 'finishes';
      }
      break;
    }
  }
  
  // Adjust carbon per unit based on unit type
  // First, filter out non-measurable units like "%"
  const unitStr = (item.unit || '').toLowerCase().trim();
  
  // Skip carbon calculation for percentage-based or non-physical units
  if (unitStr === '%' || unitStr === 'percent' || unitStr === 'percentage' || unitStr.includes('grade')) {
    return {
      carbonPerUnit: 0,
      totalCarbon: 0,
      greenAlternative: undefined,
      greenScore: 'C',
      category: 'other',
    };
  }
  
  if (unitStr.includes('m³') || unitStr.includes('m3')) {
    // Already in correct unit for concrete/aggregates
  } else if (unitStr.includes('kg')) {
    // Already in kg for cement/steel
  } else if (unitStr.includes('ton') || unitStr === 't') {
    carbonPerUnit = carbonPerUnit * 1000; // Convert to tons
  } else if (unitStr === 'nr' || unitStr === 'no' || unitStr === 'number') {
    // Number of items (bricks, blocks) - use as is
  } else if (unitStr.includes('m²') || unitStr.includes('m2')) {
    // Square meters for finishes - use as is
  } else if (unitStr.includes('l') || unitStr.includes('liter') || unitStr.includes('litre')) {
    // Liters (for paint, etc.) - use as is
  }
  
  const totalCarbon = carbonPerUnit * quantity;
  
  // Calculate green alternative if available
  let greenAlternative = undefined;
  if (greenAlternatives[matchedMaterial]) {
    const alt = greenAlternatives[matchedMaterial];
    const greenCarbonPerUnit = carbonPerUnit * (1 - alt.carbonReduction);
    const greenTotalCarbon = greenCarbonPerUnit * quantity;
    const carbonSavings = totalCarbon - greenTotalCarbon;
    
    // CURRENT IMPLEMENTATION: Simple percentage markup on existing price
    // This includes the existing supplier's transport cost in the calculation
    // FUTURE ENHANCEMENT NEEDED: Should recalculate with green supplier's actual:
    //   1. Find green supplier location (e.g., AfriSam Johannesburg vs Lafarge Johannesburg)
    //   2. Calculate distance from project to green supplier
    //   3. Calculate green supplier's material cost + NEW transport cost
    //   4. Premium = (Green Material + Green Transport) - (Standard Material + Standard Transport)
    // For Tuesday presentation: Current calculation is acceptable as it shows cost-benefit analysis
    const greenUnitPrice = unitPrice * (1 + alt.pricePremium);
    const greenTotalPrice = greenUnitPrice * quantity;
    
    greenAlternative = {
      name: alt.name,
      carbonPerUnit: greenCarbonPerUnit,
      totalCarbon: greenTotalCarbon,
      carbonSavings,
      carbonSavingsPercent: alt.carbonReduction * 100,
      unitPricePremium: greenUnitPrice - unitPrice,
      totalPricePremium: greenTotalPrice - totalPrice,
      pricePremiumPercent: alt.pricePremium * 100,
      supplierName: alt.supplierName,
      costPerTonneCO2eSaved: carbonSavings > 0 ? (greenTotalPrice - totalPrice) / (carbonSavings / 1000) : 0,
    };
  }
  
  // Calculate green score based on carbon savings potential
  let greenScore: CarbonData['greenScore'] = 'C';
  if (greenAlternative) {
    if (greenAlternative.carbonSavingsPercent >= 30) greenScore = 'A+';
    else if (greenAlternative.carbonSavingsPercent >= 25) greenScore = 'A';
    else if (greenAlternative.carbonSavingsPercent >= 20) greenScore = 'B';
    else greenScore = 'C';
  } else if (category === 'timber') {
    greenScore = 'A'; // Timber is naturally low carbon
  }
  
  return {
    carbonPerUnit,
    totalCarbon,
    greenAlternative,
    greenScore,
    category,
  };
}

export function calculateProjectCarbonSummary(items: any[]) {
  let totalCarbon = 0;
  let totalCarbonWithGreen = 0;
  let totalCarbonSavings = 0;
  let totalCost = 0;
  let totalCostWithGreen = 0;
  let itemsWithGreenAlternatives = 0;
  
  const itemsWithCarbon = items.map(item => {
    const carbonData = calculateItemCarbon(item);
    totalCarbon += carbonData.totalCarbon;
    totalCost += parseFloat(item.totalPrice) || 0;
    
    if (carbonData.greenAlternative) {
      totalCarbonWithGreen += carbonData.greenAlternative.totalCarbon;
      totalCostWithGreen += (parseFloat(item.totalPrice) || 0) + carbonData.greenAlternative.totalPricePremium;
      totalCarbonSavings += carbonData.greenAlternative.carbonSavings;
      itemsWithGreenAlternatives++;
    } else {
      totalCarbonWithGreen += carbonData.totalCarbon;
      totalCostWithGreen += parseFloat(item.totalPrice) || 0;
    }
    
    return { ...item, carbonData };
  });
  
  const carbonSavingsPercent = totalCarbon > 0 ? (totalCarbonSavings / totalCarbon) * 100 : 0;
  const costPremiumPercent = totalCost > 0 ? ((totalCostWithGreen - totalCost) / totalCost) * 100 : 0;
  
  // Calculate overall green score
  let overallGreenScore: CarbonData['greenScore'] = 'C';
  if (carbonSavingsPercent >= 20) overallGreenScore = 'A+';
  else if (carbonSavingsPercent >= 15) overallGreenScore = 'A';
  else if (carbonSavingsPercent >= 10) overallGreenScore = 'B';
  else if (carbonSavingsPercent >= 5) overallGreenScore = 'C';
  else overallGreenScore = 'D';
  
  return {
    totalCarbon: totalCarbon / 1000, // Convert to tCO2e
    totalCarbonWithGreen: totalCarbonWithGreen / 1000,
    totalCarbonSavings: totalCarbonSavings / 1000,
    carbonSavingsPercent,
    totalCost,
    totalCostWithGreen,
    costPremium: totalCostWithGreen - totalCost,
    costPremiumPercent,
    itemsWithGreenAlternatives,
    totalItems: items.length,
    overallGreenScore,
    treesEquivalent: Math.round((totalCarbonSavings / 1000) * 20), // ~20 trees per tCO2e
    itemsWithCarbon,
  };
}