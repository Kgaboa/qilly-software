/**
 * Supplier API Connector
 * Handles connections to supplier APIs across all 9 SA provinces
 */

import { getSupabaseClient } from '../supabase/client';
import { getCurrentEnvironment } from '../environment';
import { Province, getProvinceByCode } from './province-config';

// Get the Supabase client for the current environment
const getClient = () => getSupabaseClient(getCurrentEnvironment());

export type SupplierCategory = 
  | 'building_materials'
  | 'steel_metal'
  | 'concrete_aggregates'
  | 'plumbing'
  | 'electrical'
  | 'hardware'
  | 'timber'
  | 'paint_finishes'
  | 'roofing'
  | 'landscaping'
  | 'civil_earthworks'
  | 'glass_glazing'
  | 'masonry'
  | 'scaffolding'
  | 'hvac'
  | 'fire_protection';

export interface SupplierConfig {
  id: string;
  name: string;
  category: SupplierCategory;
  apiType: 'rest' | 'scraping' | 'manual' | 'csv';
  baseUrl?: string;
  apiKey?: string;
  provinces: Province[];
  isActive: boolean;
  logoUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  website?: string;
  address?: string; // ✅ NEW: Add address field
  city?: string; // ✅ NEW: Add city field
  postalCode?: string; // ✅ NEW: Add postalCode field
}

export interface SupplierProduct {
  productCode?: string;
  description: string;
  unit: string;
  unitPrice: number;
  category: string;
  isAvailable: boolean;
  province?: Province;
  city?: string;
}

export interface PriceQuote {
  supplierId: string;
  supplierName: string;
  product: SupplierProduct;
  deliveryDays: number;
  deliveryCost: number;
  totalCost: number;
  province: Province;
  timestamp: Date;
}

/**
 * South African Major Suppliers Configuration
 */
