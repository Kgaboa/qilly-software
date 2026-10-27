import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { parseTenderDocxServer } from './docx-server';

async function makeDocx(rows: string[][]): Promise<Uint8Array> {
  const zip = new JSZip();
  const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const xmlRows = rows.map(cells =>
    '<w:tr>' + cells.map(cell => '<w:tc><w:p><w:r><w:t>' + escapeXml(cell) + '</w:t></w:r></w:p></w:tc>').join('') + '</w:tr>'
  ).join('');
  zip.file('word/document.xml', '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:tbl>' + xmlRows + '</w:tbl></w:body></w:document>');
  return zip.generateAsync({ type: 'uint8array' });
}

describe('DOCX customer extraction approval gate', () => {
  it('recognizes a valid six-column BOQ without inventing rates', async () => {
    const bytes = await makeDocx([
      ['Item', 'Description', 'Unit', 'Quantity', 'Rate', 'Amount'],
      ['1', 'Excavation of trenches', 'm3', '10', '200', '2000'],
      ['2', 'Supply concrete', 'm3', '5', '1000', '5000']
    ]);
    const result = await parseTenderDocxServer(bytes);
    expect(result.lines).toHaveLength(2);
    expect(result.lines[0].quantity).toBe(10);
    expect(result.lines[0].rate).toBe(200);
    expect(result.lines[1].amount).toBe(5000);
    expect(result.importBlocked).toBe(false);
  });

  it('blocks approval if a numeric source line cannot be mapped', async () => {
    const bytes = await makeDocx([
      ['1', 'Excavation of trenches', 'm3', '10', '200', '2000'],
      ['2', 'Unmapped item 12345', 'unknown unit', '7', '300', '2100']
    ]);
    const result = await parseTenderDocxServer(bytes);
    expect(result.unparsed.length).toBeGreaterThan(0);
    expect(result.importBlocked).toBe(true);
  });

  it('blocks non-BOQ documents with zero recognized lines', async () => {
    const bytes = await makeDocx([['Project reference 123456', 'Tender instructions only']]);
    const result = await parseTenderDocxServer(bytes);
    expect(result.lines).toHaveLength(0);
    expect(result.importBlocked).toBe(true);
  });

  it('rejects malformed input without reading external resources', async () => {
    await expect(parseTenderDocxServer(new Uint8Array([1, 2, 3, 4]))).rejects.toThrow();
  });
});
