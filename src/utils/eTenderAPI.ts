// eTender API Infrastructure - Qilly Integration Layer
// This provides the complete API infrastructure for electronic tender submission
// Can be connected to real eTender endpoints or used with simulated responses

export interface ETenderSubmissionPayload {
  // Core Tender Information
  tenderId: string;
  tenderReference: string;
  projectName: string;
  municipality: string;
  province: string;
  submissionDate: string;
  closingDate: string;
  
  // Contractor Information
  contractor: {
    companyName: string;
    registrationNumber: string;
    cidbRegistration: string;
    cidbGrade: string;
    taxNumber: string;
    vatNumber: string;
    bbbeeLevel: string;
    bbbeePoints: number;
    contactPerson: string;
    email: string;
    phone: string;
    physicalAddress: string;
    postalAddress: string;
  };
  
  // Financial Information
  pricing: {
    boqTotal: number; // Materials + Labor
    deliveryCosts: number;
    complianceCosts: number;
    preliminariesAndGeneral: number;
    greenPremium: number;
    grandTotal: number;
    currency: string; // "ZAR"
    validityPeriod: number; // days
  };
  
  // Bill of Quantities
  boq: {
    items: {
      itemNumber: string;
      description: string;
      quantity: number;
      unit: string;
      unitRate: number;
      totalPrice: number;
      supplierName: string;
      deliveryTime: string;
    }[];
    totalItems: number;
    totalValue: number;
  };
  
  // Compliance & Certifications
  compliance: {
    nhbrc: {
      registered: boolean;
      enrollmentNumber?: string;
      validUntil?: string;
      cost: number;
    };
    cidb: {
      registered: boolean;
      grade: string;
      validUntil?: string;
      cost: number;
    };
    bbbee: {
      level: string;
      points: number;
      certificateNumber?: string;
      validUntil?: string;
      verificationAgency?: string;
    };
    taxClearance: {
      valid: boolean;
      pinNumber?: string;
      validUntil?: string;
    };
    insurances: {
      professionalIndemnity: boolean;
      publicLiability: boolean;
      workmensCompensation: boolean;
      totalCost: number;
    };
  };
  
  // Green Building & Environmental
  environmental: {
    useGreenMaterials: boolean;
    carbonMetrics?: {
      standardEmissions: number; // tCO₂e
      greenEmissions: number; // tCO₂e
      carbonSavings: number; // tCO₂e
      carbonSavingsPercent: number;
      costPremium: number; // ZAR
      costPremiumPercent: number;
      roiPerTonne: number; // R/tCO₂e saved
      dhsGreenScore: string; // A+, A, B, C, D
    };
    nemaCompliance: {
      compliant: boolean;
      authorizationsRequired: number;
      complianceScore: number; // 0-100
      riskLevel: string; // Low, Medium, High, Critical
      estimatedCost: number;
      timelineImpact: number; // days
    };
    wasteManagement: {
      totalWaste: number; // tonnes
      recyclingRate: number; // percentage
      disposalCost: number;
      licensedContractor: string;
    };
    empIncluded: boolean;
  };
  
  // Collusion Risk Assessment
  collusionRisk: {
    riskLevel: 'Low' | 'Medium' | 'High';
    similarityScore: number; // 0-100
    flaggedItems: string[];
    priceDeviation: number; // percentage from market average
  };
  
  // Project Timeline
  timeline: {
    mobilizationDays: number;
    constructionDays: number;
    completionDate: string;
    milestones: {
      name: string;
      dueDate: string;
      percentComplete: number;
    }[];
  };
  
  // Supporting Documents (references to uploaded files)
  documents: {
    pricedBOQ: {
      filename: string;
      filesize: number;
      format: 'PDF' | 'Excel';
      checksum: string;
    };
    companyProfile: {
      filename: string;
      filesize: number;
      format: 'PDF';
      checksum: string;
    };
    sbdForms: {
      filename: string;
      filesize: number;
      format: 'PDF';
      checksum: string;
    };
    certificates: {
      bbbee?: { filename: string; filesize: number; format: 'PDF' };
      cidb?: { filename: string; filesize: number; format: 'PDF' };
      nhbrc?: { filename: string; filesize: number; format: 'PDF' };
      taxClearance?: { filename: string; filesize: number; format: 'PDF' };
    };
  };
  
