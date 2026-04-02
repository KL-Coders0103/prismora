const ExcelJS = require("exceljs");
const Sales = require("../models/Sales");

exports.generateSalesReport = async () => {
  // Sort chronologically for a better user experience in Excel
  const data = await Sales.find().sort({ date: -1 }).lean();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = "PRISMORA AI";
  workbook.created = new Date();

  // ===== SUMMARY SHEET =====
  const summarySheet = workbook.addWorksheet("Analytics Summary");

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);
  const totalSales = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalRecords = data.length;

  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 25 },
    { header: "Value", key: "value", width: 25 }
  ];

  summarySheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };
  summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FF4F46E5" } };

  summarySheet.addRow({ metric: "Total Revenue", value: totalRevenue }).numFmt = '"₹"#,##0.00';
  summarySheet.addRow({ metric: "Total Units Sold", value: totalSales }).numFmt = '#,##0';
  summarySheet.addRow({ metric: "Total Recorded Transactions", value: totalRecords }).numFmt = '#,##0';

  // ===== SALES DATA SHEET =====
  const sheet = workbook.addWorksheet("Raw Sales Data");

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Product", key: "product", width: 30 },
    { header: "Category", key: "category", width: 20 },
    { header: "Quantity", key: "quantity", width: 12 },
    { header: "Revenue", key: "revenue", width: 18 },
    { header: "Region", key: "region", width: 20 }
  ];

  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: "FFF3F4F6" } };

  data.forEach(item => {
    sheet.addRow({
      date: item.date ? new Date(item.date) : null,
      product: item.product,
      category: item.category,
      quantity: item.quantity,
      revenue: item.revenue,
      region: item.region
    });
  });

  // Formatting columns
  sheet.getColumn("date").numFmt = 'yyyy-mm-dd';
  sheet.getColumn("quantity").numFmt = '#,##0';
  sheet.getColumn("revenue").numFmt = '"₹"#,##0.00';

  return workbook;
};