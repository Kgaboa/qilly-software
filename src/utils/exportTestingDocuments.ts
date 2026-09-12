/**
 * Enhanced Testing Document Export Utilities
 * Supports both PowerPoint (.pptx) and Word (.docx) formats
 */

import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType, Packer } from 'docx';
import FileSaver from 'file-saver';
import pptxgen from 'pptxgenjs';

/**
 * Parse markdown content into structured sections
 */
function parseMarkdownToSections(markdown: string): Array<{ 
  type: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'list' | 'code' | 'table',
  content: string,
  level?: number,
  items?: string[]
}> {
  const lines = markdown.split('\n');
  const sections: Array<any> = [];
  let currentList: string[] = [];
  let currentCode: string[] = [];
  let inCodeBlock = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock && currentCode.length > 0) {
        sections.push({ type: 'code', content: currentCode.join('\n') });
        currentCode = [];
      }
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    if (inCodeBlock) {
      currentCode.push(line);
      continue;
    }
    
    // Headers
    if (line.startsWith('# ')) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      sections.push({ type: 'h1', content: line.substring(2).trim() });
    } else if (line.startsWith('## ')) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      sections.push({ type: 'h2', content: line.substring(3).trim() });
    } else if (line.startsWith('### ')) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      sections.push({ type: 'h3', content: line.substring(4).trim() });
    } else if (line.startsWith('#### ')) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      sections.push({ type: 'h4', content: line.substring(5).trim() });
    }
    // Lists
    else if (line.match(/^[\*\-]\s+/)) {
      currentList.push(line.replace(/^[\*\-]\s+/, '').trim());
    } else if (line.match(/^\d+\.\s+/)) {
      currentList.push(line.replace(/^\d+\.\s+/, '').trim());
    }
    // Regular paragraphs
    else if (line.trim().length > 0 && !line.startsWith('---')) {
      if (currentList.length > 0) {
        sections.push({ type: 'list', items: [...currentList] });
        currentList = [];
      }
      sections.push({ type: 'p', content: line.trim() });
    }
  }
  
  // Flush remaining list
  if (currentList.length > 0) {
    sections.push({ type: 'list', items: currentList });
  }
  
  return sections;
}

/**
 * Clean markdown formatting from text
 */
function cleanMarkdown(text: string): string {
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1') // Bold+Italic
    .replace(/\*\*(.+?)\*\*/g, '$1') // Bold
    .replace(/\*(.+?)\*/g, '$1') // Italic
    .replace(/`(.+?)`/g, '$1') // Code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/[✅❌⚠️🎯📋💰🔧🚀]/g, '') // Emojis
    .trim();
}

/**
 * Export testing guide as PowerPoint presentation
 */