export const SUPPLIER_CONFIGS: SupplierConfig[] = [
  // Building Materials & Hardware
  {
    id: 'buco',
    name: 'Buco',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.buco.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'builders-warehouse',
    name: 'Builders Warehouse',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.builders.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'builders',
    name: 'BUILDERS',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'builders-depot',
    name: 'BUILDERS DEPOT',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.buildersdepot.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'bilt',
    name: 'BILT',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.bilt.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'talisman',
    name: 'TALISMAN',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.talisman.co.za',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'roofcap',
    name: 'ROOFCAP',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'civil-lab',
    name: 'CIVIL LAB',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'concrete-lab',
    name: 'CONCRETE LAB',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  
  // Steel & Metal
  {
    id: 'macsteel',
    name: 'Macsteel',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.macsteel.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'njr-steel',
    name: 'NJR STEEL',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.njrsteel.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'jvr-steel',
    name: 'JVR STEEL',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.jvrsteel.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Concrete & Aggregates
  {
    id: 'lafarge',
    name: 'Lafarge Cement',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.lafarge.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'limpopo', 'mpumalanga'],
    isActive: true,
  },
  {
    id: 'ppc-cement',
    name: 'PPC Cement',
    category: 'concrete_aggregates',
    apiType: 'rest',
    website: 'https://www.ppc.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'northern-cape', 'free-state'],
    isActive: true,
  },
  {
    id: 'raumix',
    name: 'Raumix',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.raumix.co.za',
    provinces: ['gauteng', 'limpopo', 'mpumalanga', 'north-west'],
    isActive: true,
  },
  {
    id: 'stewardsllods',
    name: 'STEWARDS&LLODS',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.stewardsandlloyds.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'infraset',
    name: 'INFRASET',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.infraset.co.za',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'technicrete',
    name: 'TECHNI CRETE',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.technicrete.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Plumbing & Water
  {
    id: 'ksb',
    name: 'KSB',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.ksb.com/ksb-za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'zenzele',
    name: 'ZENZELE',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'limpopo'],
    isActive: true,
  },
  {
    id: 'avk',
    name: 'AVK',
    category: 'plumbing',
    apiType: 'scraping',
    website: 'https://www.avk.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'sizabantu',
    name: 'SIZABANTU',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'kwazulu-natal', 'limpopo'],
    isActive: true,
  },
  {
    id: 'marley',
    name: 'MARLEY',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.marley.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'sekunalo',
    name: 'SEKUNALO',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['eastern-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'struandale',
    name: 'STRUANDALE',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['eastern-cape'],
    isActive: true,
  },
  {
    id: 'llocs',
    name: 'LLOCS',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'polyframe',
    name: 'POLYFRAME',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Roofing
  {
    id: 'east-coast',
    name: 'EAST COAST',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'polokwane-surfacing',
    name: 'POLOKWANE SURFACING',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['limpopo', 'gauteng'],
    isActive: true,
  },
  {
    id: 'rsc',
    name: 'RSC',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'global-roofing',
    name: 'GLOBAL ROOFING',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'east-coast-fencing',
    name: 'EAST COAST FENCING',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'rsc-global',
    name: 'RSC GLOBAL',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'corrshine',
    name: 'CORRSHINE',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Electrical
  {
    id: 'actom',
    name: 'ACTOM',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.actom.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'abadere',
    name: 'ABADERE',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'arb',
    name: 'ARB',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.arb.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'voltex',
    name: 'VOLTEX',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.voltex.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'power-equipment',
    name: 'POWER EQUIPMENT',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.powerequipment.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'vyl-tex',
    name: 'VYL-TEX',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'aguenie',
    name: 'AGUENIE',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'a3m',
    name: 'A3M',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Hardware & Equipment
  {
    id: 'much-plant',
    name: 'MUCH PLANT',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.muchplant.co.za',
    provinces: ['gauteng', 'limpopo'],
    isActive: true,
  },
  {
    id: 'bosun',
    name: 'BOSUN',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.bosun.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'aermart',
    name: 'AERMART',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'atlas-plant',
    name: 'ATLAS PLANT',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.atlasplanthire.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'sherrerd-road-signs',
    name: 'SHERRERD ROAD SIGNS',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'aermatt',
    name: 'AERMATT',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'container-world',
    name: 'CONTAINER WORLD',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.containerworld.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'talisman-hire',
    name: 'TALISMAN HIRE',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.talismanhire.co.za',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'hireall',
    name: 'HIREALL',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.hireall.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'much-asphalt-plant-hire',
    name: 'MUCH ASPHALT PLANT HIRE',
    category: 'hardware',
    apiType: 'scraping',
    website: 'https://www.muchplant.co.za',
    provinces: ['gauteng', 'limpopo'],
    isActive: true,
  },
  {
    id: 'pan',
    name: 'PAN',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'bridgedeck',
    name: 'BRIDGEDECK',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'maku',
    name: 'MAKU',
    category: 'hardware',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Timber
  {
    id: 'timber-city',
    name: 'TIMBER CITY',
    category: 'timber',
    apiType: 'scraping',
    website: 'https://www.timbercity.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Paint & Finishes
  {
    id: 'leroy-merlin',
    name: 'LEROY MERLIN',
    category: 'paint_finishes',
    apiType: 'scraping',
    website: 'https://www.leroymerlin.co.za',
    provinces: ['gauteng', 'western-cape'],
    isActive: true,
  },
  {
    id: 'dulux',
    name: 'DULUX',
    category: 'paint_finishes',
    apiType: 'rest',
    website: 'https://www.dulux.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'plascon',
    name: 'PLASCON',
    category: 'paint_finishes',
    apiType: 'rest',
    website: 'https://www.plascon.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'prominent-paints',
    name: 'PROMINENT PAINTS',
    category: 'paint_finishes',
    apiType: 'scraping',
    website: 'https://www.prominentpaints.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  
  // Major Hardware Retailers (Additional)
  {
    id: 'cashbuild',
    name: 'CASHBUILD',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.cashbuild.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'pennypinchers',
    name: 'PENNYPINCHERS',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.pennypinchers.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'build-it',
    name: 'BUILD IT',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.buildit.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  
  // Cement & Concrete (Additional)
  {
    id: 'afrisam',
    name: 'AFRISAM',
    category: 'concrete_aggregates',
    apiType: 'rest',
    website: 'https://www.afrisam.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'sephaku-cement',
    name: 'SEPHAKU CEMENT',
    category: 'concrete_aggregates',
    apiType: 'rest',
    website: 'https://www.sephakucement.co.za',
    provinces: ['gauteng', 'limpopo', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'npc-cimpor',
    name: 'NPC-CIMPOR',
    category: 'concrete_aggregates',
    apiType: 'scraping',
    website: 'https://www.npc-cimpor.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Steel & Metal (Additional)
  {
    id: 'arcelormittal',
    name: 'ARCELORMITTAL SA',
    category: 'steel_metal',
    apiType: 'rest',
    website: 'https://www.arcelormittal.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'aveng-trident',
    name: 'AVENG TRIDENT STEEL',
    category: 'steel_metal',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'cape-gate',
    name: 'CAPE GATE',
    category: 'steel_metal',
    apiType: 'rest',
    website: 'https://www.capegate.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'sa-steel-mills',
    name: 'SA STEEL MILLS',
    category: 'steel_metal',
    apiType: 'manual',
    provinces: ['gauteng', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'chamberlain',
    name: 'CHAMBERLAIN STEEL',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.chamberlain.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Timber (Additional)
  {
    id: 'federated-timbers',
    name: 'FEDERATED TIMBERS',
    category: 'timber',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'pentrawood',
    name: 'PENTRAWOOD',
    category: 'timber',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'sappi',
    name: 'SAPPI',
    category: 'timber',
    apiType: 'rest',
    website: 'https://www.sappi.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'mpumalanga'],
    isActive: true,
  },
  
  // Insulation & Drywall
  {
    id: 'isover',
    name: 'ISOVER',
    category: 'building_materials',
    apiType: 'manual',
    website: 'https://www.isover.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'aerolite',
    name: 'AEROLITE',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.aerolite.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'knauf',
    name: 'KNAUF',
    category: 'building_materials',
    apiType: 'rest',
    website: 'https://www.knauf.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'gyproc',
    name: 'GYPROC',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.gyproc.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'saint-gobain',
    name: 'SAINT-GOBAIN',
    category: 'building_materials',
    apiType: 'rest',
    website: 'https://www.saint-gobain.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Waterproofing, Adhesives & Sealants
  {
    id: 'tal',
    name: 'TAL',
    category: 'building_materials',
    apiType: 'rest',
    website: 'https://www.tal.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'sika',
    name: 'SIKA SA',
    category: 'building_materials',
    apiType: 'rest',
    website: 'https://www.sika.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'pratley',
    name: 'PRATLEY',
    category: 'building_materials',
    apiType: 'manual',
    website: 'https://www.pratley.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'dunlop',
    name: 'DUNLOP FLOORING',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'rhinolite',
    name: 'RHINOLITE',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Tiles & Flooring
  {
    id: 'ctm',
    name: 'CTM (CERAMIC TILE MARKET)',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.ctm.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'italtile',
    name: 'ITALTILE',
    category: 'building_materials',
    apiType: 'scraping',
    website: 'https://www.italtile.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'ceramic-industries',
    name: 'CERAMIC INDUSTRIES',
    category: 'building_materials',
    apiType: 'rest',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'johnson-tiles',
    name: 'JOHNSON TILES',
    category: 'building_materials',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Plumbing & Sanitaryware (Additional)
  {
    id: 'geberit',
    name: 'GEBERIT',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.geberit.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'cobra-watertech',
    name: 'COBRA WATERTECH',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'jojo-tanks',
    name: 'JOJO TANKS',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.jojo.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'kwikot',
    name: 'KWIKOT',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'heattech',
    name: 'HEATTECH',
    category: 'plumbing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Electrical (Additional)
  {
    id: 'schneider-electric',
    name: 'SCHNEIDER ELECTRIC',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.se.com/za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'abb',
    name: 'ABB',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.abb.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'eurolux',
    name: 'EUROLUX',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'crabtree',
    name: 'CRABTREE',
    category: 'electrical',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  
  // Roofing (Additional)
  {
    id: 'safintra',
    name: 'SAFINTRA',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'brownbuilt',
    name: 'BROWNBUILT',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'fullstop',
    name: 'FULLSTOP WATERPROOFING',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },

  // ══════════════════════════════════════════════════════════════════════════
  // BATCH 2 — 59 NEW SUPPLIERS (brings total to ~159)
  // Added March 2026 to achieve full CIDB Grade 1–9 & SANS 1200 A–Q coverage
  // ══════════════════════════════════════════════════════════════════════════

  // ── CIVIL EARTHWORKS & AGGREGATES ────────────────────────────────────────
  {
    id: 'g4-cube',
    name: 'G4 CUBE AGGREGATES',
    category: 'civil_earthworks',
    apiType: 'scraping',
    website: 'https://www.g4cube.co.za',
    provinces: ['gauteng', 'limpopo', 'north-west', 'mpumalanga', 'free-state'],
    isActive: true,
  },
  {
    id: 'afrimat',
    name: 'AFRIMAT',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.afrimat.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'sapstone',
    name: 'SAPSTONE',
    category: 'civil_earthworks',
    apiType: 'scraping',
    website: 'https://www.sapstone.co.za',
    provinces: ['gauteng', 'north-west', 'limpopo', 'mpumalanga'],
    isActive: true,
  },
  {
    id: 'much-asphalt',
    name: 'MUCH ASPHALT',
    category: 'civil_earthworks',
    apiType: 'scraping',
    website: 'https://www.muchasphalt.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'limpopo', 'mpumalanga'],
    isActive: true,
  },
  {
    id: 'concor-readymix',
    name: 'CONCOR READYMIX',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.concor.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'lafarge-readymix',
    name: 'LAFARGE READYMIX',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.lafarge.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'limpopo', 'mpumalanga'],
    isActive: true,
  },
  {
    id: 'murray-roberts-readymix',
    name: 'MURRAY & ROBERTS READYMIX',
    category: 'civil_earthworks',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'fibertex',
    name: 'FIBERTEX SA',
    category: 'civil_earthworks',
    apiType: 'scraping',
    website: 'https://www.fibertex.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'kaytech',
    name: 'KAYTECH',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.kaytech.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'maccaferri',
    name: 'MACCAFERRI SA',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.maccaferri.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── ROADS & SURFACING ────────────────────────────────────────────────────
  {
    id: 'tosas',
    name: 'TOSAS BITUMEN',
    category: 'civil_earthworks',
    apiType: 'scraping',
    website: 'https://www.tosas.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'total-bitumen',
    name: 'TOTALENERGIES BITUMEN',
    category: 'civil_earthworks',
    apiType: 'rest',
    website: 'https://www.totalenergies.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo'],
    isActive: true,
  },
  {
    id: 'engen-bitumen',
    name: 'ENGEN BITUMEN',
    category: 'civil_earthworks',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── STEEL & METAL (NEW) ───────────────────────────────────────────────────
  {
    id: 'bolt-eng',
    name: 'BOLT & ENG',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.bolteng.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'vanderbijl-steel',
    name: 'VANDERBIJLPARK STEEL',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.vanderbijlsteel.co.za',
    provinces: ['gauteng', 'north-west'],
    isActive: true,
  },
  {
    id: 'brc-reinforcing',
    name: 'BRC REINFORCING',
    category: 'steel_metal',
    apiType: 'scraping',
    website: 'https://www.brc.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'betec-concrete',
    name: 'BETEC CONCRETE',
    category: 'steel_metal',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── PLUMBING & CIVIL WATER (NEW) ─────────────────────────────────────────
  {
    id: 'pipe-world',
    name: 'PIPE WORLD',
    category: 'plumbing',
    apiType: 'scraping',
    website: 'https://www.pipeworld.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'flo-tek',
    name: 'FLO-TEK',
    category: 'plumbing',
    apiType: 'scraping',
    website: 'https://www.flo-tek.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'wavin-sa',
    name: 'WAVIN SA',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.wavin.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'vaal-sanitaryware',
    name: 'VAAL SANITARYWARE',
    category: 'plumbing',
    apiType: 'scraping',
    website: 'https://www.vaalsanitaryware.co.za',
    provinces: ['gauteng', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'roca-sa',
    name: 'ROCA SA',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.roca.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'abs-pumps',
    name: 'ABS PUMPS',
    category: 'plumbing',
    apiType: 'rest',
    website: 'https://www.abs-pumps.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── ELECTRICAL (NEW) ─────────────────────────────────────────────────────
  {
    id: 'cabstrut',
    name: 'CABSTRUT',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.cabstrut.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'helukabel',
    name: 'HELUKABEL SA',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.helukabel.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'prysmian',
    name: 'PRYSMIAN GROUP SA',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.prysmiangroup.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'belden-sa',
    name: 'BELDEN SA',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.belden.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'fuchs-lighting',
    name: 'FUCHS LIGHTING',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.fuchs.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'radiant-lighting',
    name: 'RADIANT LIGHTING',
    category: 'electrical',
    apiType: 'scraping',
    website: 'https://www.radiantlighting.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'solar-md',
    name: 'SOLAR MD',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.solarmd.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'suntech-sa',
    name: 'SUNTECH POWER SA',
    category: 'electrical',
    apiType: 'rest',
    website: 'https://www.suntech-power.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── ROOFING (NEW) ────────────────────────────────────────────────────────
  {
    id: 'safintra-roofing',
    name: 'SAFINTRA ROOFING',
    category: 'roofing',
    apiType: 'scraping',
    website: 'https://www.safintra.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'clotan-steel',
    name: 'CLOTAN STEEL',
    category: 'roofing',
    apiType: 'scraping',
    website: 'https://www.clotan.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'truecor-roofing',
    name: 'TRUECOR ROOFING',
    category: 'roofing',
    apiType: 'scraping',
    website: 'https://www.truecor.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'trussworks',
    name: 'TRUSSWORKS (MITEK)',
    category: 'roofing',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state'],
    isActive: true,
  },
  {
    id: 'waterproofing-co',
    name: 'WATERPROOFING COMPANY',
    category: 'roofing',
    apiType: 'scraping',
    website: 'https://www.waterproofingco.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },

  // ── TIMBER & JOINERY (NEW) ───────────────────────────────────────────────
  {
    id: 'pg-bison',
    name: 'PG BISON',
    category: 'timber',
    apiType: 'scraping',
    website: 'https://www.pgbison.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'saligna-timber',
    name: 'SALIGNA TIMBER',
    category: 'timber',
    apiType: 'scraping',
    website: 'https://www.saligna.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'mpumalanga'],
    isActive: true,
  },
  {
    id: 'lacewood-flooring',
    name: 'LACEWOOD FLOORING',
    category: 'timber',
    apiType: 'scraping',
    website: 'https://www.lacewood.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── GLASS & GLAZING ──────────────────────────────────────────────────────
  {
    id: 'pg-glass',
    name: 'PG GLASS',
    category: 'glass_glazing',
    apiType: 'scraping',
    website: 'https://www.pgglass.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'guardian-glass',
    name: 'GUARDIAN GLASS SA',
    category: 'glass_glazing',
    apiType: 'rest',
    website: 'https://www.guardianglass.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'aluplast',
    name: 'ALUPLAST SA',
    category: 'glass_glazing',
    apiType: 'scraping',
    website: 'https://www.aluplast.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'fenster',
    name: 'FENSTER ALUMINIUM',
    category: 'glass_glazing',
    apiType: 'scraping',
    website: 'https://www.fenster.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'stalwart-doors',
    name: 'STALWART DOORS',
    category: 'glass_glazing',
    apiType: 'scraping',
    website: 'https://www.stalwartdoors.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },

  // ── MASONRY ──────────────────────────────────────────────────────────────
  {
    id: 'corobrick',
    name: 'COROBRICK',
    category: 'masonry',
    apiType: 'scraping',
    website: 'https://www.corobrick.co.za',
    provinces: ['gauteng', 'north-west', 'limpopo', 'mpumalanga', 'free-state'],
    isActive: true,
  },
  {
    id: 'ocon-brick',
    name: 'OCON BRICK',
    category: 'masonry',
    apiType: 'scraping',
    website: 'https://www.oconbrick.co.za',
    provinces: ['gauteng', 'limpopo', 'north-west'],
    isActive: true,
  },
  {
    id: 'midrand-brick',
    name: 'MIDRAND BRICK',
    category: 'masonry',
    apiType: 'scraping',
    website: 'https://www.midrandbrick.co.za',
    provinces: ['gauteng', 'limpopo'],
    isActive: true,
  },
  {
    id: 'hebel-blocks',
    name: 'HEBEL AUTOCLAVED AERATED',
    category: 'masonry',
    apiType: 'rest',
    website: 'https://www.hebel.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── SCAFFOLDING & FORMWORK ───────────────────────────────────────────────
  {
    id: 'safway',
    name: 'SAFWAY SCAFFOLDING',
    category: 'scaffolding',
    apiType: 'scraping',
    website: 'https://www.safway.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'formscaff',
    name: 'FORMSCAFF',
    category: 'scaffolding',
    apiType: 'scraping',
    website: 'https://www.formscaff.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'doka-sa',
    name: 'DOKA SA',
    category: 'scaffolding',
    apiType: 'rest',
    website: 'https://www.doka.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── EXTERNAL WORKS & LANDSCAPING ─────────────────────────────────────────
  {
    id: 'tegola',
    name: 'TEGOLA PAVING',
    category: 'landscaping',
    apiType: 'scraping',
    website: 'https://www.tegola.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'terraforce',
    name: 'TERRAFORCE',
    category: 'landscaping',
    apiType: 'scraping',
    website: 'https://www.terraforce.com',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },
  {
    id: 'envirowild',
    name: 'ENVIROWILD LANDSCAPING',
    category: 'landscaping',
    apiType: 'manual',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },

  // ── HVAC ─────────────────────────────────────────────────────────────────
  {
    id: 'trane-sa',
    name: 'TRANE SA',
    category: 'hvac',
    apiType: 'rest',
    website: 'https://www.trane.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'daikin-sa',
    name: 'DAIKIN SA',
    category: 'hvac',
    apiType: 'rest',
    website: 'https://www.daikin.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
  {
    id: 'energy-hvac',
    name: 'ENERGY HVAC',
    category: 'hvac',
    apiType: 'scraping',
    website: 'https://www.energyhvac.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal'],
    isActive: true,
  },

  // ── FIRE PROTECTION ──────────────────────────────────────────────────────
  {
    id: 'wormald',
    name: 'WORMALD FIRE PROTECTION',
    category: 'fire_protection',
    apiType: 'rest',
    website: 'https://www.wormald.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape'],
    isActive: true,
  },
  {
    id: 'fire-solutions-sa',
    name: 'FIRE SOLUTIONS SA',
    category: 'fire_protection',
    apiType: 'scraping',
    website: 'https://www.firesolutions.co.za',
    provinces: ['gauteng', 'western-cape', 'kwazulu-natal', 'eastern-cape', 'limpopo', 'mpumalanga', 'north-west', 'free-state', 'northern-cape'],
    isActive: true,
  },
];

/**
 * Get best price for a product across all suppliers and provinces
 */
export async function getBestPrice(
  description: string,
  unit: string,
  quantity: number,
  targetProvince: Province
): Promise<PriceQuote[]> {
  const quotes: PriceQuote[] = [];

  // Get all active suppliers for the target province
  const activeSuppliersInProvince = SUPPLIER_CONFIGS.filter(
    supplier => supplier.isActive && supplier.provinces.includes(targetProvince)
  );

  for (const supplier of activeSuppliersInProvince) {
    try {
      const quote = await getSupplierQuote(supplier, description, unit, quantity, targetProvince);
      if (quote) {
        quotes.push(quote);
      }
    } catch (error) {
      console.error(`Error getting quote from ${supplier.name}:`, error);
    }
  }

  // Sort by total cost (ascending)
  return quotes.sort((a, b) => a.totalCost - b.totalCost);
}

/**
 * Get quote from a specific supplier
 */
async function getSupplierQuote(
  supplier: SupplierConfig,
  description: string,
  unit: string,
  quantity: number,
  province: Province
): Promise<PriceQuote | null> {
  // Check database first for cached prices
  const cachedProduct = await searchSupplierProducts(supplier.id, description, unit);
  
  if (cachedProduct) {
    const provinceInfo = getProvinceByCode(province);
    const deliveryCost = calculateDeliveryCost(quantity, province);
    
    return {
      supplierId: supplier.id,
      supplierName: supplier.name,
      product: cachedProduct,
      deliveryDays: provinceInfo?.defaultDeliveryDays || 2,
      deliveryCost,
      totalCost: cachedProduct.unitPrice * quantity + deliveryCost,
      province,
      timestamp: new Date(),
    };
  }

  // If not cached, fetch from API/scraping (would be implemented per supplier)
  // For now, return null
  return null;
}

/**
 * Search supplier products in database
 */
async function searchSupplierProducts(
  supplierId: string,
  description: string,
  unit: string
): Promise<SupplierProduct | null> {
  const client = getClient();
  if (!client) return null;

  const { data: supplier } = await client
    .from('suppliers')
    .select('id')
    .eq('name', SUPPLIER_CONFIGS.find(s => s.id === supplierId)?.name)
    .single();

  if (!supplier) return null;

  const { data: products } = await client
    .from('supplier_products')
    .select('*')
    .eq('supplier_id', supplier.id)
    .eq('unit', unit)
    .ilike('description', `%${description}%`)
    .eq('is_available', true)
    .limit(1);

  if (!products || products.length === 0) return null;

  const product = products[0];
  return {
    productCode: product.product_code,
    description: product.description,
    unit: product.unit,
    unitPrice: parseFloat(product.unit_price),
    category: product.category,
    isAvailable: product.is_available,
  };
}

/**
 * Calculate delivery cost based on quantity and province
 */
function calculateDeliveryCost(quantity: number, province: Province): number {
  const provinceInfo = getProvinceByCode(province);
  const baseDeliveryCost = 500; // R500 base
  const multiplier = provinceInfo?.deliveryCostMultiplier || 1.0;
  
  // Add cost based on quantity (weight/volume estimate)
  const quantityCost = quantity > 100 ? 200 : quantity > 50 ? 100 : 0;
  
  return (baseDeliveryCost + quantityCost) * multiplier;
}

/**
 * Sync supplier products to database
 * Now stores BASE products only (efficient approach)
 * Provincial pricing calculated at query time using multipliers
 */
export async function syncSupplierProducts(
  supplierId: string,
  products: SupplierProduct[]
): Promise<{ success: number; errors: number }> {
  const client = getClient();
  if (!client) {
    return { success: 0, errors: products.length };
  }

  let success = 0;
  let errors = 0;

  // Get or create supplier in database
  const supplierConfig = SUPPLIER_CONFIGS.find(s => s.id === supplierId);
  if (!supplierConfig) {
    throw new Error(`Supplier ${supplierId} not found in configuration`);
  }

  // Upsert supplier with operating provinces
  const { data: supplier, error: supplierError } = await client
    .from('suppliers')
    .upsert({
      company_name: supplierConfig.name, // Changed from 'name' to 'company_name'
      contact_person: supplierConfig.contactEmail || 'Contact Person', // Added required field
      email: supplierConfig.contactEmail || `${supplierConfig.id}@qilly.co.za`, // Added required field
      phone: supplierConfig.contactPhone || '0000000000', // Added required field
      street_address: supplierConfig.address || 'Head Office', // ✅ FIXED: Added required street_address field
      city: supplierConfig.city || 'Johannesburg', // ✅ FIXED: Added required city field
      postal_code: supplierConfig.postalCode || '2000', // ✅ FIXED: Added required postal_code field
      province: supplierConfig.provinces[0] || 'gauteng', // Added required field (use first province)
      product_categories: [supplierConfig.category], // Changed from 'category' to 'product_categories' array
      contact_email: supplierConfig.contactEmail,
      contact_phone: supplierConfig.contactPhone,
      website: supplierConfig.website,
      is_active: supplierConfig.isActive,
      logo_url: supplierConfig.logoUrl,
      delivery_provinces: supplierConfig.provinces, // Changed from operating_provinces to delivery_provinces (matches schema)
    }, {
      onConflict: 'email', // Changed from 'name' to 'email' (since email has unique constraint)
      ignoreDuplicates: false,
    })
    .select()
    .single();

  if (supplierError) {
    console.error('Error upserting supplier:', supplierError);
    return { success: 0, errors: products.length };
  }

  // Insert BASE products only (no provincial variants!)
  // Provincial pricing calculated at query time via view
  for (const product of products) {
    const { error } = await client
      .from('supplier_products')
      .upsert({
        supplier_id: supplier.id,
        product_code: product.productCode,
        description: product.description,
        unit: product.unit,
        unit_price: product.unitPrice, // Store Gauteng base price
        category: product.category,
        is_available: product.isAvailable,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'supplier_id,product_code',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Error inserting product:', error);
      errors++;
    } else {
      success++;
    }
  }

  // Update supplier's last_sync timestamp
  if (success > 0) {
    await client
      .from('suppliers')
      .update({ last_sync: new Date().toISOString() })
      .eq('id', supplier.id);
  }

  return { success, errors };
}

/**
 * Get all suppliers from database
 */
export async function getAllSuppliers() {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from('suppliers')
    .select('*')
    .order('company_name'); // Fixed: Changed from 'name' to 'company_name' and removed is_active filter

  if (error) {
    console.error('Error fetching suppliers:', error);
    // Throw the error so it can be caught by the component
    throw error;
  }

  return data || [];
}

/**
 * Get supplier products from database
 */
export async function getSupplierProducts(supplierId: string, category?: string) {
  const client = getClient();
  if (!client) return [];

  let query = client
    .from('supplier_products')
    .select(`
      *,
      suppliers (company_name, product_categories, website)
    `)
    .eq('supplier_id', supplierId)
    .eq('is_available', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('description');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}