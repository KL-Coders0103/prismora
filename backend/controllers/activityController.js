const ActivityLog = require("../models/ActivityLog");

exports.getLogs = async (req, res) => {

  try {

    const logs = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};