  // Metadata
  metadata: {
    generatedBy: string; // "Qilly"
    version: string; // API version
    submittedVia: 'API' | 'Manual';
    ipAddress: string;
    userAgent: string;
    checksum: string; // For data integrity
  };
}

export interface ETenderSubmissionResponse {
  success: boolean;
  submissionId: string;
  receiptNumber: string;
  status: 'Received' | 'Under Review' | 'Accepted' | 'Rejected' | 'Queried';
  message: string;
  timestamp: string;
  nextSteps: string[];
  errors?: {
    field: string;
    message: string;
  }[];
}

export interface ETenderStatusResponse {
  submissionId: string;
  receiptNumber: string;
  status: 'Received' | 'Under Review' | 'Accepted' | 'Rejected' | 'Queried';
  currentStage: string;
  progress: number; // 0-100
  timeline: {
    received: string;
    underReview?: string;
    evaluated?: string;
    awarded?: string;
  };
  evaluatorComments?: string[];
  queries?: {
    id: string;
    question: string;
    response?: string;
    dueDate: string;
  }[];
  awardStatus?: {
    awarded: boolean;
    awardedTo?: string;
    awardDate?: string;
    contractValue?: number;
  };
}

/**
 * Submit tender electronically to eTender portal
 * 
 * PRODUCTION: Replace URL with real eTender API endpoint
 * DEVELOPMENT: Uses simulated response for testing
 */
export async function submitToETender(
  payload: ETenderSubmissionPayload,
  mode: 'production' | 'simulation' = 'simulation'
): Promise<ETenderSubmissionResponse> {
  
  if (mode === 'production') {
    // PRODUCTION MODE: Real eTender API
    const eTenderAPIUrl = process.env.NEXT_PUBLIC_ETENDER_API_URL || 'https://api.etender.gov.za/v1/submissions';
    const apiKey = process.env.NEXT_PUBLIC_ETENDER_API_KEY;
    
    if (!apiKey) {
      throw new Error('eTender API key not configured. Set NEXT_PUBLIC_ETENDER_API_KEY environment variable.');
    }
    
    try {
      const response = await fetch(eTenderAPIUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Version': '1.0',
          'X-Client': 'Qilly',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`eTender API Error: ${errorData.message || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('eTender submission error:', error);
      throw error;
    }
  } else {
    // SIMULATION MODE: Mock response for development/demo
    return new Promise((resolve) => {
      setTimeout(() => {
        // Validate required fields
        const errors: { field: string; message: string }[] = [];
        
        if (!payload.contractor.cidbRegistration) {
          errors.push({ field: 'contractor.cidbRegistration', message: 'CIDB registration is required' });
        }
        
        if (!payload.contractor.bbbeeLevel) {
          errors.push({ field: 'contractor.bbbeeLevel', message: 'BBBEE level is required' });
        }
        
        if (!payload.compliance.taxClearance.valid) {
          errors.push({ field: 'compliance.taxClearance', message: 'Valid tax clearance certificate required' });
        }
        
        if (errors.length > 0) {
          resolve({
            success: false,
            submissionId: '',
            receiptNumber: '',
            status: 'Rejected',
            message: 'Tender submission rejected due to validation errors',
            timestamp: new Date().toISOString(),
            nextSteps: ['Correct the errors listed below', 'Resubmit your tender before closing date'],
            errors,
          });
          return;
        }
        
        // Successful submission
        const receiptNumber = `ET-${payload.municipality.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        
        resolve({
          success: true,
          submissionId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          receiptNumber,
          status: 'Received',
          message: 'Tender submission received successfully',
          timestamp: new Date().toISOString(),
          nextSteps: [
            'Your tender is now under review by the tender authority',
            'You will receive an email confirmation within 24 hours',
            'Evaluation will be completed within 14 working days',
            'Check your eTender dashboard for status updates',
            'If awarded, you will be contacted within 3 working days of evaluation completion',
          ],
        });
      }, 2000); // Simulate network delay
    });
  }
}

/**
 * Check tender submission status
 */
