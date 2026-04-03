const fs = require("fs");
const mongoose = require("mongoose");

const parseCSV = require("../utils/csvParser");
const Sales = require("../models/Sales");
const AnalyticsSummary = require("../models/AnalyticsSummary");
const { logActivity } = require("../services/activityService");

exports.uploadCSV = async (req, res) => {
  let filePath;
  const session = await mongoose.startSession();

  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    filePath = req.file.path;

    const data = await parseCSV(filePath);

    if (!data.length) {
      return res.status(400).json({ message: "CSV empty." });
    }

    if (data.length > 50000) {
      return res.status(400).json({ message: "Max 50k rows allowed." });
    }

    // ✅ TRANSACTION START
    session.startTransaction();

    const BATCH_SIZE = 5000;

    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, i + BATCH_SIZE);

      await Sales.insertMany(batch, { session });
    }

    // ✅ FIXED SUMMARY (REAL CUSTOMER COUNT)
    const summaryAgg = await Sales.aggregate([
      {
        $group: {
          _id: null,
          revenue: { $sum: "$revenue" },
          sales: { $sum: "$quantity" },
          customers: { $addToSet: "$customerId" }
        }
      }
    ]).session(session);

    const summary = summaryAgg[0] || {
      revenue: 0,
      sales: 0,
      customers: []
    };

    await AnalyticsSummary.findOneAndUpdate(
      {},
      {
        totalRevenue: summary.revenue,
        totalSales: summary.sales,
        customers: summary.customers.length,
        lastUpdated: new Date()
      },
      { upsert: true, session }
    );

    await session.commitTransaction();

    const userId = req.user?.id || req.user?._id || "system";

    await logActivity(userId, "dataset_uploaded", {
      records: data.length
    });

    res.status(200).json({
      message: "Upload successful",
      records: data.length
    });

  } catch (error) {
    await session.abortTransaction();

    console.error("[Upload Error]:", error);

    res.status(500).json({ message: "Upload failed." });

  } finally {
    session.endSession();

    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch {}
    }
  }
};