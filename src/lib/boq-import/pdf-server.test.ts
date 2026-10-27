import { describe, expect, it } from 'vitest';
import { jsPDF } from 'jspdf';
import { parseTenderPdfServer } from './pdf-server';

function pdfWithLines(lines: string[]): Uint8Array {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  lines.forEach((line, index) => doc.text(line, 42, 65 + index * 22));
  return new Uint8Array(doc.output('arraybuffer'));
}

describe('PDF tender extraction safety regression', () => {
  it('does not approve an ordinary non-BOQ PDF', async () => {
    const result = await parseTenderPdfServer(pdfWithLines([
      'Tender administration instructions',
      'Submission deadline and project scope',
      'Contact the procurement department'
    ]));
    expect(result.lines).toHaveLength(0);
    expect(result.importBlocked).toBe(true);
    expect(result.pageAudit).toHaveLength(1);
    expect(result.pageCoverage.accounted).toBe(1);
  });

  it('accounts for every source page and reports scanned page review', async () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.text('Tender administration instructions and conditions', 40, 70);
    doc.addPage();
    const result = await parseTenderPdfServer(new Uint8Array(doc.output('arraybuffer')));
    expect(result.pageAudit).toHaveLength(2);
    expect(result.pageCoverage.total).toBe(2);
    expect(result.pageCoverage.accounted).toBe(2);
    expect(result.missingOcrPages).toContain(2);
    expect(result.importBlocked).toBe(true);
  });

  it('rejects invalid PDF bytes', async () => {
    await expect(parseTenderPdfServer(new Uint8Array([1, 2, 3, 4]))).rejects.toThrow();
  });
});
