/** Canonical comparisons for contractor-scoped tender discovery. */
export const normaliseTenderKey = (value: string) => value.trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-ZA');
export const normaliseSourceUrl = (value: string) => {
  const parsed = new URL(value.trim());
  if (parsed.protocol !== 'https:' || parsed.username || parsed.password) throw Error('Tender source must be a public HTTPS URL without credentials');
  parsed.hash = '';
  parsed.hostname = parsed.hostname.toLowerCase();
  if (parsed.pathname !== '/') parsed.pathname = parsed.pathname.replace(/\/$/, '');
  return parsed.toString();
};
export const isDuplicateTender = (items: Array<{customer_name:string;tender_reference:string|null}>, issuer:string, reference:string) =>
  items.some(item => normaliseTenderKey(item.customer_name) === normaliseTenderKey(issuer) && normaliseTenderKey(item.tender_reference||'') === normaliseTenderKey(reference));
