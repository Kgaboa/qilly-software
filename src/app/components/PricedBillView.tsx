import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface PricedBillViewProps {
  bill: {
    billId: string;
    projectSettings?: {
      province: string;
      profitMargin: string;
      cidbGrading: string;
      duration: string;
      machineryType: string;
    };
    items: Array<{
      code: string;
      name: string;
      description: string;
      quantity: string;
      unit: string;
      rate: string;
      selectedSupplier: string;
      selectedProvince?: string; // Add province property
      unitPrice: string;
      totalPrice: string;
      supplierPrices: Array<{
        supplier: string;
        unitPrice: string;
        totalPrice: string;
        available: boolean;
      }>;
    }>;
    overallTotal: string;
  };
  onBack: () => void;
}

export function PricedBillView({ bill, onBack }: PricedBillViewProps) {
  const formatNumber = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handleDownload = () => {
    // Create CSV content
    let csvContent = 'Code,Item Name,Description,Quantity,Unit,Supplier,Rate,Total Amount\n';
    
    bill.items.forEach(item => {
      const row = [
        item.code,
        `"${item.name}"`,
        `"${item.description}"`,
        item.quantity,
        item.unit,
        item.selectedSupplier,
        item.unitPrice,
        item.totalPrice
      ].join(',');
      csvContent += row + '\n';
    });
    
    csvContent += `\n,,,,,Total:,,R${formatNumber(bill.overallTotal)}`;

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `priced-bill-${bill.billId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text('Qilly Construction', 14, 20);
    doc.setFontSize(12);
    doc.text('Priced Bill of Quantities', 14, 28);
    doc.setFontSize(10);
    doc.text(`Bill ID: ${bill.billId}`, 14, 35);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    let currentY = 45;

    // Add Project Settings if available with color coding
    if (bill.projectSettings) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Project Settings Applied:', 14, currentY);
      currentY += 6;
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      
      // Color-coded settings badges
      const settingsWithColors = [
        { label: 'Province:', value: bill.projectSettings.province, color: [0, 180, 216] }, // Blue
        { label: 'Profit Margin:', value: `${bill.projectSettings.profitMargin}%`, color: [34, 197, 94] }, // Green
        { label: 'CIDB Grading:', value: bill.projectSettings.cidbGrading, color: [147, 51, 234] }, // Purple
        { label: 'Duration:', value: `${bill.projectSettings.duration} months`, color: [234, 88, 12] }, // Orange
        { label: 'Machinery:', value: bill.projectSettings.machineryType === 'owned' ? 'Owned Plant' : 'Rented/Hired', color: [55, 65, 81] } // Gray
      ];
      
      settingsWithColors.forEach((setting, index) => {
        const xPos = 14 + (index % 3) * 65;
        const yPos = currentY + Math.floor(index / 3) * 8;
        
        // Draw colored box
        doc.setFillColor(setting.color[0], setting.color[1], setting.color[2]);
        doc.roundedRect(xPos, yPos - 3, doc.getTextWidth(`${setting.label} ${setting.value}`) + 4, 5, 1, 1, 'F');
        
        // Add white text
        doc.setTextColor(255, 255, 255);
        doc.text(`${setting.label} ${setting.value}`, xPos + 2, yPos);
        doc.setTextColor(0, 0, 0); // Reset to black
      });
      currentY += 20;

      // Add Impact Explanations with color-coded badges
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('How These Settings Affected Your BOQ:', 14, currentY);
      currentY += 6;
      
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      const impacts = [
        {
          title: 'Province',
          text: `Supplier rates filtered for ${bill.projectSettings.province} province. Items sourced from nearest depots.`,
          color: [0, 180, 216]
        },
        {
          title: 'Profit',
          text: `${bill.projectSettings.profitMargin}% markup added to cover overhead, risk, and contractor profit.`,
          color: [34, 197, 94]
        },
        {
          title: 'CIDB',
          text: `${bill.projectSettings.cidbGrading} determines operational overhead % (insurance, compliance, quality systems).`,
          color: [147, 51, 234]
        },
        {
          title: 'Duration',
          text: `${bill.projectSettings.duration} months affects preliminaries, site setup, supervision, and equipment rental periods.`,
          color: [234, 88, 12]
        },
        {
          title: 'Machinery',
          text: bill.projectSettings.machineryType === 'owned' 
            ? 'Owned plant reduces earthworks costs by up to 60% (fuel & maintenance only).'
            : 'Rented equipment includes full market rates, mobilization, operators, and demobilization.',
          color: [55, 65, 81]
        }
      ];

      impacts.forEach((impact, index) => {
        // Draw colored badge
        doc.setFillColor(impact.color[0], impact.color[1], impact.color[2]);
        doc.roundedRect(14, currentY - 3, doc.getTextWidth(impact.title) + 4, 4, 0.5, 0.5, 'F');
        
        // Add white text for badge
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(255, 255, 255);
        doc.text(impact.title, 16, currentY);
        doc.setTextColor(0, 0, 0); // Reset to black
        
        // Add description text
        doc.setFont('helvetica', 'normal');
        const splitText = doc.splitTextToSize(impact.text, 180);
        doc.text(splitText, 14 + doc.getTextWidth(impact.title) + 6, currentY);
        currentY += 6;
      });

      currentY += 5;
    }

    // Prepare table data
    const tableData = bill.items.map(item => {
      const isSummaryRow = item.selectedSupplier === 'Summary';
      return [
        item.code,
        item.name,
        item.quantity || '',
        item.unit || '',
        isSummaryRow ? 'SUMMARY' : item.selectedSupplier,
        isSummaryRow ? '' : `R${formatNumber(item.unitPrice)}`,
        `R${formatNumber(item.totalPrice)}`
      ];
    });

    // Add table
    autoTable(doc, {
      startY: currentY,
      head: [['ITEM NO', 'Item', 'Qty', 'Unit', 'Best Supplier', 'Best Rate', 'Total']],
      body: tableData,
      foot: [['', '', '', '', '', 'Grand Total:', `R${formatNumber(bill.overallTotal)}`]],
      theme: 'grid',
      headStyles: { fillColor: [0, 180, 216], textColor: [255, 255, 255], fontSize: 7 },
      footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
      styles: { fontSize: 6, cellPadding: 1.5 },
      columnStyles: {
        0: { cellWidth: 12 },  // ITEM NO
        1: { cellWidth: 50 },  // Item (wider now)
        2: { cellWidth: 10 },  // Qty
        3: { cellWidth: 12 },  // Unit
        4: { cellWidth: 30 },  // Best Supplier (wider)
        5: { cellWidth: 20 },  // Best Rate
        6: { cellWidth: 28 }   // Total
      },
      didParseCell: function(data) {
        // Highlight summary rows
        if (data.section === 'body') {
          const rowData = bill.items[data.row.index];
          if (rowData && rowData.selectedSupplier === 'Summary') {
            data.cell.styles.fillColor = [219, 234, 254]; // Light blue background
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = [0, 180, 216]; // Blue text
          }
        }
      }
    });

    // Save PDF
    doc.save(`priced-bill-${bill.billId}.pdf`);
  };

  const handleDownloadExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare worksheet data
    let worksheetData: any[] = [];
    let rowIndex = 0;

    // Add Project Settings if available
    if (bill.projectSettings) {
      // Add title row
      worksheetData.push(['PROJECT SETTINGS APPLIED']);
      worksheetData.push([]); // Empty row
      
      // Add settings rows with labels and values
      worksheetData.push(['Province', bill.projectSettings.province]);
      worksheetData.push(['Profit Margin', `${bill.projectSettings.profitMargin}%`]);
      worksheetData.push(['CIDB Grading', bill.projectSettings.cidbGrading]);
      worksheetData.push(['Duration', `${bill.projectSettings.duration} months`]);
      worksheetData.push(['Machinery', bill.projectSettings.machineryType === 'owned' ? 'Owned Plant' : 'Rented/Hired']);
      
      worksheetData.push([]); // Empty row
      worksheetData.push(['HOW THESE SETTINGS AFFECTED YOUR BOQ:']);
      worksheetData.push([]); // Empty row
      
      // Add impact explanations
      worksheetData.push([
        'Province', 
        `Supplier rates filtered for ${bill.projectSettings.province} province. Items sourced from nearest depots to minimize transport costs.`
      ]);
      worksheetData.push([
        'Profit Margin', 
        `${bill.projectSettings.profitMargin}% markup added to cover overhead, risk, and contractor profit.`
      ]);
      worksheetData.push([
        'CIDB Grading', 
        `${bill.projectSettings.cidbGrading} determines operational overhead % (insurance, compliance, quality systems).`
      ]);
      worksheetData.push([
        'Duration', 
        `${bill.projectSettings.duration} months affects preliminaries, site setup, supervision, and equipment rental periods.`
      ]);
      worksheetData.push([
        'Machinery', 
        bill.projectSettings.machineryType === 'owned' 
          ? 'Owned plant reduces earthworks costs by up to 60% (fuel & maintenance only).'
          : 'Rented equipment includes full market rates, mobilization, operators, and demobilization.'
      ]);
      
      worksheetData.push([]); // Empty row
      worksheetData.push([]); // Empty row
    }

    // Add BOQ header and data
    worksheetData.push(['PRICED BILL OF QUANTITIES']);
    worksheetData.push([]); // Empty row
    const headerRowIndex = worksheetData.length;
    worksheetData.push(['ITEM NO', 'Description', 'Quantity', 'Unit', 'Best Supplier', 'Best Rate', 'Total Amount']);
    
    const dataStartRow = worksheetData.length;
    bill.items.forEach(item => {
      const isSummaryRow = item.selectedSupplier === 'Summary';
      worksheetData.push([
        item.code,
        item.name,
        item.quantity || '',
        item.unit || '',
        isSummaryRow ? 'SUMMARY' : item.selectedSupplier,
        isSummaryRow ? '' : item.unitPrice,
        item.totalPrice
      ]);
    });
    
    worksheetData.push(['', '', '', '', 'Total:', '', `R${formatNumber(bill.overallTotal)}`]);

    // Create worksheet from data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Apply styling if project settings exist
    if (bill.projectSettings) {
      const settingsStartRow = 3; // Row index where settings start (0-indexed)
      
      // Color codes matching the badges (RGB to Excel hex)
      const colors = {
        province: 'FF00B4D8',    // Blue
        profit: 'FF22C55E',       // Green
        cidb: 'FF9333EA',         // Purple
        duration: 'FFEA580C',     // Orange
        machinery: 'FF374151'     // Gray
      };

      // Style settings labels (column A) with colors
      const settingsStyles = [
        { cell: `A${settingsStartRow}`, color: colors.province },
        { cell: `A${settingsStartRow + 1}`, color: colors.profit },
        { cell: `A${settingsStartRow + 2}`, color: colors.cidb },
        { cell: `A${settingsStartRow + 3}`, color: colors.duration },
        { cell: `A${settingsStartRow + 4}`, color: colors.machinery }
      ];

      settingsStyles.forEach(({ cell, color }) => {
        if (!worksheet[cell]) worksheet[cell] = { t: 's', v: '' };
        worksheet[cell].s = {
          fill: { fgColor: { rgb: color } },
          font: { color: { rgb: 'FFFFFFFF' }, bold: true },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      });

      // Style impact labels
      const impactStartRow = settingsStartRow + 8; // Row where impacts start
      const impactStyles = [
        { cell: `A${impactStartRow}`, color: colors.province },
        { cell: `A${impactStartRow + 1}`, color: colors.profit },
        { cell: `A${impactStartRow + 2}`, color: colors.cidb },
        { cell: `A${impactStartRow + 3}`, color: colors.duration },
        { cell: `A${impactStartRow + 4}`, color: colors.machinery }
      ];

      impactStyles.forEach(({ cell, color }) => {
        if (!worksheet[cell]) worksheet[cell] = { t: 's', v: '' };
        worksheet[cell].s = {
          fill: { fgColor: { rgb: color } },
          font: { color: { rgb: 'FFFFFFFF' }, bold: true },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      });

      // Style title rows
      worksheet['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: 'FF00B4D8' } },
        alignment: { horizontal: 'left', vertical: 'center' }
      };

      const impactTitleRow = settingsStartRow + 6;
      if (worksheet[`A${impactTitleRow}`]) {
        worksheet[`A${impactTitleRow}`].s = {
          font: { bold: true, sz: 12 },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }

      // Style BOQ title
      const boqTitleRow = impactStartRow + 7;
      if (worksheet[`A${boqTitleRow}`]) {
        worksheet[`A${boqTitleRow}`].s = {
          font: { bold: true, sz: 14, color: { rgb: 'FF00B4D8' } },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }

      // Style BOQ header
      const headerRow = headerRowIndex + 1;
      if (worksheet[`A${headerRow}`]) {
        worksheet[`A${headerRow}`].s = {
          font: { bold: true, sz: 12, color: { rgb: 'FF00B4D8' } },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }

      // Style BOQ data rows
      for (let i = dataStartRow; i < worksheetData.length - 1; i++) {
        const row = i + 1;
        if (worksheet[`A${row}`]) {
          worksheet[`A${row}`].s = {
            font: { bold: true, sz: 10, color: { rgb: 'FF00B4D8' } },
            alignment: { horizontal: 'left', vertical: 'center' }
          };
        }
      }

      // Style total row
      const totalRow = worksheetData.length;
      if (worksheet[`A${totalRow}`]) {
        worksheet[`A${totalRow}`].s = {
          font: { bold: true, sz: 12, color: { rgb: 'FF00B4D8' } },
          alignment: { horizontal: 'left', vertical: 'center' }
        };
      }
    }

    // Set column widths
    worksheet['!cols'] = [
      { wch: 12 },  // ITEM NO
      { wch: 50 },  // Description
      { wch: 10 },  // Quantity
      { wch: 10 },  // Unit
      { wch: 25 },  // Best Supplier
      { wch: 15 },  // Best Rate
      { wch: 18 }   // Total Amount
    ];

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Priced Bill');

    // Generate and download
    const blob = new Blob([XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `priced-bill-${bill.billId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Back Button at Top */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Priced Bill Summary Section - Back at Top */}
      <Card className="border-2 border-[#00b4d8]">
        <CardHeader className="bg-gradient-to-r from-[#00b4d8]/5 to-blue-50/50 pb-3">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base text-[#00b4d8]">Priced Bill of Quantities</CardTitle>
                <CardDescription className="text-xs mt-1">
                  <span className="font-semibold">Bill ID:</span> {bill.billId}
                  <span className="mx-2">|</span>
                  <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
                  <span className="mx-2">|</span>
                  <span className="font-semibold">Items:</span> {bill.items.length}
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleDownloadExcel} size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                  <Download className="h-4 w-4 mr-2" />
                  Excel
                </Button>
                <Button onClick={handleDownloadPDF} size="sm" className="bg-[#00b4d8] hover:bg-[#0096b8]">
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Table */}
      <Card>
        <CardContent className="p-0">
          {/* Table with fixed layout and vertical scroll only - Half the previous height */}
          <div className="w-full overflow-hidden">
            <div className="max-h-[300px] overflow-y-auto">
              <Table className="table-fixed w-full">
                <TableHeader className="sticky top-0 z-10">
                  <TableRow className="bg-[#00b4d8] hover:bg-[#00b4d8]">
                    <TableHead className="text-white font-bold text-xs px-2 py-3 w-[10%]">ITEM NO</TableHead>
                    <TableHead className="text-white font-bold text-xs px-2 py-3 w-[35%]">Description</TableHead>
                    <TableHead className="text-white font-bold text-right text-xs px-2 py-3 w-[8%]">Qty</TableHead>
                    <TableHead className="text-white font-bold text-xs px-2 py-3 w-[10%]">Unit</TableHead>
                    <TableHead className="text-white font-bold text-xs px-2 py-3 w-[15%]">Best Supplier</TableHead>
                    <TableHead className="text-white font-bold text-right text-xs px-2 py-3 w-[12%]">Best Rate</TableHead>
                    <TableHead className="text-white font-bold text-right text-xs px-2 py-3 w-[10%]">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bill.items.map((item, index) => {
                    // Check if item has blank quantity or unavailable supplier
                    const hasBlankQuantity = !item.quantity?.trim() || item.quantity?.trim() === '';
                    const isNotAvailable = item.selectedSupplier === 'Not Available' || item.selectedSupplier === 'N/A';
                    const isSummaryRow = item.selectedSupplier === 'Summary';
                    const isExcluded = hasBlankQuantity || isNotAvailable;
                    
                    return (
                      <TableRow 
                        key={index} 
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${isExcluded && !isSummaryRow ? 'opacity-50' : ''} ${isSummaryRow ? 'bg-blue-50 border-t-2 border-b-2 border-[#00b4d8]' : ''}`}
                      >
                        <TableCell className={`font-mono text-xs px-2 py-2 w-[10%] break-words ${isSummaryRow ? 'text-[#00b4d8] font-bold' : 'text-[#00b4d8]'}`}>
                          {item.code}
                        </TableCell>
                        <TableCell className="px-2 py-2 w-[35%]">
                          <div className="overflow-hidden">
                            <p className={`text-xs text-gray-900 break-words leading-tight ${isSummaryRow ? 'font-bold uppercase' : 'font-semibold'}`}>{item.name}</p>
                            {item.description && !isSummaryRow && (
                              <p className="text-xs text-gray-600 mt-0.5 break-words leading-tight line-clamp-2">{item.description}</p>
                            )}
                            {hasBlankQuantity && !isSummaryRow && (
                              <p className="text-xs text-orange-600 mt-0.5 italic">Not in total</p>
                            )}
                            {!hasBlankQuantity && isNotAvailable && !isSummaryRow && (
                              <p className="text-xs text-red-600 mt-0.5 italic">Not available</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className={`text-right text-xs text-gray-900 px-2 py-2 w-[8%] ${isSummaryRow ? '' : 'font-semibold'}`}>
                          {item.quantity || '-'}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-gray-700 px-2 py-2 w-[10%]">
                          <span className="block truncate" title={item.unit}>{item.unit || '-'}</span>
                        </TableCell>
                        <TableCell className="px-2 py-2 w-[15%]">
                          {isSummaryRow ? (
                            <Badge className="bg-[#00b4d8] hover:bg-[#0096b8] text-white font-bold text-xs px-1.5 py-0.5 block truncate max-w-full">
                              SUMMARY
                            </Badge>
                          ) : (
                            <Badge className={`${
                              isNotAvailable 
                                ? 'bg-red-500 hover:bg-red-600' 
                                : 'bg-[#00b4d8] hover:bg-[#0096b8]'
                            } text-white font-medium text-xs px-1.5 py-0.5 block truncate max-w-full`} title={item.selectedSupplier}>
                              {item.selectedSupplier}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-xs px-2 py-2 w-[12%] break-all ${isSummaryRow ? '' : 'font-semibold text-gray-900'}`}>
                          {isSummaryRow || isNotAvailable ? '-' : `R${formatNumber(item.unitPrice)}`}
                        </TableCell>
                        <TableCell className={`text-right font-mono text-sm px-2 py-2 w-[10%] break-all ${isSummaryRow ? 'font-bold text-[#00b4d8] text-base' : 'font-bold text-green-600'}`}>
                          {isSummaryRow ? `R${formatNumber(item.totalPrice)}` : (isNotAvailable ? '-' : `R${formatNumber(item.totalPrice)}`)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          {/* Total Summary Footer */}
          <div className="border-t bg-gray-50 p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="text-sm text-gray-600">
                {(() => {
                  const itemsIncluded = bill.items.filter(item => {
                    const hasValidQty = item.quantity?.trim() && item.quantity?.trim() !== '' && parseFloat(item.quantity) !== 0;
                    const hasAvailableSupplier = item.selectedSupplier !== 'Not Available' && item.selectedSupplier !== 'N/A';
                    return hasValidQty && hasAvailableSupplier;
                  });
                  const itemsExcluded = bill.items.length - itemsIncluded.length;
                  const blankQtyCount = bill.items.filter(item => !item.quantity?.trim() || item.quantity?.trim() === '').length;
                  const notAvailableCount = bill.items.filter(item => {
                    const hasValidQty = item.quantity?.trim() && item.quantity?.trim() !== '';
                    return hasValidQty && (item.selectedSupplier === 'Not Available' || item.selectedSupplier === 'N/A');
                  }).length;
                  
                  return (
                    <>
                      <span className="font-medium">{itemsIncluded.length} items included in total</span>
                      {itemsExcluded > 0 && (
                        <span className="text-orange-600 ml-2">
                          ({itemsExcluded} excluded: 
                          {blankQtyCount > 0 && ` ${blankQtyCount} blank qty`}
                          {blankQtyCount > 0 && notAvailableCount > 0 && ','}
                          {notAvailableCount > 0 && ` ${notAvailableCount} not available`})
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Grand Total</div>
                <div className="text-2xl font-bold text-green-600">
                  R{formatNumber(bill.overallTotal)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Settings Display - Now Above Intelligent Cost Optimization */}
      {bill.projectSettings && (
        <Card className="border-l-4 border-l-[#00b4d8] bg-gradient-to-r from-[#00b4d8]/5 to-blue-50/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-[#00b4d8]">Project Settings Applied</CardTitle>
            <CardDescription className="text-xs">
              These settings were used to calculate pricing and overheads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Province</p>
                <Badge className="bg-[#00b4d8] hover:bg-[#00b4d8] text-white font-semibold text-xs">
                  {bill.projectSettings.province}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Profit Margin</p>
                <Badge className="bg-green-600 hover:bg-green-600 text-white font-semibold text-xs">
                  {bill.projectSettings.profitMargin}%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">CIDB Grading</p>
                <Badge className="bg-purple-600 hover:bg-purple-600 text-white font-semibold text-xs">
                  {bill.projectSettings.cidbGrading}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Duration</p>
                <Badge className="bg-orange-600 hover:bg-orange-600 text-white font-semibold text-xs">
                  {bill.projectSettings.duration} months
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 font-medium">Machinery</p>
                <Badge className="bg-gray-700 hover:bg-gray-700 text-white font-semibold text-xs">
                  {bill.projectSettings.machineryType === 'owned' ? 'Owned Plant' : 'Rented/Hired'}
                </Badge>
              </div>
            </div>

            {/* Impact Explanations */}
            <div className="border-t pt-3">
              <p className="text-xs font-semibold text-gray-700 mb-2">How These Settings Affected Your BOQ:</p>
              <div className="grid md:grid-cols-2 gap-2">
                {/* Province Impact */}
                <div className="bg-white border border-[#00b4d8]/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-[#00b4d8] text-white text-[11px] px-2 py-0.5 shrink-0">Province</Badge>
                    <div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <span className="font-semibold">Regional Pricing:</span> Supplier rates filtered for {bill.projectSettings.province} province. 
                        Items sourced from nearest depots to minimize transport costs.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profit Margin Impact */}
                <div className="bg-white border border-green-600/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-green-600 text-white text-[11px] px-2 py-0.5 shrink-0">Profit</Badge>
                    <div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <span className="font-semibold">Markup Applied:</span> {bill.projectSettings.profitMargin}% profit margin added to total costs. 
                        Covers overhead, risk management, and contractor profit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* CIDB Grading Impact */}
                <div className="bg-white border border-purple-600/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-purple-600 text-white text-[11px] px-2 py-0.5 shrink-0">CIDB</Badge>
                    <div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <span className="font-semibold">Company Overheads:</span> {bill.projectSettings.cidbGrading} grading determines operational overhead % 
                        (higher grades = higher overheads for compliance, quality systems).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Duration Impact */}
                <div className="bg-white border border-orange-600/20 rounded-lg p-2.5">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-orange-600 text-white text-[11px] px-2 py-0.5 shrink-0">Duration</Badge>
                    <div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <span className="font-semibold">Time-Based Costs:</span> {bill.projectSettings.duration}-month duration affects preliminaries, 
                        site setup, supervision, equipment rental periods, and inflation adjustments.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Machinery Type Impact */}
                <div className="bg-white border border-gray-700/20 rounded-lg p-2.5 md:col-span-2">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-gray-700 text-white text-[11px] px-2 py-0.5 shrink-0">Machinery</Badge>
                    <div>
                      <p className="text-[11px] text-gray-700 leading-snug">
                        <span className="font-semibold">Equipment Costs:</span> {bill.projectSettings.machineryType === 'owned' 
                          ? 'Owned plant reduces earthworks and mechanical costs by up to 60% (no rental fees, only fuel & maintenance). Depreciation already factored in.' 
                          : 'Rented/hired equipment includes full market rental rates, transport mobilization, operator costs, and demobilization fees.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cost Optimization Info */}
      <Card className="border-l-4 border-l-[#00b4d8]">
        <CardHeader>
          <CardTitle className="text-lg flex items-center text-[#00b4d8]">
            <Coins className="h-5 w-5 mr-2" />
            Intelligent Cost Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 font-medium mb-4">
            Your bill was automatically optimized using our intelligent pricing engine:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-[#00b4d8] font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Multi-Supplier Search</p>
                <p className="text-sm text-gray-600">Searched across 55 suppliers including BUCO, Macsteel, Lafarge, ROOFCAP, CIVIL LAB, and more</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-[#00b4d8] font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Smart Matching</p>
                <p className="text-sm text-gray-600">Matched items by name and description keywords</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-[#00b4d8] font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Best Price Selection</p>
                <p className="text-sm text-gray-600">Automatically selected the lowest rate for each item</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <span className="text-[#00b4d8] font-bold text-xl">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Accurate Calculations</p>
                <p className="text-sm text-gray-600">100% accuracy with zero arithmetic errors</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}