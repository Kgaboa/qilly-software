# Environmental Compliance Module - Technical Specification

**System:** Qilly Construction Billing Platform  
**Module:** Environmental Compliance Assessment  
**Version:** 1.0  
**Date:** March 7, 2026

---

## 1. Overview

The Environmental Compliance Module provides automated screening for South African environmental legislation compliance, specifically targeting NEMA (National Environmental Management Act) and Waste Management Act requirements.

---

## 2. Functional Requirements

### 2.1 NEMA Screening

**Input Parameters:**
```typescript
interface ProjectParameters {
  projectType: string;
  siteArea: number; // m²
  buildingFootprint: number; // m²
  excavationVolume?: number; // m³
  isProtectedArea?: boolean;
  isUrbanArea?: boolean;
  hasWatercourse?: boolean;
  watercourseDistance?: number; // meters
  hasHeritageProximity?: boolean;
  requiresRezoning?: boolean;
  province: string;
  municipality?: string;
}
```

**Output:**
```typescript
interface NEMAScreeningResult {
  triggeredActivities: NEMAActivity[];
  authorizationRequired: boolean;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  estimatedTimeframe: number; // days
  estimatedCost: number; // ZAR
}
```

**Screening Logic:**

1. **Site Clearance (R.983, Activity 27)**
   - Trigger: >300m² in protected areas OR >10,000m² elsewhere
   - Authorization: Basic Assessment
   - Timeline: 107 days
   - Cost: R50,000 - R150,000

2. **Large Earthworks (R.983, Activity 20)**
   - Trigger: >10,000m³ outside urban areas
   - Authorization: Full EIA
   - Timeline: 300 days
   - Cost: R200,000 - R500,000

3. **Watercourse Development (R.985, Activity 12)**
   - Trigger: <32m from watercourse/wetland
   - Authorization: EIA + Water Use License
   - Timeline: 300 days
   - Cost: R350,000+

4. **Rezoning (R.983, Activity 10)**
   - Trigger: Zoning change in protected areas
   - Authorization: Basic Assessment
   - Timeline: 107 days
   - Cost: R50,000 - R150,000

5. **Bulk Earthworks (R.983, Activity 18)**
   - Trigger: >5,000m³ material movement
   - Authorization: Basic Assessment
   - Timeline: 107 days
   - Cost: R50,000 - R150,000

6. **Heritage Proximity (R.324)**
   - Trigger: <60m from listed heritage site
   - Authorization: Heritage Impact Assessment
   - Timeline: 60 days
   - Cost: R25,000 - R75,000

---

### 2.2 Waste Management Calculation

**Input:** Array of priced BOQ items

**Output:**
```typescript
interface WasteEstimate {
  category: string;
  estimatedVolume: number;
  unit: 'm³' | 'kg' | 'ton';
  recyclingPotential: number; // percentage
  disposalMethod: 'Landfill' | 'Recycling' | 'Reuse' | 'Special Treatment';
  licensedContractors: string[];
  estimatedCost: number;
  sawicClassification?: string;
}
```

**Waste Calculation Formulas:**

1. **Concrete Waste**
   ```
   Volume = Total Concrete Volume × 0.08
   Recycling Potential = 85%
   Cost = Volume × R150/m³
   SAWIC Code = G-W-01
   ```

2. **Steel Waste**
   ```
   Weight = Total Steel Weight × 0.03
   Recycling Potential = 95%
   Cost = Weight × R0.50/kg (often offset by scrap value)
   SAWIC Code = G-M-01
   ```

3. **Timber Waste**
   ```
   Volume = Total Timber Volume × 0.12
   Recycling Potential = 40%
   Cost = Volume × R80/m³
   SAWIC Code = G-W-03
   ```

4. **General Construction Waste**
   ```
   Weight = Building Area × 20 kg/m²
   Recycling Potential = 30%
   Cost = Weight × R0.12/kg
   SAWIC Code = G-W-04
   ```

5. **Excavated Soil**
   ```
   Volume = Excavation Volume × 0.15 (bulking factor)
   Recycling Potential = 60%
   Cost = Volume × R50/m³
   SAWIC Code = G-W-05
   ```

6. **Hazardous Waste**
   ```
   Weight = Building Area × 0.5 kg/m²
   Recycling Potential = 10%
   Cost = Weight × R5.00/kg
   SAWIC Code = H-W-01
   ```

---

### 2.3 Compliance Scoring

**Formula:**
```
Base Score = 100

Deductions:
- NEMA listed activity triggered: -15 points each
- Critical risk factor: -20 points
- High risk factor: -10 points

Final Score = max(0, Base Score - Total Deductions)
```

**Risk Level Classification:**
- 80-100: Low Risk
- 60-79: Medium Risk
- 40-59: High Risk
- 0-39: Critical Risk

---

### 2.4 Environmental Management Plan (EMP) Generation

