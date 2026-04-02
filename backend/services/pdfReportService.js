const PDFDocument = require("pdfkit");
const Sales = require("../models/Sales");

exports.generatePDFReport = async (res) => {
  try {
    // SECURITY/PERFORMANCE: Limit to 500 recent records to prevent PDF generation from exhausting server RAM
    const sales = await Sales.find().sort({ date: -1 }).limit(500).lean();

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Pipe directly to the Express response object
    doc.pipe(res);

    // --- TITLE ---
    doc.fontSize(20)
       .font('Helvetica-Bold')
       .text("PRISMORA BUSINESS SALES REPORT", { align: "center" });
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(`Generated on: ${new Date().toLocaleString()}`, { align: "center" });
       
    doc.moveDown(2);

    // --- SUMMARY METRICS ---
    const totalRevenue = sales.reduce((sum, s) => sum + s.revenue, 0);
    const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0);

    doc.fontSize(14).font('Helvetica-Bold').text("Recent Activity Summary (Top 500)");
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Total Revenue (from sample): ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(totalRevenue)}`);
    doc.text(`Total Units Sold (from sample): ${totalQuantity.toLocaleString()}`);
    doc.moveDown(2);

    // --- TABLE GENERATION HELPER ---
    const drawTableHeader = () => {
      doc.fontSize(10).font('Helvetica-Bold');
      doc.text("Date", 50, doc.y, { continued: true, width: 70 });
      doc.text("Product", 120, doc.y, { continued: true, width: 130 });
      doc.text("Category", 250, doc.y, { continued: true, width: 100 });
      doc.text("Qty", 350, doc.y, { continued: true, width: 50 });
      doc.text("Revenue", 400, doc.y, { continued: true, width: 70 });
      doc.text("Region", 470, doc.y);
      
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#cccccc').stroke();
      doc.moveDown(0.5);
    };

    drawTableHeader();

    // --- TABLE DATA WITH PAGE BREAK LOGIC ---
    doc.font('Helvetica');
    
    for (const item of sales) {
      // FIX: Check if we are at the bottom of the page
      if (doc.y > 750) {
        doc.addPage();
        drawTableHeader();
        doc.font('Helvetica');
      }

      const dateStr = item.date ? new Date(item.date).toLocaleDateString('en-IN') : 'N/A';
      
      // We use string limits to ensure columns don't overlap
      doc.text(dateStr, 50, doc.y, { continued: true, width: 70 });
      doc.text((item.product || "").substring(0, 20), 120, doc.y, { continued: true, width: 130 });
      doc.text((item.category || "").substring(0, 15), 250, doc.y, { continued: true, width: 100 });
      doc.text(item.quantity?.toString() || "0", 350, doc.y, { continued: true, width: 50 });
      doc.text(`₹${item.revenue?.toLocaleString() || "0"}`, 400, doc.y, { continued: true, width: 70 });
      doc.text((item.region || "").substring(0, 15), 470, doc.y);
      
      doc.moveDown(0.5);
    }

    // Finalize the PDF
    doc.end();

  } catch (error) {
    console.error("[PDF Report Service Error]:", error);
    // If we haven't sent headers yet, we can send a 500 JSON. 
    // If doc.pipe started, sending JSON will crash Express. We must just end the response.
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF report." });
    } else {
      res.end(); 
    }
  }
};