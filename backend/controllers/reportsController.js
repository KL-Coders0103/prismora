const { generatePDFReport } = require("../services/pdfReportService");
const { generateSalesReport } = require("../services/reportService");
const { logActivity } = require("../services/activityService");



// DOWNLOAD PDF REPORT
exports.downloadPDF = async (req, res) => {

  try {

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=business_report.pdf"
    );

    await generatePDFReport(res);

    await logActivity(
      req.user?.id || null,
      "download_pdf_report"
    );

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// DOWNLOAD EXCEL REPORT
exports.downloadExcel = async (req, res) => {

  try {

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

    await logActivity(
      req.user?.id || null,
      "download_excel_report"
    );

    res.end();

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};