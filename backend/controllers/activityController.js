const ActivityLog = require("../models/ActivityLog");


// GET ACTIVITY LOGS
exports.getLogs = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.action) {
      filter.action = req.query.action;
    }

    const logs = await ActivityLog.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ActivityLog.countDocuments(filter);

    res.json({
      page,
      total,
      logs
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};