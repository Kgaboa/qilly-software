import { describe, expect, it } from 'vitest';
import { isDuplicateTender, normaliseSourceUrl } from './tenderDiscovery';
describe('tender discovery safety checks',()=>{
 it('rejects same issuer/reference with different case or whitespace',()=>expect(isDuplicateTender([{customer_name:'  City  of Johannesburg ',tender_reference:' ABC-123 '}],'city of johannesburg','abc-123')).toBe(true));
 it('allows different issuer',()=>expect(isDuplicateTender([{customer_name:'City A',tender_reference:'ABC'}],'City B','ABC')).toBe(false));
 it('normalises HTTPS URL without fragments',()=>expect(normaliseSourceUrl('https://EXAMPLE.org/tender/#notice')).toBe('https://example.org/tender'));
 it('rejects non-HTTPS and credentialed URLs',()=>{expect(()=>normaliseSourceUrl('http://example.org')).toThrow();expect(()=>normaliseSourceUrl('https://user:pass@example.org')).toThrow();});
});