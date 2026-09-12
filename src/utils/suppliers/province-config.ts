/**
 * Province Configuration for Supplier API Integration
 * All 9 South African Provinces
 */

export type Province = 
  | 'gauteng'
  | 'western-cape'
  | 'kwazulu-natal'
  | 'eastern-cape'
  | 'limpopo'
  | 'mpumalanga'
  | 'north-west'
  | 'northern-cape'
  | 'free-state';

export interface ProvinceInfo {
  code: Province;
  name: string;
  shortName: string;
  capital: string;
  majorCities: string[];
  defaultDeliveryDays: number;
  deliveryCostMultiplier: number; // Relative to base cost
}

export const PROVINCES: Record<Province, ProvinceInfo> = {
  'gauteng': {
    code: 'gauteng',
    name: 'Gauteng',
    shortName: 'GP',
    capital: 'Johannesburg',
    majorCities: ['Johannesburg', 'Pretoria', 'Ekurhuleni', 'Midrand', 'Centurion'],
    defaultDeliveryDays: 1,
    deliveryCostMultiplier: 1.0,
  },
  'western-cape': {
    code: 'western-cape',
    name: 'Western Cape',
    shortName: 'WC',
    capital: 'Cape Town',
    majorCities: ['Cape Town', 'Stellenbosch', 'Paarl', 'George', 'Mossel Bay'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.2,
  },
  'kwazulu-natal': {
    code: 'kwazulu-natal',
    name: 'KwaZulu-Natal',
    shortName: 'KZN',
    capital: 'Pietermaritzburg',
    majorCities: ['Durban', 'Pietermaritzburg', 'Richards Bay', 'Newcastle', 'Ladysmith'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.15,
  },
  'eastern-cape': {
    code: 'eastern-cape',
    name: 'Eastern Cape',
    shortName: 'EC',
    capital: 'Bhisho',
    majorCities: ['Port Elizabeth', 'East London', 'Mthatha', 'Bhisho', 'Grahamstown'],
    defaultDeliveryDays: 3,
    deliveryCostMultiplier: 1.25,
  },
  'limpopo': {
    code: 'limpopo',
    name: 'Limpopo',
    shortName: 'LP',
    capital: 'Polokwane',
    majorCities: ['Polokwane', 'Tzaneen', 'Mokopane', 'Musina', 'Thohoyandou'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.3,
  },
  'mpumalanga': {
    code: 'mpumalanga',
    name: 'Mpumalanga',
    shortName: 'MP',
    capital: 'Mbombela',
    majorCities: ['Mbombela', 'Witbank', 'Middelburg', 'Secunda', 'Standerton'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.2,
  },
  'north-west': {
    code: 'north-west',
    name: 'North West',
    shortName: 'NW',
    capital: 'Mahikeng',
    majorCities: ['Mahikeng', 'Rustenburg', 'Klerksdorp', 'Potchefstroom', 'Brits'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.2,
  },
  'northern-cape': {
    code: 'northern-cape',
    name: 'Northern Cape',
    shortName: 'NC',
    capital: 'Kimberley',
    majorCities: ['Kimberley', 'Upington', 'Springbok', 'De Aar', 'Kuruman'],
    defaultDeliveryDays: 4,
    deliveryCostMultiplier: 1.5,
  },
  'free-state': {
    code: 'free-state',
    name: 'Free State',
    shortName: 'FS',
    capital: 'Bloemfontein',
    majorCities: ['Bloemfontein', 'Welkom', 'Bethlehem', 'Kroonstad', 'Sasolburg'],
    defaultDeliveryDays: 2,
    deliveryCostMultiplier: 1.15,
  },
};

export function getProvinceByCode(code: string): ProvinceInfo | undefined {
  return PROVINCES[code as Province];
}

export function getAllProvinces(): ProvinceInfo[] {
  return Object.values(PROVINCES);
}

export function getProvincesByRegion(region: 'inland' | 'coastal'): ProvinceInfo[] {
  const coastal: Province[] = ['western-cape', 'eastern-cape', 'kwazulu-natal'];
  const inland: Province[] = ['gauteng', 'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'free-state'];
  
  const provinceCodes = region === 'coastal' ? coastal : inland;
  return provinceCodes.map(code => PROVINCES[code]);
}
