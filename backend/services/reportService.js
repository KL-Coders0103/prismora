const ExcelJS = require("exceljs");
const Sales = require("../models/Sales");

exports.generateSalesReport = async () => {

  const data = await Sales.find();

  const workbook = new ExcelJS.Workbook();

  // ===== SUMMARY SHEET =====
  const summarySheet = workbook.addWorksheet("Summary");

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalSales = data.reduce((sum, item) => sum + item.quantity, 0);
  const totalRecords = data.length;

  summarySheet.columns = [
    { header: "Metric", key: "metric", width: 25 },
    { header: "Value", key: "value", width: 20 }
  ];

  summarySheet.addRow({ metric: "Total Revenue", value: totalRevenue });
  summarySheet.addRow({ metric: "Total Units Sold", value: totalSales });
  summarySheet.addRow({ metric: "Total Records", value: totalRecords });


  // ===== SALES DATA SHEET =====
  const sheet = workbook.addWorksheet("Sales Data");

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Product", key: "product", width: 20 },
    { header: "Category", key: "category", width: 20 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "Revenue", key: "revenue", width: 15 },
    { header: "Region", key: "region", width: 15 }
  ];

  // HEADER STYLE
  sheet.getRow(1).font = { bold: true };

  data.forEach(item => {

    sheet.addRow({
      date: item.date,
      product: item.product,
      category: item.category,
      quantity: item.quantity,
      revenue: item.revenue,
      region: item.region
    });

  });

  return workbook;

};