const ActivityLog = require("../models/ActivityLog");

exports.getLogs = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const page = Math.max(Number(req.query.page) || 1, 1);
    const skip = (page - 1) * limit;

    const logs = await ActivityLog.find()
      .populate("user", "name email role") 
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(logs);
  } catch (error) {
    console.error("[Activity Logs Error]:", error);
    res.status(500).json({ error: "Failed to fetch activity logs from database." });
  }
};