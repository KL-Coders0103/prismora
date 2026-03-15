const ActivityLog = require("../models/ActivityLog");


// LOG USER ACTIVITY
exports.logActivity = async (
  user = null,
  action,
  metadata = {}
) => {

  try {

    await ActivityLog.create({
      user,
      action,
      metadata
    });

  } catch (error) {

    console.error("Activity log error:", error.message);

  }

};