export async function checkETenderStatus(
  submissionId: string,
  mode: 'production' | 'simulation' = 'simulation'
): Promise<ETenderStatusResponse> {
  
  if (mode === 'production') {
    const eTenderAPIUrl = process.env.NEXT_PUBLIC_ETENDER_API_URL || 'https://api.etender.gov.za/v1/submissions';
    const apiKey = process.env.NEXT_PUBLIC_ETENDER_API_KEY;
    
    if (!apiKey) {
      throw new Error('eTender API key not configured');
    }
    
    try {
      const response = await fetch(`${eTenderAPIUrl}/${submissionId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-Version': '1.0',
          'X-Client': 'Qilly',
        },
      });
      
      if (!response.ok) {
        throw new Error(`eTender API Error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('eTender status check error:', error);
      throw error;
    }
  } else {
    // SIMULATION MODE
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          submissionId,
          receiptNumber: `ET-JHB-2026-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
          status: 'Under Review',
          currentStage: 'Technical Evaluation',
          progress: 45,
          timeline: {
            received: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            underReview: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
          evaluatorComments: [
            'BOQ pricing is competitive and within market range',
            'All compliance documents verified and in order',
            'Green building metrics noted - environmental score: A',
          ],
        });
      }, 1000);
    });
  }
}

/**
 * Helper: Build eTender payload from Qilly BOQ data
 */
export function buildETenderPayload(
  boqData: any,
  contractorData: any,
  complianceData: any,
  carbonData: any,
  environmentalData: any,
  tenderInfo: {
    tenderId: string;
    tenderReference: string;
    projectName: string;
    closingDate: string;
  }
): ETenderSubmissionPayload {
  
  return {
    // Core Tender Information
    tenderId: tenderInfo.tenderId,
    tenderReference: tenderInfo.tenderReference,
    projectName: tenderInfo.projectName,
    municipality: boqData.projectSettings?.municipality || 'Johannesburg',
    province: boqData.projectSettings?.province || 'GP',
    submissionDate: new Date().toISOString(),
    closingDate: tenderInfo.closingDate,
    
    // Contractor Information
    contractor: {
      companyName: contractorData?.company_name || 'Your Company Name',
      registrationNumber: contractorData?.registration_number || '',
      cidbRegistration: contractorData?.cidb_registration_number || contractorData?.cidb_registration || '',
      cidbGrade: contractorData?.cidb_grade || 'GB4',
      taxNumber: contractorData?.tax_number || '',
      vatNumber: contractorData?.vat_number || '',
      bbbeeLevel: contractorData?.bbbee_level || 'Level 4',
      bbbeePoints: contractorData?.bbbee_points || 10,
      contactPerson: contractorData?.contact_person || '',
      email: contractorData?.email || '',
      phone: contractorData?.phone || '',
      physicalAddress: contractorData?.physical_address || '',
      postalAddress: contractorData?.postal_address || '',
    },
    
    // Financial Information
    pricing: {
      boqTotal: boqData.grandTotal || 0,
      deliveryCosts: boqData.totalTransportCost || 0,
      complianceCosts: complianceData?.total || 0,
      preliminariesAndGeneral: complianceData?.preliminaries?.total || 0,
      greenPremium: carbonData?.costPremium || 0,
      grandTotal: boqData.overallBOQTotal || 0,
      currency: 'ZAR',
      validityPeriod: 90, // days
    },
    
    // Bill of Quantities
    boq: {
      items: (boqData.pricedItems || []).map((item: any, idx: number) => ({
        itemNumber: (idx + 1).toString(),
        description: item.description || item.name || '',
        quantity: parseFloat(item.quantity) || 0,
        unit: item.unit || '',
        unitRate: parseFloat(item.unitPrice) || 0,
        totalPrice: parseFloat(item.totalPrice) || 0,
        supplierName: item.selectedSupplier || item.supplier || item.supplierName || '',
        deliveryTime: item.deliveryTime || 'TBC',
      })),
      totalItems: (boqData.pricedItems || []).length,
      totalValue: boqData.grandTotal || 0,
    },
    
    // Compliance & Certifications
    compliance: {
      nhbrc: {
        registered: true,
        enrollmentNumber: contractorData?.nhbrc_number,
        validUntil: contractorData?.nhbrc_valid_until,
        cost: complianceData?.nhbrc?.total || 0,
      },
      cidb: {
        registered: !!contractorData?.cidb_registration,
        grade: contractorData?.cidb_grade || 'GB4',
        validUntil: contractorData?.cidb_valid_until,
        cost: complianceData?.cidb?.total || 0,
      },
      bbbee: {
        level: contractorData?.bbbee_level || 'Level 4',
        points: contractorData?.bbbee_points || 10,
        certificateNumber: contractorData?.bbbee_certificate,
        validUntil: contractorData?.bbbee_valid_until,
        verificationAgency: contractorData?.bbbee_agency,
      },
      taxClearance: {
        valid: true,
        pinNumber: contractorData?.tax_number,
      },
      insurances: {
        professionalIndemnity: true,
        publicLiability: true,
        workmensCompensation: true,
        totalCost: complianceData?.insurances?.total || 0,
      },
    },
    
    // Green Building & Environmental
    environmental: {
      useGreenMaterials: !!carbonData,
      carbonMetrics: carbonData ? {
        standardEmissions: carbonData.standardTotalEmissions || 0,
        greenEmissions: carbonData.greenTotalEmissions || 0,
        carbonSavings: carbonData.carbonSavings || 0,
        carbonSavingsPercent: carbonData.carbonSavingsPercent || 0,
        costPremium: carbonData.costPremium || 0,
        costPremiumPercent: carbonData.costPremiumPercent || 0,
        roiPerTonne: carbonData.costPerTonneCO2eSaved || 0,
        dhsGreenScore: carbonData.dhsGreenScore || 'C',
      } : undefined,
      nemaCompliance: {
        compliant: environmentalData?.nemaCompliant || true,
        authorizationsRequired: environmentalData?.authorizationsRequired?.length || 0,
        complianceScore: environmentalData?.complianceScore || 100,
        riskLevel: environmentalData?.overallRisk || 'Low',
        estimatedCost: environmentalData?.estimatedComplianceCost || 0,
        timelineImpact: environmentalData?.estimatedTimelineDelay || 0,
      },
      wasteManagement: {
        totalWaste: environmentalData?.wasteEstimates?.reduce((sum: number, w: any) => sum + w.estimatedVolume, 0) || 0,
        recyclingRate: environmentalData?.wasteEstimates?.reduce((sum: number, w: any) => sum + w.recyclingPotential, 0) / 
                       (environmentalData?.wasteEstimates?.length || 1) || 0,
        disposalCost: environmentalData?.wasteEstimates?.reduce((sum: number, w: any) => sum + w.estimatedCost, 0) || 0,
        licensedContractor: environmentalData?.wasteEstimates?.[0]?.licensedContractors?.[0] || 'TBC',
      },
      empIncluded: !!environmentalData,
    },
    
    // Collusion Risk Assessment
    collusionRisk: {
      riskLevel: 'Low', // TODO: Integrate with collusion detection
      similarityScore: 0,
      flaggedItems: [],
      priceDeviation: 0,
    },
    
    // Project Timeline
    timeline: {
      mobilizationDays: 14,
      constructionDays: 120,
      completionDate: new Date(Date.now() + 134 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      milestones: [
        { name: 'Mobilization', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], percentComplete: 0 },
        { name: 'Foundations', dueDate: new Date(Date.now() + 44 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], percentComplete: 25 },
        { name: 'Superstructure', dueDate: new Date(Date.now() + 74 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], percentComplete: 50 },
        { name: 'Finishes', dueDate: new Date(Date.now() + 104 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], percentComplete: 75 },
        { name: 'Handover', dueDate: new Date(Date.now() + 134 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], percentComplete: 100 },
      ],
    },
    
    // Supporting Documents
    documents: {
      pricedBOQ: {
        filename: 'BOQ_Priced.pdf',
        filesize: 0,
        format: 'PDF',
        checksum: '',
      },
      companyProfile: {
        filename: 'Company_Profile.pdf',
        filesize: 0,
        format: 'PDF',
        checksum: '',
      },
      sbdForms: {
        filename: 'SBD_Forms.pdf',
        filesize: 0,
        format: 'PDF',
        checksum: '',
      },
      certificates: {},
    },
    
    // Metadata
    metadata: {
      generatedBy: 'Qilly',
      version: '1.0',
      submittedVia: 'API',
      ipAddress: '0.0.0.0', // Will be filled by server
      userAgent: navigator.userAgent,
      checksum: '', // Will be calculated
    },
  };
}