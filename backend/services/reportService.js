const ExcelJS = require("exceljs");
const Sales = require("../models/Sales");

exports.generateSalesReport = async () => {
  const data = await Sales.find()
    .sort({ date: -1 })
    .limit(10000) 
    .lean();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Prismora Analytics";
  
  // Freeze the top 7 rows (Title, Summary, and Headers)
  const sheet = workbook.addWorksheet("Sales Data", {
    views: [{ state: 'frozen', ySplit: 7 }]
  });

  if (!data.length) {
    sheet.addRow(["No data available"]);
    return workbook;
  }

  // --- Title Banner ---
  sheet.mergeCells('A1:F2');
  const titleCell = sheet.getCell('A1');
  titleCell.value = "PRISMORA EXECUTIVE SALES REPORT";
  titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4F46E5' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // --- Executive Summary Section ---
  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  
  sheet.mergeCells('A4:C4');
  sheet.getCell('A4').value = "Executive Summary";
  sheet.getCell('A4').font = { bold: true, size: 12 };
  
  sheet.getCell('A5').value = "Total Records:";
  sheet.getCell('B5').value = data.length;
  sheet.getCell('B5').font = { bold: true };
  
  sheet.getCell('D5').value = "Total Revenue:";
  sheet.getCell('E5').value = totalRevenue;
  sheet.getCell('E5').numFmt = '"₹"#,##0.00';
  sheet.getCell('E5').font = { bold: true, color: { argb: 'FF059669' } }; // Emerald Green

  // --- Columns Configuration ---
  sheet.columns = [
    { key: "date", width: 18 },
    { key: "product", width: 35 },
    { key: "category", width: 22 },
    { key: "quantity", width: 15 },
    { key: "revenue", width: 22 },
    { key: "region", width: 20 }
  ];

  // --- Setup Data Headers (Row 7) ---
  const headerRow = sheet.getRow(7);
  headerRow.values = ["Date", "Product", "Category", "Quantity", "Revenue", "Region"];
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } }; 
  headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  headerRow.height = 25;

  sheet.autoFilter = 'A7:F7';

  // --- Populate Data ---
  data.forEach(item => {
    sheet.addRow({
      date: item.date ? new Date(item.date) : "",
      product: item.product || "N/A",
      category: item.category || "N/A",
      quantity: item.quantity || 0,
      revenue: item.revenue || 0,
      region: item.region || "N/A"
    });
  });

  const totalRows = data.length + 7; 

  // --- Formatting & Data Visualization ---
  for (let i = 8; i <= totalRows; i++) {
    const row = sheet.getRow(i);
    
    row.getCell(1).numFmt = 'dd-mmm-yyyy hh:mm AM/PM'; 
    row.getCell(4).alignment = { horizontal: 'center' }; 
    row.getCell(5).numFmt = '"₹"#,##0.00'; 

    if (i % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
    }

    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };
    });
  }

  // Add Excel Conditional Formatting (Color Scale on Revenue)
  sheet.addConditionalFormatting({
    ref: `E8:E${totalRows}`,
    rules: [
      {
        type: 'colorScale',
        cfvo: [{ type: 'min' }, { type: 'percentile', value: 50 }, { type: 'max' }],
        color: [{ argb: 'FFFCA5A5' }, { argb: 'FFFDE047' }, { argb: 'FF86EFAC' }] // Pastel Red -> Yellow -> Green
      }
    ]
  });

  return workbook;
};