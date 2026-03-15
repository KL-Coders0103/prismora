const PDFDocument = require("pdfkit");
const Sales = require("../models/Sales");

exports.generatePDFReport = async (res) => {

  try {

    const sales = await Sales.find();

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=prismora_sales_report.pdf"
    );

    doc.pipe(res);

    // TITLE
    doc
      .fontSize(22)
      .text("PRISMORA BUSINESS SALES REPORT", {
        align: "center"
      });

    doc.moveDown();

    // SUMMARY
    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
    const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);

    doc.fontSize(14).text("Summary Metrics");
    doc.moveDown(0.5);

    doc.text(`Total Revenue: ${totalRevenue}`);
    doc.text(`Total Units Sold: ${totalQuantity}`);
    doc.text(`Total Records: ${sales.length}`);

    doc.moveDown(2);

    // TABLE HEADER
    doc.fontSize(12).text("Product", 50, doc.y);
    doc.text("Category", 150, doc.y);
    doc.text("Qty", 270, doc.y);
    doc.text("Revenue", 320, doc.y);
    doc.text("Region", 420, doc.y);

    doc.moveDown();

    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown();

    // TABLE DATA
    sales.forEach((item) => {

      doc.text(item.product, 50, doc.y);
      doc.text(item.category, 150, doc.y);
      doc.text(item.quantity.toString(), 270, doc.y);
      doc.text(item.revenue.toString(), 320, doc.y);
      doc.text(item.region, 420, doc.y);

      doc.moveDown();

    });

    doc.end();

  } catch (error) {

    console.error("PDF Report Error:", error.message);

    res.status(500).json({
      error: "Failed to generate PDF report"
    });

  }

};