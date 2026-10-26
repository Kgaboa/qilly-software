import { useState } from 'react';
import { Button } from './ui/button';

const allowed = new Set(['xlsx','xls','csv','tsv','txt','pdf','doc','docx']);
export function FlexibleTenderFileReview({ onBack, onStandard }: { onBack: () => void; onStandard: () => void }) {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  async function selectFile(file?: File) {
    setName(''); setStatus(''); setPreview(''); setError('');
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowed.has(ext)) { setError('Unsupported document type. Choose Excel, Word, PDF, CSV or text.'); return; }
    if (file.size > 15 * 1024 * 1024) { setError('Maximum file size is 15 MB.'); return; }
    if (file.size === 0) { setError('The selected document is empty.'); return; }
    setName(file.name);
    if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
      try {
        const text = await file.slice(0, 16000).text();
        setPreview(text.slice(0, 4000));
        setStatus('Local text preview only. Review and map this document before pricing.');
      } catch { setError('Unable to read the local text preview.'); }
    } else {
      setStatus('File validated locally. Full extraction for this format is not connected to this UAT workflow. For supported Excel BOQs, use Standard Excel BOQ Import.');
    }
  }
  return <section aria-label="Flexible Tender Import" className="mb-6 rounded-xl border bg-white p-6 shadow-sm space-y-4">
    <h2 className="text-2xl font-bold">Flexible Tender Import</h2>
    <p className="text-sm text-slate-600">Choose a document for local validation. Nothing is uploaded or saved by this screen. This is not a completed tender extraction or pricing workflow.</p>
    <label htmlFor="flexible-tender-file" className="block font-semibold">Select Excel, Word, PDF, CSV or text file (up to 15 MB)</label>
    <input id="flexible-tender-file" aria-label="Select tender document" type="file" accept=".xlsx,.xls,.csv,.tsv,.txt,.pdf,.doc,.docx" onChange={event => { void selectFile(event.currentTarget.files?.[0]); }} className="block w-full rounded-lg border p-3" />
    {error && <p role="alert" className="text-red-700">{error}</p>}
    {name && <div className="rounded-lg bg-slate-50 p-4"><p className="font-semibold">{name}</p><p className="mt-1 text-sm text-amber-800">{status}</p></div>}
    {preview && <div><h3 className="font-semibold">Local text preview (first 4,000 characters)</h3><pre className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap rounded bg-slate-100 p-3 text-xs">{preview}</pre></div>}
    <p className="text-sm text-amber-800">Do not select confidential customer tenders until the protected Phase 2 extraction service and security review are approved.</p>
    <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={onBack}>Back to Import Options</Button><Button onClick={onStandard}>Use Standard Excel BOQ Import</Button></div>
  </section>;
}
