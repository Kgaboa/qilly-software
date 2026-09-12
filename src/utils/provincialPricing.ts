// Provincial pricing factors for South African provinces
// GP (Gauteng) is the BASE pricing province (1.0) as it's the manufacturing and distribution hub
// All other provinces have adjustments based on distance from GP and logistics costs

export interface Province {
  code: string;
  name: string;
  factor: number;
  description: string;
}

export const provinces: Province[] = [
  {
    code: 'GP',
    name: 'Gauteng',
    factor: 1.0,
    description: 'Johannesburg/Pretoria metro - manufacturing hub, base pricing'
  },
  {
    code: 'WC',
    name: 'Western Cape',
    factor: 1.05,
    description: 'Cape Town metro - port access but +5% transport from GP'
  },
  {
    code: 'KZN',
    name: 'KwaZulu-Natal',
    factor: 1.03,
    description: 'Durban metro - port access but +3% transport from GP'
  },
  {
    code: 'MP',
    name: 'Mpumalanga',
    factor: 1.04,
    description: 'Nelspruit/Witbank area - proximity to GP, moderate costs'
  },
  {
    code: 'FS',
    name: 'Free State',
    factor: 1.05,
    description: 'Bloemfontein area - central location but lower volume'
  },
  {
    code: 'LP',
    name: 'Limpopo',
    factor: 1.06,
    description: 'Polokwane area - rural delivery, lower volume'
  },
  {
    code: 'NW',
    name: 'North West',
    factor: 1.07,
    description: 'Rustenburg/Mahikeng area - mining region, scattered demand'
  },
  {
    code: 'EC',
    name: 'Eastern Cape',
    factor: 1.08,
    description: 'Port Elizabeth/East London - distance and rural logistics'
  },
  {
    code: 'NC',
    name: 'Northern Cape',
    factor: 1.12,
    description: 'Kimberley area - most remote, very low volume'
  }
];

// Export as uppercase alias for convenience
export const PROVINCES = provinces;

// Get province by code
export function getProvinceByCode(code: string): Province | undefined {
  return provinces.find(p => p.code.toLowerCase() === code.toLowerCase());
}

// Get province by name
export function getProvinceByName(name: string): Province | undefined {
  return provinces.find(p => p.name.toLowerCase() === name.toLowerCase());
}

// Calculate provincial price
export function calculateProvincialPrice(basePrice: number, provinceCode: string): number {
  const province = getProvinceByCode(provinceCode);
  if (!province) {
    // Default to unfactored price if province not found
    return basePrice;
  }
  return basePrice * province.factor;
}

// Alias for calculateProvincialPrice for convenience
export function getProvincialPrice(basePrice: number, provinceCode: string): number {
  return calculateProvincialPrice(basePrice, provinceCode);
}

// Get all province codes
export function getAllProvinceCodes(): string[] {
  return provinces.map(p => p.code);
}

// Get all province names
export function getAllProvinceNames(): string[] {
  return provinces.map(p => p.name);
}

// Get pricing breakdown for all provinces
export function getProvincialPricingBreakdown(basePrice: number): { 
  province: string; 
  code: string;
  price: number; 
  factor: number;
  difference: number;
  percentageDiff: number;
}[] {
  return provinces.map(province => {
    const price = basePrice * province.factor;
    const difference = price - basePrice;
    const percentageDiff = ((province.factor - 1) * 100);
    
    return {
      province: province.name,
      code: province.code,
      price: parseFloat(price.toFixed(2)),
      factor: province.factor,
      difference: parseFloat(difference.toFixed(2)),
      percentageDiff: parseFloat(percentageDiff.toFixed(1))
    };
  });
}

// Check if province has base pricing (unfactored)
export function isBasePricingProvince(provinceCode: string): boolean {
  const province = getProvinceByCode(provinceCode);
  return province?.factor === 1.0 || false;
}

// Get provinces grouped by pricing tier
export function getProvincesByPricingTier(): {
  basePricing: Province[];
  moderateAdjustment: Province[];
  higherAdjustment: Province[];
} {
  return {
    basePricing: provinces.filter(p => p.factor === 1.0),
    moderateAdjustment: provinces.filter(p => p.factor > 1.0 && p.factor <= 1.10),
    higherAdjustment: provinces.filter(p => p.factor > 1.10)
  };
}