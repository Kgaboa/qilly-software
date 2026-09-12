/**
 * Utility functions for exporting documents (Word, PDF) from Qilly
 * Supports markdown conversion to downloadable formats
 * 
 * NOTE: For testing documents, use /src/utils/exportTestingDocuments.ts instead
 * which provides enhanced PowerPoint and Word exports using docx and pptxgenjs libraries
 */

/**
 * Convert markdown content to HTML for Word document
 */
function markdownToHTML(markdown: string): string {
  // Basic markdown to HTML conversion
  let html = markdown;
  
  // Headers (process from most specific to least)
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold (before italic to prevent conflicts)
  html = html.replace(/\*\*\*(.+?)\*\*\*/gim, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.+?)\*/gim, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
  
  // Checkmarks and symbols
  html = html.replace(/✅/g, '&#x2705;');
  html = html.replace(/❌/g, '&#x274C;');
  html = html.replace(/⚠️/g, '&#x26A0;&#xFE0F;');
  html = html.replace(/🎯/g, '&#x1F3AF;');
  html = html.replace(/📋/g, '&#x1F4CB;');
  html = html.replace(/💰/g, '&#x1F4B0;');
  html = html.replace(/🔧/g, '&#x1F527;');
  
  // Code blocks (must be before inline code)
  html = html.replace(/```([^\n]*)\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>');
  
  // Inline code
  html = html.replace(/`([^`]+)`/gim, '<code>$1</code>');
  
  // Horizontal rules
  html = html.replace(/^\s*[-*_]{3,}\s*$/gim, '<hr>');
  
  // Lists - wrap consecutive list items
  // Unordered lists
  html = html.replace(/^[\*\-] (.+)$/gim, '<li>$1</li>');
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gim, '<li>$1</li>');
  
  // Wrap consecutive <li> tags in <ul>
  html = html.replace(/(<li>.*?<\/li>\s*)+/gis, '<ul>$&</ul>');
  
  // Tables (basic - just strip table formatting)
  html = html.replace(/\|/g, ' ');
  html = html.replace(/^-+$/gim, '');
  
  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote>$1</blockquote>');
  
  // Line breaks - handle paragraphs
  // Split by double newlines for paragraphs
  const sections = html.split(/\n\n+/);
  html = sections.map(section => {
    // Don't wrap if already wrapped in a tag
    if (section.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr)/i)) {
      return section;
    }
    // Replace single newlines with <br>
    section = section.replace(/\n/g, '<br>');
    // Wrap in paragraph
    return `<p>${section}</p>`;
  }).join('\n');
  
  return html;
}

/**
 * Download markdown file as Word document (.doc format - HTML-based)
 * For enhanced .docx format with better styling, use exportTestingGuideToWord from exportTestingDocuments.ts
 */
