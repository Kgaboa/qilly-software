import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  Table, 
  TableRow, 
  TableCell, 
  WidthType, 
  BorderStyle,
  ShadingType,
  convertInchesToTwip
} from 'docx';

export function createDocxFromMarkdown(markdown: string, title: string): Document {
  const lines = markdown.split('\n');
  const documentChildren: any[] = [];
  
  // Add title page
  documentChildren.push(
    new Paragraph({
      text: title,
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 200
      }
    })
  );
  
  documentChildren.push(
    new Paragraph({
      text: `Qilly Construction Billing System`,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 100
      }
    })
  );
  
  documentChildren.push(
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString('en-ZA', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 400
      }
    })
  );
  
  let i = 0;
  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let inList = false;
  let listItems: string[] = [];
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Handle code blocks
    if (trimmed.startsWith('```')) {
      if (inCodeBlock) {
        // End of code block
        if (codeBlockLines.length > 0) {
          documentChildren.push(
            new Paragraph({
              text: codeBlockLines.join('\n'),
              style: 'Code',
              shading: {
                fill: 'f1f5f9',
                type: ShadingType.CLEAR
              },
              spacing: {
                before: 120,
                after: 120
              },
              border: {
                top: { color: 'cbd5e1', space: 1, style: BorderStyle.SINGLE, size: 6 },
                bottom: { color: 'cbd5e1', space: 1, style: BorderStyle.SINGLE, size: 6 },
                left: { color: 'cbd5e1', space: 1, style: BorderStyle.SINGLE, size: 6 },
                right: { color: 'cbd5e1', space: 1, style: BorderStyle.SINGLE, size: 6 }
              }
            })
          );
        }
        codeBlockLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      i++;
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockLines.push(line);
      i++;
      continue;
    }
    
    // Handle tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      
      // Skip separator rows
      if (trimmed.includes('---')) {
        i++;
        continue;
      }
      
      const cells = trimmed
        .split('|')
        .map(cell => cell.trim())
        .filter(cell => cell !== '');
      
      tableRows.push(cells);
      i++;
      continue;
    } else if (inTable) {
      // End of table - create table
      if (tableRows.length > 0) {
        const tableRowElements = tableRows.map((row, rowIndex) => {
          return new TableRow({
            children: row.map((cell) => {
              return new TableCell({
                children: [
                  new Paragraph({
                    children: parseInlineFormatting(cell),
                    ...(rowIndex === 0 ? { style: 'TableHeader' } : {})
                  })
                ],
                shading: {
                  fill: rowIndex === 0 ? 'dbeafe' : 'ffffff',
                  type: ShadingType.CLEAR
                }
              });
            })
          });
        });
        
        documentChildren.push(
          new Table({
            rows: tableRowElements,
            width: {
              size: 100,
              type: WidthType.PERCENTAGE
            }
          })
        );
        
        documentChildren.push(
          new Paragraph({
            text: '',
            spacing: { after: 200 }
          })
        );
      }
      inTable = false;
      tableRows = [];
    }
    
    // Handle horizontal rules
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      documentChildren.push(
        new Paragraph({
          text: '',
          border: {
            bottom: {
              color: 'cbd5e1',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 12
            }
          },
          spacing: {
            before: 200,
            after: 200
          }
        })
      );
      i++;
      continue;
    }
    
    // Handle headings
    if (trimmed.startsWith('# ')) {
      const headingText = trimmed.replace(/^#\s+/, '').replace(/[🎯📋🏗️💻🚀🎨⚡📊💰✅📖🔑💡🎓📞🏆📚⚙️🌟🔧📈]/g, '').trim();
      documentChildren.push(
        new Paragraph({
          text: headingText,
          heading: HeadingLevel.HEADING_1,
          spacing: {
            before: 240,
            after: 120
          }
        })
      );
      i++;
      continue;
    }
    
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.replace(/^##\s+/, '').replace(/[🎯📋🏗️💻🚀🎨⚡📊💰✅📖🔑💡🎓📞🏆📚⚙️🌟🔧📈]/g, '').trim();
      documentChildren.push(
        new Paragraph({
          text: headingText,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 100
          }
        })
      );
      i++;
      continue;
    }
    
    if (trimmed.startsWith('### ')) {
      const headingText = trimmed.replace(/^###\s+/, '').replace(/[🎯📋🏗️💻🚀🎨⚡📊💰✅📖🔑💡🎓📞🏆📚⚙️🌟🔧📈]/g, '').trim();
      documentChildren.push(
        new Paragraph({
          text: headingText,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: 160,
            after: 80
          }
        })
      );
      i++;
      continue;
    }
    
    if (trimmed.startsWith('#### ')) {
      const headingText = trimmed.replace(/^####\s+/, '').replace(/[🎯📋🏗️💻🚀🎨⚡📊💰✅📖🔑💡🎓📞🏆📚⚙️🌟🔧📈]/g, '').trim();
      documentChildren.push(
        new Paragraph({
          text: headingText,
          heading: HeadingLevel.HEADING_4,
          spacing: {
            before: 120,
            after: 60
          }
        })
      );
      i++;
      continue;
    }
    
    // Handle blockquotes
    if (trimmed.startsWith('> ')) {
      const quoteText = trimmed.replace(/^>\s+/, '');
      documentChildren.push(
        new Paragraph({
          children: parseInlineFormatting(quoteText),
          shading: {
            fill: 'f8fafc',
            type: ShadingType.CLEAR
          },
          indent: {
            left: convertInchesToTwip(0.5)
          },
          border: {
            left: {
              color: '3b82f6',
              space: 1,
              style: BorderStyle.SINGLE,
              size: 24
            }
          },
          spacing: {
            before: 80,
            after: 80
          }
        })
      );
      i++;
      continue;
    }
    
    // Handle lists
    if (trimmed.match(/^[-*+]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const listText = trimmed
        .replace(/^[-*+]\s+/, '')
        .replace(/^\d+\.\s+/, '')
        .replace(/^✅\s+/, '')
        .replace(/^❌\s+/, '')
        .replace(/^⚠️\s+/, '');
      
      const isNumbered = trimmed.match(/^\d+\.\s+/);
      
      documentChildren.push(
        new Paragraph({
          children: parseInlineFormatting(listText),
          bullet: isNumbered ? undefined : {
            level: 0
          },
          numbering: isNumbered ? {
            reference: 'default-numbering',
            level: 0
          } : undefined,
          spacing: {
            before: 40,
            after: 40
          }
        })
      );
      i++;
      continue;
    }
    
    // Handle empty lines
    if (trimmed === '') {
      documentChildren.push(
        new Paragraph({
          text: '',
          spacing: {
            after: 100
          }
        })
      );
      i++;
      continue;
    }
    
    // Handle regular paragraphs
    if (trimmed !== '') {
      documentChildren.push(
        new Paragraph({
          children: parseInlineFormatting(trimmed),
          spacing: {
            before: 80,
            after: 80
          }
        })
      );
    }
    
    i++;
  }
  
  return new Document({
    sections: [{
      properties: {},
      children: documentChildren
    }],
    styles: {
      paragraphStyles: [
        {
          id: 'Code',
          name: 'Code',
          basedOn: 'Normal',
          run: {
            font: 'Consolas',
            size: 20,
            color: '1e293b'
          }
        },
        {
          id: 'TableHeader',
          name: 'Table Header',
          basedOn: 'Normal',
          run: {
            bold: true,
            color: '1e293b'
          }
        }
      ]
    },
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.LEFT
            }
          ]
        }
      ]
    }
  });
}