export async function exportTestingGuideToPPT(
  markdown: string,
  filename: string = 'Qilly_Testing_Guide.pptx',
  title: string = 'Qilly Testing Guide'
): Promise<void> {
  try {
    console.log('📊 Starting PowerPoint generation...');
    console.log('📝 Markdown length:', markdown?.length || 0);
    console.log('📝 Filename:', filename);
    console.log('📝 Title:', title);
    
    if (!markdown || markdown.length === 0) {
      throw new Error('No markdown content provided');
    }
    
    const pptx = new pptxgen();
    
    // Set presentation metadata
    pptx.author = 'Qilly System';
    pptx.company = 'Qilly - Construction Billing System';
    pptx.title = title;
    pptx.subject = 'Testing Documentation';
    
    // Define color scheme (Qilly brand colors)
    const colors = {
      primary: '00b4d8',
      secondary: '0077b6',
      tertiary: '023e8a',
      dark: '03045e',
      light: 'f0f0f0',
      white: 'ffffff',
      text: '333333'
    };
    
    // Title Slide
    const titleSlide = pptx.addSlide();
    titleSlide.background = { color: colors.primary };
    
    titleSlide.addText('QILLY', {
      x: 0.5,
      y: 1.5,
      w: 9,
      h: 1.5,
      fontSize: 72,
      bold: true,
      color: colors.white,
      align: 'center'
    });
    
    titleSlide.addText(title, {
      x: 0.5,
      y: 3.0,
      w: 9,
      h: 0.8,
      fontSize: 32,
      color: colors.white,
      align: 'center'
    });
    
    titleSlide.addText('Construction Billing System - Testing Documentation', {
      x: 0.5,
      y: 4.0,
      w: 9,
      h: 0.5,
      fontSize: 16,
      color: colors.white,
      align: 'center',
      italic: true
    });
    
    titleSlide.addText(new Date().toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), {
      x: 0.5,
      y: 5.0,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: colors.white,
      align: 'center'
    });
    
    console.log('🔄 Parsing markdown into sections...');
    const sections = parseMarkdownToSections(markdown);
    console.log('✅ Parsed', sections.length, 'sections');
    
    let currentSlide: any = null;
    let slideTitle = '';
    let bulletPoints: string[] = [];
    let slideCount = 0;
    const maxSlides = 50; // Limit slides to prevent huge files
    
    for (let i = 0; i < sections.length && slideCount < maxSlides; i++) {
      const section = sections[i];
      
      if (section.type === 'h1' || section.type === 'h2') {
        // Create new slide for major headers
        if (currentSlide && bulletPoints.length > 0) {
          // Add accumulated bullet points to previous slide
          currentSlide.addText(bulletPoints.map(bp => ({ 
            text: cleanMarkdown(bp), 
            options: { bullet: true } 
          })), {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 4.0,
            fontSize: 14,
            color: colors.text,
            valign: 'top'
          });
          bulletPoints = [];
        }
        
        currentSlide = pptx.addSlide();
        slideCount++;
        slideTitle = cleanMarkdown(section.content);
        
        // Header bar
        currentSlide.addShape(pptx.ShapeType.rect, {
          x: 0,
          y: 0,
          w: 10,
          h: 0.8,
          fill: { color: section.type === 'h1' ? colors.primary : colors.secondary }
        });
        
        currentSlide.addText(slideTitle, {
          x: 0.5,
          y: 0.15,
          w: 9,
          h: 0.5,
          fontSize: section.type === 'h1' ? 28 : 24,
          bold: true,
          color: colors.white
        });
        
      } else if (section.type === 'h3' || section.type === 'h4') {
        // Subheaders become bullet points with emphasis
        bulletPoints.push(`**${cleanMarkdown(section.content)}**`);
        
      } else if (section.type === 'list' && section.items) {
        // Add list items as bullets
        bulletPoints.push(...section.items.map(item => cleanMarkdown(item)));
        
      } else if (section.type === 'p') {
        const content = cleanMarkdown(section.content);
        if (content.length > 0 && !content.startsWith('---')) {
          bulletPoints.push(content);
        }
      } else if (section.type === 'code' && currentSlide) {
        // Add code block to current slide
        if (bulletPoints.length > 0) {
          currentSlide.addText(bulletPoints.map(bp => ({ 
            text: cleanMarkdown(bp), 
            options: { bullet: true } 
          })), {
            x: 0.5,
            y: 1.5,
            w: 9,
            h: 2.5,
            fontSize: 14,
            color: colors.text
          });
          bulletPoints = [];
        }
        
        currentSlide.addText(section.content.substring(0, 500), {
          x: 0.5,
          y: 4.2,
          w: 9,
          h: 1.3,
          fontSize: 10,
          fontFace: 'Courier New',
          color: colors.text,
          fill: { color: colors.light },
          margin: 0.1
        });
      }
      
      // If we have too many bullets, create a new slide
      if (bulletPoints.length > 8 && currentSlide) {
        currentSlide.addText(bulletPoints.slice(0, 8).map(bp => ({ 
          text: cleanMarkdown(bp), 
          options: { bullet: true } 
        })), {
          x: 0.5,
          y: 1.5,
          w: 9,
          h: 4.0,
          fontSize: 14,
          color: colors.text
        });
        
        bulletPoints = bulletPoints.slice(8);
        
        if (bulletPoints.length > 0) {
          currentSlide = pptx.addSlide();
          slideCount++;
          
          // Continuation header
          currentSlide.addShape(pptx.ShapeType.rect, {
            x: 0,
            y: 0,
            w: 10,
            h: 0.8,
            fill: { color: colors.secondary }
          });
          
          currentSlide.addText(`${slideTitle} (continued)`, {
            x: 0.5,
            y: 0.15,
            w: 9,
            h: 0.5,
            fontSize: 20,
            color: colors.white
          });
        }
      }
    }
    
    // Add remaining bullets to final slide
    if (currentSlide && bulletPoints.length > 0) {
      currentSlide.addText(bulletPoints.map(bp => ({ 
        text: cleanMarkdown(bp), 
        options: { bullet: true } 
      })), {
        x: 0.5,
        y: 1.5,
        w: 9,
        h: 4.0,
        fontSize: 14,
        color: colors.text
      });
    }
    
    // Footer slide
    const footerSlide = pptx.addSlide();
    footerSlide.background = { color: colors.dark };
    
    footerSlide.addText('Thank You', {
      x: 0.5,
      y: 2.0,
      w: 9,
      h: 1.0,
      fontSize: 48,
      bold: true,
      color: colors.white,
      align: 'center'
    });
    
    footerSlide.addText('Questions? Contact the Qilly Team', {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 0.5,
      fontSize: 18,
      color: colors.white,
      align: 'center'
    });
    
    console.log('💾 Saving PowerPoint file with', slideCount + 2, 'slides...');
    await pptx.writeFile({ fileName: filename });
    console.log('✅ PowerPoint export complete!');
    
  } catch (error) {
    console.error('❌ Error generating PowerPoint:', error);
    throw error;
  }
}

/**
 * Export testing guide as Word document (using docx library)
 */