export async function downloadMarkdownAsWord(
  markdown: string,
  filename: string = 'document.doc'
): Promise<void> {
  try {
    console.log('🔧 Starting Word document generation...');
    console.log('📝 Markdown length:', markdown.length);
    
    if (!markdown || markdown.length === 0) {
      throw new Error('No content to export - markdown is empty');
    }
    
    // Convert markdown to HTML
    console.log('🔄 Converting markdown to HTML...');
    const htmlContent = markdownToHTML(markdown);
    console.log('✅ HTML conversion complete. Length:', htmlContent.length);
    
    // Create blob with proper MIME type for Word
    const blob = new Blob(
      [
        '\ufeff', // UTF-8 BOM
        `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
<head>
  <meta charset='utf-8'>
  <title>${filename}</title>
  <style>
    body { 
      font-family: 'Calibri', 'Arial', sans-serif; 
      font-size: 11pt; 
      line-height: 1.5;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
    }
    h1 { 
      color: #00b4d8; 
      font-size: 24pt; 
      font-weight: bold; 
      margin-top: 20pt;
      margin-bottom: 10pt;
      border-bottom: 2px solid #00b4d8;
      padding-bottom: 5pt;
    }
    h2 { 
      color: #0077b6; 
      font-size: 18pt; 
      font-weight: bold; 
      margin-top: 16pt;
      margin-bottom: 8pt;
    }
    h3 { 
      color: #023e8a; 
      font-size: 14pt; 
      font-weight: bold; 
      margin-top: 12pt;
      margin-bottom: 6pt;
    }
    h4 { 
      color: #03045e; 
      font-size: 12pt; 
      font-weight: bold; 
      margin-top: 10pt;
      margin-bottom: 4pt;
    }
    p { 
      margin-top: 6pt; 
      margin-bottom: 6pt; 
    }
    table { 
      border-collapse: collapse; 
      width: 100%; 
      margin: 10pt 0;
    }
    th { 
      background-color: #00b4d8; 
      color: white; 
      font-weight: bold; 
      padding: 8pt; 
      border: 1pt solid #ccc; 
    }
    td { 
      padding: 6pt; 
      border: 1pt solid #ccc; 
    }
    code { 
      background-color: #f4f4f4; 
      padding: 2pt 6pt; 
      font-family: 'Courier New', monospace; 
      font-size: 10pt;
    }
    pre { 
      background-color: #f4f4f4; 
      padding: 10pt; 
      border-left: 3pt solid #00b4d8; 
      overflow-x: auto;
      font-family: 'Courier New', monospace;
      font-size: 9pt;
    }
    ul, ol { 
      margin-left: 20pt; 
    }
    li { 
      margin-bottom: 4pt; 
    }
    strong { 
      font-weight: bold; 
    }
    em { 
      font-style: italic; 
    }
    blockquote {
      background-color: #f9f9f9;
      border-left: 3pt solid #ccc;
      padding: 10pt;
      margin: 10pt 0;
      font-style: italic;
    }
    hr {
      border: none;
      border-top: 1pt solid #ccc;
      margin: 15pt 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30pt;
      border-bottom: 3pt solid #00b4d8;
      padding-bottom: 10pt;
    }
    .footer {
      text-align: center;
      margin-top: 30pt;
      border-top: 1pt solid #ccc;
      padding-top: 10pt;
      font-size: 9pt;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0; border: none;">QILLY</h1>
    <p style="margin: 0; font-size: 10pt; color: #666;">Construction Billing System - Testing Documentation</p>
  </div>
  ${htmlContent}
  <div class="footer">
    <p>Generated by Qilly | ${new Date().toLocaleDateString('en-ZA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })} | Confidential</p>
  </div>
</body>
</html>
      `.trim()
      ],
      { type: 'application/vnd.ms-word' }
    );
    
    console.log('📦 Blob created. Size:', blob.size, 'bytes');
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
    document.body.appendChild(link);
    
    console.log('⬇️ Triggering download:', filename);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('✅ Download complete!');
  } catch (error) {
    console.error('❌ Error in downloadMarkdownAsWord:', error);
    throw error; // Re-throw so the UI can catch it
  }
}

/**
 * Download compliance calculator testing guide (legacy - uses HTML-based .doc)
 * @deprecated Use exportTestingGuideToWord from exportTestingDocuments.ts instead
 */
export async function downloadComplianceTestingGuide(): Promise<void> {
  const markdown = await fetch('/COMPLIANCE_CALCULATOR_TESTING_GUIDE.md').then(r => r.text());
  await downloadMarkdownAsWord(markdown, 'Qilly_Compliance_Calculator_Testing_Guide.doc');
}

/**
 * Download complete system test guide (legacy - uses HTML-based .doc)
 * @deprecated Use exportTestingGuideToWord from exportTestingDocuments.ts instead
 */
export async function downloadCompleteSystemTestGuide(): Promise<void> {
  const markdown = await fetch('/QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md').then(r => r.text());
  await downloadMarkdownAsWord(markdown, 'Qilly_Complete_System_Test_Guide.doc');
}

/**
 * Load markdown file from public folder
 * @deprecated Use loadMarkdownFile from exportTestingDocuments.ts instead
 */
export async function loadMarkdownFile(filename: string): Promise<string> {
  try {
    // Try loading from /public first (Vite serves from public in production)
    let response = await fetch(`/${filename}`);
    
    // If not found in public, return error message explaining the issue
    if (!response.ok) {
      throw new Error(`Failed to load ${filename} (Status: ${response.status})`);
    }
    
    return await response.text();
  } catch (error) {
    console.error('Error loading markdown file:', error);
    return `# Error Loading Document\n\nFailed to load ${filename}.\n\n**Troubleshooting:**\n- File may not exist in the /public folder\n- Check that ${filename} has been copied to /public\n- Original file should be at project root: /${filename}`;
  }
}