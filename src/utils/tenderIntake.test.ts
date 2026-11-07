import { describe,it,expect } from 'vitest';
import { tenderReadiness,validateTenderIntake,type TenderIntake } from './tenderIntake';
const intake:TenderIntake={opportunityId:'opp-1',route:'contractor_import',issuer:'Municipality',
 reference:'MUN-001',title:'Road rehabilitation',closingDate:'2027-01-31',
 documents:[{id:'notice',name:'Tender.pdf',kind:'tender_notice',version:1,uploadedAt:'2026-11-07',extractionStatus:'verified'}],
 requirements:[{id:'cidb',description:'CIDB grading',mandatory:true,status:'evidence_required',sourceDocumentId:'notice'}]};
describe('Sprint 4A tender intake',()=>{
 it('accepts contractor imported tender',()=>expect(validateTenderIntake(intake)).toEqual([]));
 it('requires traceable discovery source',()=>expect(validateTenderIntake({...intake,route:'qilly_discovery'})).toContain('Discovered tender requires a secure source URL'));
 it('rejects compliance references to missing documents',()=>expect(validateTenderIntake({...intake,requirements:[{...intake.requirements[0],sourceDocumentId:'missing'}]})).toContain('Compliance source document not registered'));
 it('does not claim readiness with missing evidence',()=>expect(tenderReadiness(intake)).toMatchObject({percent:0,ready:false}));
 it('calculates readiness only when verified',()=>expect(tenderReadiness({...intake,requirements:[{...intake.requirements[0],status:'verified'}]})).toMatchObject({percent:100,ready:true}));
 it('holds readiness for unresolved extraction',()=>expect(tenderReadiness({...intake,documents:[{...intake.documents[0],extractionStatus:'review'}],requirements:[{...intake.requirements[0],status:'verified'}]}).ready).toBe(false));
});
