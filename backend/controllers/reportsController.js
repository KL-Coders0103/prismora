const { generatePDFReport } = require("../services/pdfReportService");
const { generateSalesReport } = require("../services/reportService");
const { logActivity } = require("../services/activityService");

exports.downloadPDF = async (req, res) => {
  try {
    // Safely check user ID
    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "download_pdf_report", { type: "pdf" });

    // Ensure headers are set for PDF rendering
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="PRISMORA_Report.pdf"');

    // Assuming generatePDFReport handles piping to `res`
    await generatePDFReport(res);

  } catch (error) {
    console.error("[PDF Report Error]:", error);

    // If headers are already sent (mid-stream crash), we must end the response abruptly
    if (res.headersSent) {
      res.end();
    } else {
      res.status(500).json({ message: "Failed to generate PDF report. Please try again later." });
    }
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "download_excel_report", { type: "excel" });

    // Generate workbook first. If it crashes, headers haven't been sent yet.
    const workbook = await generateSalesReport();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="PRISMORA_Sales_Report.xlsx"');

    // Write the workbook to the response stream
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("[Excel Report Error]:", error);

    if (res.headersSent) {
      res.end();
    } else {
      res.status(500).json({ message: "Failed to generate Excel report. Ensure dataset is not empty." });
    }
  }
};