function parseInlineFormatting(text: string): TextRun[] {
  const runs: TextRun[] = [];
  
  // Remove emojis
  text = text.replace(/[🎯📋🏗️💻🚀🎨⚡📊💰✅📖🔑💡🎓📞🏆📚⚙️🌟🔧📈❌⚠️]/g, '').trim();
  
  // Simple regex patterns for inline formatting
  const parts: Array<{ text: string; bold?: boolean; italic?: boolean; code?: boolean }> = [];
  
  // Split by ** for bold
  const boldParts = text.split(/(\*\*[^*]+\*\*)/);
  
  for (const part of boldParts) {
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      // Check for code within bold
      if (content.includes('`')) {
        const codeParts = content.split(/(`[^`]+`)/);
        for (const cp of codeParts) {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            parts.push({ text: cp.slice(1, -1), bold: true, code: true });
          } else if (cp) {
            parts.push({ text: cp, bold: true });
          }
        }
      } else {
        parts.push({ text: content, bold: true });
      }
    } else if (part) {
      // Check for code
      if (part.includes('`')) {
        const codeParts = part.split(/(`[^`]+`)/);
        for (const cp of codeParts) {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            parts.push({ text: cp.slice(1, -1), code: true });
          } else if (cp) {
            // Check for italic
            if (cp.includes('*')) {
              const italicParts = cp.split(/(\*[^*]+\*)/);
              for (const ip of italicParts) {
                if (ip.startsWith('*') && ip.endsWith('*') && !ip.startsWith('**')) {
                  parts.push({ text: ip.slice(1, -1), italic: true });
                } else if (ip) {
                  parts.push({ text: ip });
                }
              }
            } else {
              parts.push({ text: cp });
            }
          }
        }
      } else if (part.includes('*') && !part.includes('**')) {
        const italicParts = part.split(/(\*[^*]+\*)/);
        for (const ip of italicParts) {
          if (ip.startsWith('*') && ip.endsWith('*')) {
            parts.push({ text: ip.slice(1, -1), italic: true });
          } else if (ip) {
            parts.push({ text: ip });
          }
        }
      } else {
        parts.push({ text: part });
      }
    }
  }
  
  // Create TextRun objects
  for (const part of parts) {
    if (part.text) {
      runs.push(
        new TextRun({
          text: part.text,
          bold: part.bold,
          italics: part.italic,
          font: part.code ? 'Consolas' : undefined,
          shading: part.code ? {
            fill: 'e2e8f0',
            type: ShadingType.CLEAR
          } : undefined,
          color: part.code ? '475569' : undefined
        })
      );
    }
  }
  
  return runs.length > 0 ? runs : [new TextRun({ text })];
}