**Template Structure:**
```markdown
1. PROJECT INFORMATION
   - Name, location, size
   
2. LEGISLATIVE COMPLIANCE
   - NEMA authorization status
   - Waste Act requirements
   
3. ENVIRONMENTAL RISKS & MITIGATION
   - Risk description
   - Mitigation measures
   - Responsible parties
   - Monitoring frequency
   
4. WASTE MANAGEMENT PLAN
   - Waste categories
   - Disposal methods
   - Licensed contractors
   - SAWIC codes
   
5. ROLES & RESPONSIBILITIES
   - Site Agent
   - Environmental Officer
   - Waste Contractor
   - Environmental Consultant
   
6. MONITORING & REPORTING
   - Weekly site inspections
   - Monthly compliance reports
   - Quarterly environmental audits
   
7. EMERGENCY RESPONSE
   - Spill procedures
   - Fire response
   - Emergency contacts
```

---

## 3. Data Sources

### 3.1 Legislative References

**NEMA Framework:**
- National Environmental Management Act (Act 107 of 1998)
- EIA Regulations 2014:
  - R.982: Procedures
  - R.983: Activities requiring Basic Assessment
  - R.984: Environmental Management Plans
  - R.985: Activities requiring Full EIA
  - R.324: Listing Notice 1 (2014)
  - R.327: Listing Notice 3 (2014)

**Waste Legislation:**
- National Environmental Management: Waste Act (Act 59 of 2008)
- SAWIC (South African Waste Information Centre) classifications

**Supporting Legislation:**
- National Heritage Resources Act (Act 25 of 1999)
- National Water Act (Act 36 of 1998)
- SANS 10400-XA: Energy Efficiency

### 3.2 Industry Data Sources

**Waste Coefficients:**
- CSIR Green Building Handbook (2023 edition)
- Construction Industry Development Board (CIDB) benchmarks
- South African Green Building Council (GBCSA) data

**Cost Estimates:**
- Environmental Assessment Practitioner (EAP) industry rates (2026)
- Waste disposal industry averages (Gauteng, Western Cape, KZN)
- DEA authorization processing timelines (2024-2025 average)

---

## 4. Technical Implementation

### 4.1 Core Functions

**`screenNEMACompliance(projectParams)`**
- Input: Project parameters
- Output: NEMA screening result
- Complexity: O(1) - constant time evaluation
- Dependencies: None

**`calculateConstructionWaste(pricedItems, buildingArea, province)`**
- Input: BOQ items array, building area, province
- Output: Array of waste estimates
- Complexity: O(n) where n = number of BOQ items
- Dependencies: None

**`assessEnvironmentalCompliance(projectParams, pricedItems)`**
- Input: Project parameters, BOQ items
- Output: Comprehensive compliance status
- Complexity: O(n)
- Dependencies: Calls `screenNEMACompliance()` and `calculateConstructionWaste()`

**`generateEMPTemplate(projectParams, complianceStatus)`**
- Input: Project parameters, compliance assessment
- Output: Markdown-formatted EMP
- Complexity: O(1)
- Dependencies: None

### 4.2 React Component Structure

```
<EnvironmentalComplianceDashboard>
  ├─ <ComplianceScoreCard>     // Overall risk & score
  ├─ <Tabs>
  │   ├─ <OverviewTab>          // Risk summary
  │   ├─ <NEMATab>              // NEMA activities
  │   ├─ <WasteTab>             // Waste management
  │   └─ <ActionsTab>           // Recommendations
  └─ <EMPDownloadButton>        // EMP generator
```

**State Management:**
```typescript
const [activeTab, setActiveTab] = useState('overview');
const complianceStatus = useMemo(() => 
  assessEnvironmentalCompliance(projectParams, pricedItems),
  [projectParams, pricedItems]
);
```

---

## 5. Integration Points

### 5.1 Data Flow

```
User uploads BOQ
    ↓
BOQ parsed & priced
    ↓
Project parameters extracted
    ↓
Environmental screening triggered
    ↓
Compliance results displayed
    ↓
User downloads EMP
```

### 5.2 UI Integration

**Location:** RegionalPricedBillView component

**Trigger:** Collapsible card interface

**Display Logic:**
```typescript
{showEnvironmentalCompliance && (
  <EnvironmentalComplianceDashboard 
    projectParams={...}
    pricedItems={pricedItems}
  />
)}
```

---

## 6. Performance Considerations

### 6.1 Computational Complexity

- NEMA screening: **O(1)** - fixed number of checks
- Waste calculation: **O(n)** - linear with BOQ item count
- EMP generation: **O(1)** - template-based
- **Total:** O(n) where n = number of BOQ items (typically 50-500)

### 6.2 Memory Usage

- NEMA database: ~2KB (6 activity definitions)
- Waste coefficients: ~1KB (6 waste categories)
- Licensed contractors: ~5KB (36 contractors × 9 provinces)
- **Total static data:** ~8KB

### 6.3 Rendering Performance

- Component memoization: `useMemo()` for compliance calculations
- No external API calls in Phase 1
- Client-side computation only
- Expected render time: <100ms for typical BOQ

