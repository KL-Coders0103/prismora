const PDFDocument = require("pdfkit");
const Sales = require("../models/Sales");

exports.generatePDFReport = async (res) => {
  try {
    const sales = await Sales.find()
      .sort({ date: -1 })
      .limit(500)
      .lean();

    if (!sales.length) {
      return res.status(400).json({ message: "No data available for PDF report." });
    }

    // Calculate Summary Metrics
    const totalRevenue = sales.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue);

    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Prismora_Executive_Report.pdf"');

    doc.pipe(res);

    // --- Header ---
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#4f46e5').text("PRISMORA", { align: "left" });
    doc.fontSize(12).font('Helvetica').fillColor('#64748b').text("Executive Sales Report", { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString('en-IN')}`, { align: "left" });
    doc.moveDown(1);

    // --- Executive Summary Box ---
    doc.rect(50, doc.y, 495, 60).fillAndStroke('#f8fafc', '#e2e8f0');
    doc.fillColor('#0f172a').fontSize(12).font('Helvetica-Bold').text("Financial Summary", 65, doc.y + 10);
    doc.fontSize(10).font('Helvetica').text(`Total Transactions: ${sales.length}`, 65, doc.y + 20);
    doc.text(`Total Revenue: ${formattedTotal}`, 300, doc.y - 12);
    doc.moveDown(3);

    // --- Table Column Settings ---
    const tableTop = doc.y;
    const colProduct = 60;
    const colCategory = 240;
    const colRegion = 360;
    const colRevenue = 440;

    const drawHeaders = (y) => {
      doc.rect(50, y - 5, 495, 20).fill('#1e293b'); // Dark Slate Header
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(10);
      doc.text("Product", colProduct, y);
      doc.text("Category", colCategory, y);
      doc.text("Region", colRegion, y);
      doc.text("Revenue", colRevenue, y, { width: 95, align: "right" });
    };

    let currentY = tableTop;
    drawHeaders(currentY);
    currentY += 25;

    // --- Table Rows with Zebra Striping ---
    sales.forEach((item, index) => {
      if (currentY > 750) {
        doc.addPage();
        currentY = 50;
        drawHeaders(currentY);
        currentY += 25;
      }

      // Zebra Striping (Light gray background for even rows)
      if (index % 2 === 0) {
        doc.rect(50, currentY - 5, 495, 20).fill('#f8fafc');
      }

      const revenueStr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.revenue || 0);

      doc.fillColor('#334155').font('Helvetica').fontSize(10);
      doc.text(item.product || "N/A", colProduct, currentY, { width: 170, height: 15, ellipsis: true });
      doc.text(item.category || "N/A", colCategory, currentY, { width: 110, height: 15, ellipsis: true });
      doc.text(item.region || "N/A", colRegion, currentY, { width: 80, height: 15, ellipsis: true });
      doc.text(revenueStr, colRevenue, currentY, { width: 95, align: "right" });
      
      currentY += 20;
    });

    // --- Footer & Pagination ---
    const pages = doc.bufferedPageRange();
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      doc.moveTo(50, doc.page.height - 50).lineTo(545, doc.page.height - 50).strokeColor('#cbd5e1').lineWidth(1).stroke();
      doc.fontSize(8).fillColor('#94a3b8').text(
        `CONFIDENTIAL  |  Page ${i + 1} of ${pages.count}`,
        50,
        doc.page.height - 40,
        { align: 'center' }
      );
    }

    doc.end();

  } catch (error) {
    console.error("[PDF Error]:", error);
    if (!res.headersSent) res.status(500).json({ message: "PDF generation failed" });
    else res.end();
  }
};