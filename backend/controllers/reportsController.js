const { generatePDFReport } = require("../services/pdfReportService");
const { generateSalesReport } = require("../services/reportService");
const { logActivity } = require("../services/activityService");

// PDF
exports.downloadPDF = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "system";

    await logActivity(userId, "download_pdf_report");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="PRISMORA_Report.pdf"');

    // ✅ SAFETY TIMEOUT
    const timeout = setTimeout(() => {
      console.error("PDF generation timeout");
      res.end();
    }, 20000);

    await generatePDFReport(res);

    clearTimeout(timeout);

  } catch (error) {
    console.error("[PDF Error]:", error);

    if (!res.headersSent) {
      res.status(500).json({ message: "PDF generation failed." });
    } else {
      res.end();
    }
  }
};

// EXCEL
exports.downloadExcel = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "system";

    await logActivity(userId, "download_excel_report");

    const workbook = await generateSalesReport();

    if (!workbook) {
      return res.status(400).json({ message: "No data available." });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="PRISMORA_Sales_Report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("[Excel Error]:", error);

    if (!res.headersSent) {
      res.status(500).json({ message: "Excel generation failed." });
    } else {
      res.end();
    }
  }
};