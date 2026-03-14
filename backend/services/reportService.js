const ExcelJS = require("exceljs");
const Sales = require("../models/Sales");

exports.generateSalesReport = async () => {

  const data = await Sales.find();

  const workbook = new ExcelJS.Workbook();

  const sheet = workbook.addWorksheet("Sales Report");

  sheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Product", key: "product", width: 20 },
    { header: "Category", key: "category", width: 20 },
    { header: "Quantity", key: "quantity", width: 10 },
    { header: "Revenue", key: "revenue", width: 15 },
    { header: "Region", key: "region", width: 15 }
  ];

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