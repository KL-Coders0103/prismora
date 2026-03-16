const { generatePDFReport } = require("../services/pdfReportService");
const { generateSalesReport } = require("../services/reportService");
const { logActivity } = require("../services/activityService");

exports.downloadPDF = async (req, res) => {

  try {

    await logActivity(
      req.user?.id || null,
      "download_pdf_report",
      { type: "pdf" }
    );

    res.setHeader("Content-Type","application/pdf");

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=business_report.pdf"
    );

    await generatePDFReport(res);

  } catch (error) {

    console.error("PDF report error:", error);

    if (!res.headersSent) {

      res.status(500).json({
        message:"Failed to generate PDF report"
      });

    }

  }

};

exports.downloadExcel = async (req, res) => {

  try {

    await logActivity(
      req.user?.id || null,
      "download_excel_report",
      { type:"excel" }
    );

    const workbook = await generateSalesReport();

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=sales_report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (error) {

    console.error("Excel report error:", error);

    if (!res.headersSent) {

      res.status(500).json({
        message:"Failed to generate Excel report"
      });

    }

  }

};