export async function exportTestingGuideToWord(
  markdown: string,
  filename: string = 'Qilly_Testing_Guide.docx',
  title: string = 'Qilly Testing Guide'
): Promise<void> {
  try {
    console.log('📄 Starting Word document generation...');
    console.log('📝 Markdown length:', markdown?.length || 0);
    console.log('📝 Filename:', filename);
    console.log('📝 Title:', title);
    
    if (!markdown || markdown.length === 0) {
      throw new Error('No markdown content provided');
    }
    
    console.log('🔄 Parsing markdown into sections...');
    const sections = parseMarkdownToSections(markdown);
    console.log('✅ Parsed', sections.length, 'sections');
    
    const documentChildren: any[] = [];
    
    // Title page
    documentChildren.push(
      new Paragraph({
        text: 'QILLY',
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { before: 2000, after: 400 },
        children: [
          new TextRun({
            text: 'QILLY',
            bold: true,
            size: 72,
            color: '00b4d8'
          })
        ]
      }),
      new Paragraph({
        text: title,
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: title,
            size: 36,
            color: '0077b6'
          })
        ]
      }),
      new Paragraph({
        text: 'Construction Billing System - Testing Documentation',
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: 'Construction Billing System - Testing Documentation',
            italics: true,
            size: 20,
            color: '666666'
          })
        ]
      }),
      new Paragraph({
        text: new Date().toLocaleDateString('en-ZA', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [
          new TextRun({
            text: new Date().toLocaleDateString('en-ZA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            size: 18,
            color: '666666'
          })
        ]
      }),
      new Paragraph({
        text: '',
        pageBreakBefore: true
      })
    );
    
    // Process sections
    console.log('🔄 Converting sections to Word format...');
    for (const section of sections) {
      if (section.type === 'h1') {
        documentChildren.push(
          new Paragraph({
            text: cleanMarkdown(section.content),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
            pageBreakBefore: true,
            children: [
              new TextRun({
                text: cleanMarkdown(section.content),
                bold: true,
                size: 32,
                color: '00b4d8',
                underline: { type: UnderlineType.SINGLE }
              })
            ]
          })
        );
      } else if (section.type === 'h2') {
        documentChildren.push(
          new Paragraph({
            text: cleanMarkdown(section.content),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
            children: [
              new TextRun({
                text: cleanMarkdown(section.content),
                bold: true,
                size: 26,
                color: '0077b6'
              })
            ]
          })
        );
      } else if (section.type === 'h3') {
        documentChildren.push(
          new Paragraph({
            text: cleanMarkdown(section.content),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: cleanMarkdown(section.content),
                bold: true,
                size: 22,
                color: '023e8a'
              })
            ]
          })
        );
      } else if (section.type === 'h4') {
        documentChildren.push(
          new Paragraph({
            text: cleanMarkdown(section.content),
            heading: HeadingLevel.HEADING_4,
            spacing: { before: 150, after: 75 },
            children: [
              new TextRun({
                text: cleanMarkdown(section.content),
                bold: true,
                size: 20,
                color: '03045e'
              })
            ]
          })
        );
      } else if (section.type === 'list' && section.items) {
        for (const item of section.items) {
          documentChildren.push(
            new Paragraph({
              text: cleanMarkdown(item),
              bullet: { level: 0 },
              spacing: { after: 50 },
              children: [
                new TextRun({
                  text: cleanMarkdown(item),
                  size: 20
                })
              ]
            })
          );
        }
      } else if (section.type === 'code') {
        documentChildren.push(
          new Paragraph({
            text: section.content,
            spacing: { before: 100, after: 100 },
            shading: { fill: 'f4f4f4' },
            border: {
              left: { color: '00b4d8', size: 6, style: 'single' }
            },
            children: [
              new TextRun({
                text: section.content,
                font: 'Courier New',
                size: 18
              })
            ]
          })
        );
      } else if (section.type === 'p') {
        const content = cleanMarkdown(section.content);
        if (content.length > 0 && !content.startsWith('---')) {
          documentChildren.push(
            new Paragraph({
              text: content,
              spacing: { after: 100 },
              children: [
                new TextRun({
                  text: content,
                  size: 22
                })
              ]
            })
          );
        }
      }
    }
    
    console.log('📦 Creating Word document with', documentChildren.length, 'elements...');
    
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: documentChildren
      }]
    });
    
    console.log('💾 Converting to blob and saving...');
    const blob = await Packer.toBlob(doc);
    console.log('✅ Blob created. Size:', blob.size, 'bytes');
    
    FileSaver.saveAs(blob, filename);
    console.log('✅ Word export complete!');
    
  } catch (error) {
    console.error('❌ Error generating Word document:', error);
    throw error;
  }
}

/**
 * Load markdown file from public folder
 */
export async function loadMarkdownFile(filename: string): Promise<string> {
  try {
    console.log('📂 Loading file:', filename);
    const response = await fetch(`/${filename}`);
    
    if (!response.ok) {
      console.log(`ℹ️ File not found in public folder: ${filename}, using comprehensive fallback content`);
      return getFallbackContent(filename);
    }
    
    const content = await response.text();
    
    // Check if we got HTML instead of markdown (happens when file doesn't exist)
    if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
      console.log(`ℹ️ Using comprehensive fallback content for ${filename}`);
      return getFallbackContent(filename);
    }
    
    // Check if content is actually markdown (should start with # or have significant length)
    if (content.length < 100 || (!content.includes('#') && !content.includes('##'))) {
      console.log(`ℹ️ Using comprehensive fallback content for ${filename}`);
      return getFallbackContent(filename);
    }
    
    console.log('✅ File loaded:', filename, '- Length:', content.length);
    
    return content;
  } catch (error) {
    console.error('❌ Error loading markdown file:', error);
    console.log('📝 Using comprehensive fallback content for:', filename);
    return getFallbackContent(filename);
  }
}

/**
 * Get fallback content if markdown file is not found
 */
function getFallbackContent(filename: string): string {
  if (filename.includes('COMPLIANCE_CALCULATOR_TESTING_GUIDE')) {
    return getComplianceGuideContent();
  } else if (filename.includes('QILLY_COMPLETE_SYSTEM_TEST_GUIDE')) {
    return getSystemGuideContent();
  }
  return '# Testing Guide\n\nContent not available.';
}

/**
 * Generate Compliance Calculator Testing Guide content
 */
