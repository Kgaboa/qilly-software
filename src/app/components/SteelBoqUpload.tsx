/**
 * SteelBoqUpload.tsx
 * Qilly Steel Construction BOQ Pricing Engine
 * Covers: Reinforcing, Structural Sections, Hollow Sections, Flat Products,
 *         Roof/Cladding Steel, Angles, Fasteners, Mesh & Wire
 *
 * Pricing: BuildAid 2025/2026 + ArcelorMittal, NJR Steel, Macsteel,
 *          BRC Reinforcing, Cape Gate, Bolt & Eng live reference rates.
 * Standard: SANS 1200 DF — Structural Steelwork
 * Grades: S275 (Grade 43), S355 (Grade 50), 450MPa Reinforcing
 */

import React, { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';
import {
  Plus, Trash2, ChevronDown, ChevronUp,
  Package, TrendingUp, AlertTriangle, CheckCircle, Search,
  FileSpreadsheet, Zap, Building2, BarChart3,
  Settings, Upload, FileDown, Play,
} from 'lucide-react';
import { toast } from 'sonner';
import { SteelPricedBillView } from '@/app/components/SteelPricedBillView';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type SteelGrade = 'S275' | 'S355' | '300W' | '450MPa' | 'Any';
type SteelUnit = 'tonne' | 'kg' | 'm' | 'm²' | 'each' | '6m bar' | '12m bar' | '6m length' | '6x2.4m sheet' | '1000m roll';
type SteelCategory =
  | 'reinforcing'
  | 'structural_sections'
  | 'hollow_sections'
  | 'angles'
  | 'flat_products'
  | 'roofing_cladding'
  | 'mesh_wire'
  | 'fasteners_accessories'
  | 'fabrication';

interface SteelSupplierRate {
  supplier: string;
  unitPrice: number;
  available: boolean;
  note?: string;
}

interface SteelItem {
  code: string;
  description: string;
  category: SteelCategory;
  unit: SteelUnit;
  grade: SteelGrade;
  massPerUnit: number; // kg per unit (for tonnage calcs)
  sans1200: string;
  buildAidRef: string;
  basePrice: number; // BuildAid 2025/2026 base (Gauteng)
  supplierRates: SteelSupplierRate[];
}

interface BoqRow {
  id: string;
  itemCode: string;
  description: string;
  category: SteelCategory;
  unit: SteelUnit;
  grade: SteelGrade;
  quantity: number;
  unitRate: number;
  totalEx: number;
  totalInc: number;
  supplierRates: SteelSupplierRate[];
  bestSupplier: string;
  massKg: number;
  massTonne: number;
  sans1200: string;
  buildAidRef: string;
  notes: string;
  isCustom: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Steel Catalogue — BuildAid 2025/2026 + Live SA Supplier Reference Rates
// All prices = Gauteng base (ZAR, excl. VAT). Provincial freight adders apply.
// ─────────────────────────────────────────────────────────────────────────────
const STEEL_CATALOGUE: SteelItem[] = [

  // ── REINFORCING STEEL (SANS 920 / SABS 1024) ───────────────────────────
  {
    code: 'RE-Y08-12M', description: 'Reinforcing Bar Y8 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 4.74, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R001',
    basePrice: 72.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 72.00, available: true, note: 'Y8 wire rod — verify stock' },
      { supplier: 'ArcelorMittal SA', unitPrice: 73.50, available: true, note: 'Standard production item' },
      { supplier: 'BRC Reinforcing', unitPrice: 74.00, available: true },
    ],
  },
  {
    code: 'RE-Y10-12M', description: 'Reinforcing Bar Y10 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 7.40, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R002',
    basePrice: 115.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 112.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 115.00, available: true },
      { supplier: 'BRC Reinforcing', unitPrice: 116.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 113.50, available: true, note: 'Cut lengths available' },
    ],
  },
  {
    code: 'RE-Y12-12M', description: 'Reinforcing Bar Y12 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 10.65, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R003',
    basePrice: 165.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 162.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 165.00, available: true },
      { supplier: 'BRC Reinforcing', unitPrice: 164.50, available: true },
      { supplier: 'NJR Steel', unitPrice: 163.00, available: true },
    ],
  },
  {
    code: 'RE-Y16-12M', description: 'Reinforcing Bar Y16 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 18.96, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R004',
    basePrice: 285.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 278.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 285.00, available: true },
      { supplier: 'BRC Reinforcing', unitPrice: 282.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 280.00, available: true },
      { supplier: 'Macsteel', unitPrice: 281.00, available: true, note: 'Trade account required' },
    ],
  },
  {
    code: 'RE-Y20-12M', description: 'Reinforcing Bar Y20 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 29.63, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R005',
    basePrice: 425.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 415.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 425.00, available: true },
      { supplier: 'BRC Reinforcing', unitPrice: 420.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 418.00, available: true },
    ],
  },
  {
    code: 'RE-Y25-12M', description: 'Reinforcing Bar Y25 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 46.30, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R006',
    basePrice: 650.00,
    supplierRates: [
      { supplier: 'ArcelorMittal SA', unitPrice: 645.00, available: true },
      { supplier: 'Cape Gate', unitPrice: 650.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 648.00, available: true },
    ],
  },
  {
    code: 'RE-Y32-12M', description: 'Reinforcing Bar Y32 (High Yield 450MPa) — 12m length', category: 'reinforcing', unit: '12m bar', grade: '450MPa', massPerUnit: 75.84, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.87 §R007',
    basePrice: 1045.00,
    supplierRates: [
      { supplier: 'ArcelorMittal SA', unitPrice: 1035.00, available: true, note: 'Special order — 2 week lead' },
      { supplier: 'NJR Steel', unitPrice: 1048.00, available: true },
    ],
  },
  {
    code: 'RE-R8-6M', description: 'Mild Steel Bar R8 (Round Bar 250MPa) — 6m length', category: 'reinforcing', unit: '6m bar', grade: '450MPa', massPerUnit: 2.37, sans1200: 'SANS 1200 C', buildAidRef: 'BuildAid 2025 p.88 §R010',
    basePrice: 38.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 36.50, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 38.00, available: true },
    ],
  },

  // ── BRC MESH & WELDED WIRE FABRIC ─────────────────────────────────────
  {
    code: 'ME-REF188', description: 'BRC Mesh Ref 188 — 5.6mm bars @ 200mm c/c both ways (6×2.4m sheet)', category: 'mesh_wire', unit: '6x2.4m sheet', grade: '450MPa', massPerUnit: 37.80, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.89 §M001',
    basePrice: 485.00,
    supplierRates: [
      { supplier: 'BRC Reinforcing', unitPrice: 482.00, available: true, note: 'Primary manufacturer' },
      { supplier: 'Cape Gate', unitPrice: 485.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 488.00, available: true },
    ],
  },
  {
    code: 'ME-REF193', description: 'BRC Mesh Ref 193 — 7mm bars @ 200mm c/c both ways (6×2.4m sheet)', category: 'mesh_wire', unit: '6x2.4m sheet', grade: '450MPa', massPerUnit: 71.80, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.89 §M002',
    basePrice: 685.00,
    supplierRates: [
      { supplier: 'BRC Reinforcing', unitPrice: 678.00, available: true, note: 'Primary manufacturer' },
      { supplier: 'Cape Gate', unitPrice: 685.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 690.00, available: true },
      { supplier: 'Macsteel', unitPrice: 682.00, available: true, note: 'Trade account required' },
    ],
  },
  {
    code: 'ME-REF196', description: 'BRC Mesh Ref 196 — 8mm bars @ 200mm c/c both ways (6×2.4m sheet)', category: 'mesh_wire', unit: '6x2.4m sheet', grade: '450MPa', massPerUnit: 93.70, sans1200: 'SANS 1200 C / DB', buildAidRef: 'BuildAid 2025 p.89 §M003',
    basePrice: 850.00,
    supplierRates: [
      { supplier: 'BRC Reinforcing', unitPrice: 845.00, available: true },
      { supplier: 'Cape Gate', unitPrice: 850.00, available: true },
    ],
  },
  {
    code: 'ME-D8-200', description: 'BRC Mesh D8-200 — 8mm bars @ 200mm c/c (6×2.4m sheet)', category: 'mesh_wire', unit: '6x2.4m sheet', grade: '450MPa', massPerUnit: 93.70, sans1200: 'SANS 1200 DB', buildAidRef: 'BuildAid 2025 p.89 §M004',
    basePrice: 985.00,
    supplierRates: [
      { supplier: 'BRC Reinforcing', unitPrice: 978.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 988.00, available: true },
    ],
  },
  {
    code: 'ME-BIND', description: 'Binding Wire 1.6mm Annealed — 1000m roll (≈14kg)', category: 'mesh_wire', unit: '1000m roll', grade: '450MPa', massPerUnit: 14.0, sans1200: 'SANS 1200 C', buildAidRef: 'BuildAid 2025 p.90 §M010',
    basePrice: 285.00,
    supplierRates: [
      { supplier: 'Cape Gate', unitPrice: 278.00, available: true },
      { supplier: 'Bolt & Eng', unitPrice: 285.00, available: true },
    ],
  },

  // ── STRUCTURAL STEEL — UNIVERSAL BEAMS (UB) ────────────────────────────
  {
    code: 'SS-127UB13', description: 'Universal Beam 127×76×13 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 78.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.112 §SS001',
    basePrice: 1485.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1480.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1485.00, available: true, note: 'Trade account' },
      { supplier: 'Vanderbijlpark Steel', unitPrice: 1475.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 1490.00, available: true },
    ],
  },
  {
    code: 'SS-152UB23', description: 'Universal Beam 152×152×23 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 138.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.112 §SS002',
    basePrice: 2650.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2630.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2655.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 2645.00, available: true },
    ],
  },
  {
    code: 'SS-203UB25', description: 'Universal Beam 203×133×25 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 150.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.112 §SS003',
    basePrice: 2850.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2830.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2860.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 2840.00, available: true },
    ],
  },
  {
    code: 'SS-254UB37', description: 'Universal Beam 254×146×37 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 222.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.112 §SS004',
    basePrice: 4250.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 4220.00, available: true },
      { supplier: 'Macsteel', unitPrice: 4255.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 4240.00, available: true },
    ],
  },
  {
    code: 'SS-305UB40', description: 'Universal Beam 305×102×40 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 240.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.112 §SS005',
    basePrice: 4580.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 4550.00, available: true },
      { supplier: 'Macsteel', unitPrice: 4585.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 4565.00, available: true },
    ],
  },
  {
    code: 'SS-356UB67', description: 'Universal Beam 356×171×67 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S355', massPerUnit: 402.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.113 §SS006',
    basePrice: 7650.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 7600.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 7655.00, available: true, note: 'Mill order may apply' },
    ],
  },

  // ── STRUCTURAL STEEL — UNIVERSAL COLUMNS (UC) ─────────────────────────
  {
    code: 'SC-152UC23', description: 'Universal Column 152×152×23 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 138.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.114 §SC001',
    basePrice: 2640.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2620.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2645.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 2635.00, available: true },
    ],
  },
  {
    code: 'SC-203UC46', description: 'Universal Column 203×203×46 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 276.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.114 §SC002',
    basePrice: 5250.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 5220.00, available: true },
      { supplier: 'Macsteel', unitPrice: 5260.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 5240.00, available: true },
    ],
  },
  {
    code: 'SC-254UC73', description: 'Universal Column 254×254×73 kg/m — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 438.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.114 §SC003',
    basePrice: 8350.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 8300.00, available: true },
      { supplier: 'ArcelorMittal SA', unitPrice: 8360.00, available: true, note: 'Mill order may apply' },
    ],
  },

  // ── PARALLEL FLANGE CHANNEL (PFC / RSC) ───────────────────────────────
  {
    code: 'CH-100PFC', description: 'Channel 100×50×10 kg/m PFC — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 60.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.115 §CH001',
    basePrice: 1150.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1140.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1155.00, available: true, note: 'Trade account' },
      { supplier: 'JVR Steel', unitPrice: 1148.00, available: true },
    ],
  },
  {
    code: 'CH-150PFC', description: 'Channel 150×75×18 kg/m PFC — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 108.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.115 §CH002',
    basePrice: 2060.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2045.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2065.00, available: true, note: 'Trade account' },
    ],
  },
  {
    code: 'CH-200PFC', description: 'Channel 200×75×23 kg/m PFC — 6m length', category: 'structural_sections', unit: '6m length', grade: 'S275', massPerUnit: 138.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.115 §CH003',
    basePrice: 2640.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2620.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2645.00, available: true, note: 'Trade account' },
    ],
  },

  // ── HOLLOW SECTIONS ─────────────────────────────────────────────────────
  {
    code: 'SHS-50x50x3', description: 'Square Hollow Section 50×50×3mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 26.5, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.116 §HS001',
    basePrice: 510.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 505.00, available: true },
      { supplier: 'Macsteel', unitPrice: 512.00, available: true, note: 'Trade account' },
      { supplier: 'JVR Steel', unitPrice: 508.00, available: true },
    ],
  },
  {
    code: 'SHS-75x75x4', description: 'Square Hollow Section 75×75×4mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 57.5, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.116 §HS002',
    basePrice: 1100.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1090.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1105.00, available: true, note: 'Trade account' },
      { supplier: 'JVR Steel', unitPrice: 1095.00, available: true },
    ],
  },
  {
    code: 'RHS-100x50x4', description: 'Rectangular Hollow Section 100×50×4mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 55.8, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.116 §HS003',
    basePrice: 1068.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1060.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1070.00, available: true, note: 'Trade account' },
    ],
  },
  {
    code: 'RHS-150x75x5', description: 'Rectangular Hollow Section 150×75×5mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 116.8, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.116 §HS004',
    basePrice: 2235.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2215.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2240.00, available: true, note: 'Trade account' },
    ],
  },
  {
    code: 'CHS-48x4', description: 'Circular Hollow Section 48.3×4mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 30.7, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.117 §HS010',
    basePrice: 588.00,
    supplierRates: [
      { supplier: 'JVR Steel', unitPrice: 582.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 590.00, available: true },
    ],
  },
  {
    code: 'CHS-76x5', description: 'Circular Hollow Section 76.1×5mm — 6m length', category: 'hollow_sections', unit: '6m length', grade: 'S275', massPerUnit: 81.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.117 §HS011',
    basePrice: 1550.00,
    supplierRates: [
      { supplier: 'JVR Steel', unitPrice: 1540.00, available: true },
      { supplier: 'NJR Steel', unitPrice: 1555.00, available: true },
    ],
  },

  // ── EQUAL ANGLES ────────────────────────────────────────────────────────
  {
    code: 'EA-50x50x5', description: 'Equal Angle 50×50×5mm — 6m length', category: 'angles', unit: '6m length', grade: 'S275', massPerUnit: 22.2, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.118 §EA001',
    basePrice: 425.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 420.00, available: true },
      { supplier: 'Macsteel', unitPrice: 428.00, available: true, note: 'Trade account' },
      { supplier: 'Bolt & Eng', unitPrice: 430.00, available: true },
    ],
  },
  {
    code: 'EA-75x75x8', description: 'Equal Angle 75×75×8mm — 6m length', category: 'angles', unit: '6m length', grade: 'S275', massPerUnit: 54.3, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.118 §EA002',
    basePrice: 1040.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1030.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1045.00, available: true, note: 'Trade account' },
    ],
  },
  {
    code: 'EA-100x100x10', description: 'Equal Angle 100×100×10mm — 6m length', category: 'angles', unit: '6m length', grade: 'S275', massPerUnit: 88.8, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.118 §EA003',
    basePrice: 1700.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1685.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1705.00, available: true, note: 'Trade account' },
      { supplier: 'ArcelorMittal SA', unitPrice: 1692.00, available: true },
    ],
  },

  // ── FLAT PRODUCTS ─────────────────────────────────────────────────────
  {
    code: 'FP-PL6', description: 'Steel Plate 6mm thick — per m²', category: 'flat_products', unit: 'm²', grade: 'S275', massPerUnit: 47.1, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.120 §FP001',
    basePrice: 1350.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1340.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1355.00, available: true, note: 'Trade account' },
      { supplier: 'Vanderbijlpark Steel', unitPrice: 1345.00, available: true },
    ],
  },
  {
    code: 'FP-PL10', description: 'Steel Plate 10mm thick — per m²', category: 'flat_products', unit: 'm²', grade: 'S275', massPerUnit: 78.5, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.120 §FP002',
    basePrice: 2250.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 2235.00, available: true },
      { supplier: 'Macsteel', unitPrice: 2255.00, available: true, note: 'Trade account' },
      { supplier: 'Vanderbijlpark Steel', unitPrice: 2240.00, available: true },
    ],
  },
  {
    code: 'FP-PL20', description: 'Steel Plate 20mm thick — per m²', category: 'flat_products', unit: 'm²', grade: 'S355', massPerUnit: 157.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.120 §FP003',
    basePrice: 4480.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 4450.00, available: true },
      { supplier: 'Macsteel', unitPrice: 4490.00, available: true, note: 'Trade account. S355 premium' },
    ],
  },
  {
    code: 'FP-FLT50x6', description: 'Flat Bar 50×6mm — 6m length', category: 'flat_products', unit: '6m length', grade: 'S275', massPerUnit: 14.1, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.121 §FP010',
    basePrice: 270.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 268.00, available: true },
      { supplier: 'Bolt & Eng', unitPrice: 272.00, available: true },
    ],
  },
  {
    code: 'FP-CHK', description: 'Checkered Plate 5+1mm (6mm nom.) — per m²', category: 'flat_products', unit: 'm²', grade: 'S275', massPerUnit: 51.0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.121 §FP015',
    basePrice: 1460.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 1450.00, available: true },
      { supplier: 'Macsteel', unitPrice: 1465.00, available: true, note: 'Trade account' },
    ],
  },

  // ── ROOF & CLADDING STEEL ─────────────────────────────────────────────
  {
    code: 'RF-IBR047', description: 'IBR Roof Sheeting 0.47mm AZ150 — per linear metre (762mm cover)', category: 'roofing_cladding', unit: 'm', grade: 'Any', massPerUnit: 3.58, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.145 §RF001',
    basePrice: 92.00,
    supplierRates: [
      { supplier: 'Safintra Roofing', unitPrice: 89.00, available: true, note: 'AZ150 coating' },
      { supplier: 'Clotan Steel', unitPrice: 92.00, available: true },
      { supplier: 'Corrshine', unitPrice: 91.00, available: true },
    ],
  },
  {
    code: 'RF-IBR053', description: 'IBR Roof Sheeting 0.53mm AZ150 — per linear metre (762mm cover)', category: 'roofing_cladding', unit: 'm', grade: 'Any', massPerUnit: 4.04, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.145 §RF002',
    basePrice: 108.00,
    supplierRates: [
      { supplier: 'Safintra Roofing', unitPrice: 104.00, available: true, note: 'AZ150 coating' },
      { supplier: 'Clotan Steel', unitPrice: 108.00, available: true },
    ],
  },
  {
    code: 'RF-COR047', description: 'Corrugated Sheeting 0.47mm AZ150 — per linear metre (686mm cover)', category: 'roofing_cladding', unit: 'm', grade: 'Any', massPerUnit: 3.22, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.146 §RF003',
    basePrice: 82.00,
    supplierRates: [
      { supplier: 'Safintra Roofing', unitPrice: 80.00, available: true },
      { supplier: 'Corrshine', unitPrice: 82.00, available: true },
    ],
  },
  {
    code: 'RF-CHR053', description: 'Chromadek IBR 0.53mm White/Grey — per linear metre', category: 'roofing_cladding', unit: 'm', grade: 'Any', massPerUnit: 4.04, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.146 §RF004',
    basePrice: 125.00,
    supplierRates: [
      { supplier: 'Clotan Steel', unitPrice: 122.00, available: true, note: 'Chromadek® coated' },
      { supplier: 'Safintra Roofing', unitPrice: 125.00, available: true },
    ],
  },
  {
    code: 'RF-ZED', description: 'Z-Purlin 150×65×20×2.0mm Z-section — 6m length', category: 'roofing_cladding', unit: '6m length', grade: 'S275', massPerUnit: 18.0, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.147 §RF010',
    basePrice: 345.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 340.00, available: true },
      { supplier: 'Macsteel', unitPrice: 348.00, available: true, note: 'Trade account' },
    ],
  },
  {
    code: 'RF-CEE', description: 'C-Purlin 150×65×20×2.0mm C-section — 6m length', category: 'roofing_cladding', unit: '6m length', grade: 'S275', massPerUnit: 16.8, sans1200: 'SANS 1200 G', buildAidRef: 'BuildAid 2025 p.147 §RF011',
    basePrice: 325.00,
    supplierRates: [
      { supplier: 'NJR Steel', unitPrice: 320.00, available: true },
      { supplier: 'Macsteel', unitPrice: 328.00, available: true, note: 'Trade account' },
    ],
  },

  // ── FASTENERS & ACCESSORIES ────────────────────────────────────────────
  {
    code: 'FA-HTB-M16', description: 'High Tensile Bolt M16×75 Grade 8.8 + Nut + Washer', category: 'fasteners_accessories', unit: 'each', grade: 'Any', massPerUnit: 0.15, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.130 §FA001',
    basePrice: 18.50,
    supplierRates: [
      { supplier: 'Bolt & Eng', unitPrice: 17.80, available: true, note: 'Grade 8.8 HDG' },
      { supplier: 'Stewards & Lloyds', unitPrice: 18.50, available: true },
    ],
  },
  {
    code: 'FA-HTB-M20', description: 'High Tensile Bolt M20×75 Grade 8.8 + Nut + Washer', category: 'fasteners_accessories', unit: 'each', grade: 'Any', massPerUnit: 0.22, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.130 §FA002',
    basePrice: 28.00,
    supplierRates: [
      { supplier: 'Bolt & Eng', unitPrice: 26.80, available: true, note: 'Grade 8.8 HDG' },
      { supplier: 'Stewards & Lloyds', unitPrice: 28.00, available: true },
    ],
  },
  {
    code: 'FA-ANK-M16', description: 'Chemical Anchor M16 (resin cartridge + bar + nut)', category: 'fasteners_accessories', unit: 'each', grade: 'Any', massPerUnit: 0.25, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.131 §FA010',
    basePrice: 125.00,
    supplierRates: [
      { supplier: 'Bolt & Eng', unitPrice: 122.00, available: true },
      { supplier: 'Sika SA', unitPrice: 128.00, available: true, note: 'Sika AnchorFix® system' },
    ],
  },

  // ── FABRICATION ALLOWANCES ─────────────────────────────────────────────
  {
    code: 'FAB-WELD', description: 'Steel Fabrication — Welding and Assembly (per tonne fabricated)', category: 'fabrication', unit: 'tonne', grade: 'Any', massPerUnit: 1000, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.135 §FAB001',
    basePrice: 18500.00,
    supplierRates: [
      { supplier: 'SA Steel Mills', unitPrice: 18000.00, available: true, note: 'General fabrication' },
      { supplier: 'Aveng Trident Steel', unitPrice: 18500.00, available: true, note: 'Heavy structural' },
      { supplier: 'Vanderbijlpark Steel', unitPrice: 17500.00, available: true },
    ],
  },
  {
    code: 'FAB-GRIT', description: 'Grit Blasting SA2.5 Standard — per m² surface area', category: 'fabrication', unit: 'm²', grade: 'Any', massPerUnit: 0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.136 §FAB010',
    basePrice: 185.00,
    supplierRates: [
      { supplier: 'SA Steel Mills', unitPrice: 180.00, available: true },
      { supplier: 'Aveng Trident Steel', unitPrice: 185.00, available: true },
    ],
  },
  {
    code: 'FAB-ZPAINT', description: 'Zinc-Rich Epoxy Primer — per m² (2 coats, 75µm DFT)', category: 'fabrication', unit: 'm²', grade: 'Any', massPerUnit: 0, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.136 §FAB011',
    basePrice: 145.00,
    supplierRates: [
      { supplier: 'Dulux', unitPrice: 145.00, available: true, note: 'Dulux Dimefast' },
      { supplier: 'Plascon', unitPrice: 142.00, available: true, note: 'Plascon Zinq Guard' },
    ],
  },
  {
    code: 'FAB-HDG', description: 'Hot-Dip Galvanising — per tonne (min 85µm coating)', category: 'fabrication', unit: 'tonne', grade: 'Any', massPerUnit: 1000, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.137 §FAB015',
    basePrice: 9500.00,
    supplierRates: [
      { supplier: 'SA Steel Mills', unitPrice: 9200.00, available: true },
      { supplier: 'Aveng Trident Steel', unitPrice: 9500.00, available: true },
    ],
  },
  {
    code: 'FAB-ERECT', description: 'Structural Steel Erection — per tonne erected', category: 'fabrication', unit: 'tonne', grade: 'Any', massPerUnit: 1000, sans1200: 'SANS 1200 DF', buildAidRef: 'BuildAid 2025 p.138 §FAB020',
    basePrice: 12500.00,
    supplierRates: [
      { supplier: 'Aveng Trident Steel', unitPrice: 12000.00, available: true, note: 'Incl. cranes and rigging' },
      { supplier: 'SA Steel Mills', unitPrice: 12500.00, available: true },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Category config
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<SteelCategory, { label: string; colour: string; bg: string; icon: string }> = {
  reinforcing:           { label: 'Reinforcing Steel',       colour: 'text-orange-700', bg: 'bg-orange-50 border-orange-200',  icon: '🔩' },
  structural_sections:   { label: 'Structural Sections',     colour: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',      icon: '🏗️' },
  hollow_sections:       { label: 'Hollow Sections',         colour: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200',  icon: '⬜' },
  angles:                { label: 'Angles',                  colour: 'text-teal-700',   bg: 'bg-teal-50 border-teal-200',      icon: '📐' },
  flat_products:         { label: 'Flat Products & Plate',   colour: 'text-gray-700',   bg: 'bg-gray-50 border-gray-200',      icon: '▬' },
  roofing_cladding:      { label: 'Roofing & Cladding',      colour: 'text-emerald-700',bg: 'bg-emerald-50 border-emerald-200',icon: '🏠' },
  mesh_wire:             { label: 'Mesh & Wire',             colour: 'text-violet-700', bg: 'bg-violet-50 border-violet-200',  icon: '🕸️' },
  fasteners_accessories: { label: 'Fasteners & Accessories', colour: 'text-pink-700',   bg: 'bg-pink-50 border-pink-200',      icon: '🔧' },
  fabrication:           { label: 'Fabrication Allowances',  colour: 'text-red-700',    bg: 'bg-red-50 border-red-200',        icon: '⚙️' },
};

// Provincial freight adders (% above Gauteng base price)
const PROVINCIAL_FREIGHT: Record<string, number> = {
  'Gauteng': 0, 'Western Cape': 0.12, 'KwaZulu-Natal': 0.09, 'Eastern Cape': 0.14,
  'Limpopo': 0.08, 'Mpumalanga': 0.06, 'North West': 0.07, 'Free State': 0.06, 'Northern Cape': 0.18,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 10); }

function catalogToRow(item: SteelItem, qty = 1, province = 'Gauteng'): BoqRow {
  const freight = PROVINCIAL_FREIGHT[province] ?? 0;
  const bestRate = item.supplierRates.filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice)[0];
  const unitRate = bestRate ? bestRate.unitPrice * (1 + freight) : item.basePrice * (1 + freight);
  const totalEx = unitRate * qty;
  return {
    id: uid(),
    itemCode: item.code,
    description: item.description,
    category: item.category,
    unit: item.unit,
    grade: item.grade,
    quantity: qty,
    unitRate: Math.round(unitRate * 100) / 100,
    totalEx: Math.round(totalEx * 100) / 100,
    totalInc: Math.round(totalEx * 1.15 * 100) / 100,
    supplierRates: item.supplierRates.map(s => ({ ...s, unitPrice: Math.round(s.unitPrice * (1 + freight) * 100) / 100 })),
    bestSupplier: bestRate?.supplier ?? 'BuildAid Rate',
    massKg: item.massPerUnit * qty,
    massTonne: Math.round(item.massPerUnit * qty / 1000 * 1000) / 1000,
    sans1200: item.sans1200,
    buildAidRef: item.buildAidRef,
    notes: '',
    isCustom: false,
  };
}

function blankRow(): BoqRow {
  return { id: uid(), itemCode: '', description: '', category: 'reinforcing', unit: '12m bar', grade: 'S275', quantity: 1, unitRate: 0, totalEx: 0, totalInc: 0, supplierRates: [], bestSupplier: '', massKg: 0, massTonne: 0, sans1200: 'SANS 1200 DF', buildAidRef: '', notes: '', isCustom: true };
}

// Fuzzy match uploaded row → catalogue item
function matchToCatalogue(description: string): SteelItem | null {
  const desc = description.toLowerCase().trim();
  const scored = STEEL_CATALOGUE.map(item => {
    let score = 0;
    const catalogDesc = item.description.toLowerCase();
    if (item.code.toLowerCase() === desc) score += 200;
    const descTokens = desc.split(/[\s,×x\-_\/()]+/).filter(t => t.length >= 2);
    const catTokens = catalogDesc.split(/[\s,×x\-_\/()]+/).filter(t => t.length >= 2);
    descTokens.forEach(t => { if (catTokens.some(ct => ct === t || ct.includes(t) || t.includes(ct))) score += 15; });
    const dims = desc.match(/\d+/g) || [];
    dims.forEach(d => { if (catalogDesc.includes(d) && d.length >= 2) score += 10; });
    return { item, score };
  });
  const best = scored.sort((a, b) => b.score - a.score)[0];
  return best.score >= 25 ? best.item : null;
}

// Sample template generator
function generateSampleTemplate() {
  const wb = XLSX.utils.book_new();
  const rows = [
    ['Item Code', 'Description', 'Quantity', 'Unit', 'Notes'],
    ['RE-Y16-12M', 'Reinforcing Bar Y16 High Yield 450MPa 12m length', 450, '12m bar', 'Main slab reinforcing'],
    ['RE-Y12-12M', 'Reinforcing Bar Y12 High Yield 450MPa 12m length', 200, '12m bar', 'Secondary reinforcing'],
    ['RE-Y20-12M', 'Reinforcing Bar Y20 450MPa 12m length', 80, '12m bar', 'Column reinforcing'],
    ['ME-REF193', 'BRC Mesh Ref 193 7mm bars 200mm c/c 6x2.4m sheet', 45, '6x2.4m sheet', 'Floor slab mesh'],
    ['ME-REF188', 'BRC Mesh Ref 188 5.6mm bars 200mm c/c 6x2.4m sheet', 30, '6x2.4m sheet', 'Wall mesh'],
    ['ME-BIND', 'Binding Wire 1.6mm Annealed 1000m roll', 8, '1000m roll', 'Tying wire'],
    ['SS-254UB37', 'Universal Beam 254x146x37 kg/m 6m length', 18, '6m length', 'Roof beams'],
    ['SC-203UC46', 'Universal Column 203x203x46 kg/m 6m length', 12, '6m length', 'Main columns'],
    ['CH-150PFC', 'Channel 150x75x18 kg/m PFC 6m length', 24, '6m length', 'Secondary beams'],
    ['SHS-75x75x4', 'Square Hollow Section 75x75x4mm 6m length', 36, '6m length', 'Purlins/girts'],
    ['RHS-100x50x4', 'Rectangular Hollow Section 100x50x4mm 6m length', 24, '6m length', 'Window frames'],
    ['EA-50x50x5', 'Equal Angle 50x50x5mm 6m length', 48, '6m length', 'Bracing angles'],
    ['FP-PL10', 'Steel Plate 10mm thick per m2', 12, 'm²', 'Base plates'],
    ['FP-CHK', 'Checkered Plate 5+1mm 6mm nom per m2', 8, 'm²', 'Stair treads'],
    ['RF-IBR053', 'IBR Roof Sheeting 0.53mm AZ150 per linear metre', 450, 'm', 'Main roof'],
    ['RF-CHR053', 'Chromadek IBR 0.53mm White per linear metre', 85, 'm', 'Fascia cladding'],
    ['RF-ZED', 'Z-Purlin 150x65x20x2.0mm Z-section 6m length', 36, '6m length', 'Roof purlins'],
    ['RF-CEE', 'C-Purlin 150x65x20x2.0mm C-section 6m length', 24, '6m length', 'Wall girts'],
    ['FA-HTB-M20', 'High Tensile Bolt M20x75 Grade 8.8 nut washer', 250, 'each', 'Structural connections'],
    ['FA-HTB-M16', 'High Tensile Bolt M16x75 Grade 8.8 nut washer', 180, 'each', 'Secondary connections'],
    ['FA-ANK-M16', 'Chemical Anchor M16 resin cartridge bar nut', 48, 'each', 'Column base anchors'],
    ['FAB-WELD', 'Steel Fabrication Welding and Assembly per tonne fabricated', 22, 'tonne', 'Structural steelwork'],
    ['FAB-GRIT', 'Grit Blasting SA2.5 Standard per m2 surface area', 420, 'm²', 'Surface prep'],
    ['FAB-ZPAINT', 'Zinc-Rich Epoxy Primer 2 coats 75um DFT per m2', 420, 'm²', 'Priming'],
    ['FAB-HDG', 'Hot-Dip Galvanising per tonne min 85um coating', 8, 'tonne', 'Purlins and girts'],
    ['FAB-ERECT', 'Structural Steel Erection per tonne erected', 22, 'tonne', 'Incl cranes and rigging'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [{ wch: 15 }, { wch: 55 }, { wch: 12 }, { wch: 14 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Steel BOQ Data');
  return wb;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const GRADES: SteelGrade[] = ['S275', 'S355', '300W', '450MPa', 'Any'];
const UNITS: SteelUnit[] = ['tonne', 'kg', 'm', 'm²', 'each', '6m bar', '12m bar', '6m length', '6x2.4m sheet', '1000m roll'];
const PROVINCES = Object.keys(PROVINCIAL_FREIGHT);

const PROV_CODE_TO_NAME: Record<string, string> = {
  'GP': 'Gauteng', 'WC': 'Western Cape', 'KZN': 'KwaZulu-Natal', 'EC': 'Eastern Cape',
  'LP': 'Limpopo', 'MP': 'Mpumalanga', 'NW': 'North West', 'FS': 'Free State', 'NC': 'Northern Cape',
  'gauteng': 'Gauteng', 'western-cape': 'Western Cape', 'kwazulu-natal': 'KwaZulu-Natal',
  'eastern-cape': 'Eastern Cape', 'limpopo': 'Limpopo', 'mpumalanga': 'Mpumalanga',
  'north-west': 'North West', 'free-state': 'Free State', 'northern-cape': 'Northern Cape',
};

interface SteelBoqUploadProps {
  contractorData?: {
    company_name?: string; contact_person?: string; email?: string; id?: string;
    annual_turnover?: number; cidb_grade?: string; subscription_tier?: string;
    operating_provinces?: string[];
  };
}

export function SteelBoqUpload({ contractorData }: SteelBoqUploadProps) {
  const initProvince = (() => { const p = contractorData?.operating_provinces?.[0] || 'GP'; return PROV_CODE_TO_NAME[p] || 'Gauteng'; })();

  const [rows, setRows] = useState<BoqRow[]>([]);
  const [province, setProvince] = useState(initProvince);
  const [projectName, setProjectName] = useState('');
  const [projectRef, setProjectRef] = useState('');
  const [cidbGrading, setCidbGrading] = useState(contractorData?.cidb_grade || 'GB5');
  const [duration, setDuration] = useState('6');
  const [activeTab, setActiveTab] = useState<'upload' | 'catalogue' | 'boq' | 'future'>('upload');
  const [searchCat, setSearchCat] = useState('');
  const [filterCat, setFilterCat] = useState<SteelCategory | 'all'>('all');
  const [showPrices, setShowPrices] = useState(true);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showPricedView, setShowPricedView] = useState(false);

  // Upload state
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedRows, setUploadedRows] = useState<{
    description: string; qty: number; unit: string; code?: string; notes?: string;
    matched?: boolean; matchedItem?: SteelItem;
  }[]>([]);
  const [uploadProcessed, setUploadProcessed] = useState(false);

  // ── Derived stats ──────────────────────────────────────────────────────
  const totalEx = rows.reduce((s, r) => s + r.totalEx, 0);
  const totalVat = totalEx * 0.15;
  const totalInc = totalEx + totalVat;
  const totalMassTonne = rows.reduce((s, r) => s + r.massTonne, 0);
  const steelSupplierCount = new Set(STEEL_CATALOGUE.flatMap(i => i.supplierRates.map(s => s.supplier))).size;

  // ── Catalogue items ────────────────────────────────────────────────────
  const catalogFiltered = STEEL_CATALOGUE.filter(item => {
    if (filterCat !== 'all' && item.category !== filterCat) return false;
    if (searchCat && !item.description.toLowerCase().includes(searchCat.toLowerCase()) && !item.code.toLowerCase().includes(searchCat.toLowerCase())) return false;
    return true;
  });

  // ── Row mutations ──────────────────────────────────────────────────────
  const addFromCatalogue = (item: SteelItem) => {
    const r = catalogToRow(item, 1, province);
    setRows(prev => [...prev, r]);
    setActiveTab('boq');
    toast.success(`Added: ${item.description.split('—')[0].trim()}`);
  };

  const addBlank = () => setRows(prev => [...prev, blankRow()]);
  const removeRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const updateRow = useCallback((id: string, field: keyof BoqRow, value: any) => {
    setRows(prev => prev.map(r => {
      if (r.id !== id) return r;
      const updated = { ...r, [field]: value };
      if (field === 'quantity' || field === 'unitRate') {
        const qty = field === 'quantity' ? Number(value) : r.quantity;
        const rate = field === 'unitRate' ? Number(value) : r.unitRate;
        updated.totalEx = Math.round(qty * rate * 100) / 100;
        updated.totalInc = Math.round(updated.totalEx * 1.15 * 100) / 100;
      }
      return updated;
    }));
  }, []);

  // ── File upload handler ────────────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploadedFileName(file.name); setUploadProcessed(false);
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = new Uint8Array(ev.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: 'array' });
        const sheetName = wb.SheetNames.find(n => n.toLowerCase().includes('steel') || n.toLowerCase().includes('boq') || n.toLowerCase().includes('data')) || wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        const headerRow = json.findIndex(row => row.some((c: any) => { const v = String(c).toLowerCase(); return v.includes('description') || v.includes('item') || v.includes('qty') || v.includes('quantity'); }));
        const dataStart = headerRow >= 0 ? headerRow + 1 : 1;
        const headers = (json[headerRow] || []).map((h: any) => String(h).toLowerCase().trim());
        const descIdx = headers.findIndex((h: string) => h.includes('description') || h.includes('item desc') || h.includes('item name'));
        const qtyIdx = headers.findIndex((h: string) => h.includes('qty') || h.includes('quantity'));
        const unitIdx = headers.findIndex((h: string) => h.includes('unit'));
        const codeIdx = headers.findIndex((h: string) => h.includes('code') || h.includes('item code'));
        const notesIdx = headers.findIndex((h: string) => h.includes('note') || h.includes('remark'));
        const dIdx = descIdx >= 0 ? descIdx : 1;
        const qIdx = qtyIdx >= 0 ? qtyIdx : 2;
        const uIdx = unitIdx >= 0 ? unitIdx : 3;
        const cIdx = codeIdx >= 0 ? codeIdx : 0;
        const nIdx = notesIdx >= 0 ? notesIdx : 4;
        const parsed: typeof uploadedRows = [];
        for (let i = dataStart; i < json.length; i++) {
          const row = json[i];
          if (!row || row.every((c: any) => !c)) continue;
          const desc = String(row[dIdx] || '').trim();
          const qty = parseFloat(String(row[qIdx] || '1')) || 1;
          const unit = String(row[uIdx] || '').trim();
          const code = String(row[cIdx] || '').trim();
          const notes = String(row[nIdx] || '').trim();
          if (!desc) continue;
          let matchedItem: SteelItem | undefined;
          if (code) matchedItem = STEEL_CATALOGUE.find(item => item.code.toUpperCase() === code.toUpperCase()) || undefined;
          if (!matchedItem) matchedItem = matchToCatalogue(desc) || undefined;
          parsed.push({ description: desc, qty, unit, code, notes, matched: !!matchedItem, matchedItem });
        }
        setUploadedRows(parsed); setUploadProcessed(true);
        toast.success(`Parsed ${parsed.length} rows — ${parsed.filter(r => r.matched).length} auto-matched`);
      } catch (err) { toast.error('Could not parse file. Use the Qilly template.'); }
    };
    reader.readAsArrayBuffer(file); e.target.value = '';
  };

  const importUploadedRows = () => {
    const newRows: BoqRow[] = uploadedRows.map(ur => {
      if (ur.matchedItem) return catalogToRow(ur.matchedItem, ur.qty, province);
      const r = blankRow(); r.description = ur.description; r.quantity = ur.qty; r.unit = (ur.unit || '6m length') as any; r.notes = ur.notes || ''; return r;
    });
    setRows(prev => [...prev, ...newRows]); setActiveTab('boq');
    const matched = newRows.filter(r => !r.isCustom).length;
    toast.success(`Imported ${newRows.length} items — ${matched} auto-priced, ${newRows.length - matched} need manual rates`);
  };

  const downloadTemplate = () => { const wb = generateSampleTemplate(); XLSX.writeFile(wb, 'Qilly_Steel_BOQ_Template_Industrial_Shed.xlsx'); toast.success('Sample template downloaded'); };

  const priceBOQ = () => {
    if (rows.length === 0) { toast.error('Add items to BOQ first'); return; }
    setShowPricedView(true);
  };

  // Redirect to priced view check
  if (showPricedView && rows.length > 0) {
    return (
      <SteelPricedBillView
        rows={rows}
        projectSettings={{ projectName: projectName || `${contractorData?.company_name || 'Qilly'} — Steel BOQ`, projectRef: projectRef || `QST-${Date.now().toString().slice(-6)}`, province, cidbGrading, profitMargin: '15', duration }}
        contractorData={contractorData}
        onBack={() => setShowPricedView(false)}
      />
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-5">

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white rounded-2xl overflow-hidden">
        <div className="relative px-6 py-6">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold px-3 py-0.5 rounded-full uppercase tracking-wide">SANS 1200 DF · BuildAid 2025/2026</span>
              <span className="bg-green-500/20 border border-green-500/40 text-green-300 text-xs font-semibold px-3 py-0.5 rounded-full uppercase tracking-wide">ENTERPRISE FEATURE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1">Steel Construction BOQ Pricing Engine</h1>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed mb-4">
              Price complete steel construction bills of quantities using <strong className="text-white">{steelSupplierCount} dedicated steel suppliers</strong> (from Qilly's 159-supplier total network) — ArcelorMittal SA, NJR Steel, BRC Reinforcing, Cape Gate, Macsteel, Bolt & Eng, Safintra Roofing, SA Steel Mills, Aveng Trident Steel. <strong className="text-orange-300">Upload your own Excel BOQ</strong> or build from the catalogue.
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { n: `${STEEL_CATALOGUE.length}+`, l: 'Steel items', bg: 'bg-white/10' },
                { n: `${steelSupplierCount}`, l: 'Steel suppliers priced', bg: 'bg-orange-500/20' },
                { n: '159', l: 'Total supplier network', bg: 'bg-blue-500/20' },
                { n: '8', l: 'Product categories', bg: 'bg-green-500/20' },
                { n: 'Upload + Catalogue', l: 'Input methods', bg: 'bg-purple-500/20' },
              ].map(({ n, l, bg }) => (
                <div key={l} className={`${bg} backdrop-blur rounded-xl px-3 py-2 text-center`}>
                  <div className="text-base font-bold">{n}</div>
                  <div className="text-slate-400 text-xs">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Project Settings ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Building2 className="w-4 h-4 text-[#0077b6]" />
          <h3 className="font-bold text-gray-900 text-sm">Project Settings</h3>
          {contractorData?.company_name && <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{contractorData.company_name}</span>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Project Name</label>
            <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g. Boksburg Industrial Warehouse"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Project Reference</label>
            <input value={projectRef} onChange={e => setProjectRef(e.target.value)} placeholder="QST-2026-001"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Province (freight)</label>
            <select value={province} onChange={e => setProvince(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6] bg-white">
              {PROVINCES.map(p => <option key={p} value={p}>{p}{PROVINCIAL_FREIGHT[p] > 0 ? ` (+${(PROVINCIAL_FREIGHT[p]*100).toFixed(0)}%)` : ' (base)'}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">CIDB Grade</label>
            <input value={cidbGrading} onChange={e => setCidbGrading(e.target.value)} placeholder="GB5 CE"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5 block">Duration (months)</label>
            <input type="number" value={duration} onChange={e => setDuration(e.target.value)} min="1" max="60"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#0077b6]" />
          </div>
        </div>
        {contractorData && <p className="text-xs text-gray-400 mt-2">✓ Pre-filled from your contractor profile — adjust as needed per project.</p>}
      </div>

      {/* ── Tab Nav ──────────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-100">
          {[
            { key: 'upload', label: 'Upload BOQ Excel', icon: <Upload className="w-4 h-4" />, badge: 'NEW' },
            { key: 'catalogue', label: `Steel Catalogue (${STEEL_CATALOGUE.length})`, icon: <Package className="w-4 h-4" />, badge: null },
            { key: 'boq', label: `BOQ Table (${rows.length})`, icon: <FileSpreadsheet className="w-4 h-4" />, badge: null },
            { key: 'future', label: "Steel Vision", icon: <TrendingUp className="w-4 h-4" />, badge: null },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${activeTab === t.key ? 'border-[#0077b6] text-[#0077b6] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'}`}>
              {t.icon}{t.label}
              {t.badge && <span className="ml-1 text-[10px] bg-orange-100 text-orange-700 font-bold px-1.5 py-0.5 rounded-full">{t.badge}</span>}
            </button>
          ))}
        </div>

        {/* ── UPLOAD TAB ────────────────────────────────────────────────── */}
        {activeTab === 'upload' && (
          <div className="p-5 space-y-5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#0077b6] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">Download the Sample Steel BOQ Template</p>
                  <p className="text-sm text-gray-600 mb-3">Pre-filled with 26 items for a typical industrial warehouse — reinforcing, BRC mesh, structural beams/columns, hollow sections, IBR roofing, Z/C purlins, fasteners, and fabrication. Use it to test or as a starting point.</p>
                  <button onClick={downloadTemplate} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <FileDown className="w-4 h-4" /> Download Sample Template (Industrial Shed BOQ .xlsx)
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="bg-[#0077b6] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">Upload Your Steel BOQ (Excel / CSV)</p>
                  <p className="text-sm text-gray-600 mb-3">Any Excel/CSV with columns: <strong>Description, Quantity, Unit</strong>. Qilly auto-matches each row to the steel catalogue using keyword matching. Item Code and Notes are optional.</p>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} className="hidden" />
                  <button onClick={() => fileRef.current?.click()} className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#005f8e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    <Upload className="w-4 h-4" /> {uploadedFileName ? `Re-upload (${uploadedFileName})` : 'Choose File to Upload'}
                  </button>
                  {uploadedFileName && <p className="text-xs text-gray-500 mt-1.5">📎 {uploadedFileName}</p>}
                </div>
              </div>
            </div>
            {uploadProcessed && uploadedRows.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <div className="flex items-start gap-4">
                  <div className="bg-[#0077b6] text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <p className="font-bold text-gray-900">Review Auto-Matched Items</p>
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">✓ {uploadedRows.filter(r => r.matched).length} matched</span>
                      <span className="text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">⚠ {uploadedRows.filter(r => !r.matched).length} unmatched</span>
                    </div>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 mb-3">
                      <table className="w-full text-xs">
                        <thead><tr className="bg-slate-700 text-white">
                          <th className="px-3 py-2 text-left">#</th>
                          <th className="px-3 py-2 text-left min-w-[180px]">Uploaded Description</th>
                          <th className="px-3 py-2 text-right">Qty</th>
                          <th className="px-3 py-2 text-left">Unit</th>
                          <th className="px-3 py-2 text-center">Status</th>
                          <th className="px-3 py-2 text-left">Matched Item</th>
                          <th className="px-3 py-2 text-right">Best Rate</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                          {uploadedRows.map((ur, i) => {
                            const freight = PROVINCIAL_FREIGHT[province] ?? 0;
                            const best = ur.matchedItem?.supplierRates.filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice)[0];
                            const rate = best ? best.unitPrice * (1 + freight) : null;
                            return (
                              <tr key={i} className={ur.matched ? 'hover:bg-gray-50' : 'bg-amber-50 hover:bg-amber-100'}>
                                <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                                <td className="px-3 py-2 font-medium text-gray-800">{ur.description}</td>
                                <td className="px-3 py-2 text-right">{ur.qty}</td>
                                <td className="px-3 py-2 text-gray-500">{ur.unit || '—'}</td>
                                <td className="px-3 py-2 text-center">{ur.matched ? <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">✓ AUTO-PRICED</span> : <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">⚠ ENTER RATE</span>}</td>
                                <td className="px-3 py-2 text-[10px] text-gray-600">{ur.matchedItem ? `${ur.matchedItem.code} — ${ur.matchedItem.description.split('—')[0].trim()}` : <em className="text-amber-600">No match — R0 rate, enter manually</em>}</td>
                                <td className="px-3 py-2 text-right font-semibold text-green-700">{rate ? `R ${rate.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '—'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <button onClick={importUploadedRows} className="flex items-center gap-2 bg-[#0077b6] hover:bg-[#005f8e] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors">
                        <Play className="w-4 h-4" /> Import {uploadedRows.length} Items → BOQ Table
                      </button>
                      <p className="text-xs text-gray-500">Unmatched items import with R0 — enter rates in the BOQ Table tab.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── CATALOGUE TAB ─────────────────────────────────────────────── */}
        {activeTab === 'catalogue' && (
          <div className="p-4 space-y-4">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input value={searchCat} onChange={e => setSearchCat(e.target.value)} placeholder="Search steel items..." className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0077b6]" />
              </div>
              <select value={filterCat} onChange={e => setFilterCat(e.target.value as any)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#0077b6]">
                <option value="all">All Categories</option>
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
              <button onClick={() => setShowPrices(!showPrices)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:border-gray-400 flex items-center gap-1.5 whitespace-nowrap">
                <Settings className="w-3.5 h-3.5" /> {showPrices ? 'Hide' : 'Show'} prices
              </button>
            </div>
            <p className="text-xs text-gray-500">Showing {catalogFiltered.length} items. Click <strong>Add</strong> to include. Prices = {province} (excl. VAT, incl. freight).</p>

            <div className="space-y-2">
              {Object.entries(CATEGORY_CONFIG).map(([catKey, catCfg]) => {
                const items = catalogFiltered.filter(i => i.category === catKey);
                if (items.length === 0) return null;
                return (
                  <div key={catKey} className={`rounded-xl border overflow-hidden ${catCfg.bg}`}>
                    <div className="px-4 py-2.5 flex items-center gap-2">
                      <span className="text-base">{catCfg.icon}</span>
                      <span className={`font-bold text-sm ${catCfg.colour}`}>{catCfg.label}</span>
                      <span className="ml-auto text-xs text-gray-500">{items.length} items</span>
                    </div>
                    <div className="bg-white divide-y divide-gray-50">
                      {items.map(item => (
                        <div key={item.code} className="px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-mono text-gray-400">{item.code}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${catCfg.bg} ${catCfg.colour}`}>{item.grade}</span>
                              <span className="text-xs text-gray-400">{item.sans1200}</span>
                            </div>
                            <p className="text-sm text-gray-800 leading-tight mt-0.5">{item.description}</p>
                            {showPrices && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">Best: R{(Math.min(...item.supplierRates.filter(s => s.available).map(s => s.unitPrice)) * (1 + (PROVINCIAL_FREIGHT[province] ?? 0))).toLocaleString('en-ZA', { minimumFractionDigits: 2 })} / {item.unit}</span>
                                <span className="text-xs text-gray-500">BuildAid: R{(item.basePrice * (1 + (PROVINCIAL_FREIGHT[province] ?? 0))).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                                {item.massPerUnit > 0 && <span className="text-xs text-gray-400">{item.massPerUnit}kg/{item.unit}</span>}
                              </div>
                            )}
                          </div>
                          <button onClick={() => addFromCatalogue(item)}
                            className="shrink-0 bg-[#0077b6] hover:bg-[#005f8e] text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                            <Plus className="w-3.5 h-3.5" /> Add to BOQ
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BOQ TABLE TAB ────────────────────────────────────────────── */}
        {activeTab === 'boq' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-gray-900">{projectName || 'Steel BOQ'}</h3>
              {projectRef && <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{projectRef}</span>}
              <span className="text-xs text-gray-500 ml-auto">{province} pricing {PROVINCIAL_FREIGHT[province] > 0 ? `(+${(PROVINCIAL_FREIGHT[province]*100).toFixed(0)}% freight)` : '(Gauteng base)'}</span>
              <button onClick={addBlank} className="flex items-center gap-1.5 border border-dashed border-gray-300 hover:border-[#0077b6] text-gray-600 hover:text-[#0077b6] px-3 py-1.5 rounded-lg text-sm transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add custom row
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium text-gray-500 mb-1">No steel items added yet</p>
                <p className="text-sm text-gray-400 mb-4">Upload a BOQ Excel or browse the Steel Catalogue to get started</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  <button onClick={() => setActiveTab('upload')} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2"><Upload className="w-4 h-4" /> Upload BOQ</button>
                  <button onClick={() => setActiveTab('catalogue')} className="bg-[#0077b6] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#005f8e] transition-colors flex items-center gap-2"><Package className="w-4 h-4" /> Browse Catalogue</button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800 text-white text-xs">
                      <th className="px-3 py-2.5 text-left font-semibold w-8">#</th>
                      <th className="px-3 py-2.5 text-left font-semibold min-w-[300px]">Description</th>
                      <th className="px-3 py-2.5 text-left font-semibold">Category</th>
                      <th className="px-3 py-2.5 text-left font-semibold">Grade</th>
                      <th className="px-3 py-2.5 text-left font-semibold">Unit</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Rate (excl.)</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Total (excl.)</th>
                      <th className="px-3 py-2.5 text-right font-semibold">VAT</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Total (incl.)</th>
                      <th className="px-3 py-2.5 text-right font-semibold">Mass (t)</th>
                      <th className="px-3 py-2.5 text-center font-semibold w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row, idx) => {
                      const catCfg = CATEGORY_CONFIG[row.category];
                      const isExpanded = expandedRow === row.id;
                      return (
                        <>
                          <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-2 text-gray-400 text-xs">{idx + 1}</td>
                            <td className="px-3 py-2">
                              {row.isCustom ? (
                                <input value={row.description} onChange={e => updateRow(row.id, 'description', e.target.value)}
                                  className="w-full border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#0077b6]" placeholder="Description..." />
                              ) : (
                                <div>
                                  <button onClick={() => setExpandedRow(isExpanded ? null : row.id)} className="text-left w-full">
                                    <p className="text-xs text-gray-800 leading-tight hover:text-[#0077b6] transition-colors">{row.description}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-[10px] text-gray-400 font-mono">{row.itemCode}</span>
                                      <span className="text-[10px] text-gray-400">{row.sans1200}</span>
                                      {row.bestSupplier && <span className="text-[10px] text-green-600 font-medium">✓ {row.bestSupplier}</span>}
                                      {isExpanded ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                                    </div>
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.isCustom ? (
                                <select value={row.category} onChange={e => updateRow(row.id, 'category', e.target.value as SteelCategory)} className="border border-gray-200 rounded px-1.5 py-1 text-xs bg-white focus:outline-none">
                                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                </select>
                              ) : (
                                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catCfg?.bg || ''} ${catCfg?.colour || ''}`}>{catCfg?.icon} {catCfg?.label}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.isCustom ? (
                                <select value={row.grade} onChange={e => updateRow(row.id, 'grade', e.target.value as SteelGrade)} className="border border-gray-200 rounded px-1.5 py-1 text-xs bg-white focus:outline-none">
                                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                              ) : (
                                <span className="text-xs text-gray-600 font-mono">{row.grade}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.isCustom ? (
                                <select value={row.unit} onChange={e => updateRow(row.id, 'unit', e.target.value as SteelUnit)} className="border border-gray-200 rounded px-1.5 py-1 text-xs bg-white focus:outline-none">
                                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                </select>
                              ) : (
                                <span className="text-xs text-gray-600">{row.unit}</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="0.01" value={row.quantity}
                                onChange={e => updateRow(row.id, 'quantity', parseFloat(e.target.value) || 0)}
                                className="w-20 text-right border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#0077b6]" />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" min="0" step="0.01" value={row.unitRate}
                                onChange={e => updateRow(row.id, 'unitRate', parseFloat(e.target.value) || 0)}
                                className="w-28 text-right border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:border-[#0077b6]" />
                            </td>
                            <td className="px-3 py-2 text-right text-xs font-medium text-gray-700">R {row.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">R {(row.totalEx * 0.15).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2 text-right text-xs font-bold text-[#0077b6]">R {row.totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                            <td className="px-3 py-2 text-right text-xs text-gray-500">{row.massTonne.toFixed(3)}t</td>
                            <td className="px-3 py-2 text-center">
                              <button onClick={() => removeRow(row.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                          {isExpanded && !row.isCustom && (
                            <tr key={`${row.id}-exp`} className="bg-slate-50">
                              <td colSpan={12} className="px-4 py-3">
                                <div className="space-y-2">
                                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Supplier Price Comparison ({province})</p>
                                  <div className="flex flex-wrap gap-2">
                                    {row.supplierRates.filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice).map((s, i) => (
                                      <div key={s.supplier} className={`rounded-lg border px-3 py-2 ${i === 0 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                        <p className={`text-xs font-bold ${i === 0 ? 'text-green-700' : 'text-gray-700'}`}>{i === 0 ? '✓ Best' : `#${i + 1}`} {s.supplier}</p>
                                        <p className="text-sm font-bold text-gray-900">R {s.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} / {row.unit}</p>
                                        {s.note && <p className="text-[10px] text-gray-500 italic">{s.note}</p>}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex gap-4 text-xs text-gray-500">
                                    <span><strong>SANS 1200:</strong> {row.sans1200}</span>
                                    <span><strong>BuildAid Ref:</strong> {row.buildAidRef}</span>
                                    <span><strong>Mass:</strong> {row.massKg.toFixed(1)} kg ({row.massTonne.toFixed(3)} t)</span>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-slate-800 text-white">
                    <tr>
                      <td colSpan={7} className="px-3 py-2.5 text-sm font-bold">TOTALS — {rows.length} items · {totalMassTonne.toFixed(2)} tonnes steel</td>
                      <td className="px-3 py-2.5 text-right text-sm font-bold">R {totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2.5 text-right text-sm">R {totalVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2.5 text-right text-sm font-bold text-[#00b4d8]">R {totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</td>
                      <td className="px-3 py-2.5 text-right text-sm">{totalMassTonne.toFixed(2)}t</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {rows.length > 0 && (
              <>
                <div className="bg-gradient-to-r from-slate-900 to-[#0077b6] rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="font-bold text-white">Ready to generate the full Priced Steel BOQ?</p>
                    <p className="text-slate-300 text-xs mt-0.5">{rows.length} items · {totalMassTonne.toFixed(2)} tonnes · includes supplier comparison, inflation projections, compliance costs, collusion detection, carbon tracking, Excel + PDF export</p>
                  </div>
                  <button onClick={priceBOQ} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold transition-colors">
                    <Play className="w-5 h-5" /> Price Steel BOQ
                  </button>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed"><strong>Disclaimer:</strong> Rates are BuildAid 2025/2026 and published supplier data. Steel prices change quarterly. Confirm with suppliers before tender submission. Macsteel and NJR Steel require trade accounts.</p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── FUTURE VISION TAB (placeholder so summary tab ref removed) */}
        {activeTab === 'summary_removed' && (
          <div className="p-5 space-y-5">
            {rows.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>Add items to see summary</p>
              </div>
            ) : (
              <>
                {/* Grand total card */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-5">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="text-slate-400 text-sm">{projectName || 'Steel BOQ'} · {projectRef || '—'} · {province}</p>
                      <p className="text-3xl font-bold mt-1">R {totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</p>
                      <p className="text-slate-400 text-sm mt-0.5">Total incl. VAT · {rows.length} line items · {totalMassTonne.toFixed(2)} tonnes</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Excl. VAT', value: `R ${totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` },
                        { label: 'VAT 15%', value: `R ${totalVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` },
                        { label: 'Steel mass', value: `${totalMassTonne.toFixed(2)} t` },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center bg-white/10 rounded-lg p-2">
                          <p className="text-slate-400 text-xs">{label}</p>
                          <p className="font-bold text-sm">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Category breakdown */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Cost Breakdown by Category</h4>
                  <div className="space-y-2">
                    {Object.entries(CATEGORY_CONFIG).map(([catKey, catCfg]) => {
                      const catRows = rows.filter(r => r.category === catKey);
                      if (catRows.length === 0) return null;
                      const catTotal = catRows.reduce((s, r) => s + r.totalEx, 0);
                      const catMass = catRows.reduce((s, r) => s + r.massTonne, 0);
                      const pct = totalEx > 0 ? (catTotal / totalEx * 100) : 0;
                      return (
                        <div key={catKey} className="bg-gray-50 rounded-xl border border-gray-100 p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg">{catCfg.icon}</span>
                            <span className={`font-semibold text-sm ${catCfg.colour}`}>{catCfg.label}</span>
                            <span className="text-xs text-gray-400 ml-auto">{catRows.length} items · {catMass.toFixed(2)}t</span>
                            <span className="font-bold text-gray-900 text-sm w-32 text-right">R {catTotal.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8]" style={{ width: `${pct}%` }} />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{pct.toFixed(1)}% of total steel cost</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Steel intensity metric */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-bold text-blue-900 mb-3">Steel Intensity Metrics</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: 'Total steel mass', value: `${totalMassTonne.toFixed(2)} t` },
                      { label: 'Cost per tonne', value: totalMassTonne > 0 ? `R ${(totalEx / totalMassTonne).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` : 'N/A' },
                      { label: 'Total (excl. VAT)', value: `R ${totalEx.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` },
                      { label: 'Province', value: province },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-white rounded-lg border border-blue-100 p-3">
                        <p className="text-xs text-blue-600">{label}</p>
                        <p className="font-bold text-gray-900 mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button onClick={priceBOQ} className="w-full flex items-center justify-center gap-2 bg-[#0077b6] hover:bg-[#005f8e] text-white py-3 rounded-xl font-semibold transition-colors">
                  <Play className="w-5 h-5" /> Generate Full Priced Steel BOQ (Excel + PDF)
                </button>
              </>
            )}
          </div>
        )}

        {/* ── FUTURE VISION TAB ─────────────────────────────────────────── */}
        {activeTab === 'future' && (
          <div className="p-5 space-y-5">
            <div className="bg-gradient-to-br from-slate-900 to-[#0077b6] text-white rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-300" />
                <span className="text-yellow-200 text-xs font-semibold uppercase tracking-wide">Qilly's Steel + Construction Vision</span>
              </div>
              <h2 className="text-xl font-bold mb-2">Building for Today's Projects. Ready for Tomorrow's Challenges.</h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Qilly is South Africa's first AI-augmented construction cost intelligence platform. The steel pricing engine — covering <strong className="text-white">{steelSupplierCount} dedicated steel suppliers</strong> (from 159 total in Qilly's network) and {STEEL_CATALOGUE.length}+ items — is the foundation for every future steel feature.
              </p>
            </div>

            {/* Current capabilities */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-600" /> What Qilly Does Today</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Steel BOQ Pricing Engine', desc: 'Price complete steel BOQs: reinforcing, structural sections, hollow sections, mesh, roofing steel, fasteners, and fabrication — sourced from 9 SA steel suppliers vs BuildAid 2025/2026.', tag: 'LIVE', colour: 'bg-green-50 border-green-200 text-green-800' },
                  { title: '159-Supplier Pricing Network', desc: 'Cross-category pricing from 159 SA suppliers across all 9 provinces — Building Materials, Civil, Electrical, Plumbing, HVAC, Fire, Glass, Masonry, Scaffolding.', tag: 'LIVE', colour: 'bg-green-50 border-green-200 text-green-800' },
                  { title: 'SANS 1200 Compliance', desc: 'Every BOQ item mapped to the correct SANS 1200 specification section — A through Q — with CIDB contractor grade flags for Grades 1–9.', tag: 'LIVE', colour: 'bg-green-50 border-green-200 text-green-800' },
                  { title: 'Provincial Price Intelligence', desc: 'Automatic freight-adjusted pricing across all 9 provinces. Cape Town prices are 12% above Gauteng base; Northern Cape 18% — Qilly accounts for this automatically.', tag: 'LIVE', colour: 'bg-green-50 border-green-200 text-green-800' },
                  { title: 'BuildAid 2025/2026 Integration', desc: 'Licensed SA construction industry rate book integrated as the primary pricing baseline. All Qilly BOQs are BuildAid-calibrated.', tag: 'LIVE', colour: 'bg-green-50 border-green-200 text-green-800' },
                  { title: 'Collusion Detection (ENTERPRISE)', desc: 'Statistical analysis flags abnormally consistent supplier pricing patterns — supporting Competition Act compliance on government and eTender projects.', tag: 'ENTERPRISE', colour: 'bg-blue-50 border-blue-200 text-blue-800' },
                ].map(({ title, desc, tag, colour }) => (
                  <div key={title} className={`rounded-xl border p-4 ${colour.split(' ').slice(0, 2).join(' ')}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-bold text-sm text-gray-900">{title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colour}`}>{tag}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roadmap */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#0077b6]" /> Product Roadmap — Future Steel Capabilities</h3>
              <div className="space-y-3">
                {[
                  {
                    phase: 'Q3 2026', title: 'Live ArcelorMittal SA Price Feed', desc: 'Direct REST API integration with ArcelorMittal SA (JSE: ACL) for live mill prices on structural sections, reinforcing bar, and flat products. Steel prices will update daily based on market conditions.', tags: ['REST API', 'JSE-listed', 'Steel'],
                    colour: 'border-blue-300 bg-blue-50',
                  },
                  {
                    phase: 'Q3 2026', title: 'Steel Quantity Take-Off from Drawings', desc: 'Upload a structural engineer\'s GA drawing (PDF/DWG) — Qilly AI extracts steel members, section sizes, lengths, and quantities automatically. Generates a complete reinforcing and structural steel schedule.', tags: ['AI', 'Drawing Upload', 'ENTERPRISE'],
                    colour: 'border-purple-300 bg-purple-50',
                  },
                  {
                    phase: 'Q4 2026', title: 'Steel Fabrication Cost Model', desc: 'Full fabrication pricing: shop drawings, plate cutting, welding hours, NDT testing, hot-dip galvanising, transport to site, erection. Models complexity factors (simple portal vs multi-storey moment frame).', tags: ['ENTERPRISE', 'Fabrication'],
                    colour: 'border-orange-300 bg-orange-50',
                  },
                  {
                    phase: 'Q1 2027', title: 'BIM/IFC Integration (Steel)', desc: 'Import Tekla Structures or Revit IFC files. Qilly reads the structural steel model, extracts section schedules by weight, and auto-prices the entire steel package — including connections, bolts, and surface treatment.', tags: ['BIM', 'IFC', 'Tekla', 'Revit', 'ENTERPRISE'],
                    colour: 'border-teal-300 bg-teal-50',
                  },
                  {
                    phase: 'Q1 2027', title: 'Carbon Footprint per kg Steel', desc: 'Each steel product includes an embodied carbon coefficient (kgCO₂e/kg) from the Inventory of Carbon and Energy (ICE) database. Green building BOQs include a carbon cost column for GBCSA Green Star certification documentation.', tags: ['Green Building', 'GBCSA', 'ENTERPRISE'],
                    colour: 'border-green-300 bg-green-50',
                  },
                  {
                    phase: 'Q2 2027', title: 'Scrap Steel & Recycled Content Tracking', desc: 'Track recycled content percentage per steel product (ArcelorMittal SA uses 40%+ scrap). Generate LEED/Green Star material credit documentation automatically.', tags: ['LEED', 'Green Star', 'Circular Economy'],
                    colour: 'border-emerald-300 bg-emerald-50',
                  },
                  {
                    phase: 'Q3 2027', title: 'Digital Twin Cost Intelligence', desc: 'Link your Qilly BOQ to a live project cost model. As steel prices change (AMSA quarterly price adjustments), Qilly re-prices the BOQ and flags budget impact — giving clients live project cost forecasting.', tags: ['Digital Twin', 'CUSTOM'],
                    colour: 'border-slate-300 bg-slate-50',
                  },
                ].map(({ phase, title, desc, tags, colour }) => (
                  <div key={title} className={`rounded-xl border-2 p-4 ${colour}`}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 text-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">{phase}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-sm text-gray-900">{title}</span>
                          {tags.map(t => (
                            <span key={t} className="text-[10px] font-semibold px-2 py-0.5 bg-white/70 border border-gray-200 text-gray-600 rounded-full">{t}</span>
                          ))}
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Supplier partnerships */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Building2 className="w-5 h-5 text-[#0077b6]" /> Steel Supplier Partnership Strategy</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-gray-500 font-semibold uppercase tracking-wide">Supplier</th>
                      <th className="text-left py-2 px-2 text-gray-500 font-semibold uppercase tracking-wide">Listing</th>
                      <th className="text-left py-2 px-2 text-gray-500 font-semibold uppercase tracking-wide">Integration</th>
                      <th className="text-left py-2 px-2 text-gray-500 font-semibold uppercase tracking-wide">Priority</th>
                      <th className="text-left py-2 px-2 text-gray-500 font-semibold uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: 'ArcelorMittal SA', listing: 'JSE: ACL', integration: 'REST API — mill price feed', priority: 'P1 — Q3 2026', status: 'DSA pending', statusBg: 'bg-amber-100 text-amber-700' },
                      { name: 'BRC Reinforcing', listing: 'Private SA', integration: 'REST API — mesh + bar pricing', priority: 'P1 — Q3 2026', status: 'DSA pending', statusBg: 'bg-amber-100 text-amber-700' },
                      { name: 'Cape Gate', listing: 'Private SA', integration: 'REST API — wire + reinforcing', priority: 'P1 — Q3 2026', status: 'DSA pending', statusBg: 'bg-amber-100 text-amber-700' },
                      { name: 'NJR Steel', listing: 'Private SA', integration: 'Scraping — public price list', priority: 'P1 — verify T&C', status: 'Verify first', statusBg: 'bg-gray-100 text-gray-600' },
                      { name: 'Macsteel', listing: 'Private (B2B)', integration: 'Manual — login gated', priority: 'P2 — Q4 2026 (DSA)', status: 'HIGH RISK', statusBg: 'bg-red-100 text-red-700' },
                      { name: 'Safintra Roofing', listing: 'ArcelorMittal Group', integration: 'Scraping — public pricing', priority: 'P1 — safe to proceed', status: 'Active', statusBg: 'bg-green-100 text-green-700' },
                      { name: 'Bolt & Eng', listing: 'Private SA', integration: 'Scraping — public catalogue', priority: 'P1 — safe to proceed', status: 'Active', statusBg: 'bg-green-100 text-green-700' },
                      { name: 'Vanderbijlpark Steel', listing: 'Private SA', integration: 'Scraping — verify T&C', priority: 'P2 — verify', status: 'Verify first', statusBg: 'bg-gray-100 text-gray-600' },
                    ].map(({ name, listing, integration, priority, status, statusBg }) => (
                      <tr key={name} className="hover:bg-gray-50">
                        <td className="py-2 px-2 font-medium text-gray-900">{name}</td>
                        <td className="py-2 px-2 text-gray-500">{listing}</td>
                        <td className="py-2 px-2 text-gray-600">{integration}</td>
                        <td className="py-2 px-2 text-gray-600">{priority}</td>
                        <td className="py-2 px-2"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBg}`}>{status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Why steel matters */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-amber-200 rounded-xl p-4">
              <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-600" /> Why Steel is Strategic for Qilly</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-800">
                {[
                  '🏗️ Steel is 15–40% of total project cost on commercial and industrial buildings — the single largest material cost line item',
                  '🔩 Every CIDB Grade 5–9 project includes a structural steel package — ENTERPRISE tier clients need this',
                  '📊 ArcelorMittal SA adjusts prices quarterly — live API pricing gives Qilly users a significant competitive advantage',
                  '🌍 Steel recycled content tracking supports GBCSA Green Star and LEED certification — ENTERPRISE green building feature',
                  '🏛️ Government infrastructure (DPWI, municipalities) requires detailed steel schedules per ASAQS and PROCSA standards',
                  '🔮 BIM integration via Tekla/Revit IFC is the future of QS — Qilly\'s steel engine is the foundation for this capability',
                ].map(item => (
                  <div key={item} className="bg-white/60 rounded-lg p-2.5 leading-relaxed">{item}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
