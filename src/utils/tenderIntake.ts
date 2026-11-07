/** Unified tender intake contract for manual import (Route B) and future discovery (Route A). */
export type TenderIntakeRoute = 'contractor_import' | 'qilly_discovery' | 'direct_invitation';
export type TenderDocumentKind = 'tender_notice' | 'boq' | 'specification' | 'drawing' | 'addendum' | 'other';
export type TenderDocument = {
  id: string; name: string; kind: TenderDocumentKind; version: number;
  sourceUrl?: string; uploadedAt: string; extractionStatus: 'pending' | 'review' | 'verified';
};
export type ComplianceRequirement = {
  id: string; description: string; mandatory: boolean;
  status: 'not_started' | 'evidence_required' | 'under_review' | 'verified' | 'not_applicable';
  sourceDocumentId?: string; evidenceDocumentId?: string;
};
export type TenderIntake = {
  opportunityId: string; route: TenderIntakeRoute; issuer: string;
  reference: string; title: string; closingDate: string | null;
  sourceUrl?: string; sourcePublishedAt?: string;
  documents: TenderDocument[]; requirements: ComplianceRequirement[];
};
export function validateTenderIntake(intake: TenderIntake): string[] {
 const errors:string[]=[];
 if(!intake.opportunityId.trim())errors.push('Opportunity link required');
 if(!intake.issuer.trim())errors.push('Tender issuer required');
 if(!intake.title.trim())errors.push('Tender title required');
 if(!intake.reference.trim())errors.push('Tender reference required');
 if(intake.route==='qilly_discovery' && !intake.sourceUrl?.startsWith('https://')) errors.push('Discovered tender requires a secure source URL');
 if(intake.closingDate && Number.isNaN(Date.parse(intake.closingDate)))errors.push('Invalid closing date');
 const ids=new Set(intake.documents.map(d=>d.id));
 if(ids.size!==intake.documents.length)errors.push('Duplicate document IDs');
 if(intake.documents.some(d=>d.version<1 || !Number.isInteger(d.version)))errors.push('Document versions must be positive integers');
 if(intake.requirements.some(r=>r.sourceDocumentId && !ids.has(r.sourceDocumentId)))errors.push('Compliance source document not registered');
 if(intake.requirements.some(r=>r.evidenceDocumentId && !ids.has(r.evidenceDocumentId)))errors.push('Compliance evidence document not registered');
 return errors;
}
export function tenderReadiness(intake:TenderIntake){
 const mandatory=intake.requirements.filter(r=>r.mandatory && r.status!=='not_applicable');
 const verified=mandatory.filter(r=>r.status==='verified').length;
 const unresolved=intake.documents.filter(d=>d.extractionStatus!=='verified').length;
 return {mandatory:mandatory.length,verified,unresolvedDocuments:unresolved,
  percent:mandatory.length?Math.round(verified/mandatory.length*100):0,
  ready:mandatory.length>0 && verified===mandatory.length && unresolved===0};
}
