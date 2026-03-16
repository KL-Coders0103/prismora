const parseCSV = require("../utils/csvParser");
const Sales = require("../models/Sales");
const fs = require("fs");

const { logActivity } = require("../services/activityService");
const AnalyticsSummary = require("../models/AnalyticsSummary");

exports.uploadCSV = async (req, res) => {

  let filePath;

  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded"
      });
    }

    filePath = req.file.path;

    const csvData = await parseCSV(filePath);

    if (csvData.length === 0) {
      return res.status(400).json({
        message: "CSV file empty"
      });
    }

    if (csvData.length > 50000) {
      return res.status(400).json({
        message: "Dataset too large (max 50k rows)"
      });
    }

    const formattedData = csvData.filter(row =>
      row.date &&
      row.product &&
      row.category &&
      !isNaN(row.quantity) &&
      !isNaN(row.revenue) &&
      row.region
    );

    const inserted = await Sales.insertMany(formattedData);

    console.log("Inserted rows:", inserted.length);

    // UPDATE ANALYTICS SUMMARY

    const summaryAgg = await Sales.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$revenue" },
          sales: { $sum: "$quantity" },
          regions: { $addToSet: "$region" }
        }
      }
    ]);

    const summary = summaryAgg[0];

    await AnalyticsSummary.findOneAndUpdate(
      {},
      {
        totalRevenue: summary.revenue,
        totalSales: summary.sales,
        customers: summary.regions.length,
        lastUpdated: new Date()
      },
      { upsert: true }
    );

    await logActivity(
      req.user.id,
      "dataset_uploaded",
      {
        filename: req.file.originalname,
        records: formattedData.length
      }
    );

    res.json({
      message: "Dataset uploaded successfully",
      records: formattedData.length
    });

    console.log("CSV rows:", csvData.length);
    console.log("Formatted rows:", formattedData.length);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  } finally {

    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

  }

};