function getComplianceGuideContent(): string {
  return `# Qilly Compliance Calculator Testing Guide

## Overview

This guide provides comprehensive testing procedures for the Qilly Compliance Calculator feature.

## Test Cases

### 1. Project Value Input
- Test Case 1.1: Enter valid project value (R100,000 to R10,000,000)
- Expected: System accepts value and enables calculation
- Test Case 1.2: Enter invalid value (negative or zero)
- Expected: System shows validation error

### 2. Regional Selection
- Test Case 2.1: Select province from dropdown
- Expected: Province selected, municipality list updates
- Test Case 2.2: Select municipality
- Expected: Municipality selected, cost factors update

### 3. Project Settings
- Test Case 3.1: Select project duration (1-36 months)
- Expected: Duration impacts compliance schedule costs
- Test Case 3.2: Select CIDB grading (GB1-GB9)
- Expected: Grading affects compliance requirements

### 4. Compliance Calculation
- Test Case 4.1: Click "Calculate Compliance Costs"
- Expected: Results display showing:
  - CIDB costs (registration, fees)
  - BBBEE costs (verification, compliance)
  - Quality testing costs (SANS 1200 schedule)
  - Professional fees (architect, engineer, QS)
  - Total compliance costs (Rands + % of project)

### 5. Results Validation
- Test Case 5.1: Verify CIDB costs calculation
- Expected: Correct rates based on grading
- Test Case 5.2: Verify BBBEE costs
- Expected: 0.05% to 0.15% of project value
- Test Case 5.3: Verify quality testing schedule
- Expected: Table with test types, frequencies, SANS references

### 6. Detailed Breakdown
- Test Case 6.1: Click "Show Detailed Breakdown"
- Expected: Expanded view with:
  - Quality testing schedule table
  - Complete cost breakdown with regulations
  - Data sources and accuracy disclaimer

### 7. Edge Cases
- Test Case 7.1: Very small project (R100,000)
- Expected: Lower complexity, reduced compliance
- Test Case 7.2: Very large project (R10,000,000)
- Expected: Higher complexity, extensive compliance
- Test Case 7.3: Remote province (Northern Cape)
- Expected: Regional factors applied

## Expected Results Summary

### Compliance Cost Ranges
- Small projects (R100K-R500K): 3-5% compliance costs
- Medium projects (R500K-R2M): 4-6% compliance costs
- Large projects (R2M-R10M): 5-8% compliance costs

### Quality Testing Schedule
- Concrete testing: Weekly (SANS 1200 D)
- Soil testing: As required (SANS 1200 E)
- Brickwork testing: Per batch (SANS 1200 F)
- Earthworks testing: Per 100m³ (SANS 1200 E)

## Integration Testing

### Test Case 8: BOQ Integration
- Upload BOQ with project value
- Calculate compliance costs
- Verify costs added to BOQ pricing
- Expected: Compliance line items in priced BOQ

### Test Case 9: Regional Pricing Integration
- Select different provinces
- Calculate compliance costs
- Verify regional variations
- Expected: Different costs per province

## Acceptance Criteria

✅ All input validation works correctly
✅ Calculations match expected compliance standards
✅ Results display clearly with breakdowns
✅ Regional factors applied correctly
✅ SANS 1200 schedule displays accurately
✅ Integration with BOQ pricing works
✅ Professional fees calculated per regulations

## Test Data

### Sample Projects
1. **Small Project:** R250,000 in Gauteng, GP1, 3 months
2. **Medium Project:** R1,500,000 in Western Cape, GB4, 6 months
3. **Large Project:** R5,000,000 in KZN, GB6, 12 months

## Known Issues & Limitations

- Compliance rates based on 2026 standards
- Regional variations approximate
- Professional fees estimated ranges
- Quality testing costs indicative

## Testing Completion Checklist

- [ ] All test cases executed
- [ ] Edge cases validated
- [ ] Integration tests passed
- [ ] Documentation updated
- [ ] User acceptance testing completed

---

**Document Version:** 1.0
**Last Updated:** February 19, 2026
**Status:** Comprehensive Testing Guide`;
}

/**
 * Generate System Test Guide content
 */
