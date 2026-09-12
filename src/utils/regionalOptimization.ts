// Regional Price Optimization System for Qilly
// Optimizes supplier selection based on location, distance, and transport costs

export interface Municipality {
  name: string;
  code: string;
  provinceCode: string;
  lat: number;
  lng: number;
  type: 'metro' | 'city' | 'town';
}

export interface SupplierBranch {
  supplier: string;
  branchName: string;
  province: string;
  municipality: string;
  lat: number;
  lng: number;
}

export interface TransportCostConfig {
  materialType: 'bulk' | 'standard' | 'lightweight';
  costPerKm: number; // ZAR per km
  minCharge: number; // Minimum delivery charge
}

// Major municipalities and metros across South Africa's 9 provinces
export const municipalities: Municipality[] = [
  // Gauteng (GP) - 11 municipalities
  { name: 'City of Johannesburg (JHB)', code: 'JHB', provinceCode: 'GP', lat: -26.2041, lng: 28.0473, type: 'metro' },
  { name: 'City of Tshwane (PTA)', code: 'PTA', provinceCode: 'GP', lat: -25.7479, lng: 28.2293, type: 'metro' },
  { name: 'City of Ekurhuleni (EKU)', code: 'EKU', provinceCode: 'GP', lat: -26.1596, lng: 28.3299, type: 'metro' },
  { name: 'Sedibeng District (SED)', code: 'SED', provinceCode: 'GP', lat: -26.6734, lng: 27.9265, type: 'city' },
  { name: 'West Rand District (WRD)', code: 'WRD', provinceCode: 'GP', lat: -26.1715, lng: 27.7830, type: 'city' },
  { name: 'Emfuleni (VER)', code: 'VER', provinceCode: 'GP', lat: -26.6734, lng: 27.9265, type: 'city' },
  { name: 'Mogale City (MOG)', code: 'MOG', provinceCode: 'GP', lat: -26.0359, lng: 27.7650, type: 'city' },
  { name: 'Midvaal (MID)', code: 'MID', provinceCode: 'GP', lat: -26.6050, lng: 28.1369, type: 'town' },
  { name: 'Lesedi (LES)', code: 'LES', provinceCode: 'GP', lat: -26.5234, lng: 28.3839, type: 'town' },
  { name: 'Rand West City (RWC)', code: 'RWC', provinceCode: 'GP', lat: -26.1715, lng: 27.7830, type: 'city' },
  { name: 'Merafong City (MER)', code: 'MER', provinceCode: 'GP', lat: -26.6945, lng: 27.2823, type: 'city' },
  
  // Western Cape (WC) - 15 municipalities
  { name: 'City of Cape Town (CPT)', code: 'CPT', provinceCode: 'WC', lat: -33.9249, lng: 18.4241, type: 'metro' },
  { name: 'Cape Winelands District (CWD)', code: 'CWD', provinceCode: 'WC', lat: -33.7667, lng: 19.1667, type: 'city' },
  { name: 'Stellenbosch (STB)', code: 'STB', provinceCode: 'WC', lat: -33.9321, lng: 18.8602, type: 'city' },
  { name: 'Drakenstein (DRA)', code: 'DRA', provinceCode: 'WC', lat: -33.8000, lng: 19.1000, type: 'city' },
  { name: 'George (GRJ)', code: 'GRJ', provinceCode: 'WC', lat: -33.9631, lng: 22.4619, type: 'city' },
  { name: 'Mossel Bay (MOS)', code: 'MOS', provinceCode: 'WC', lat: -34.1836, lng: 22.1460, type: 'city' },
  { name: 'Knysna (KNY)', code: 'KNY', provinceCode: 'WC', lat: -34.0362, lng: 23.0471, type: 'town' },
  { name: 'Worcester (WOR)', code: 'WOR', provinceCode: 'WC', lat: -33.6462, lng: 19.4486, type: 'town' },
  { name: 'Swellendam (SWE)', code: 'SWE', provinceCode: 'WC', lat: -34.0239, lng: 20.4411, type: 'town' },
  { name: 'Saldanha Bay (SAL)', code: 'SAL', provinceCode: 'WC', lat: -33.0117, lng: 17.9442, type: 'city' },
  { name: 'Bergrivier (BER)', code: 'BER', provinceCode: 'WC', lat: -32.7167, lng: 18.4667, type: 'town' },
  { name: 'Cederberg (CED)', code: 'CED', provinceCode: 'WC', lat: -32.4667, lng: 19.1667, type: 'town' },
  { name: 'Overberg District (OVB)', code: 'OVB', provinceCode: 'WC', lat: -34.3667, lng: 19.9167, type: 'city' },
  { name: 'West Coast District (WCD)', code: 'WCD', provinceCode: 'WC', lat: -32.5000, lng: 18.5000, type: 'city' },
  { name: 'Garden Route District (GRD)', code: 'GRD', provinceCode: 'WC', lat: -33.9667, lng: 22.4500, type: 'city' },
  
  // KwaZulu-Natal (KZN) - 18 municipalities
  { name: 'eThekwini (Durban) (DBN)', code: 'DBN', provinceCode: 'KZN', lat: -29.8587, lng: 31.0218, type: 'metro' },
  { name: 'Pietermaritzburg (PMB)', code: 'PMB', provinceCode: 'KZN', lat: -29.6005, lng: 30.3795, type: 'city' },
  { name: 'Newcastle (NEW)', code: 'NEW', provinceCode: 'KZN', lat: -27.7574, lng: 29.9320, type: 'city' },
  { name: 'Richards Bay (RBA)', code: 'RBA', provinceCode: 'KZN', lat: -28.7831, lng: 32.0378, type: 'city' },
  { name: 'Empangeni (EMP)', code: 'EMP', provinceCode: 'KZN', lat: -28.7500, lng: 31.8833, type: 'city' },
  { name: 'Ladysmith (LAD)', code: 'LAD', provinceCode: 'KZN', lat: -28.5578, lng: 29.7805, type: 'city' },
  { name: 'Dundee (DUN)', code: 'DUN', provinceCode: 'KZN', lat: -28.1667, lng: 30.2333, type: 'town' },
  { name: 'Vryheid (VRY)', code: 'VRY', provinceCode: 'KZN', lat: -27.7667, lng: 30.7917, type: 'town' },
  { name: 'Kokstad (KOK)', code: 'KOK', provinceCode: 'KZN', lat: -30.5472, lng: 29.4244, type: 'town' },
  { name: 'Port Shepstone (PSH)', code: 'PSH', provinceCode: 'KZN', lat: -30.7417, lng: 30.4556, type: 'city' },
  { name: 'Umzumbe (UMZ)', code: 'UMZ', provinceCode: 'KZN', lat: -30.5667, lng: 30.4833, type: 'town' },
  { name: 'Umlazi (UML)', code: 'UML', provinceCode: 'KZN', lat: -29.9667, lng: 30.8833, type: 'city' },
  { name: 'Pinetown (PIN)', code: 'PIN', provinceCode: 'KZN', lat: -29.8167, lng: 30.8667, type: 'city' },
  { name: 'Stanger (STA)', code: 'STA', provinceCode: 'KZN', lat: -29.3333, lng: 31.2833, type: 'town' },
  { name: 'Eshowe (ESH)', code: 'ESH', provinceCode: 'KZN', lat: -28.9000, lng: 31.4667, type: 'town' },
  { name: 'Ulundi (ULU)', code: 'ULU', provinceCode: 'KZN', lat: -28.3000, lng: 31.4167, type: 'town' },
  { name: 'Greytown (GRT)', code: 'GRT', provinceCode: 'KZN', lat: -29.0667, lng: 30.5833, type: 'town' },
  { name: 'Estcourt (EST)', code: 'EST', provinceCode: 'KZN', lat: -29.0083, lng: 29.8783, type: 'town' },
  
  // Eastern Cape (EC) - 14 municipalities
  { name: 'Nelson Mandela Bay (Port Elizabeth) (PLZ)', code: 'PLZ', provinceCode: 'EC', lat: -33.9608, lng: 25.6022, type: 'metro' },
  { name: 'Buffalo City (East London) (ELS)', code: 'ELS', provinceCode: 'EC', lat: -33.0153, lng: 27.9116, type: 'metro' },
  { name: 'OR Tambo (Mthatha) (UTH)', code: 'UTH', provinceCode: 'EC', lat: -31.5890, lng: 28.7845, type: 'city' },
  { name: 'Grahamstown/Makhanda (GRA)', code: 'GRA', provinceCode: 'EC', lat: -33.3042, lng: 26.5328, type: 'city' },
  { name: 'King Williams Town (KWT)', code: 'KWT', provinceCode: 'EC', lat: -32.8833, lng: 27.4000, type: 'city' },
  { name: 'Queenstown (QUE)', code: 'QUE', provinceCode: 'EC', lat: -31.8975, lng: 26.8758, type: 'city' },
  { name: 'Uitenhage (UIT)', code: 'UIT', provinceCode: 'EC', lat: -33.7628, lng: 25.3969, type: 'city' },
  { name: 'Graaff-Reinet (GRR)', code: 'GRR', provinceCode: 'EC', lat: -32.2522, lng: 24.5308, type: 'town' },
  { name: 'Cradock (CRA)', code: 'CRA', provinceCode: 'EC', lat: -32.1694, lng: 25.6183, type: 'town' },
  { name: 'Aliwal North (ALI)', code: 'ALI', provinceCode: 'EC', lat: -30.6975, lng: 26.7111, type: 'town' },
  { name: 'Butterworth (BUT)', code: 'BUT', provinceCode: 'EC', lat: -32.3333, lng: 28.1500, type: 'town' },
  { name: 'Mdantsane (MDA)', code: 'MDA', provinceCode: 'EC', lat: -32.9833, lng: 27.7167, type: 'city' },
  { name: 'Bhisho (BHI)', code: 'BHI', provinceCode: 'EC', lat: -32.8500, lng: 27.4333, type: 'city' },
  { name: 'Fort Beaufort (FTB)', code: 'FTB', provinceCode: 'EC', lat: -32.7833, lng: 26.6333, type: 'town' },
  
  // Free State (FS) - 10 municipalities
  { name: 'Mangaung (Bloemfontein) (BFN)', code: 'BFN', provinceCode: 'FS', lat: -29.0852, lng: 26.1596, type: 'metro' },
  { name: 'Welkom (WEL)', code: 'WEL', provinceCode: 'FS', lat: -27.9776, lng: 26.7336, type: 'city' },
  { name: 'Bethlehem (BET)', code: 'BET', provinceCode: 'FS', lat: -28.2308, lng: 28.3078, type: 'city' },
  { name: 'Kroonstad (KRO)', code: 'KRO', provinceCode: 'FS', lat: -27.6503, lng: 27.2342, type: 'city' },
  { name: 'Sasolburg (SAS)', code: 'SAS', provinceCode: 'FS', lat: -26.8133, lng: 27.8172, type: 'city' },
  { name: 'Phuthaditjhaba (PHU)', code: 'PHU', provinceCode: 'FS', lat: -28.5167, lng: 28.8167, type: 'city' },
  { name: 'Virginia (VIR)', code: 'VIR', provinceCode: 'FS', lat: -28.1042, lng: 26.8667, type: 'town' },
  { name: 'Parys (PAR)', code: 'PAR', provinceCode: 'FS', lat: -26.9033, lng: 27.4592, type: 'town' },
  { name: 'Harrismith (HAR)', code: 'HAR', provinceCode: 'FS', lat: -28.2722, lng: 29.1261, type: 'town' },
  { name: 'Ficksburg (FIC)', code: 'FIC', provinceCode: 'FS', lat: -28.8736, lng: 27.8683, type: 'town' },
  
  // Limpopo (LP) - 12 municipalities
  { name: 'Polokwane (PTG)', code: 'PTG', provinceCode: 'LP', lat: -23.9045, lng: 29.4689, type: 'metro' },
  { name: 'Tzaneen (TZN)', code: 'TZN', provinceCode: 'LP', lat: -23.8331, lng: 30.1639, type: 'city' },
  { name: 'Mokopane (MOK)', code: 'MOK', provinceCode: 'LP', lat: -24.1944, lng: 29.0100, type: 'city' },
  { name: 'Lephalale (LEP)', code: 'LEP', provinceCode: 'LP', lat: -23.6764, lng: 27.7086, type: 'city' },
  { name: 'Thohoyandou (THO)', code: 'THO', provinceCode: 'LP', lat: -22.9500, lng: 30.4833, type: 'city' },
  { name: 'Giyani (GIY)', code: 'GIY', provinceCode: 'LP', lat: -23.3167, lng: 30.7167, type: 'city' },
  { name: 'Musina (MUS)', code: 'MUS', provinceCode: 'LP', lat: -22.3403, lng: 30.0411, type: 'city' },
  { name: 'Louis Trichardt/Makhado (LOU)', code: 'LOU', provinceCode: 'LP', lat: -23.0425, lng: 29.9056, type: 'city' },
  { name: 'Mogalakwena (Mokopane) (MGA)', code: 'MGA', provinceCode: 'LP', lat: -24.1944, lng: 29.0100, type: 'city' },
  { name: 'Bela-Bela (BEL)', code: 'BEL', provinceCode: 'LP', lat: -24.8833, lng: 28.2833, type: 'town' },
  { name: 'Modimolle (MOD)', code: 'MOD', provinceCode: 'LP', lat: -24.6989, lng: 28.4031, type: 'town' },
  { name: 'Thabazimbi (THA)', code: 'THA', provinceCode: 'LP', lat: -24.5917, lng: 27.4106, type: 'town' },
  
  // Mpumalanga (MP) - 13 municipalities
  { name: 'Mbombela (Nelspruit) (NLP)', code: 'NLP', provinceCode: 'MP', lat: -25.4753, lng: 30.9694, type: 'metro' },
  { name: 'eMalahleni (Witbank) (WIT)', code: 'WIT', provinceCode: 'MP', lat: -25.8694, lng: 29.2320, type: 'city' },
  { name: 'Secunda (SEC)', code: 'SEC', provinceCode: 'MP', lat: -26.5500, lng: 29.1667, type: 'city' },
  { name: 'Standerton (STO)', code: 'STO', provinceCode: 'MP', lat: -26.9333, lng: 29.2500, type: 'city' },
  { name: 'Middelburg (MDB)', code: 'MDB', provinceCode: 'MP', lat: -25.7750, lng: 29.4667, type: 'city' },
  { name: 'Ermelo (ERM)', code: 'ERM', provinceCode: 'MP', lat: -26.5333, lng: 29.9833, type: 'city' },
  { name: 'Piet Retief (PIE)', code: 'PIE', provinceCode: 'MP', lat: -27.0083, lng: 30.8083, type: 'town' },
  { name: 'White River (WHI)', code: 'WHI', provinceCode: 'MP', lat: -25.3319, lng: 31.0139, type: 'town' },
  { name: 'Hazyview (HAZ)', code: 'HAZ', provinceCode: 'MP', lat: -25.0500, lng: 31.1333, type: 'town' },
  { name: 'Barberton (BAR)', code: 'BAR', provinceCode: 'MP', lat: -25.7908, lng: 31.0542, type: 'town' },
  { name: 'Komatipoort (KOM)', code: 'KOM', provinceCode: 'MP', lat: -25.4333, lng: 31.9500, type: 'town' },
  { name: 'Carolina (CAR)', code: 'CAR', provinceCode: 'MP', lat: -26.0708, lng: 30.1194, type: 'town' },
  { name: 'Belfast (BEF)', code: 'BEF', provinceCode: 'MP', lat: -25.6833, lng: 30.0167, type: 'town' },
  
  // Northern Cape (NC) - 8 municipalities
  { name: 'Sol Plaatje (Kimberley) (KIM)', code: 'KIM', provinceCode: 'NC', lat: -28.7282, lng: 24.7499, type: 'metro' },
  { name: 'Upington (UTN)', code: 'UTN', provinceCode: 'NC', lat: -28.4478, lng: 21.2561, type: 'city' },
  { name: 'De Aar (DEA)', code: 'DEA', provinceCode: 'NC', lat: -30.6497, lng: 24.0122, type: 'city' },
  { name: 'Springbok (SPR)', code: 'SPR', provinceCode: 'NC', lat: -29.6650, lng: 17.8850, type: 'town' },
  { name: 'Kuruman (KUR)', code: 'KUR', provinceCode: 'NC', lat: -27.4500, lng: 23.4333, type: 'town' },
  { name: 'Postmasburg (POS)', code: 'POS', provinceCode: 'NC', lat: -28.3333, lng: 23.0667, type: 'town' },
  { name: 'Prieska (PRI)', code: 'PRI', provinceCode: 'NC', lat: -29.6644, lng: 22.7472, type: 'town' },
  { name: 'Carnarvon (CRN)', code: 'CRN', provinceCode: 'NC', lat: -30.9667, lng: 22.1333, type: 'town' },
  
  // North West (NW) - 11 municipalities
  { name: 'Rustenburg (RUS)', code: 'RUS', provinceCode: 'NW', lat: -25.6672, lng: 27.2421, type: 'metro' },
  { name: 'Mahikeng (MAH)', code: 'MAH', provinceCode: 'NW', lat: -25.8647, lng: 25.6441, type: 'city' },
  { name: 'Klerksdorp (KLE)', code: 'KLE', provinceCode: 'NW', lat: -26.8524, lng: 26.6671, type: 'city' },
  { name: 'Potchefstroom (POT)', code: 'POT', provinceCode: 'NW', lat: -26.7144, lng: 27.0964, type: 'city' },
  { name: 'Brits (BRI)', code: 'BRI', provinceCode: 'NW', lat: -25.6333, lng: 27.7833, type: 'city' },
  { name: 'Vryburg (VRB)', code: 'VRB', provinceCode: 'NW', lat: -26.9567, lng: 24.7286, type: 'city' },
  { name: 'Lichtenburg (LIC)', code: 'LIC', provinceCode: 'NW', lat: -26.1525, lng: 26.1667, type: 'town' },
  { name: 'Schweizer-Reneke (SCH)', code: 'SCH', provinceCode: 'NW', lat: -27.1833, lng: 25.3333, type: 'town' },
  { name: 'Taung (TAU)', code: 'TAU', provinceCode: 'NW', lat: -27.5333, lng: 24.7667, type: 'town' },
  { name: 'Zeerust (ZEE)', code: 'ZEE', provinceCode: 'NW', lat: -25.5389, lng: 26.0792, type: 'town' },
  { name: 'Moretele (MOR)', code: 'MOR', provinceCode: 'NW', lat: -25.2333, lng: 28.0333, type: 'town' },
];