---

## 7. Testing Strategy

### 7.1 Unit Tests

**Test Coverage:**
- NEMA trigger thresholds (6 activities)
- Waste calculation formulas (6 categories)
- Risk level classification logic
- Compliance score calculation
- EMP template generation

**Sample Test Cases:**
```typescript
describe('NEMA Screening', () => {
  it('should trigger Basic Assessment for 5,500m³ earthworks', () => {
    const result = screenNEMACompliance({
      excavationVolume: 5500,
      isUrbanArea: false
    });
    expect(result.authorizationRequired).toBe(true);
    expect(result.triggeredActivities[0].activityNumber).toBe('Activity 18');
  });
});
```

### 7.2 Integration Tests

- Full workflow: BOQ upload → Environmental screening → EMP download
- Province-specific waste contractor recommendations
- Multiple NEMA triggers in single project
- Edge cases (zero waste, no triggers)

### 7.3 User Acceptance Testing

- DHS project manager review (target: 2 reviewers)
- Environmental consultant validation (target: 1 EAP)
- Contractor usability testing (target: 5 contractors)

---

## 8. Future Enhancements (Roadmap)

### Phase 2 (Q2 2026)
- SAWIC API integration for real-time waste contractor verification
- DEA online portal integration for application tracking
- Heritage screening via SAHRA database API
- Water Use License automation (DWS integration)

### Phase 3 (Q3 2026)
- Biodiversity screening (SANBI database)
- Air quality impact assessment
- Noise impact compliance
- Traffic management plan generator

### Phase 4 (Q4 2026)
- ISO 14001 alignment checker
- GBCSA Green Star certification tracker
- Carbon offset marketplace integration
- Automated EMP submission to DEA

---

## 9. Security & Privacy

### 9.1 Data Privacy
- No PII collected in environmental screening
- Project data stored in existing Supabase structure
- POPIA compliance maintained (existing consent flows)

### 9.2 Data Retention
- Compliance assessments stored with BOQ records
- EMP templates generated on-demand (not stored)
- Audit trail for compliance screening (future enhancement)

---

## 10. Deployment

### 10.1 Files Deployed

**Backend/Utilities:**
- `/src/utils/environmentalCompliance.ts` (530 lines)

**Frontend/Components:**
- `/src/app/components/EnvironmentalComplianceDashboard.tsx` (680 lines)
- `/src/app/components/RegionalPricedBillView.tsx` (updated)

**Documentation:**
- `/ENVIRONMENTAL_COMPLIANCE_IMPLEMENTATION_COMPLETE.md`
- `/ENVIRONMENTAL_COMPLIANCE_QUICK_REFERENCE.md`
- `/ENVIRONMENTAL_COMPLIANCE_TECHNICAL_SPEC.md` (this document)

### 10.2 Environment Variables
None required. Uses existing project configuration.

### 10.3 Database Changes
None required for Phase 1.

### 10.4 Dependencies
No new npm packages. Uses existing:
- React 18.x
- TypeScript 5.x
- shadcn/ui components
- Lucide React icons

---

## 11. Support & Maintenance

### 11.1 Known Limitations
- NEMA thresholds assume 2014 regulations (DEA updates rare but possible)
- Waste coefficients are industry averages (±10% variance in real projects)
- Licensed contractor database is static (Phase 2 will integrate SAWIC API)
- Heritage site proximity requires manual verification (no SAHRA API integration yet)

### 11.2 Monitoring
- Track environmental screening usage rate
- Monitor EMP download frequency
- Collect user feedback on accuracy of NEMA triggers
- A/B test compliance score thresholds

### 11.3 Updates Required
- Annual review of NEMA listing notices (DEA updates)
- Quarterly update of waste disposal costs (inflation adjustment)
- Bi-annual review of EAP fee estimates
- Ongoing licensed contractor database maintenance

---

## 12. API Documentation (Future)

### 12.1 Planned Endpoints

**POST /api/environmental/screen**
```json
{
  "projectParams": {...},
  "pricedItems": [...]
}
```
Response: `ComplianceStatus`

**GET /api/environmental/contractors/:province**
Response: `LicensedContractor[]`

**POST /api/environmental/emp**
```json
{
  "projectParams": {...},
  "complianceStatus": {...}
}
```
Response: EMP template (Markdown or PDF)

---

## 13. Compliance Statement

This module is designed to **assist** contractors with environmental compliance screening. It does **not** replace professional environmental consultants or guarantee regulatory approval. Users must:

1. Verify NEMA triggers with independent EAPs
2. Engage licensed environmental consultants for formal applications
3. Submit authorization applications to competent authorities (DEA/Provincial)
4. Appoint certified waste contractors with valid licenses

**Disclaimer:** Qilly provides screening tools, not legal or regulatory advice.

---

**Document Version:** 1.0  
**Author:** Qilly Development Team  
**Review Status:** Approved for production deployment  
**Next Review:** Post-investor presentation (March 18, 2026)
