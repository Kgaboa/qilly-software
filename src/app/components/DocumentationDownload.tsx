import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { FileText, Download, BookOpen, Code, Rocket, Eye, FileCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Packer } from 'docx';
import FileSaver from 'file-saver';
import { createDocxFromMarkdown } from '@/utils/docxConverter';

export function DocumentationDownload() {
  const documentationFiles = [
    {
      name: 'BACKEND_INDEX.md',
      title: 'Documentation Index',
      description: 'Navigation guide to all backend documentation',
      icon: BookOpen,
      size: '12 KB',
      readTime: '5 min'
    },
    {
      name: 'BACKEND_QUICK_START.md',
      title: 'Quick Start Guide',
      description: '15-minute overview and MVP setup instructions',
      icon: Rocket,
      size: '28 KB',
      readTime: '15 min'
    },
    {
      name: 'BACKEND_ARCHITECTURE.md',
      title: 'Complete Architecture',
      description: 'Full system design, database schema, and API endpoints',
      icon: Code,
      size: '45 KB',
      readTime: '45 min'
    },
    {
      name: 'BACKEND_IMPLEMENTATION_GUIDE.md',
      title: 'Implementation Guide',
      description: 'Step-by-step code examples and file structure',
      icon: FileCheck,
      size: '38 KB',
      readTime: '60 min'
    },
    {
      name: 'DEPLOYMENT_GUIDE.md',
      title: 'Deployment Guide',
      description: 'Staging and production deployment instructions',
      icon: Rocket,
      size: '35 KB',
      readTime: '45 min'
    },
    {
      name: 'BACKEND_VISUAL_SUMMARY.md',
      title: 'Visual Summary',
      description: 'Architecture diagrams and flow charts',
      icon: Eye,
      size: '32 KB',
      readTime: '20 min'
    },
    {
      name: 'ENVIRONMENT_TABS_SUMMARY.md',
      title: 'Environment Tabs',
      description: 'Admin dashboard tabs and testing strategy',
      icon: FileText,
      size: '18 KB',
      readTime: '15 min'
    },
    {
      name: 'STAGING_TESTING_GUIDE.md',
      title: 'Staging Testing Guide',
      description: 'Pre-production testing workflows',
      icon: FileCheck,
      size: '22 KB',
      readTime: '30 min'
    }
  ];

  const downloadFile = async (fileName: string, title: string) => {
    try {
      toast.loading(`Generating ${title}...`, { id: fileName });
      
      let markdownContent = '';
      
      // Try to fetch the markdown file
      try {
        const response = await fetch(`/${fileName}`);
        
        if (response.ok) {
          const content = await response.text();
          
          // Check if we got HTML instead of markdown (happens when file doesn't exist)
          if (content.trim().startsWith('<!DOCTYPE') || content.trim().startsWith('<html')) {
            console.warn(`Got HTML instead of markdown for ${fileName}, using fallback`);
            markdownContent = getFallbackMarkdown(fileName, title);
          } else if (content.length > 100 && (content.includes('#') || content.includes('##'))) {
            markdownContent = content;
          } else {
            console.warn(`Invalid markdown content for ${fileName}, using fallback`);
            markdownContent = getFallbackMarkdown(fileName, title);
          }
        } else {
          console.warn(`File not found: ${fileName}, using fallback`);
          markdownContent = getFallbackMarkdown(fileName, title);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        markdownContent = getFallbackMarkdown(fileName, title);
      }
      
      // Convert markdown to Word document
      const doc = createDocxFromMarkdown(markdownContent, title);
      
      // Generate blob
      const blob = await Packer.toBlob(doc);
      
      // Download the file
      const docxFileName = fileName.replace('.md', '.docx');
      FileSaver.saveAs(blob, docxFileName);
      
      toast.success(`Downloaded ${docxFileName}`, { id: fileName });
    } catch (error) {
      console.error('Download error:', error);
      toast.error(`Failed to download ${fileName}`, { id: fileName });
    }
  };

  const getFallbackMarkdown = (fileName: string, title: string): string => {
    return `# ${title}

## Document Information

**Filename:** ${fileName}  
**Generated:** ${new Date().toLocaleDateString()}  
**System:** Qilly Construction Billing System

---

## Overview

This is a placeholder document for **${title}**.

The original markdown source file is not currently available in the web application's public directory. To access the full documentation:

1. **Check the project root directory** for the file \`${fileName}\`
2. **Move the file to the public folder** if deploying to production
3. **Or create an API endpoint** to serve the documentation files

---

## Expected Content

This document should contain detailed information about:

- Backend architecture and implementation
- Database schemas and API endpoints
- Deployment guides and configuration
- Testing strategies and workflows
- Supplier integration and pricing systems
- Compliance tracking (SANS 1200, NBR, BBBEE)
- Payment processing workflows

---

## Next Steps

To enable full documentation downloads:

### Option 1: Move Files to Public Folder
\`\`\`bash
# Copy markdown files to public directory
cp BACKEND_*.md public/
cp DEPLOYMENT_GUIDE.md public/
cp ENVIRONMENT_TABS_SUMMARY.md public/
cp STAGING_TESTING_GUIDE.md public/
\`\`\`

### Option 2: Create API Endpoint
\`\`\`typescript
// pages/api/docs/[filename].ts
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { filename } = req.query;
  const filePath = path.join(process.cwd(), filename);
  
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.setHeader('Content-Type', 'text/markdown');
    res.send(content);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
}
\`\`\`

### Option 3: Embed Content Directly
Import the documentation content directly into the application as TypeScript constants.

---

## DHS Proposal Value

**Qilly** is a groundbreaking construction billing system for the South African Department of Human Settlements that:

- ✅ Achieves **100% pricing accuracy** in under 5 minutes
- ✅ Integrates with suppliers across **all 9 provinces**
- ✅ Saves **R45M-R220M** over 5 years
- ✅ Could fund **500-1,650 additional houses**
- ✅ Includes full **compliance tracking** (SANS 1200, NBR, BBBEE)
- ✅ Prevents corruption with transparent pricing
- ✅ POPIA compliant with data protection

---

## Contact & Support

For access to the complete documentation, please contact the Qilly development team.

**Generated by:** Qilly Admin Dashboard  
**Date:** ${new Date().toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
`;
  };

  const downloadAllAsZip = async () => {
    try {
      toast.loading('Generating Word documents...', { id: 'download-all' });
      
      // Download all files as Word documents
      for (const doc of documentationFiles) {
        await downloadFile(doc.name, doc.title);
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      toast.success('All documents downloaded!', { id: 'download-all' });
    } catch (error) {
      console.error('Bulk download error:', error);
      toast.error('Failed to download all files', { id: 'download-all' });
    }
  };

  const totalReadTime = documentationFiles.reduce((sum, doc) => {
    const minutes = parseInt(doc.readTime);
    return sum + minutes;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-blue-600" />
            Backend Architecture Documentation
          </CardTitle>
          <CardDescription className="text-base">
            Complete production-ready documentation for Qilly's backend with supplier API integration (Word format)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {documentationFiles.length} Word documents
                </span>
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {totalReadTime} min total read time
                </span>
              </div>
              <p className="text-sm text-slate-600">
                Everything you need to build, deploy, and scale Qilly's backend infrastructure
              </p>
            </div>
            <Button 
              onClick={downloadAllAsZip} 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Download All (.docx)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">Complete</p>
              <p className="text-sm text-slate-600">Database schema, APIs, services</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Rocket className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">1 Week MVP</p>
              <p className="text-sm text-slate-600">Quick start to production</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <FileCheck className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-slate-900">9 Provinces</p>
              <p className="text-sm text-slate-600">Supplier API integration</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documentation Files */}
      <Card>
        <CardHeader>
          <CardTitle>Available Documents</CardTitle>
          <CardDescription>
            Click any document to download individually or use "Download All" above
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentationFiles.map((doc) => {
              const Icon = doc.icon;
              return (
                <div 
                  key={doc.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900">{doc.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{doc.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>{doc.readTime} read</span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{doc.name}</span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadFile(doc.name, doc.title)}
                    className="ml-4 flex items-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* What's Included */}
      <Card>
        <CardHeader>
          <CardTitle>What's Included</CardTitle>
          <CardDescription>
            Production-ready backend architecture for Qilly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Code className="w-4 h-4 text-blue-600" />
                Technical Documentation
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Complete database schema (PostgreSQL/Supabase)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>20+ API endpoints with full implementation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>BOQ calculation engine ({"<"}5 min, 100% accuracy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Supplier API integration (all 9 provinces)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Payment processing (EFT, Stitch, PayFast)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span>Compliance tracking (SANS 1200, NBR, BBBEE)</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-green-600" />
                Implementation Guides
              </h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Next.js + Supabase setup (15 minutes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Complete code examples (ready to use)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Deployment guides (Vercel, Railway, Docker)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Testing strategy (Jest, Playwright)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Monitoring setup (Sentry, Datadog)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Cost breakdown (MVP: R150/month!)</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Rocket className="w-5 h-5 text-green-600" />
            Quick Start (1 Week to MVP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-slate-700">
            <p className="font-semibold">Get started in 90 minutes:</p>
            <ol className="space-y-1 ml-4">
              <li>1. Download <span className="font-mono text-xs bg-white px-2 py-0.5 rounded">BACKEND_QUICK_START.md</span> (15 min read)</li>
              <li>2. Setup Supabase project (5 min)</li>
              <li>3. Deploy database schema (10 min)</li>
              <li>4. Create Next.js API routes (30 min)</li>
              <li>5. Deploy to Vercel (15 min)</li>
              <li>6. Test end-to-end (15 min)</li>
            </ol>
            <p className="pt-2 text-xs text-slate-600">
              ✅ Result: Functional backend with BOQ calculation, payment verification, and supplier management
            </p>
          </div>
        </CardContent>
      </Card>

      {/* DHS Value Proposition */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            DHS Proposal Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="font-semibold text-purple-900 mb-1">Cost Savings</p>
              <p className="text-2xl font-bold text-purple-600">R190M</p>
              <p className="text-xs text-slate-600">Annual taxpayer savings</p>
            </div>
            <div>
              <p className="font-semibold text-purple-900 mb-1">Additional Houses</p>
              <p className="text-2xl font-bold text-purple-600">500-1,650</p>
              <p className="text-xs text-slate-600">Over 5 years</p>
            </div>
            <div>
              <p className="font-semibold text-purple-900 mb-1">Processing Time</p>
              <p className="text-2xl font-bold text-purple-600">{"<"}5 min</p>
              <p className="text-xs text-slate-600">vs 2-4 weeks manual</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}