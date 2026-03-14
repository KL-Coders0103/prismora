const PDFDocument = require("pdfkit");
const Sales = require("../models/Sales");

exports.generatePDFReport = async (res) => {

  const sales = await Sales.find();

  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=sales_report.pdf"
  );

  doc.pipe(res);

  doc.fontSize(20).text("PRISMORA SALES REPORT", {
    align: "center"
  });

  doc.moveDown();

  sales.forEach((item) => {

    doc.fontSize(12).text(
      `${item.product} | ${item.category} | ${item.quantity} | ${item.revenue} | ${item.region}`
    );

  });

  doc.end();

};