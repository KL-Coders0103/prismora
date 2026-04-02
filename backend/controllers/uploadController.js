const fs = require("fs");
const parseCSV = require("../utils/csvParser");
const Sales = require("../models/Sales");
const AnalyticsSummary = require("../models/AnalyticsSummary");
const { logActivity } = require("../services/activityService"); // Assuming this exists

exports.uploadCSV = async (req, res) => {
  let filePath;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded. Please select a CSV file." });
    }

    filePath = req.file.path;

    // 1. Parse and sanitize the CSV (filtering is handled inside parseCSV)
    const validData = await parseCSV(filePath);

    if (validData.length === 0) {
      return res.status(400).json({ message: "CSV file is empty or contains no valid data rows." });
    }

    if (validData.length > 50000) {
      return res.status(400).json({ message: "Dataset too large. Maximum allowed is 50,000 rows per upload." });
    }

    // 2. Batch Insertion (Crucial for Node.js memory management)
    // Inserts in chunks of 5000 to prevent event loop blocking
    const BATCH_SIZE = 5000;
    for (let i = 0; i < validData.length; i += BATCH_SIZE) {
      const batch = validData.slice(i, i + BATCH_SIZE);
      await Sales.insertMany(batch);
    }

    // 3. Recalculate Analytics Summary securely
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

    // Safety fallback if aggregation is empty
    const summary = summaryAgg[0] || { revenue: 0, sales: 0, regions: [] };

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

    // 4. Log Activity (Safely checking if req.user exists)
    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "dataset_uploaded", {
      filename: req.file.originalname,
      records: validData.length
    });

    res.status(200).json({
      message: "Dataset processed and integrated successfully.",
      recordsProcessed: validData.length
    });

  } catch (error) {
    console.error("[Upload Error]:", error);
    res.status(500).json({ error: "An internal server error occurred during processing." });
  } finally {
    // 5. Bulletproof Cleanup
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (cleanupError) {
        console.error("Failed to delete temp file:", cleanupError);
      }
    }
  }
};