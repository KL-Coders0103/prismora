const { generatePDFReport } = require("../services/pdfReportService");
const { generateSalesReport } = require("../services/reportService");

exports.downloadPDF = async (req, res) => {

  try {

    await generatePDFReport(res);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};

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

    res.end();

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};