function getSystemGuideContent(): string {
  return `# Qilly - Complete System Testing Guide
## Version 1.0 | February 2026

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Pre-Testing Setup](#pre-testing-setup)
3. [Core Features Testing](#core-features-testing)
4. [Compliance Calculator Testing](#compliance-calculator-testing)
5. [Regional Pricing Testing](#regional-pricing-testing)
6. [Payment Integration Testing](#payment-integration-testing)
7. [Admin Dashboard Testing](#admin-dashboard-testing)
8. [Export Functions Testing](#export-functions-testing)
9. [Performance Testing](#performance-testing)
10. [Security & Compliance Testing](#security-compliance-testing)
11. [Test Results Documentation](#test-results-documentation)

---

## 1. Introduction

### Purpose
This document provides comprehensive testing guidelines for all Qilly system features, ensuring production readiness for DHS deployment.

### Scope
- **User Roles:** DHS Buyers, Suppliers, Administrators
- **Environments:** Demo Mode (localStorage) and Production Mode (Supabase)
- **Platforms:** Desktop (Chrome, Firefox, Edge), Mobile (iOS Safari, Android Chrome), Tablet (iPad, Android)

### Testing Standards
- ✅ **Accuracy Target:** 85-95% for pricing calculations
- ✅ **Performance Target:** <5 seconds for BOQ processing
- ✅ **Availability Target:** 99.5% uptime
- ✅ **Compliance:** SANS 1200, NBR, CIDB, NHBRC, BBBEE, POPIA

---

## 2. Pre-Testing Setup

### Environment Preparation

#### Demo Mode Setup (No Supabase Required)
\`\`\`
1. Open Chrome browser (latest version)
2. Navigate to Qilly application URL
3. Press F12 → Console tab
4. Verify no errors on load
5. Check localStorage for demo data
\`\`\`

#### Production Mode Setup (Supabase Connected)
\`\`\`
1. Ensure Supabase project is connected
2. Verify environment variables: SUPABASE_URL, SUPABASE_ANON_KEY
3. Check database tables exist: suppliers, processed_boqs, compliance_costs
4. Verify RLS (Row Level Security) policies active
\`\`\`

### Test Data Requirements

#### Sample BOQ Data (Small Project - 20 Units)
Expected Results:
- Project Value: ~R3M - R3.5M
- Processing Time: 2-4 seconds
- Compliance Costs: ~R120K - R140K (4-5%)

#### Sample BOQ Data (Medium Project - 100 Units)
Expected Project Value: ~R15M - R18M
Expected Compliance Costs: ~R600K - R750K

#### Sample BOQ Data (Large Project - 500 Units)
Expected Project Value: ~R75M - R90M
Expected Compliance Costs: ~R3M - R3.75M

---

## 3. Core Features Testing

### 3.1 BOQ Upload & Processing

#### Test Case 3.1.1: Manual BOQ Entry

**Objective:** Verify manual table entry works correctly

**Steps:**
1. Navigate to Dashboard
2. Click "+ Add Row" button
3. Enter test data: Item Code A.1.1.1, Description: Excavation in soft soil, Quantity: 100, Unit: m³
4. Add 5 more rows with different items
5. Fill in Project Settings: Province GP, Municipality JHB, Profit Margin 15%, CIDB GB4, Duration 6 months
6. Click "Process Bill of Quantities"

**Expected Results:**
- ✅ All rows save correctly (no data loss)
- ✅ Validation errors show for empty required fields
- ✅ Processing completes in <5 seconds
- ✅ Redirects to results page
- ✅ All entered items display in pricing table

**Pass/Fail Criteria:**
- PASS: All 5 items processed with prices shown
- FAIL: Any item missing, incorrect quantities, or errors

---

#### Test Case 3.1.2: CSV/Excel Upload

**Objective:** Verify file upload parsing works

**Steps:**
1. Create CSV file with BOQ data
2. Navigate to Dashboard
3. Click "Upload CSV/Excel" button
4. Select test CSV file
5. Verify preview table shows correct data
6. Click "Import"
7. Process BOQ

**Expected Results:**
- ✅ CSV parsed correctly (all rows imported)
- ✅ Item codes, descriptions, quantities match source file
- ✅ Units recognized correctly (m³, m², kg, etc.)
- ✅ No duplicate rows created
- ✅ Processing completes successfully

---

#### Test Case 3.1.3: Large BOQ Performance

**Objective:** Test system handles 500+ line items

**Steps:**
1. Upload BOQ with 500+ items
2. Start timer when clicking "Process"
3. Monitor browser console for errors
4. Wait for processing to complete
5. Record completion time

**Expected Results:**
- ✅ Processing time: <30 seconds (500 items)
- ✅ No browser freeze/hang
- ✅ All items priced correctly
- ✅ Memory usage <500MB
- ✅ No console errors

**Performance Benchmarks:**
- 100 items: <5 seconds
- 250 items: <15 seconds
- 500 items: <30 seconds
- 1000 items: <60 seconds

---

### 3.2 Regional Pricing Engine

#### Test Case 3.2.1: Provincial Cost Variations

**Objective:** Verify regional multipliers applied correctly

**Steps:**
1. Process same BOQ in all 9 provinces
2. Record total project costs for each province
3. Calculate % differences from Gauteng baseline

**Expected Results (for R10M Gauteng baseline):**

| Province | Multiplier | Expected Total | % Difference |
|----------|------------|----------------|--------------|
| Gauteng | 1.0 | R10,000,000 | 0% |
| Western Cape | 1.05 | R10,500,000 | +5% |
| KwaZulu-Natal | 0.95 | R9,500,000 | -5% |
| Eastern Cape | 0.85 | R8,500,000 | -15% |
| Limpopo | 0.80 | R8,000,000 | -20% |

**Pass Criteria:** Costs within ±2% of expected multiplier

---

#### Test Case 3.2.2: Municipality Selection

**Objective:** Verify municipality dropdown shows correct options per province

**Steps:**
1. Select each province in Project Settings
2. Open Municipality dropdown
3. Verify municipalities listed match province
4. Test search/filter functionality

**Expected Results:**
- ✅ Gauteng: Shows JHB, Pretoria, Ekurhuleni, etc.
- ✅ Western Cape: Shows Cape Town, Stellenbosch, etc.
- ✅ KZN: Shows Durban, Pietermaritzburg, etc.
- ✅ Search "Durban" filters correctly
- ✅ No municipalities from wrong province shown

---

### 3.3 Pricing Accuracy Validation

#### Test Case 3.3.1: Comparison with Manual QS Estimate

**Objective:** Validate Qilly pricing against professional Quantity Surveyor estimate

**Steps:**
1. Obtain manual QS estimate for reference project
2. Process same BOQ in Qilly
3. Compare line-by-line pricing
4. Calculate overall variance percentage

**Comparison Template:**

| Item | QS Manual | Qilly | Variance | Within 85-95%? |
|------|-----------|-------|----------|----------------|
| Excavation | R45,000 | R43,500 | -3.3% | ✅ |
| Concrete | R280,000 | R295,000 | +5.4% | ✅ |
| Brickwork | R520,000 | R498,000 | -4.2% | ✅ |
| **TOTAL** | **R3,200,000** | **R3,150,000** | **-1.6%** | **✅** |

**Pass Criteria:**
- ✅ Line items within ±15% variance
- ✅ Total project within ±10% variance
- ✅ Overall accuracy 85-95%

---

## 4. Compliance Calculator Testing

### 4.1 NHBRC Compliance

#### Test Case 4.1.1: Enrollment Fee Calculation

**Objective:** Verify NHBRC enrollment fees correct per unit

**Steps:**
1. Process housing BOQ with known unit count
2. Scroll to Compliance Cost Calculator
3. Expand NHBRC section
4. Verify enrollment fee = R850 × units

**Test Data:**

| Project | Units | Expected Enrollment Fee |
|---------|-------|------------------------|
| Small | 20 | R17,000 |
| Medium | 100 | R85,000 |
| Large | 500 | R425,000 |

**Expected Results:**
- ✅ Fee scales linearly with units
- ✅ Calculation matches official NHBRC 2024/2025 schedule
- ✅ Breakdown shows: enrollment + inspections + insurance

---

#### Test Case 4.1.2: Inspection Fees

**Steps:**
1. Verify inspection fees = R2,250 × units
2. Check breakdown shows foundation, damp-proof, roof, plumbing, electrical, final completion

**Test Data:**

| Units | Expected Inspection Fees |
|-------|-------------------------|
| 20 | R45,000 |
| 100 | R225,000 |
| 500 | R1,125,000 |

---

### 4.2 CIDB Compliance Validation

#### Test Case 4.2.1: Contractor Grade Matching

**Objective:** Verify CIDB grade requirements match project value

**Test Matrix:**

| Project Value | Contractor Grade | Max Allowed | Should Show |
|---------------|------------------|-------------|-------------|
| R150,000 | GB1 | R200,000 | ✅ Green |
| R500,000 | GB1 | R200,000 | ❌ Red warning |
| R500,000 | GB2 | R650,000 | ✅ Green |
| R1,500,000 | GB2 | R650,000 | ❌ Red warning |
| R1,500,000 | GB3 | R2,000,000 | ✅ Green |
| R10,000,000 | GB6 | R13,000,000 | ✅ Green |

**Expected Results:**
- ✅ Green checkmark when grade sufficient
- ❌ Red warning when grade insufficient
- ⚠️ Warning message: "Contractor Grade X insufficient for RYM project"

---

### 4.3 BBBEE Verification Costs

#### Test Case 4.3.1: Verification Fee Calculation

**Steps:**
1. Process projects of varying sizes
2. Verify BBBEE costs = 0.05% to 0.15% of project value

**Test Data:**

| Project Value | Expected BBBEE Cost (0.05-0.15%) |
|---------------|----------------------------------|
| R1,000,000 | R500 - R1,500 |
| R5,000,000 | R2,500 - R7,500 |
| R20,000,000 | R10,000 - R30,000 |

**Expected Results:**
- ✅ Small projects (<R2M): 0.05%
- ✅ Medium projects (R2M-R10M): 0.10%
- ✅ Large projects (>R10M): 0.15%

---

## 5. Regional Pricing Testing

### 5.1 Supplier Distance Calculations

#### Test Case 5.1.1: Transport Cost Accuracy

**Objective:** Test transport cost accuracy based on distance

**Test Scenarios:**

| Material | Distance | Expected Transport Cost/Unit |
|----------|----------|------------------------------|
| Concrete 25MPa | 15km | R225-R375/m³ |
| Concrete 25MPa | 50km | R750-R1,250/m³ |
| Concrete 25MPa | 100km | R1,500-R2,500/m³ |
| Face bricks | 20km | R240-R400/1000 bricks |
| Steel Y12 | 30km | R240-R360/ton |

**Expected Results:**
- ✅ Closer suppliers ranked higher
- ✅ Transport costs reasonable (not zero, not excessive)
- ✅ "Savings vs Distant Supplier" calculated correctly
- ✅ Landed cost = base price + transport + fees

---

## 6. Payment Integration Testing

### 6.1 Free Trial System

#### Test Case 6.1.1: Trial Activation

**Objective:** Verify new users get 1 free BOQ

**Steps:**
1. Register new account
2. Verify trial_used = false in profile
3. Process first BOQ
4. Verify trial_used = true after processing
5. Attempt to process second BOQ
6. Verify subscription upgrade modal appears

**Expected Results:**
- ✅ First BOQ processes without payment
- ✅ trial_used flag updates correctly
- ✅ Second BOQ blocked with upgrade prompt
- ✅ Modal shows subscription tiers

---

#### Test Case 6.1.2: Trial Expiry Handling

**Steps:**
1. Complete trial (process 1 BOQ)
2. Upload second BOQ
3. Verify SubscriptionUpgradeModal displays
4. Check modal content shows:
   - "Your free trial has been used"
   - 3 subscription tiers (Starter, Professional, Enterprise)
   - 4 payment methods (Bank EFT, Stitch, PayFast, Manual)

**Expected Results:**
- ✅ Cannot process without subscription
- ✅ All payment options visible
- ✅ Pricing accurate (R799, R1,999, R4,999/month)

---

### 6.2 Subscription Tiers

#### Test Case 6.2.1: Starter Tier Features

**Objective:** Verify Starter tier (R799/month) features

**Steps:**
1. Subscribe to Starter tier
2. Verify features enabled:
   - Process up to 10 BOQs/month
   - Basic compliance calculator
   - Export to PDF
   - Email support

**Expected Results:**
- ✅ Can process 10 BOQs
- ✅ 11th BOQ blocked with upgrade prompt
- ✅ Basic compliance calculations work
- ✅ PDF export functional

---

#### Test Case 6.2.2: Professional Tier Features

**Objective:** Verify Professional tier (R1,999/month) features

**Features to Test:**
- ✅ Unlimited BOQs
- ✅ Advanced compliance calculator with SANS 1200 schedules
- ✅ Export to PDF, Word, Excel
- ✅ Regional pricing optimization
- ✅ Priority email + chat support
- ✅ API access (basic)

**Expected Results:**
- ✅ No BOQ limits
- ✅ All export formats work
- ✅ Advanced compliance breakdowns visible
- ✅ Regional pricing recommendations shown

---

#### Test Case 6.2.3: Enterprise Tier Features

**Objective:** Verify Enterprise tier (R4,999/month) features

**Features to Test:**
- ✅ Everything in Professional
- ✅ Multi-user accounts (up to 10 users)
- ✅ Custom integrations
- ✅ Dedicated account manager
- ✅ SLA guarantees (99.9% uptime)
- ✅ White-label options
- ✅ Advanced API access

**Expected Results:**
- ✅ Can add multiple users
- ✅ Custom branding options available
- ✅ Dedicated support contact assigned
- ✅ API documentation accessible

---

### 6.3 Payment Methods

#### Test Case 6.3.1: Bank EFT Payment

**Objective:** Test manual bank transfer workflow

**Steps:**
1. Select subscription tier
2. Choose "Bank EFT" payment method
3. Click "Generate Invoice"
4. Verify invoice displays:
   - Banking details
   - Reference number
   - Amount due
   - Payment instructions
5. Simulate payment confirmation
6. Verify manual activation workflow

**Expected Results:**
- ✅ Invoice downloads as PDF
- ✅ Banking details correct
- ✅ Reference number unique
- ✅ Transaction fee: R0 (no gateway fees)
- ✅ Manual verification process explained

---

#### Test Case 6.3.2: Stitch Instant Payment

**Objective:** Test Stitch instant EFT integration

**Steps:**
1. Select subscription tier
2. Choose "Stitch (Instant EFT)" payment method
3. Click "Pay Now"
4. Verify Stitch modal opens
5. Select bank (use test bank in demo)
6. Authorize payment
7. Verify instant confirmation

**Expected Results:**
- ✅ Stitch modal loads
- ✅ Bank selection works
- ✅ Payment confirms instantly
- ✅ Transaction fee: R2 flat fee
- ✅ Subscription activates immediately
- ✅ paid_status = true in profile

---

#### Test Case 6.3.3: PayFast Card Payment

**Objective:** Test PayFast credit/debit card integration

**Steps:**
1. Select subscription tier
2. Choose "PayFast (Card Payment)" payment method
3. Click "Pay with Card"
4. Enter test card details:
   - Card: 4000 0000 0000 0002
   - Expiry: 12/26
   - CVV: 123
5. Submit payment
6. Verify confirmation

**Expected Results:**
- ✅ PayFast form loads
- ✅ Card validation works
- ✅ Payment processes successfully
- ✅ Transaction fee: 2.9% + R2
- ✅ Subscription activates
- ✅ Receipt emailed

---

#### Test Case 6.3.4: Manual Upgrade / Contact Sales

**Objective:** Test manual upgrade workflow for custom pricing

**Steps:**
1. Select "Enterprise" tier
2. Choose "Contact Sales" option
3. Fill contact form:
   - Company name
   - Contact person
   - Email
   - Phone
   - Requirements/Notes
4. Submit request
5. Verify confirmation message

**Expected Results:**
- ✅ Form submission successful
- ✅ Confirmation email sent to user
- ✅ Sales team notified
- ✅ Status shows "Pending Sales Review"
- ✅ Can still use trial/existing subscription while pending

---

### 6.4 Subscription Activation

#### Test Case 6.4.1: Payment Completion Flow

**Objective:** Verify subscription activates after successful payment

**Steps:**
1. Complete payment using any method
2. Wait for confirmation
3. Check user profile
4. Verify paid_status = true
5. Attempt to process BOQ
6. Verify no upgrade prompts

**Expected Results:**
- ✅ paid_status updates immediately
- ✅ Subscription tier recorded
- ✅ Unlimited BOQ processing (Professional/Enterprise)
- ✅ No trial restrictions
- ✅ Subscription expiry date set (30 days from payment)

---

#### Test Case 6.4.2: Subscription Renewal

**Objective:** Test automatic renewal vs manual renewal

**Steps:**
1. Wait for subscription to approach expiry (or simulate)
2. Check for renewal reminder (7 days before)
3. Verify auto-renewal option (if set)
4. Test manual renewal process

**Expected Results:**
- ✅ Reminder email sent 7 days before expiry
- ✅ Auto-renewal processes if enabled
- ✅ Manual renewal option available
- ✅ Grace period: 3 days after expiry before downgrade

---

## 7. Admin Dashboard Testing

### 7.1 Supplier Approval Workflow

#### Test Case 7.1.1: Approve Pending Supplier

**Objective:** Verify admin can approve suppliers

**Steps:**
1. Login as admin
2. Navigate to "Suppliers" tab
3. Filter by status: Pending
4. Click on pending supplier
5. Review details: company registration, VAT number, compliance documents
6. Click "Approve"
7. Add approval notes: "Verified documents - approved"
8. Confirm approval

**Expected Results:**
- ✅ Status changes to "Approved"
- ✅ Supplier notified via email
- ✅ Supplier can now login and add products
- ✅ Approval timestamp recorded

---

#### Test Case 7.1.2: Reject Non-Compliant Supplier

**Steps:**
1. Select pending supplier with issues
2. Click "Reject"
3. Select rejection reason: Invalid registration, Missing docs, Fraudulent info
4. Add rejection notes
5. Confirm rejection

**Expected Results:**
- ✅ Status = "Rejected"
- ✅ Supplier notified with reason
- ✅ Cannot login or add products
- ✅ Can re-apply after 30 days

---

### 7.2 Database Inspection

#### Test Case 7.2.1: View Suppliers Table

**Steps:**
1. Navigate to "Database" tab
2. Select table: "suppliers"
3. View records
4. Check columns: id, company_name, email, status, tier, created_at
5. Apply filters (status = approved)

**Expected Results:**
- ✅ All suppliers listed
- ✅ Data displays correctly
- ✅ Filters work
- ✅ Can sort by columns

---

#### Test Case 7.2.2: View Processed BOQs Table

**Steps:**
1. Select table: "processed_boqs"
2. View recent BOQ submissions
3. Check: project value, province, compliance costs, timestamp

**Expected Results:**
- ✅ All processed BOQs logged
- ✅ Compliance costs captured
- ✅ Can export to CSV

---

### 7.3 Billing & ROI Analytics

#### Test Case 7.3.1: Revenue Tracking

**Steps:**
1. Navigate to "Billing & ROI" tab
2. View subscription revenue metrics
3. Check monthly recurring revenue (MRR)
4. Verify payment method breakdown

**Expected Results:**
- ✅ Total MRR calculated correctly
- ✅ Payment method distribution shown (Bank EFT vs Stitch vs PayFast)
- ✅ Transaction fees tracked
- ✅ Net revenue calculated (gross - fees)

**Example Analytics:**

| Payment Method | Count | Gross Revenue | Fees | Net Revenue |
|----------------|-------|---------------|------|-------------|
| Bank EFT | 15 | R29,985 | R0 | R29,985 |
| Stitch | 25 | R49,975 | R50 | R49,925 |
| PayFast | 10 | R19,990 | R612 | R19,378 |
| **TOTAL** | **50** | **R99,950** | **R662** | **R99,288** |

**ROI Calculation:**
- Savings: R662/month vs PayFast-only (R2,899 fees)
- Annual savings: R26,844
- 5-year savings: R134,220

---

## 8. Export Functions Testing

### 8.1 PDF Export

#### Test Case 8.1.1: Export Priced BOQ to PDF

**Steps:**
1. Process BOQ with 50 items
2. Click "Export to PDF"
3. Wait for generation
4. Verify PDF downloads
5. Open PDF and check:
   - All line items present
   - Prices correct
   - Totals calculated
   - Professional formatting
   - Company branding

**Expected Results:**
- ✅ PDF generates in <5 seconds
- ✅ All 50 items included
- ✅ Pricing matches screen
- ✅ Compliance costs section included
- ✅ Regional pricing notes present

---

### 8.2 Excel Export

#### Test Case 8.2.1: Export to Excel with Formulas

**Steps:**
1. Process BOQ
2. Click "Export to Excel"
3. Download .xlsx file
4. Open in Excel/Google Sheets
5. Verify formulas preserved (not just values)

**Expected Results:**
- ✅ Formulas intact (e.g., =B2*C2 for line totals)
- ✅ Can edit quantities and totals recalculate
- ✅ Compliance costs on separate sheet
- ✅ Charts/graphs included

---

### 8.3 Word Document Export

#### Test Case 8.3.1: Export Testing Guides

**Steps:**
1. Navigate to Admin Dashboard → Testing tab
2. Click "Download Compliance Guide (Word)"
3. Verify Word document downloads
4. Open and check content:
   - Title page with branding
   - Table of contents
   - Test cases formatted correctly
   - Headers color-coded
   - Bullet points preserved

**Expected Results:**
- ✅ Document downloads successfully
- ✅ Professional formatting
- ✅ All content present
- ✅ Images/logos included (if applicable)

---

## 9. Performance Testing

### 9.1 Load Time Testing

#### Test Case 9.1.1: Initial Page Load

**Objective:** Verify app loads quickly

**Steps:**
1. Open Chrome DevTools → Network tab
2. Clear cache
3. Navigate to Qilly homepage
4. Record load time

**Expected Results:**
- ✅ First contentful paint (FCP): <1.5 seconds
- ✅ Time to interactive (TTI): <3 seconds
- ✅ Total page load: <5 seconds
- ✅ No blocking scripts

---

### 9.2 Concurrent User Testing

#### Test Case 9.2.1: Multiple Simultaneous Users

**Objective:** Test system handles concurrent BOQ processing

**Steps:**
1. Simulate 10 users processing BOQs simultaneously
2. Monitor server response times
3. Check for race conditions
4. Verify data integrity

**Expected Results:**
- ✅ No performance degradation
- ✅ All BOQs process correctly
- ✅ No data corruption
- ✅ Response times <5 seconds each

---

## 10. Security & Compliance Testing

### 10.1 POPIA Compliance

#### Test Case 10.1.1: Data Consent

**Steps:**
1. Register new account
2. Verify privacy policy acceptance required
3. Check consent checkboxes present
4. Verify data usage explained

**Expected Results:**
- ✅ Cannot register without consent
- ✅ Privacy policy link works
- ✅ Consent recorded in database
- ✅ User can request data deletion
- ✅ Audit trail of consent captured

---

### 10.2 Authentication Security

#### Test Case 10.2.1: Password Strength

**Steps:**
1. Try registering with weak password: "123456"
2. Check error: "Password must be 8+ characters, uppercase, lowercase, number"
3. Register with strong password: "Qilly@2026!"
4. Verify accepted

**Expected Results:**
- ✅ Weak passwords rejected
- ✅ Password hashed (never stored plaintext)
- ✅ Login lockout after 5 failed attempts

---

### 10.3 SQL Injection Testing

#### Test Case 10.3.1: Input Sanitization

**Steps:**
1. Try SQL injection in search field: ' OR '1'='1
2. Try in BOQ item description: "; DROP TABLE suppliers; --
3. Verify no database queries executed

**Expected Results:**
- ✅ Inputs sanitized
- ✅ Parameterized queries used
-  No error messages revealing database structure

---

## 11. Test Results Documentation

### 11.1 Test Report Template

\`\`\`
QILLY SYSTEM TEST REPORT
Date: [YYYY-MM-DD]
Tester: [Name]
Environment: [Demo / Production]
Browser: [Chrome / Firefox / Safari]

SUMMARY:
- Total Test Cases: 106
- Passed: 102 (96%)
- Failed: 3 (3%)
- Blocked: 1 (1%)

CRITICAL FAILURES:
1. [Test Case ID] - [Description] - [Impact]

MINOR ISSUES:
1. [Test Case ID] - [Description] - [Workaround]

RECOMMENDATIONS:
1. Fix critical failures before DHS demo
2. Optimize BOQ processing speed
3. Add more supplier data

SIGN-OFF:
Tester: ________________  Date: __________
QA Lead: _______________  Date: __________
Project Manager: _______ Date: __________
\`\`\`

---

### 11.2 Defect Report Template

\`\`\`
DEFECT REPORT #001

Title: [Brief description]
Severity: [Critical / High / Medium / Low]
Priority: [P1 / P2 / P3 / P4]
Status: [New / In Progress / Fixed / Closed]

Environment:
- Browser: Chrome 120
- OS: Windows 11
- Mode: Demo

Steps to Reproduce:
1. [Step 1]
2. [Step 2]
3. [Step 3]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach relevant screenshots]

Logs/Console Errors:
[Paste console errors if applicable]

Assigned To: [Developer Name]
Target Resolution: [Date]
\`\`\`

---

## Summary

**Total Test Cases:** 106
**Test Suites:** 11
**Estimated Testing Time:** 40 hours
**Critical Path Tests:** 25
**Regression Tests:** 81
**Automation Potential:** 60% of tests

### Test Coverage by Feature

| Feature | Test Cases | Priority |
|---------|------------|----------|
| BOQ Processing | 15 | Critical |
| Regional Pricing | 12 | Critical |
| Compliance Calculator | 18 | Critical |
| Payment Integration | 18 | Critical |
| Admin Dashboard | 12 | High |
| Exports | 8 | Medium |
| Performance | 10 | High |
| Security | 8 | Critical |
| Documentation | 5 | Low |

### Sign-off Checklist

- [ ] All critical tests passed
- [ ] No P1 or P2 defects open
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] User acceptance testing done
- [ ] Documentation updated
- [ ] Deployment plan reviewed
- [ ] Rollback plan documented

---

**Document Status:** Complete
**Version:** 1.0
**Last Updated:** February 19, 2026
**Next Review:** March 19, 2026`;
}