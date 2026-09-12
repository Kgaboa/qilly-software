/**
 * SteelPricedBillView.tsx
 * Full priced Steel BOQ output — mirrors RegionalPricedBillView feature set
 * Tier features: FREE=encrypted, PRO=live+Excel, ENTERPRISE=collusion+carbon+PDF+projections
 * Qilly (Pty) Ltd K2026156151 | BuildAid 2025/2026 | SANS 1200 DF
 */

import React, { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  FileSpreadsheet, FileText, ChevronDown, ChevronUp,
  Shield, AlertTriangle, TrendingUp, BarChart3,
  Lock, Package, Layers, Leaf, ArrowLeft,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';
import { getTierFeatures, type SubscriptionTier } from '@/utils/tierAccess';
import { CollusionDetection } from '@/app/components/CollusionDetection';
import { calculateAllComplianceCosts, applyProvincialAdjustments } from '@/utils/complianceCalculations';
import { UpgradePrompt } from '@/app/components/UpgradePrompt';

// ─────────────────────────────────────────────────────────────────────────────
// Types (re-exported from SteelBoqUpload shape)
// ─────────────────────────────────────────────────────────────────────────────
type SteelCategory =
  | 'reinforcing' | 'structural_sections' | 'hollow_sections'
  | 'angles' | 'flat_products' | 'roofing_cladding'
  | 'mesh_wire' | 'fasteners_accessories' | 'fabrication';

interface BoqRow {
  id: string;
  itemCode: string;
  description: string;
  category: SteelCategory;
  unit: string;
  grade: string;
  quantity: number;
  unitRate: number;
  totalEx: number;
  totalInc: number;
  supplierRates: { supplier: string; unitPrice: number; available: boolean; note?: string }[];
  bestSupplier: string;
  massKg: number;
  massTonne: number;
  sans1200: string;
  buildAidRef: string;
  notes: string;
  isCustom: boolean;
}

interface ProjectSettings {
  projectName: string;
  projectRef: string;
  province: string;
  municipality?: string;
  cidbGrading: string;
  profitMargin: string;
  duration: string;
  projectType?: string;
}

interface SteelPricedBillViewProps {
  rows: BoqRow[];
  projectSettings: ProjectSettings;
  contractorData?: {
    id?: string;
    email?: string;
    company_name?: string;
    contact_person?: string;
    annual_turnover?: number;
    cidb_grade?: string;
    subscription_tier?: string;
  };
  onBack: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Steel Carbon Intensity — ICE Database v3.0 (kgCO₂e per kg)
// ─────────────────────────────────────────────────────────────────────────────
const STEEL_CARBON: Record<SteelCategory, { factor: number; label: string }> = {
  reinforcing:           { factor: 1.46, label: 'Reinforcing bar (EAF 40% scrap)' },
  structural_sections:   { factor: 1.74, label: 'Structural sections (BOF)' },
  hollow_sections:       { factor: 1.95, label: 'Hollow sections (ERW)' },
  angles:                { factor: 1.74, label: 'Angles (BOF)' },
  flat_products:         { factor: 1.85, label: 'Flat plate/sheet (BOF)' },
  roofing_cladding:      { factor: 2.10, label: 'Galvanised/coated roofing sheet' },
  mesh_wire:             { factor: 1.46, label: 'Wire mesh (EAF)' },
  fasteners_accessories: { factor: 4.10, label: 'Fasteners (machined)' },
  fabrication:           { factor: 0.35, label: 'Fabrication energy (per kg)' },
};

const CAT_CFG: Record<SteelCategory, { label: string; bg: string; text: string; icon: string }> = {
  reinforcing:           { label: 'Reinforcing Steel',       bg: 'bg-orange-50',  text: 'text-orange-700', icon: '🔩' },
  structural_sections:   { label: 'Structural Sections',     bg: 'bg-blue-50',    text: 'text-blue-700',   icon: '🏗️' },
  hollow_sections:       { label: 'Hollow Sections',         bg: 'bg-indigo-50',  text: 'text-indigo-700', icon: '⬜' },
  angles:                { label: 'Angles',                  bg: 'bg-teal-50',    text: 'text-teal-700',   icon: '📐' },
  flat_products:         { label: 'Flat Products & Plate',   bg: 'bg-gray-50',    text: 'text-gray-700',   icon: '▬' },
  roofing_cladding:      { label: 'Roofing & Cladding',      bg: 'bg-emerald-50', text: 'text-emerald-700',icon: '🏠' },
  mesh_wire:             { label: 'Mesh & Wire',             bg: 'bg-violet-50',  text: 'text-violet-700', icon: '🕸️' },
  fasteners_accessories: { label: 'Fasteners & Accessories', bg: 'bg-pink-50',    text: 'text-pink-700',   icon: '🔧' },
  fabrication:           { label: 'Fabrication Allowances',  bg: 'bg-red-50',     text: 'text-red-700',    icon: '⚙️' },
};

const PROVINCIAL_FREIGHT: Record<string, number> = {
  'Gauteng': 0, 'Western Cape': 0.12, 'KwaZulu-Natal': 0.09, 'Eastern Cape': 0.14,
  'Limpopo': 0.08, 'Mpumalanga': 0.06, 'North West': 0.07, 'Free State': 0.06, 'Northern Cape': 0.18,
};

const PROV_CODES: Record<string, string> = {
  'Gauteng': 'GP', 'Western Cape': 'WC', 'KwaZulu-Natal': 'KZN', 'Eastern Cape': 'EC',
  'Limpopo': 'LP', 'Mpumalanga': 'MP', 'North West': 'NW', 'Free State': 'FS', 'Northern Cape': 'NC',
};

// ─────────────────────────────────────────────────────────────────────────────
// Export helpers
// ─────────────────────────────────────────────────────────────────────────────
function buildExcelWorkbook(rows: BoqRow[], ps: ProjectSettings, totals: any, contractorData?: any) {
  const wb = XLSX.utils.book_new();

  // ── Summary sheet ──────────────────────────────────────────
  const summaryData = [
    ['Qilly (Pty) Ltd — K2026156151', '', '', ''],
    ['STEEL CONSTRUCTION — PRICED BILL OF QUANTITIES', '', '', ''],
    ['', '', '', ''],
    ['Project Name:', ps.projectName || 'Untitled', 'Standard:', 'SANS 1200 DF / BuildAid 2025/2026'],
    ['Project Ref:', ps.projectRef || '—', 'Province:', ps.province],
    ['Contractor:', contractorData?.company_name || '—', 'CIDB Grade:', ps.cidbGrading],
    ['Date:', new Date().toLocaleDateString('en-ZA'), 'Municipality:', ps.municipality || '—'],
    ['', '', '', ''],
    ['FINANCIAL SUMMARY', '', '', ''],
    ['Total (excl. VAT):', `R ${totals.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['VAT @ 15%:', `R ${totals.totalVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['TOTAL (incl. VAT):', `R ${totals.totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['', '', '', ''],
    ['STEEL MASS', '', '', ''],
    ['Total Steel Mass:', `${totals.totalMassKg.toFixed(0)} kg`, '', ''],
    ['Total Steel Tonnes:', `${totals.totalMassTonne.toFixed(3)} t`, '', ''],
    ['Average Cost per Tonne:', totals.totalMassTonne > 0 ? `R ${(totals.totalEx / totals.totalMassTonne).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` : 'N/A', '', ''],
    ['', '', '', ''],
    ['INFLATION PROJECTIONS (7.5% p.a. CPI + steel premium)', '', '', ''],
    ['6-month projection (+3.75%):', `R ${(totals.totalEx * 1.0375).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['12-month projection (+7.5%):', `R ${(totals.totalEx * 1.075).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['18-month projection (+11.25%):', `R ${(totals.totalEx * 1.1125).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['24-month projection (+15%):', `R ${(totals.totalEx * 1.15).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, '', ''],
    ['', '', '', ''],
    ['PRICING SOURCES', '', '', ''],
    ['Primary:', 'BuildAid 2025/2026 Reference Rates', '', ''],
    ['Secondary:', 'ArcelorMittal SA · NJR Steel · BRC Reinforcing · Cape Gate · Macsteel · Bolt & Eng', '', ''],
    ['Provincial Freight:', `+${((PROVINCIAL_FREIGHT[ps.province] || 0) * 100).toFixed(0)}% applied to all items`, '', ''],
    ['', '', '', ''],
    ['DISCLAIMER', '', '', ''],
    ['These rates are estimates based on published market data. Confirm with suppliers before tender submission.', '', '', ''],
    ['Steel prices are volatile — AMSA adjusts prices quarterly. This BOQ is valid for 30 days from date above.', '', '', ''],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
  ws1['!cols'] = [{ wch: 35 }, { wch: 30 }, { wch: 20 }, { wch: 50 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Summary');

  // ── BOQ Detail sheet ────────────────────────────────────────
  const headers = ['#', 'Item Code', 'Description', 'Category', 'Grade', 'SANS 1200', 'BuildAid Ref', 'Unit', 'Quantity', 'Rate (excl VAT)', 'Total (excl VAT)', 'VAT 15%', 'Total (incl VAT)', 'Mass (kg)', 'Mass (t)', 'Best Supplier', 'Notes'];
  const dataRows = rows.map((r, i) => [
    i + 1, r.itemCode, r.description, CAT_CFG[r.category]?.label || r.category,
    r.grade, r.sans1200, r.buildAidRef, r.unit, r.quantity,
    r.unitRate, r.totalEx, r.totalEx * 0.15, r.totalInc,
    r.massKg, r.massTonne, r.bestSupplier, r.notes,
  ]);
  // Totals row
  dataRows.push(['', '', 'TOTALS', '', '', '', '', '', '', '', totals.totalEx, totals.totalVat, totals.totalInc, totals.totalMassKg, totals.totalMassTonne, '', '']);

  const ws2 = XLSX.utils.aoa_to_sheet([headers, ...dataRows]);
  ws2['!cols'] = [{ wch: 4 }, { wch: 14 }, { wch: 50 }, { wch: 20 }, { wch: 10 }, { wch: 16 }, { wch: 20 }, { wch: 14 }, { wch: 10 }, { wch: 16 }, { wch: 16 }, { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 10 }, { wch: 25 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws2, 'Steel BOQ');

  // ── Supplier Comparison sheet ───────────────────────────────
  const supplierHeaders = ['#', 'Description', 'Unit', 'Qty', 'Supplier 1 (Best)', 'Rate 1', 'Supplier 2', 'Rate 2', 'Supplier 3', 'Rate 3', 'Saving vs 2nd best'];
  const supplierRows = rows.filter(r => r.supplierRates.length >= 2).map((r, i) => {
    const sorted = [...r.supplierRates].filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice);
    const saving = sorted.length >= 2 ? (sorted[1].unitPrice - sorted[0].unitPrice) * r.quantity : 0;
    return [
      i + 1, r.description, r.unit, r.quantity,
      sorted[0]?.supplier || '', sorted[0]?.unitPrice || '',
      sorted[1]?.supplier || '', sorted[1]?.unitPrice || '',
      sorted[2]?.supplier || '', sorted[2]?.unitPrice || '',
      saving,
    ];
  });
  const ws3 = XLSX.utils.aoa_to_sheet([supplierHeaders, ...supplierRows]);
  ws3['!cols'] = [{ wch: 4 }, { wch: 40 }, { wch: 14 }, { wch: 8 }, { wch: 22 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 22 }, { wch: 14 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'Supplier Comparison');

  // ── Carbon tracking sheet ───────────────────────────────────
  const carbonHeaders = ['#', 'Description', 'Category', 'Mass (kg)', 'Carbon Factor (kgCO₂e/kg)', 'Total Carbon (kgCO₂e)', 'Total Carbon (tCO₂e)', 'Carbon Source'];
  const carbonRows = rows.filter(r => r.massKg > 0).map((r, i) => {
    const cfg = STEEL_CARBON[r.category];
    const totalCarbon = r.massKg * cfg.factor;
    return [i + 1, r.description, CAT_CFG[r.category]?.label, r.massKg, cfg.factor, totalCarbon, totalCarbon / 1000, cfg.label];
  });
  const totalCarbonKg = rows.reduce((s, r) => s + r.massKg * STEEL_CARBON[r.category].factor, 0);
  carbonRows.push(['', 'TOTALS', '', totals.totalMassKg, '', totalCarbonKg, totalCarbonKg / 1000, 'ICE Database v3.0']);
  const ws4 = XLSX.utils.aoa_to_sheet([carbonHeaders, ...carbonRows]);
  ws4['!cols'] = [{ wch: 4 }, { wch: 45 }, { wch: 22 }, { wch: 12 }, { wch: 22 }, { wch: 22 }, { wch: 18 }, { wch: 35 }];
  XLSX.utils.book_append_sheet(wb, ws4, 'Carbon Tracking');

  return wb;
}

function buildPDF(rows: BoqRow[], ps: ProjectSettings, totals: any, inflationRate: number, contractorData?: any, contractorTier: SubscriptionTier = 'free') {
  const isFreeTier = contractorTier === 'free';
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a3' });
  const pageW = doc.internal.pageSize.getWidth();
  const enc = (v: string | number) => isFreeTier ? '●●●●●●' : String(v);

  // Header
  doc.setFillColor(0, 55, 100);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18); doc.setFont('helvetica', 'bold');
  doc.text('QILLY (PTY) LTD — STEEL CONSTRUCTION PRICED BOQ', 14, 11);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('K2026156151 | BuildAid 2025/2026 | SANS 1200 DF | ' + (isFreeTier ? 'FREE TIER — TRAINING MODE' : contractorTier.toUpperCase() + ' TIER'), 14, 18);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-ZA')}   Province: ${ps.province}   CIDB: ${ps.cidbGrading}`, 14, 24);

  // Project info block
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8.5); doc.setFont('helvetica', 'bold');
  let y = 34;
  const info = [
    ['Project:', ps.projectName || 'Untitled', 'Ref:', ps.projectRef || '—'],
    ['Contractor:', contractorData?.company_name || '—', 'Contact:', contractorData?.contact_person || '—'],
    ['CIDB Grade:', ps.cidbGrading, 'Province:', ps.province + (PROVINCIAL_FREIGHT[ps.province] > 0 ? ` (+${(PROVINCIAL_FREIGHT[ps.province]*100).toFixed(0)}% freight)` : ' (base)')],
    ['Standard:', 'SANS 1200 DF — Structural Steelwork', 'Reference:', 'BuildAid 2025/2026'],
  ];
  doc.setFont('helvetica', 'normal');
  info.forEach(row => {
    doc.setFont('helvetica', 'bold'); doc.text(row[0], 14, y);
    doc.setFont('helvetica', 'normal'); doc.text(row[1], 42, y);
    doc.setFont('helvetica', 'bold'); doc.text(row[2], 140, y);
    doc.setFont('helvetica', 'normal'); doc.text(row[3], 165, y);
    y += 5;
  });
  y += 2;

  // Summary boxes
  const boxes = [
    { label: 'TOTAL (excl. VAT)', value: isFreeTier ? 'R ●●●●●●' : `R ${totals.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, colour: [0, 55, 100] as [number, number, number] },
    { label: 'VAT @ 15%', value: isFreeTier ? 'R ●●●●●●' : `R ${totals.totalVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, colour: [70, 70, 70] as [number, number, number] },
    { label: 'TOTAL (incl. VAT)', value: isFreeTier ? 'R ●●●●●●' : `R ${totals.totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, colour: [0, 100, 80] as [number, number, number] },
    { label: 'TOTAL STEEL MASS', value: `${totals.totalMassTonne.toFixed(2)} tonnes`, colour: [80, 50, 0] as [number, number, number] },
    { label: 'LINE ITEMS', value: String(rows.length), colour: [50, 50, 80] as [number, number, number] },
  ];
  const bw = 62, bh = 12;
  boxes.forEach((b, i) => {
    const bx = 14 + i * (bw + 3);
    doc.setFillColor(...b.colour);
    doc.roundedRect(bx, y, bw, bh, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(6.5); doc.setFont('helvetica', 'normal');
    doc.text(b.label, bx + 3, y + 4.5);
    doc.setFontSize(9); doc.setFont('helvetica', 'bold');
    doc.text(b.value, bx + 3, y + 10);
  });
  doc.setTextColor(30, 30, 30);
  y += bh + 6;

  // FREE TIER watermark
  if (isFreeTier) {
    doc.setTextColor(220, 50, 50);
    doc.setFontSize(60); doc.setFont('helvetica', 'bold');
    doc.text('TRAINING MODE', pageW / 2, 190, { align: 'center', angle: 35 });
    doc.setTextColor(30, 30, 30);
    doc.setFontSize(8);
  }

  // Main BOQ table
  const tableHeaders = ['#', 'Code', 'Description', 'Category', 'Grade', 'SANS', 'Unit', 'Qty', 'Rate (excl)', 'Total (excl)', 'VAT', 'Total (incl)', 'Mass (t)', 'Best Supplier'];
  const tableRows = rows.map((r, i) => [
    String(i + 1), r.itemCode,
    r.description.length > 48 ? r.description.substring(0, 48) + '…' : r.description,
    (CAT_CFG[r.category]?.icon || '') + ' ' + (CAT_CFG[r.category]?.label.split(' ').slice(0, 2).join(' ') || r.category),
    r.grade, r.sans1200, r.unit, String(r.quantity),
    isFreeTier ? '●●●' : `R ${r.unitRate.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    isFreeTier ? '●●●●●●' : `R ${r.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    isFreeTier ? '●●●' : `R ${(r.totalEx * 0.15).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    isFreeTier ? '●●●●●●' : `R ${r.totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
    r.massTonne.toFixed(3),
    r.bestSupplier || 'BuildAid',
  ]);

  autoTable(doc, {
    startY: y,
    head: [tableHeaders],
    body: tableRows,
    foot: [[
      '', '', `TOTALS (${rows.length} items)`, '', '', '', '', '',
      '', isFreeTier ? '●●●●●●' : `R ${totals.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
      isFreeTier ? '●●●' : `R ${totals.totalVat.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
      isFreeTier ? '●●●●●●' : `R ${totals.totalInc.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`,
      `${totals.totalMassTonne.toFixed(2)} t`, '',
    ]],
    headStyles: { fillColor: [15, 40, 80], textColor: 255, fontSize: 6.5, fontStyle: 'bold', halign: 'center' },
    bodyStyles: { fontSize: 6.5, cellPadding: 1.5 },
    footStyles: { fillColor: [15, 40, 80], textColor: 255, fontSize: 7, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 }, 1: { cellWidth: 20 }, 2: { cellWidth: 60 },
      3: { cellWidth: 28 }, 4: { cellWidth: 14 }, 5: { cellWidth: 20 },
      6: { cellWidth: 16 }, 7: { halign: 'right', cellWidth: 10 },
      8: { halign: 'right', cellWidth: 22 }, 9: { halign: 'right', cellWidth: 22 },
      10: { halign: 'right', cellWidth: 18 }, 11: { halign: 'right', cellWidth: 22 },
      12: { halign: 'right', cellWidth: 14 }, 13: { cellWidth: 28 },
    },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 8;

  // Inflation projection (PRO+)
  if (!isFreeTier) {
    if (y + 40 > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
    doc.setFontSize(9); doc.setFont('helvetica', 'bold'); doc.setTextColor(0, 55, 100);
    doc.text('STEEL PRICE INFLATION PROJECTIONS', 14, y);
    y += 5;
    const projRate = inflationRate / 100;
    const projData = [
      ['Period', 'Rate Assumption', 'Projected Total (excl. VAT)', 'Increase vs Today', 'Basis'],
      ['Today', '—', `R ${totals.totalEx.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 'Base', 'BuildAid 2025/2026'],
      ['6 months', `${(inflationRate * 0.5).toFixed(1)}%`, `R ${(totals.totalEx * (1 + projRate * 0.5)).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, `+R ${(totals.totalEx * projRate * 0.5).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 'AMSA quarterly adj.'],
      ['12 months', `${inflationRate.toFixed(1)}%`, `R ${(totals.totalEx * (1 + projRate)).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, `+R ${(totals.totalEx * projRate).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 'CPI + steel premium'],
      ['18 months', `${(inflationRate * 1.5).toFixed(1)}%`, `R ${(totals.totalEx * (1 + projRate * 1.5)).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, `+R ${(totals.totalEx * projRate * 1.5).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 'AMSA 2026 forecast'],
      ['24 months', `${(inflationRate * 2).toFixed(1)}%`, `R ${(totals.totalEx * (1 + projRate * 2)).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, `+R ${(totals.totalEx * projRate * 2).toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`, 'Long-range estimate'],
    ];
    autoTable(doc, { startY: y, head: [projData[0]], body: projData.slice(1), headStyles: { fillColor: [20, 80, 40] }, bodyStyles: { fontSize: 7 }, margin: { left: 14, right: 14 } });
    y = (doc as any).lastAutoTable.finalY + 8;
  }

  // Compliance note
  if (y + 20 > doc.internal.pageSize.getHeight() - 20) { doc.addPage(); y = 20; }
  doc.setFontSize(7.5); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 30, 30);
  doc.text('COMPLIANCE & LEGAL NOTE', 14, y);
  y += 4;
  doc.setFont('helvetica', 'normal'); doc.setFontSize(6.5);
  const notes = [
    `This BOQ was prepared using Qilly's automated pricing engine — BuildAid 2025/2026 as primary reference, verified against current market rates from ArcelorMittal SA, NJR Steel, BRC Reinforcing, Cape Gate, Macsteel, and Bolt & Engineering Distributors.`,
    `Steel prices are subject to quarterly revision by ArcelorMittal SA. This document is valid for 30 days from the date printed above. Re-pricing recommended before final tender submission.`,
    `Provincial freight adder applied: ${ps.province} = +${((PROVINCIAL_FREIGHT[ps.province] || 0) * 100).toFixed(0)}% above Gauteng base rates.`,
    `SANS 1200 DF (Structural Steelwork) applies to all structural steel items. SANS 920 / SABS 1024 applies to reinforcing steel. Fabrication per SANS 10162-1 and SANS 10162-2.`,
    `Qilly (Pty) Ltd K2026156151 | 210 Kirkness Avenue, Pierre van Ryneveld, 0157 | kgabo@qilly.co.za | +27 83 941 2655`,
  ];
  notes.forEach(n => { doc.text(n, 14, y, { maxWidth: pageW - 28 }); y += 5; });

  // Page numbers
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7); doc.setTextColor(150);
    doc.text(`Page ${i} of ${pageCount} | Qilly Steel BOQ | ${ps.projectRef || 'Draft'} | CONFIDENTIAL`, pageW / 2, doc.internal.pageSize.getHeight() - 6, { align: 'center' });
  }

  return doc;
}

// ─────────────────────────────────────────────────────────────────────────────
// Map BoqRow → RegionalPricedBillItem shape for CollusionDetection
// ─────────────────────────────────────────────────────────────────────────────
function mapToRegionalItem(r: BoqRow): any {
  const sorted = [...r.supplierRates].filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice);
  const quotes = r.supplierRates.filter(s => s.available).map(s => ({
    supplierName: s.supplier,
    pricePerUnit: s.unitPrice,
    totalCost: s.unitPrice * r.quantity,
    transportCost: 0,
    landedCost: s.unitPrice,
    distanceKm: 0,
    inStock: s.available,
    deliveryDays: 3,
  }));
  return {
    code: r.itemCode,
    name: r.description,
    description: r.description,
    quantity: String(r.quantity),
    unit: r.unit,
    supplierQuotes: quotes,
    selectedSupplier: r.bestSupplier,
    finalUnitPrice: String(r.unitRate),
    baseUnitPrice: String(r.unitRate),
    totalPrice: String(r.totalEx),
    transportCost: '0',
    transportCostPerUnit: '0',
    additionalFeesBreakdown: { profit: 0, overheads: 0, preliminaries: 0, contingency: 0, compliance: 0, total: 0 },
    optimizedSavings: sorted.length >= 2 ? String((sorted[1].unitPrice - sorted[0].unitPrice) * r.quantity) : '0',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────
export function SteelPricedBillView({ rows, projectSettings: ps, contractorData, onBack }: SteelPricedBillViewProps) {
  const [inflationRate, setInflationRate] = useState(10.5); // Steel-specific CPI + commodity premium
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [showCollusion, setShowCollusion] = useState(false);
  const [showCompliance, setShowCompliance] = useState(false);
  const [showCarbon, setShowCarbon] = useState(false);
  const [showInflation, setShowInflation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'boq' | 'suppliers' | 'summary'>('boq');

  const contractorTier: SubscriptionTier = ((contractorData?.subscription_tier || 'free') as SubscriptionTier);
  const tf = getTierFeatures(contractorTier);
  const isFreeTier = contractorTier === 'free';
  const isPro = contractorTier === 'professional' || contractorTier === 'enterprise' || contractorTier === 'custom';
  const isEnterprise = contractorTier === 'enterprise' || contractorTier === 'custom';

  // ── Totals ─────────────────────────────────────────────────
  const totals = useMemo(() => {
    const totalEx = rows.reduce((s, r) => s + r.totalEx, 0);
    const totalVat = totalEx * 0.15;
    const totalInc = totalEx + totalVat;
    const totalMassKg = rows.reduce((s, r) => s + r.massKg, 0);
    const totalMassTonne = rows.reduce((s, r) => s + r.massTonne, 0);
    const totalSavings = rows.reduce((r, s) => {
      const sorted = [...s.supplierRates].filter(q => q.available).sort((a, b) => a.unitPrice - b.unitPrice);
      return r + (sorted.length >= 2 ? (sorted[1].unitPrice - sorted[0].unitPrice) * s.quantity : 0);
    }, 0);
    const totalCarbonKg = rows.reduce((s, r) => s + r.massKg * STEEL_CARBON[r.category].factor, 0);
    return { totalEx, totalVat, totalInc, totalMassKg, totalMassTonne, totalSavings, totalCarbonKg };
  }, [rows]);

  // ── Compliance costs ────────────────────────────────────────
  const complianceCosts = useMemo(() => {
    if (!isPro || totals.totalEx === 0) return null;
    try {
      const provCode = PROV_CODES[ps.province] || 'GP';
      const base = calculateAllComplianceCosts({
        projectValue: totals.totalEx,
        province: provCode,
        projectDuration: parseInt(ps.duration || '6'),
        labourContent: 25, // steel is lower labour content
        projectType: 'commercial',
        contractorGrade: ps.cidbGrading || 'GB4',
        companyTurnover: contractorData?.annual_turnover || totals.totalEx * 4,
        houseType: 'Custom',
      });
      return applyProvincialAdjustments(base, provCode);
    } catch { return null; }
  }, [totals.totalEx, ps, isPro, contractorData]);

  // ── Category breakdown ─────────────────────────────────────
  const catBreakdown = useMemo(() => {
    const map: Partial<Record<SteelCategory, { total: number; mass: number; count: number }>> = {};
    rows.forEach(r => {
      if (!map[r.category]) map[r.category] = { total: 0, mass: 0, count: 0 };
      map[r.category]!.total += r.totalEx;
      map[r.category]!.mass += r.massTonne;
      map[r.category]!.count++;
    });
    return map;
  }, [rows]);

  // ── Format helpers ─────────────────────────────────────────
  const fmt = (v: number) => isFreeTier ? 'R ●●●●●●' : `R ${v.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}`;
  const fmtPct = (v: number) => isFreeTier ? '●●●%' : `${v.toFixed(1)}%`;

  // ── Export handlers ────────────────────────────────────────
  const handleExcelExport = useCallback(() => {
    if (!isPro) { toast.error('Excel export requires PROFESSIONAL tier or higher'); return; }
    setIsExporting(true);
    requestAnimationFrame(() => setTimeout(() => {
      try {
        const wb = buildExcelWorkbook(rows, ps, totals, contractorData);
        XLSX.writeFile(wb, `Qilly_Steel_PricedBOQ_${ps.projectRef || 'Project'}_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Steel Priced BOQ exported to Excel (4 sheets)');
      } catch (e) { toast.error('Export failed'); console.error(e); }
      finally { setIsExporting(false); }
    }, 50));
  }, [rows, ps, totals, contractorData, isPro]);

  const handlePDFExport = useCallback(() => {
    if (!isPro) { toast.error('PDF export requires PROFESSIONAL tier or higher'); return; }
    setIsExporting(true);
    requestAnimationFrame(() => setTimeout(() => {
      try {
        const doc = buildPDF(rows, ps, totals, inflationRate, contractorData, contractorTier);
        doc.save(`Qilly_Steel_PricedBOQ_${ps.projectRef || 'Project'}_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('Steel Priced BOQ PDF downloaded');
      } catch (e) { toast.error('PDF export failed'); console.error(e); }
      finally { setIsExporting(false); }
    }, 50));
  }, [rows, ps, totals, inflationRate, contractorData, contractorTier, isPro]);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedRows(next);
  };

  const mappedItems = useMemo(() => rows.map(mapToRegionalItem), [rows]);

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-900 text-white rounded-2xl overflow-hidden">
        <div className="px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <button onClick={onBack} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm">
                  <ArrowLeft className="w-4 h-4" /> Back to Steel BOQ
                </button>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-orange-500/20 border border-orange-500/40 text-orange-300 text-xs font-semibold px-3 py-0.5 rounded-full uppercase tracking-wide">SANS 1200 DF · BuildAid 2025/2026</span>
                {isFreeTier && <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold px-2 py-0.5 rounded-full">🔒 TRAINING MODE</span>}
                {isPro && !isEnterprise && <span className="bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">PROFESSIONAL</span>}
                {isEnterprise && <span className="bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold px-2 py-0.5 rounded-full">ENTERPRISE</span>}
              </div>
              <h1 className="text-2xl font-bold">{ps.projectName || 'Steel Construction BOQ'}</h1>
              <p className="text-slate-400 text-sm mt-0.5">{ps.projectRef || '—'} · {contractorData?.company_name || 'Qilly User'} · {ps.province} · CIDB {ps.cidbGrading}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isPro ? (
                <>
                  <button onClick={handleExcelExport} disabled={isExporting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                    <FileSpreadsheet className="w-4 h-4" /> Excel (4 sheets)
                  </button>
                  <button onClick={handlePDFExport} disabled={isExporting}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50">
                    <FileText className="w-4 h-4" /> PDF
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2 bg-white/10 border border-white/20 text-white/70 px-4 py-2 rounded-xl text-sm">
                  <Lock className="w-4 h-4" /> Excel/PDF — PRO+
                </div>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-3 mt-5">
            {[
              { label: 'Total (excl. VAT)', value: fmt(totals.totalEx), highlight: false },
              { label: 'VAT @ 15%', value: fmt(totals.totalVat), highlight: false },
              { label: 'TOTAL (incl. VAT)', value: fmt(totals.totalInc), highlight: true },
              { label: 'Steel Mass', value: `${totals.totalMassTonne.toFixed(2)} t`, highlight: false },
              { label: 'Best Supplier Savings', value: isFreeTier ? 'R ●●●●●●' : `R ${totals.totalSavings.toLocaleString('en-ZA', { minimumFractionDigits: 0 })}`, highlight: false },
              { label: 'Line Items', value: String(rows.length), highlight: false },
              { label: 'Carbon Estimate', value: isEnterprise ? `${(totals.totalCarbonKg / 1000).toFixed(2)} tCO₂e` : '— ENTERPRISE', highlight: false },
            ].map(({ label, value, highlight }) => (
              <div key={label} className={`rounded-xl px-4 py-2.5 text-center ${highlight ? 'bg-[#00b4d8]/20 border border-[#00b4d8]/40' : 'bg-white/10'}`}>
                <div className={`font-bold text-base ${highlight ? 'text-[#00b4d8]' : 'text-white'}`}>{value}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FREE tier upgrade prompt ─────────────────────────── */}
      {isFreeTier && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900 mb-1">Training Mode — Rates are encrypted</p>
            <p className="text-sm text-amber-800">Upgrade to <strong>PROFESSIONAL (R2,999/month)</strong> to see live steel prices, supplier comparison, Excel/PDF export, compliance costs, and inflation projections. <strong>ENTERPRISE</strong> adds collusion detection, carbon tracking, and environmental compliance.</p>
          </div>
        </div>
      )}

      {/* ── Tabs ────────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[
            { key: 'boq', label: `BOQ Table (${rows.length} items)`, icon: <Package className="w-4 h-4" /> },
            { key: 'suppliers', label: 'Supplier Comparison', icon: <BarChart3 className="w-4 h-4" /> },
            { key: 'summary', label: 'Category Summary', icon: <Layers className="w-4 h-4" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key as any)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${activeTab === t.key ? 'border-[#0077b6] text-[#0077b6] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── BOQ TABLE ─────────────────────────────────────────── */}
        {activeTab === 'boq' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-xs">
                  <th className="px-3 py-2.5 text-left font-semibold w-8">#</th>
                  <th className="px-3 py-2.5 text-left font-semibold min-w-[280px]">Description</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Category</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Grade</th>
                  <th className="px-3 py-2.5 text-left font-semibold">SANS</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Unit</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Qty</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Rate (excl.)</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total (excl.)</th>
                  <th className="px-3 py-2.5 text-right font-semibold">VAT</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Total (incl.)</th>
                  <th className="px-3 py-2.5 text-right font-semibold">Mass (t)</th>
                  <th className="px-3 py-2.5 text-left font-semibold">Best Supplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, idx) => {
                  const catCfg = CAT_CFG[row.category];
                  const isOpen = expandedRows.has(row.id);
                  const sorted = [...row.supplierRates].filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice);
                  const saving = sorted.length >= 2 ? (sorted[1].unitPrice - sorted[0].unitPrice) * row.quantity : 0;
                  return (
                    <React.Fragment key={row.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2.5 text-gray-400 text-xs">{idx + 1}</td>
                        <td className="px-3 py-2.5">
                          <button onClick={() => toggleRow(row.id)} className="text-left w-full">
                            <p className="text-xs text-gray-900 leading-tight hover:text-[#0077b6] transition-colors font-medium">{row.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-gray-400 font-mono">{row.itemCode}</span>
                              {saving > 0 && <span className="text-[10px] text-green-600 font-medium">💰 Save {isFreeTier ? '●●●' : `R${saving.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`} vs 2nd</span>}
                              {isOpen ? <ChevronUp className="w-3 h-3 text-gray-400" /> : <ChevronDown className="w-3 h-3 text-gray-400" />}
                            </div>
                          </button>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${catCfg.bg} ${catCfg.text}`}>{catCfg.icon} {catCfg.label.split(' ').slice(0,2).join(' ')}</span>
                        </td>
                        <td className="px-3 py-2.5 text-xs text-gray-600 font-mono">{row.grade}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-500">{row.sans1200}</td>
                        <td className="px-3 py-2.5 text-xs text-gray-600">{row.unit}</td>
                        <td className="px-3 py-2.5 text-right text-xs text-gray-700">{row.quantity}</td>
                        <td className="px-3 py-2.5 text-right text-xs">{fmt(row.unitRate)}</td>
                        <td className="px-3 py-2.5 text-right text-xs font-medium text-gray-800">{fmt(row.totalEx)}</td>
                        <td className="px-3 py-2.5 text-right text-xs text-gray-500">{fmt(row.totalEx * 0.15)}</td>
                        <td className="px-3 py-2.5 text-right text-xs font-bold text-[#0077b6]">{fmt(row.totalInc)}</td>
                        <td className="px-3 py-2.5 text-right text-xs text-gray-500">{row.massTonne.toFixed(3)}</td>
                        <td className="px-3 py-2.5 text-xs text-green-700 font-medium">{row.bestSupplier || 'BuildAid'}</td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-slate-50">
                          <td colSpan={13} className="px-5 py-4">
                            <div className="space-y-3">
                              {/* Supplier comparison */}
                              <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Supplier Price Comparison — {ps.province}</p>
                                <div className="flex flex-wrap gap-2">
                                  {sorted.map((s, i) => (
                                    <div key={s.supplier} className={`rounded-lg border px-3 py-2 ${i === 0 ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
                                      <p className={`text-xs font-bold ${i === 0 ? 'text-green-700' : 'text-gray-700'}`}>{i === 0 ? '✓ Best' : `#${i + 1}`} {s.supplier}</p>
                                      <p className="text-sm font-bold text-gray-900">{isPro ? `R ${s.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })} / ${row.unit}` : 'R ●●●●●●'}</p>
                                      {s.note && <p className="text-[10px] text-gray-500 italic">{s.note}</p>}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                <span><strong>SANS 1200:</strong> {row.sans1200}</span>
                                <span><strong>BuildAid Ref:</strong> {row.buildAidRef}</span>
                                <span><strong>Mass:</strong> {row.massKg.toFixed(1)} kg</span>
                                {isEnterprise && <span><strong>Carbon:</strong> {(row.massKg * STEEL_CARBON[row.category].factor / 1000).toFixed(3)} tCO₂e</span>}
                              </div>
                              {row.notes && <p className="text-xs text-gray-600 italic">Note: {row.notes}</p>}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-800 text-white">
                <tr>
                  <td colSpan={8} className="px-3 py-3 text-sm font-bold">TOTALS — {rows.length} items · {totals.totalMassTonne.toFixed(2)} tonnes steel</td>
                  <td className="px-3 py-3 text-right text-sm font-bold">{fmt(totals.totalEx)}</td>
                  <td className="px-3 py-3 text-right text-sm">{fmt(totals.totalVat)}</td>
                  <td className="px-3 py-3 text-right text-sm font-bold text-[#00b4d8]">{fmt(totals.totalInc)}</td>
                  <td className="px-3 py-3 text-right text-sm">{totals.totalMassTonne.toFixed(2)}t</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* ── SUPPLIER COMPARISON TAB ──────────────────────────── */}
        {activeTab === 'suppliers' && (
          <div className="p-5 space-y-4">
            {!isPro && <UpgradePrompt currentTier={contractorTier} requiredTier="professional" featureName="Multi-supplier comparison" />}
            {isPro && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-800"><strong>Qilly Best Rate Engine:</strong> For each steel item, Qilly selected the lowest available rate from {new Set(rows.flatMap(r => r.supplierRates.filter(s=>s.available).map(s=>s.supplier))).size} active suppliers. Total savings vs next-best supplier: <strong>{fmt(totals.totalSavings)}</strong></p>
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-slate-700 text-white">
                        <th className="px-3 py-2.5 text-left">#</th>
                        <th className="px-3 py-2.5 text-left min-w-[220px]">Description</th>
                        <th className="px-3 py-2.5 text-left">Unit</th>
                        <th className="px-3 py-2.5 text-right">Qty</th>
                        <th className="px-3 py-2.5 text-left">✓ Best Supplier</th>
                        <th className="px-3 py-2.5 text-right">Best Rate</th>
                        <th className="px-3 py-2.5 text-left">#2 Supplier</th>
                        <th className="px-3 py-2.5 text-right">#2 Rate</th>
                        <th className="px-3 py-2.5 text-right">Saving/unit</th>
                        <th className="px-3 py-2.5 text-right">Total Saving</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {rows.map((row, i) => {
                        const sorted = [...row.supplierRates].filter(s => s.available).sort((a, b) => a.unitPrice - b.unitPrice);
                        const saving = sorted.length >= 2 ? sorted[1].unitPrice - sorted[0].unitPrice : 0;
                        const totalSaving = saving * row.quantity;
                        return (
                          <tr key={row.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 text-gray-400">{i + 1}</td>
                            <td className="px-3 py-2 text-gray-800 font-medium">{row.description.split('—')[0].trim()}</td>
                            <td className="px-3 py-2 text-gray-500">{row.unit}</td>
                            <td className="px-3 py-2 text-right text-gray-700">{row.quantity}</td>
                            <td className="px-3 py-2 text-green-700 font-semibold">{sorted[0]?.supplier || 'BuildAid'}</td>
                            <td className="px-3 py-2 text-right font-bold text-green-700">R {sorted[0]?.unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 }) || row.unitRate.toFixed(2)}</td>
                            <td className="px-3 py-2 text-gray-500">{sorted[1]?.supplier || '—'}</td>
                            <td className="px-3 py-2 text-right text-gray-500">{sorted[1] ? `R ${sorted[1].unitPrice.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '—'}</td>
                            <td className="px-3 py-2 text-right text-emerald-600">{saving > 0 ? `R ${saving.toFixed(2)}` : '—'}</td>
                            <td className="px-3 py-2 text-right font-semibold text-emerald-700">{totalSaving > 0 ? `R ${totalSaving.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-emerald-50 font-bold">
                        <td colSpan={9} className="px-3 py-2 text-emerald-800 text-xs">Total savings using Qilly's best-rate selection vs next-best supplier</td>
                        <td className="px-3 py-2 text-right text-emerald-700">{fmt(totals.totalSavings)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── SUMMARY TAB ──────────────────────────────────────── */}
        {activeTab === 'summary' && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total (excl. VAT)', value: fmt(totals.totalEx) },
                { label: 'VAT @ 15%', value: fmt(totals.totalVat) },
                { label: 'Total (incl. VAT)', value: fmt(totals.totalInc) },
                { label: 'Total Steel Mass', value: `${totals.totalMassTonne.toFixed(2)} t` },
                { label: 'Cost per tonne', value: totals.totalMassTonne > 0 && isPro ? `R ${(totals.totalEx / totals.totalMassTonne).toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` : '●●●●●●' },
                { label: 'Best rate savings', value: fmt(totals.totalSavings) },
                { label: 'Carbon estimate', value: isEnterprise ? `${(totals.totalCarbonKg / 1000).toFixed(2)} tCO₂e` : '🔒 ENTERPRISE' },
                { label: 'Line items', value: String(rows.length) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-xl border border-gray-200 p-3">
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <h4 className="font-bold text-gray-900 mt-2">Cost by Category</h4>
            <div className="space-y-2">
              {(Object.keys(catBreakdown) as SteelCategory[]).map(cat => {
                const data = catBreakdown[cat]!;
                const pct = totals.totalEx > 0 ? (data.total / totals.totalEx * 100) : 0;
                const cfg = CAT_CFG[cat];
                return (
                  <div key={cat} className={`rounded-xl border p-3 ${cfg.bg}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-base">{cfg.icon}</span>
                      <span className={`font-semibold text-sm ${cfg.text}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400 ml-auto">{data.count} items · {data.mass.toFixed(3)}t</span>
                      <span className="font-bold text-gray-900 text-sm w-32 text-right">{fmt(data.total)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-[#0077b6] to-[#00b4d8]" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{fmtPct(pct)} of total steel cost</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── INFLATION PROJECTIONS (PRO+) ─────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={() => setShowInflation(!showInflation)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-[#0077b6]" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Steel Price Inflation Projections</p>
              <p className="text-xs text-gray-500">ArcelorMittal SA quarterly price adjustments · CPI commodity premium</p>
            </div>
            {!isPro && <span className="ml-3 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">PRO+</span>}
          </div>
          {showInflation ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showInflation && (
          <div className="px-5 pb-5 border-t border-gray-100">
            {!isPro ? <UpgradePrompt currentTier={contractorTier} requiredTier="professional" featureName="Steel inflation projections" /> : (
              <>
                <div className="flex items-center gap-4 py-3">
                  <label className="text-sm font-medium text-gray-700">Annual inflation rate (steel-specific):</label>
                  <input type="range" min="3" max="25" step="0.5" value={inflationRate} onChange={e => setInflationRate(Number(e.target.value))} className="flex-1 max-w-xs" />
                  <span className="text-sm font-bold text-[#0077b6] w-14">{inflationRate.toFixed(1)}% p.a.</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { period: 'Today', months: 0, note: 'Current BuildAid rates' },
                    { period: '6 months', months: 0.5, note: 'AMSA Q3 2026 adj.' },
                    { period: '12 months', months: 1, note: 'CPI + commodity' },
                    { period: '18 months', months: 1.5, note: 'AMSA forecast' },
                    { period: '24 months', months: 2, note: 'Long-range' },
                  ].map(({ period, months, note }) => {
                    const proj = totals.totalEx * (1 + (inflationRate / 100) * months);
                    const increase = proj - totals.totalEx;
                    return (
                      <div key={period} className={`rounded-xl border p-3 text-center ${months === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-xs text-gray-500 font-medium">{period}</p>
                        <p className="font-bold text-gray-900 mt-1">{isPro ? `R ${proj.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` : 'R ●●●●●●'}</p>
                        {months > 0 && <p className="text-[10px] text-red-600 mt-0.5">+{isPro ? `R ${increase.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}` : '●●●●●●'}</p>}
                        <p className="text-[10px] text-gray-400 mt-0.5">{note}</p>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">💡 Steel prices are typically 2–3× more volatile than CPI. ArcelorMittal SA adjusts structural section and flat product prices quarterly. Reinforcing bar prices tracked monthly via scrap steel index.</p>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── COMPLIANCE COSTS (PRO+) ──────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={() => setShowCompliance(!showCompliance)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-600" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Compliance Costs Calculator</p>
              <p className="text-xs text-gray-500">NHBRC · CIDB levy · OHSA · Structural steel testing · B-BBEE</p>
            </div>
            {!isPro && <span className="ml-3 text-xs bg-amber-100 text-amber-700 font-semibold px-2 py-0.5 rounded-full">PRO+</span>}
          </div>
          {showCompliance ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showCompliance && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-3">
            {!isPro ? <UpgradePrompt currentTier={contractorTier} requiredTier="professional" featureName="Compliance cost calculator" /> : (
              complianceCosts ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'CIDB Levy (0.125%)', value: complianceCosts.cidbLevy?.total || 0 },
                    { label: 'OHSA Compliance', value: complianceCosts.statutory?.total || 0 },
                    { label: 'Structural Steel Testing (NDT)', value: totals.totalEx * 0.008 },
                    { label: 'B-BBEE Compliance', value: complianceCosts.bbbee?.total || 0 },
                    { label: 'Insurances (CAR/WCA)', value: totals.totalEx * 0.015 },
                    { label: 'Total Compliance', value: (complianceCosts.total || 0) + totals.totalEx * 0.023 },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                      <p className="text-xs text-gray-600">{label}</p>
                      <p className="font-bold text-gray-900 mt-0.5">{fmt(value)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 py-4 text-center">Compliance costs calculated based on project value and CIDB grade.</p>
              )
            )}
          </div>
        )}
      </div>

      {/* ── COLLUSION DETECTION (ENTERPRISE) ─────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={() => setShowCollusion(!showCollusion)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Collusion Detection Analysis</p>
              <p className="text-xs text-gray-500">Competition Act No. 89 of 1998 compliance · Abnormal pricing patterns</p>
            </div>
            {!isEnterprise && <span className="ml-3 text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">ENTERPRISE</span>}
          </div>
          {showCollusion ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showCollusion && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-3">
            {!isEnterprise ? <UpgradePrompt currentTier={contractorTier} requiredTier="enterprise" featureName="Collusion detection" /> : (
              <CollusionDetection
                pricedItems={mappedItems}
                grandTotal={totals.totalEx}
                overallBOQTotal={totals.totalEx}
                projectSettings={{ province: PROV_CODES[ps.province] || 'GP', municipality: ps.municipality }}
              />
            )}
          </div>
        )}
      </div>

      {/* ── CARBON TRACKING (ENTERPRISE) ─────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <button onClick={() => setShowCarbon(!showCarbon)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <p className="font-bold text-gray-900">Steel Embodied Carbon Tracking</p>
              <p className="text-xs text-gray-500">ICE Database v3.0 · GBCSA Green Star · LEED v4 material credits</p>
            </div>
            {!isEnterprise && <span className="ml-3 text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-0.5 rounded-full">ENTERPRISE</span>}
          </div>
          {showCarbon ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {showCarbon && (
          <div className="px-5 pb-5 border-t border-gray-100 pt-3">
            {!isEnterprise ? <UpgradePrompt currentTier={contractorTier} requiredTier="enterprise" featureName="Carbon tracking" /> : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Embodied Carbon', value: `${(totals.totalCarbonKg / 1000).toFixed(2)} tCO₂e` },
                    { label: 'Total Steel Mass', value: `${totals.totalMassTonne.toFixed(2)} t` },
                    { label: 'Avg Carbon Intensity', value: totals.totalMassKg > 0 ? `${(totals.totalCarbonKg / totals.totalMassKg).toFixed(2)} kgCO₂e/kg` : 'N/A' },
                    { label: 'GBCSA Mat. Credit', value: 'Available' },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-green-50 border border-green-200 rounded-xl p-3">
                      <p className="text-xs text-gray-600">{label}</p>
                      <p className="font-bold text-gray-900 mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full text-xs">
                    <thead><tr className="bg-green-700 text-white">
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-right">Mass (kg)</th>
                      <th className="px-3 py-2 text-right">Factor (kgCO₂e/kg)</th>
                      <th className="px-3 py-2 text-right">Carbon (kgCO₂e)</th>
                      <th className="px-3 py-2 text-right">Carbon (tCO₂e)</th>
                      <th className="px-3 py-2 text-left">Source</th>
                    </tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {(Object.keys(catBreakdown) as SteelCategory[]).map(cat => {
                        const data = catBreakdown[cat]!;
                        const carbonCfg = STEEL_CARBON[cat];
                        const catCarbon = data.mass * 1000 * carbonCfg.factor;
                        return (
                          <tr key={cat} className="hover:bg-gray-50">
                            <td className="px-3 py-2">{CAT_CFG[cat].icon} {CAT_CFG[cat].label}</td>
                            <td className="px-3 py-2 text-right">{(data.mass * 1000).toFixed(0)}</td>
                            <td className="px-3 py-2 text-right">{carbonCfg.factor}</td>
                            <td className="px-3 py-2 text-right font-medium">{catCarbon.toFixed(0)}</td>
                            <td className="px-3 py-2 text-right">{(catCarbon / 1000).toFixed(3)}</td>
                            <td className="px-3 py-2 text-gray-500">{carbonCfg.label}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot><tr className="bg-green-50 font-bold">
                      <td className="px-3 py-2">TOTALS</td>
                      <td className="px-3 py-2 text-right">{totals.totalMassKg.toFixed(0)}</td>
                      <td className="px-3 py-2 text-right">—</td>
                      <td className="px-3 py-2 text-right text-green-700">{totals.totalCarbonKg.toFixed(0)}</td>
                      <td className="px-3 py-2 text-right text-green-700">{(totals.totalCarbonKg / 1000).toFixed(3)}</td>
                      <td className="px-3 py-2 text-gray-500">ICE Database v3.0</td>
                    </tr></tfoot>
                  </table>
                </div>
                <p className="text-xs text-gray-500 italic">ArcelorMittal SA uses approximately 40% recycled scrap steel, reducing reinforcing bar emissions to ~1.46 kgCO₂e/kg vs virgin (2.0+). Using AMSA-sourced reinforcing over imported alternatives provides a 27% carbon saving per tonne.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Disclaimer ──────────────────────────────────────────── */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> This priced BOQ is based on BuildAid 2025/2026 reference rates and published SA supplier data as at March 2026. Steel prices change quarterly with ArcelorMittal SA's mill price revisions. This document is valid for 30 days from date of generation. Always confirm rates with suppliers before final tender submission. Macsteel pricing requires a registered trade account. Fabrication rates exclude shop drawings, NDT testing, and structural connection design.
        </p>
      </div>
    </div>
  );
}