// Mock supplier branch locations (in production, this would come from supplier API data)
export const supplierBranches: SupplierBranch[] = [
  // Buco branches
  { supplier: 'Buco', branchName: 'Buco Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { supplier: 'Buco', branchName: 'Buco Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7479, lng: 28.2293 },
  { supplier: 'Buco', branchName: 'Buco Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { supplier: 'Buco', branchName: 'Buco Durban', province: 'KZN', municipality: 'Durban', lat: -29.8587, lng: 31.0218 },
  { supplier: 'Buco', branchName: 'Buco Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9608, lng: 25.6022 },
  
  // Macsteel branches
  { supplier: 'Macsteel', branchName: 'Macsteel Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1596, lng: 28.3299 },
  { supplier: 'Macsteel', branchName: 'Macsteel Durban', province: 'KZN', municipality: 'Durban', lat: -29.8587, lng: 31.0218 },
  { supplier: 'Macsteel', branchName: 'Macsteel Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  
  // Raumix branches
  { supplier: 'Raumix', branchName: 'Raumix Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { supplier: 'Raumix', branchName: 'Raumix Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7479, lng: 28.2293 },
  { supplier: 'Raumix', branchName: 'Raumix Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { supplier: 'Raumix', branchName: 'Raumix Bloemfontein', province: 'FS', municipality: 'Bloemfontein', lat: -29.0852, lng: 26.1596 },
  
  // Lafarge branches
  { supplier: 'Lafarge', branchName: 'Lafarge Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.2041, lng: 28.0473 },
  { supplier: 'Lafarge', branchName: 'Lafarge Durban', province: 'KZN', municipality: 'Durban', lat: -29.8587, lng: 31.0218 },
  { supplier: 'Lafarge', branchName: 'Lafarge Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9249, lng: 18.4241 },
  { supplier: 'Lafarge', branchName: 'Lafarge Polokwane', province: 'LP', municipality: 'Polokwane', lat: -23.9045, lng: 29.4689 },
  
  // RSC branches (Roofing & Building Materials)
  { supplier: 'RSC', branchName: 'RSC Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1596, lng: 28.2041 },
  { supplier: 'RSC', branchName: 'RSC Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7311, lng: 28.2184 },
  { supplier: 'RSC', branchName: 'RSC Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9608, lng: 18.4094 },
  { supplier: 'RSC', branchName: 'RSC Durban', province: 'KZN', municipality: 'Durban', lat: -29.8673, lng: 31.0287 },
  
  // Builders Warehouse branches (National chain - 9 provinces)
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1885, lng: 28.0285 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7616, lng: 28.2431 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9321, lng: 18.4152 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Durban', province: 'KZN', municipality: 'Durban', lat: -29.8739, lng: 31.0294 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9742, lng: 25.5998 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Bloemfontein', province: 'FS', municipality: 'Bloemfontein', lat: -29.0973, lng: 26.1551 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Polokwane', province: 'LP', municipality: 'Polokwane', lat: -23.9113, lng: 29.4608 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Nelspruit', province: 'MP', municipality: 'Mbombela', lat: -25.4647, lng: 30.9693 },
  { supplier: 'Builders Warehouse', branchName: 'Builders Warehouse Rustenburg', province: 'NW', municipality: 'Rustenburg', lat: -25.6672, lng: 27.2424 },
  
  // BUILDERS branches (National chain)
  { supplier: 'BUILDERS', branchName: 'BUILDERS Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1947, lng: 28.0305 },
  { supplier: 'BUILDERS', branchName: 'BUILDERS Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7524, lng: 28.2368 },
  { supplier: 'BUILDERS', branchName: 'BUILDERS Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9406, lng: 18.4242 },
  { supplier: 'BUILDERS', branchName: 'BUILDERS Durban', province: 'KZN', municipality: 'Durban', lat: -29.8804, lng: 31.0262 },
  { supplier: 'BUILDERS', branchName: 'BUILDERS East London', province: 'EC', municipality: 'Buffalo City', lat: -32.9897, lng: 27.8724 },
  
  // PPC Cement branches (National - major cement supplier)
  { supplier: 'PPC', branchName: 'PPC Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1723, lng: 28.0514 },
  { supplier: 'PPC', branchName: 'PPC Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7342, lng: 28.2165 },
  { supplier: 'PPC', branchName: 'PPC Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9274, lng: 18.4321 },
  { supplier: 'PPC', branchName: 'PPC Durban', province: 'KZN', municipality: 'Durban', lat: -29.8512, lng: 31.0354 },
  { supplier: 'PPC', branchName: 'PPC Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9528, lng: 25.6147 },
  { supplier: 'PPC', branchName: 'PPC Bloemfontein', province: 'FS', municipality: 'Bloemfontein', lat: -29.1028, lng: 26.1683 },
  
  // AfriSam branches (Major concrete & aggregates)
  { supplier: 'AfriSam', branchName: 'AfriSam Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1831, lng: 28.0396 },
  { supplier: 'AfriSam', branchName: 'AfriSam Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7445, lng: 28.2197 },
  { supplier: 'AfriSam', branchName: 'AfriSam Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9185, lng: 18.4209 },
  { supplier: 'AfriSam', branchName: 'AfriSam Durban', province: 'KZN', municipality: 'Durban', lat: -29.8641, lng: 31.0316 },
  { supplier: 'AfriSam', branchName: 'AfriSam Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9684, lng: 25.6085 },
  
  // Cashbuild branches (Budget building materials)
  { supplier: 'Cashbuild', branchName: 'Cashbuild Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1968, lng: 28.0419 },
  { supplier: 'Cashbuild', branchName: 'Cashbuild Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7589, lng: 28.2305 },
  { supplier: 'Cashbuild', branchName: 'Cashbuild Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9467, lng: 18.4197 },
  { supplier: 'Cashbuild', branchName: 'Cashbuild Durban', province: 'KZN', municipality: 'Durban', lat: -29.8762, lng: 31.0238 },
  
  // NJR STEEL branches (Steel & reinforcement)
  { supplier: 'NJR STEEL', branchName: 'NJR STEEL Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1685, lng: 28.0527 },
  { supplier: 'NJR STEEL', branchName: 'NJR STEEL Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7284, lng: 28.2248 },
  { supplier: 'NJR STEEL', branchName: 'NJR STEEL Durban', province: 'KZN', municipality: 'Durban', lat: -29.8563, lng: 31.0285 },
  
  // JVR STEEL branches (Steel & reinforcement)
  { supplier: 'JVR STEEL', branchName: 'JVR STEEL Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1742, lng: 28.0463 },
  { supplier: 'JVR STEEL', branchName: 'JVR STEEL Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9158, lng: 18.4287 },
  { supplier: 'JVR STEEL', branchName: 'JVR STEEL Durban', province: 'KZN', municipality: 'Durban', lat: -29.8597, lng: 31.0342 },
  
  // GLOBAL ROOFING branches (Structural steel & roofing)
  { supplier: 'GLOBAL ROOFING', branchName: 'GLOBAL ROOFING Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1627, lng: 28.0584 },
  { supplier: 'GLOBAL ROOFING', branchName: 'GLOBAL ROOFING Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9235, lng: 18.4326 },
  { supplier: 'GLOBAL ROOFING', branchName: 'GLOBAL ROOFING Durban', province: 'KZN', municipality: 'Durban', lat: -29.8518, lng: 31.0367 },
  
  // INFRASET branches (Civils products & paving)
  { supplier: 'INFRASET', branchName: 'INFRASET Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1758, lng: 28.0446 },
  { supplier: 'INFRASET', branchName: 'INFRASET Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7398, lng: 28.2135 },
  { supplier: 'INFRASET', branchName: 'INFRASET Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9312, lng: 18.4175 },
  
  // TECHNI CRETE branches (Precast concrete)
  { supplier: 'TECHNI CRETE', branchName: 'TECHNI CRETE Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1814, lng: 28.0372 },
  { supplier: 'TECHNI CRETE', branchName: 'TECHNI CRETE Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7462, lng: 28.2211 },
  { supplier: 'TECHNI CRETE', branchName: 'TECHNI CRETE Durban', province: 'KZN', municipality: 'Durban', lat: -29.8624, lng: 31.0329 },
  
  // ========== ADDITIONAL 52+ SUPPLIERS (82 total new suppliers added) ==========
  
  // Leroy Merlin branches (National DIY & building materials)
  { supplier: 'Leroy Merlin', branchName: 'Leroy Merlin Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.2014, lng: 28.0375 },
  { supplier: 'Leroy Merlin', branchName: 'Leroy Merlin Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7543, lng: 28.2417 },
  { supplier: 'Leroy Merlin', branchName: 'Leroy Merlin Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9384, lng: 18.4268 },
  { supplier: 'Leroy Merlin', branchName: 'Leroy Merlin Durban', province: 'KZN', municipality: 'Durban', lat: -29.8785, lng: 31.0247 },
  { supplier: 'Leroy Merlin', branchName: 'Leroy Merlin Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9715, lng: 25.6012 },
  
  // Timber City branches (Specialist timber & roofing)
  { supplier: 'Timber City', branchName: 'Timber City Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1923, lng: 28.0492 },
  { supplier: 'Timber City', branchName: 'Timber City Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7498, lng: 28.2273 },
  { supplier: 'Timber City', branchName: 'Timber City Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9295, lng: 18.4185 },
  { supplier: 'Timber City', branchName: 'Timber City Durban', province: 'KZN', municipality: 'Durban', lat: -29.8714, lng: 31.0251 },
  
  // Builders Depot branches (Budget building supplies)
  { supplier: 'Builders Depot', branchName: 'Builders Depot Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1876, lng: 28.0318 },
  { supplier: 'Builders Depot', branchName: 'Builders Depot Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7571, lng: 28.2395 },
  { supplier: 'Builders Depot', branchName: 'Builders Depot Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9423, lng: 18.4214 },
  { supplier: 'Builders Depot', branchName: 'Builders Depot Durban', province: 'KZN', municipality: 'Durban', lat: -29.8751, lng: 31.0265 },
  
  // Marley branches (Roof tiles & building products)
  { supplier: 'Marley', branchName: 'Marley Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1794, lng: 28.0425 },
  { supplier: 'Marley', branchName: 'Marley Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7426, lng: 28.2186 },
  { supplier: 'Marley', branchName: 'Marley Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9217, lng: 18.4263 },
  { supplier: 'Marley', branchName: 'Marley Durban', province: 'KZN', municipality: 'Durban', lat: -29.8596, lng: 31.0321 },
  { supplier: 'Marley', branchName: 'Marley Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9667, lng: 25.6094 },
  
  // Talisman branches (Civils & hire equipment)
  { supplier: 'Talisman', branchName: 'Talisman Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1738, lng: 28.0551 },
  { supplier: 'Talisman', branchName: 'Talisman Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7352, lng: 28.2142 },
  { supplier: 'Talisman', branchName: 'Talisman Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9247, lng: 18.4308 },
  { supplier: 'Talisman', branchName: 'Talisman Durban', province: 'KZN', municipality: 'Durban', lat: -29.8541, lng: 31.0374 },
  
  // Voltex branches (Electrical & cable supplies)
  { supplier: 'Voltex', branchName: 'Voltex Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1853, lng: 28.0387 },
  { supplier: 'Voltex', branchName: 'Voltex Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7489, lng: 28.2254 },
  { supplier: 'Voltex', branchName: 'Voltex Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9352, lng: 18.4198 },
  { supplier: 'Voltex', branchName: 'Voltex Durban', province: 'KZN', municipality: 'Durban', lat: -29.8685, lng: 31.0298 },
  { supplier: 'Voltex', branchName: 'Voltex Bloemfontein', province: 'FS', municipality: 'Bloemfontein', lat: -29.0947, lng: 26.1624 },
  { supplier: 'Voltex', branchName: 'Voltex Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9695, lng: 25.6073 },
  
  // KSB branches (Pumps & valves)
  { supplier: 'KSB', branchName: 'KSB Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1671, lng: 28.0513 },
  { supplier: 'KSB', branchName: 'KSB Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9164, lng: 18.4276 },
  { supplier: 'KSB', branchName: 'KSB Durban', province: 'KZN', municipality: 'Durban', lat: -29.8574, lng: 31.0348 },
  
  // AVK branches (Valves & fittings)
  { supplier: 'AVK', branchName: 'AVK Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1698, lng: 28.0539 },
  { supplier: 'AVK', branchName: 'AVK Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9192, lng: 18.4295 },
  { supplier: 'AVK', branchName: 'AVK Durban', province: 'KZN', municipality: 'Durban', lat: -29.8608, lng: 31.0336 },
  
  // Zenzele branches (BEE supplier - building materials)
  { supplier: 'Zenzele', branchName: 'Zenzele Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1842, lng: 28.0364 },
  { supplier: 'Zenzele', branchName: 'Zenzele Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7453, lng: 28.2203 },
  { supplier: 'Zenzele', branchName: 'Zenzele Durban', province: 'KZN', municipality: 'Durban', lat: -29.8657, lng: 31.0312 },
  
  // Sizabantu branches (BEE supplier - civils)
  { supplier: 'Sizabantu', branchName: 'Sizabantu Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1785, lng: 28.0417 },
  { supplier: 'Sizabantu', branchName: 'Sizabantu Durban', province: 'KZN', municipality: 'Durban', lat: -29.8632, lng: 31.0325 },
  { supplier: 'Sizabantu', branchName: 'Sizabantu Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9281, lng: 18.4231 },
  
  // Stewards&Llods branches (Shuttering & formwork)
  { supplier: 'Stewards&Llods', branchName: 'Stewards&Llods Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1762, lng: 28.0487 },
  { supplier: 'Stewards&Llods', branchName: 'Stewards&Llods Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9328, lng: 18.4193 },
  { supplier: 'Stewards&Llods', branchName: 'Stewards&Llods Durban', province: 'KZN', municipality: 'Durban', lat: -29.8589, lng: 31.0359 },
  
  // East Coast branches (Steel & hardware - KZN/EC focused)
  { supplier: 'East Coast', branchName: 'East Coast Durban', province: 'KZN', municipality: 'Durban', lat: -29.8548, lng: 31.0382 },
  { supplier: 'East Coast', branchName: 'East Coast Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9723, lng: 25.6028 },
  { supplier: 'East Coast', branchName: 'East Coast East London', province: 'EC', municipality: 'Buffalo City', lat: -32.9934, lng: 27.8765 },
  
  // Much Plant branches (Plant hire - GP/LP focused)
  { supplier: 'Much Plant', branchName: 'Much Plant Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1649, lng: 28.0562 },
  { supplier: 'Much Plant', branchName: 'Much Plant Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7318, lng: 28.2176 },
  { supplier: 'Much Plant', branchName: 'Much Plant Polokwane', province: 'LP', municipality: 'Polokwane', lat: -23.9082, lng: 29.4712 },
  
  // Polokwane Surfacing branches (Limpopo specialist)
  { supplier: 'Polokwane Surfacing', branchName: 'Polokwane Surfacing Polokwane', province: 'LP', municipality: 'Polokwane', lat: -23.9127, lng: 29.4634 },
  { supplier: 'Polokwane Surfacing', branchName: 'Polokwane Surfacing Mokopane', province: 'LP', municipality: 'Mokopane', lat: -24.1978, lng: 29.0123 },
  
  // Bosun branches (Marine & industrial supplies)
  { supplier: 'Bosun', branchName: 'Bosun Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9137, lng: 18.4315 },
  { supplier: 'Bosun', branchName: 'Bosun Durban', province: 'KZN', municipality: 'Durban', lat: -29.8521, lng: 31.0395 },
  { supplier: 'Bosun', branchName: 'Bosun Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9651, lng: 25.6119 },
  
  // Actom branches (Electrical equipment)
  { supplier: 'Actom', branchName: 'Actom Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1712, lng: 28.0498 },
  { supplier: 'Actom', branchName: 'Actom Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9206, lng: 18.4284 },
  { supplier: 'Actom', branchName: 'Actom Durban', province: 'KZN', municipality: 'Durban', lat: -29.8615, lng: 31.0343 },
  
  // Abadere branches (BEE supplier - construction materials)
  { supplier: 'Abadere', branchName: 'Abadere Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1827, lng: 28.0356 },
  { supplier: 'Abadere', branchName: 'Abadere Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7517, lng: 28.2329 },
  
  // ARB branches (Electrical wholesaler)
  { supplier: 'ARB', branchName: 'ARB Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1776, lng: 28.0434 },
  { supplier: 'ARB', branchName: 'ARB Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9263, lng: 18.4247 },
  { supplier: 'ARB', branchName: 'ARB Durban', province: 'KZN', municipality: 'Durban', lat: -29.8671, lng: 31.0306 },
  
  // Power Equipment branches (Generators & power tools)
  { supplier: 'Power Equipment', branchName: 'Power Equipment Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1694, lng: 28.0521 },
  { supplier: 'Power Equipment', branchName: 'Power Equipment Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9179, lng: 18.4302 },
  
  // Aermart branches (Industrial supplies)
  { supplier: 'Aermart', branchName: 'Aermart Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1819, lng: 28.0348 },
  { supplier: 'Aermart', branchName: 'Aermart Durban', province: 'KZN', municipality: 'Durban', lat: -29.8643, lng: 31.0318 },
  
  // Atlas Plant branches (Plant hire)
  { supplier: 'Atlas Plant', branchName: 'Atlas Plant Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1636, lng: 28.0575 },
  { supplier: 'Atlas Plant', branchName: 'Atlas Plant Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7295, lng: 28.2158 },
  
  // BILT branches (Roofing materials)
  { supplier: 'BILT', branchName: 'BILT Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1807, lng: 28.0401 },
  { supplier: 'BILT', branchName: 'BILT Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9253, lng: 18.4255 },
  { supplier: 'BILT', branchName: 'BILT Durban', province: 'KZN', municipality: 'Durban', lat: -29.8664, lng: 31.0309 },
  
  // CORRSHINE branches (Metal roofing)
  { supplier: 'CORRSHINE', branchName: 'CORRSHINE Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1751, lng: 28.0475 },
  { supplier: 'CORRSHINE', branchName: 'CORRSHINE Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9289, lng: 18.4223 },
  { supplier: 'CORRSHINE', branchName: 'CORRSHINE Durban', province: 'KZN', municipality: 'Durban', lat: -29.8601, lng: 31.0351 },
  
  // Sekunalo branches (BEE supplier - Eastern Cape)
  { supplier: 'Sekunalo', branchName: 'Sekunalo Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9734, lng: 25.6042 },
  { supplier: 'Sekunalo', branchName: 'Sekunalo East London', province: 'EC', municipality: 'Buffalo City', lat: -32.9916, lng: 27.8751 },
  
  // Struandale branches (PE specialist)
  { supplier: 'Struandale', branchName: 'Struandale Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9741, lng: 25.6055 },
  
  // Llocs branches (Formwork systems)
  { supplier: 'Llocs', branchName: 'Llocs Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1769, lng: 28.0463 },
  { supplier: 'Llocs', branchName: 'Llocs Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9341, lng: 18.4186 },
  
  // Polyframe branches (Shuttering)
  { supplier: 'Polyframe', branchName: 'Polyframe Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1745, lng: 28.0481 },
  { supplier: 'Polyframe', branchName: 'Polyframe Durban', province: 'KZN', municipality: 'Durban', lat: -29.8579, lng: 31.0365 },
  
  // East Coast Fencing branches
  { supplier: 'East Coast Fencing', branchName: 'East Coast Fencing Durban', province: 'KZN', municipality: 'Durban', lat: -29.8555, lng: 31.0389 },
  { supplier: 'East Coast Fencing', branchName: 'East Coast Fencing Port Elizabeth', province: 'EC', municipality: 'Port Elizabeth/Gqeberha', lat: -33.9716, lng: 25.6035 },
  
  // Sherrerd Road Signs branches
  { supplier: 'Sherrerd Road Signs', branchName: 'Sherrerd Road Signs Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1683, lng: 28.0533 },
  { supplier: 'Sherrerd Road Signs', branchName: 'Sherrerd Road Signs Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9226, lng: 18.4271 },
  
  // Vyl-Tex branches (Waterproofing)
  { supplier: 'Vyl-Tex', branchName: 'Vyl-Tex Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1798, lng: 28.0409 },
  { supplier: 'Vyl-Tex', branchName: 'Vyl-Tex Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9304, lng: 18.4207 },
  
  // Aermatt branches (Equipment hire)
  { supplier: 'Aermatt', branchName: 'Aermatt Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1722, lng: 28.0505 },
  
  // Aguenie branches (Specialist supplier)
  { supplier: 'Aguenie', branchName: 'Aguenie Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1811, lng: 28.0379 },
  
  // A3M branches (Construction materials)
  { supplier: 'A3M', branchName: 'A3M Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1863, lng: 28.0332 },
  
  // RSC Global branches (Roofing - different from RSC)
  { supplier: 'RSC Global', branchName: 'RSC Global Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1621, lng: 28.0594 },
  { supplier: 'RSC Global', branchName: 'RSC Global Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9621, lng: 18.4108 },
  
  // Container World branches (Containers & portables)
  { supplier: 'Container World', branchName: 'Container World Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1656, lng: 28.0557 },
  { supplier: 'Container World', branchName: 'Container World Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9373, lng: 18.4162 },
  { supplier: 'Container World', branchName: 'Container World Durban', province: 'KZN', municipality: 'Durban', lat: -29.8535, lng: 31.0401 },
  
  // Talisman Hire branches (Equipment rental)
  { supplier: 'Talisman Hire', branchName: 'Talisman Hire Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1729, lng: 28.0569 },
  { supplier: 'Talisman Hire', branchName: 'Talisman Hire Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9256, lng: 18.4333 },
  
  // Hireall branches (Tool & equipment hire)
  { supplier: 'Hireall', branchName: 'Hireall Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1643, lng: 28.0581 },
  { supplier: 'Hireall', branchName: 'Hireall Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7307, lng: 28.2163 },
  { supplier: 'Hireall', branchName: 'Hireall Durban', province: 'KZN', municipality: 'Durban', lat: -29.8528, lng: 31.0408 },
  
  // Much Asphalt Plant Hire branches
  { supplier: 'Much Asphalt Plant Hire', branchName: 'Much Asphalt Plant Hire Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1614, lng: 28.0588 },
  { supplier: 'Much Asphalt Plant Hire', branchName: 'Much Asphalt Plant Hire Polokwane', province: 'LP', municipality: 'Polokwane', lat: -23.9096, lng: 29.4725 },
  
  // PAN branches (Portables & ablutions)
  { supplier: 'PAN', branchName: 'PAN Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1869, lng: 28.0325 },
  { supplier: 'PAN', branchName: 'PAN Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9395, lng: 18.4145 },
  
  // Bridgedeck branches (Specialist formwork)
  { supplier: 'Bridgedeck', branchName: 'Bridgedeck Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1755, lng: 28.0469 },
  
  // Maku branches (Machinery & equipment)
  { supplier: 'Maku', branchName: 'Maku Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1706, lng: 28.0515 },
  
  // Roofcap branches (Testing services)
  { supplier: 'Roofcap', branchName: 'Roofcap Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1835, lng: 28.0340 },
  { supplier: 'Roofcap', branchName: 'Roofcap Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9317, lng: 18.4199 },
  
  // Civil Lab branches (Testing laboratories)
  { supplier: 'Civil Lab', branchName: 'Civil Lab Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1790, lng: 28.0423 },
  { supplier: 'Civil Lab', branchName: 'Civil Lab Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7471, lng: 28.2217 },
  { supplier: 'Civil Lab', branchName: 'Civil Lab Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9271, lng: 18.4239 },
  { supplier: 'Civil Lab', branchName: 'Civil Lab Durban', province: 'KZN', municipality: 'Durban', lat: -29.8650, lng: 31.0315 },
  
  // Concrete Lab branches (Concrete testing)
  { supplier: 'Concrete Lab', branchName: 'Concrete Lab Johannesburg', province: 'GP', municipality: 'Johannesburg', lat: -26.1777, lng: 28.0441 },
  { supplier: 'Concrete Lab', branchName: 'Concrete Lab Pretoria', province: 'GP', municipality: 'Pretoria/Tshwane', lat: -25.7434, lng: 28.2192 },
  { supplier: 'Concrete Lab', branchName: 'Concrete Lab Cape Town', province: 'WC', municipality: 'Cape Town', lat: -33.9241, lng: 18.4262 },
  { supplier: 'Concrete Lab', branchName: 'Concrete Lab Durban', province: 'KZN', municipality: 'Durban', lat: -29.8636, lng: 31.0322 },
];

// Transport cost configurations by material type
export const transportCosts: { [key: string]: TransportCostConfig } = {
  bulk: {
    materialType: 'bulk',
    costPerKm: 8.5, // R8.50 per km for bulk materials (cement, aggregates, sand)
    minCharge: 450, // Minimum R450 delivery (same area/0km deliveries)
  },
  standard: {
    materialType: 'standard',
    costPerKm: 6.0, // R6.00 per km for standard materials (bricks, timber, steel)
    minCharge: 300, // Minimum R300 delivery (same area/0km deliveries)
  },
  lightweight: {
    materialType: 'lightweight',
    costPerKm: 3.5, // R3.50 per km for lightweight materials (fittings, tools, paint)
    minCharge: 150, // Minimum R150 delivery (same area/0km deliveries)
  },
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Determine material type from BOQ item description
 * Used to calculate appropriate transport costs
 */
export function getMaterialType(itemDescription: string): 'bulk' | 'standard' | 'lightweight' {
  const desc = itemDescription.toLowerCase();
  
  // Bulk materials (heavy, high-volume)
  if (desc.includes('cement') || desc.includes('concrete') || desc.includes('aggregate') ||
      desc.includes('sand') || desc.includes('stone') || desc.includes('gravel') ||
      desc.includes('readymix') || desc.includes('mortar')) {
    return 'bulk';
  }
  
  // Lightweight materials (small, low-weight)
  if (desc.includes('paint') || desc.includes('fitting') || desc.includes('tool') ||
      desc.includes('handle') || desc.includes('tape') || desc.includes('adhesive') ||
      desc.includes('sealant') || desc.includes('cable') || desc.includes('wire')) {
    return 'lightweight';
  }
  
  // Default to standard materials (bricks, steel, timber, etc.)
  return 'standard';
}

/**
 * Calculate transport cost based on distance and material type
 */
export function calculateTransportCost(
  distance: number,
  materialType: 'bulk' | 'standard' | 'lightweight'
): number {
  const config = transportCosts[materialType];
  const calculatedCost = distance * config.costPerKm;
  
  // Return the maximum of calculated cost or minimum charge
  return Math.max(calculatedCost, config.minCharge);
}

/**
 * Find nearest supplier branches to a given location
 */
export function findNearestBranches(
  projectLat: number,
  projectLng: number,
  supplier: string,
  maxResults: number = 3
): Array<SupplierBranch & { distance: number }> {
  // Filter branches by supplier (case-insensitive to handle catalog name variations)
  const supplierBranchList = supplierBranches.filter(
    b => b.supplier.toUpperCase() === supplier.toUpperCase()
  );
  
  // Calculate distances and sort
  const branchesWithDistance = supplierBranchList.map(branch => ({
    ...branch,
    distance: calculateDistance(projectLat, projectLng, branch.lat, branch.lng)
  })).sort((a, b) => a.distance - b.distance);
  
  // Return top N results
  return branchesWithDistance.slice(0, maxResults);
}

/**
 * Get municipality by code
 */
export function getMunicipalityByCode(code: string): Municipality | undefined {
  return municipalities.find(m => m.code === code);
}

/**
 * Get municipalities by province
 */
export function getMunicipalitiesByProvince(provinceCode: string): Municipality[] {
  return municipalities.filter(m => m.provinceCode === provinceCode);
}

/**
 * Calculate total landed cost (base price + transport)
 */
export function calculateLandedCost(
  basePrice: number,
  quantity: number,
  distance: number,
  materialType: 'bulk' | 'standard' | 'lightweight'
): {
  basePrice: number;
  transportCost: number;
  transportCostPerUnit: number;
  totalLandedCost: number;
  totalLandedCostPerUnit: number;
} {
  const transportCost = calculateTransportCost(distance, materialType);
  const transportCostPerUnit = quantity > 0 ? transportCost / quantity : transportCost;
  const totalLandedCost = (basePrice * quantity) + transportCost;
  const totalLandedCostPerUnit = quantity > 0 ? totalLandedCost / quantity : basePrice + transportCost;
  
  return {
    basePrice,
    transportCost: Math.round(transportCost * 100) / 100,
    transportCostPerUnit: Math.round(transportCostPerUnit * 100) / 100,
    totalLandedCost: Math.round(totalLandedCost * 100) / 100,
    totalLandedCostPerUnit: Math.round(totalLandedCostPerUnit * 100) / 100,
  };
}

/**
 * Optimize supplier selection based on landed cost
 * Returns suppliers ranked by total cost (base price + transport)
 */
export interface OptimizedSupplierQuote {
  supplier: string;
  branchName: string;
  baseUnitPrice: number;
  distance: number;
  transportCost: number;
  transportCostPerUnit: number;
  landedUnitPrice: number;
  totalLandedCost: number;
  isRegionalBest: boolean;
  isNationalBest: boolean;
  savingsVsNationalBest?: number;
}

export function optimizeSupplierSelection(
  supplierQuotes: Array<{ supplier: string; unitPrice: number }>,
  projectLat: number,
  projectLng: number,
  itemDescription: string,
  quantity: number
): OptimizedSupplierQuote[] {
  const materialType = getMaterialType(itemDescription);
  const qty = parseFloat(String(quantity)) || 1;
  
  const optimizedQuotes: OptimizedSupplierQuote[] = supplierQuotes.map(quote => {
    // Find nearest branch for this supplier
    const nearestBranches = findNearestBranches(projectLat, projectLng, quote.supplier, 1);
    const nearestBranch = nearestBranches[0];
    
    if (!nearestBranch) {
      // Fallback if no branch found
      return {
        supplier: quote.supplier,
        branchName: `${quote.supplier} (Location Unknown)`,
        baseUnitPrice: quote.unitPrice,
        distance: 0,
        transportCost: 0,
        transportCostPerUnit: 0,
        landedUnitPrice: quote.unitPrice,
        totalLandedCost: quote.unitPrice * qty,
        isRegionalBest: false,
        isNationalBest: false,
      };
    }
    
    const landedCost = calculateLandedCost(
      quote.unitPrice,
      qty,
      nearestBranch.distance,
      materialType
    );
    
    return {
      supplier: quote.supplier,
      branchName: nearestBranch.branchName,
      baseUnitPrice: quote.unitPrice,
      distance: nearestBranch.distance,
      transportCost: landedCost.transportCost,
      transportCostPerUnit: landedCost.transportCostPerUnit,
      landedUnitPrice: landedCost.totalLandedCostPerUnit,
      totalLandedCost: landedCost.totalLandedCost,
      isRegionalBest: false,
      isNationalBest: false,
    };
  });
  
  // Sort by landed unit price (lowest to highest)
  optimizedQuotes.sort((a, b) => a.landedUnitPrice - b.landedUnitPrice);
  
  // Mark best options
  if (optimizedQuotes.length > 0) {
    optimizedQuotes[0].isNationalBest = true;
    optimizedQuotes[0].isRegionalBest = true;
    
    // Calculate savings: show how much you save by choosing nearby supplier
    // vs the cheapest BASE price supplier (which might be far away)
    const bestQuote = optimizedQuotes[0];
    const bestLandedPrice = bestQuote.landedUnitPrice;
    
    // Find supplier with lowest BASE price (ignoring transport)
    const lowestBasePriceQuote = optimizedQuotes.reduce((min, quote) => 
      quote.baseUnitPrice < min.baseUnitPrice ? quote : min
    );
    
    // Only show savings if:
    // 1. The lowest base price supplier is different from the best landed cost supplier
    // 2. The lowest base price supplier is significantly farther (>20km difference)
    const distanceDiff = lowestBasePriceQuote.distance - bestQuote.distance;
    
    if (lowestBasePriceQuote.supplier !== bestQuote.supplier && distanceDiff > 20) {
      // Calculate what you WOULD HAVE paid with the cheapest base price supplier
      const wouldHavePaid = lowestBasePriceQuote.landedUnitPrice;
      const savings = wouldHavePaid - bestLandedPrice;
      
      // Only show savings if it's meaningful (at least R1 per unit)
      if (savings > 1) {
        optimizedQuotes[0].savingsVsNationalBest = savings;
      }
    }
    
    // Calculate extra cost for other quotes (not savings, but additional cost)
    optimizedQuotes.forEach(quote => {
      if (!quote.isNationalBest) {
        quote.savingsVsNationalBest = quote.landedUnitPrice - bestLandedPrice;
      }
    });
  }
  
  return optimizedQuotes;
}