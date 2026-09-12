# Qilly Testing Documents - Setup & Usage Guide

## 📚 Overview

The Qilly testing documentation system now supports **both PowerPoint (.pptx) and Word (.docx)** formats with professional styling and formatting!

## 🎉 New Features

### 1. **PowerPoint Presentations (.pptx)**
- Professional slide deck format
- Qilly branded theme (primary colors: #00b4d8, #0077b6, #023e8a)
- Title slide with system branding
- Automatic slide generation from markdown sections
- Bullet points and code snippets
- Footer slide with contact information
- Perfect for DHS presentations and demos!

### 2. **Enhanced Word Documents (.docx)**
- True .docx format (not HTML-based)
- Professional formatting with headers, bullets, and code blocks
- Colored section headers (matching Qilly brand)
- Page breaks for major sections
- Title page with metadata
- Proper document structure for easy navigation

## 📂 Files Required

To enable downloads, copy these markdown files to `/public`:

```bash
# From project root, run:
cp COMPLIANCE_CALCULATOR_TESTING_GUIDE.md public/
cp QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md public/
```

### Files Status:
- ✅ `/public/COMPLIANCE_CALCULATOR_TESTING_GUIDE.md` - Ready
- ⏳ `/public/QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md` - **Needs to be copied**

## 🚀 How to Use

### From Admin Dashboard:

1. Navigate to **Admin Dashboard → Testing tab**
2. Select a testing guide (Compliance Calculator or Complete System)
3. Choose your format:
   - **Download Word Doc** - Professional .docx document
   - **Download PPT** - PowerPoint presentation

### Download Buttons Available:

**Compliance Calculator Tab:**
- ✅ Download Word Doc (.docx)
- ✅ Download PPT (.pptx)

**Complete System Tab:**
- ✅ Download Word Doc (.docx)
- ✅ Download PPT (.pptx)

## 📊 PowerPoint Features

### Slide Structure:
1. **Title Slide** - Qilly branding + document title
2. **Content Slides** - Organized by H1/H2 headers from markdown
3. **Bullet Points** - Max 8 per slide (auto-pagination)
4. **Code Blocks** - Monospace font with gray background
5. **Footer Slide** - Thank you + contact info

### Styling:
- **Header Bar** - Gradient background with white text
- **Body Text** - Clean, readable font (14pt)
- **Colors** - Qilly brand palette throughout
- **Layout** - 10" wide, professional spacing

## 📄 Word Document Features

### Document Structure:
1. **Title Page** - Centered branding + metadata
2. **Headers** - 4 levels (H1-H4) with color coding
3. **Lists** - Bulleted and numbered
4. **Code Blocks** - Gray background with left border
5. **Paragraphs** - Proper spacing and formatting

### Styling:
- **H1** - 32pt, #00b4d8, underlined
- **H2** - 26pt, #0077b6
- **H3** - 22pt, #023e8a
- **H4** - 20pt, #03045e
- **Body** - 22pt, readable line height

## 🔧 Technical Details

### Libraries Used:
- **pptxgenjs** - PowerPoint generation
- **docx** - Word document generation
- **file-saver** - File download utility

### File Locations:
- Export utilities: `/src/utils/exportTestingDocuments.ts`
- UI component: `/src/app/components/TestingGuidelines.tsx`
- Markdown files: `/public/*.md`

## 🐛 Troubleshooting

### Downloads Not Working?

**Check 1: Files Exist**
```bash
ls -la public/*.md
```
You should see:
- COMPLIANCE_CALCULATOR_TESTING_GUIDE.md
- QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md

**Check 2: Browser Console**
Open Developer Tools (F12) → Console tab

Look for:
```
📊 Starting PowerPoint generation...
💾 Saving PowerPoint file...
✅ PowerPoint export complete!
```

or

```
📄 Starting Word document generation...
💾 Saving Word document...
✅ Word export complete!
```

**Check 3: File Permissions**
Ensure markdown files are readable:
```bash
chmod 644 public/*.md
```

### Common Errors:

**Error: "Failed to load QILLY_COMPLETE_SYSTEM_TEST_GUIDE.md"**
- **Solution:** Copy the file to `/public` as shown above

**Error: "Cannot read properties of undefined"**
- **Solution:** Wait for markdown files to load (check network tab)

**Error: "Blob size 0 bytes"**
- **Solution:** Markdown content is empty - verify file contains text

## 📈 Usage Statistics

### File Sizes (Approximate):
- **Compliance Guide PPT:** ~50KB (10-15 slides)
- **Compliance Guide Word:** ~80KB (12 pages)
- **System Guide PPT:** ~150KB (30-40 slides)
- **System Guide Word:** ~200KB (45+ pages)

### Generation Time:
- **PowerPoint:** 1-2 seconds
- **Word:** 1-2 seconds

## ✅ Verification Checklist

Before presenting to DHS:

- [ ] Both markdown files copied to `/public`
- [ ] Compliance Guide downloads (Word + PPT)
- [ ] System Guide downloads (Word + PPT)
- [ ] Word docs open in Microsoft Word without errors
- [ ] PowerPoint opens in Microsoft PowerPoint/Google Slides
- [ ] All branding colors correct (Qilly blues)
- [ ] No blank pages or missing content
- [ ] Headers and bullets formatted correctly
- [ ] Code blocks readable and styled

## 🎯 Perfect For:

- **DHS Presentations** - Use PowerPoint format
- **Testing Documentation** - Use Word format
- **Training Materials** - Both formats available
- **Offline Reference** - Download and share easily
- **Quality Assurance** - Comprehensive test coverage
- **Compliance Audits** - Professional documentation

## 📞 Support

If you encounter any issues:

1. Check browser console for error messages
2. Verify markdown files exist in `/public`
3. Try different browser (Chrome recommended)
4. Clear browser cache and retry
5. Check file permissions on server

---

**Generated by Qilly Testing Documentation System**  
**Version 1.0 | February 2026**
