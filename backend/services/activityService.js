const ActivityLog = require("../models/ActivityLog");


// LOG USER ACTIVITY
exports.logActivity = async (
  user = null,
  action,
  metadata = {},
  entity = ""
) => {

  try {

    const logData = {
      action: action?.trim(),
      metadata,
      entity
    };

    if (user && user !== "System") {
      logData.user = user;
    }

    await ActivityLog.create(logData);

  } catch (error) {

    console.error("Activity log error:", error.message);

  }

};