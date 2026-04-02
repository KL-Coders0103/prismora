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

    // Safely check for system actions to prevent CastErrors on ObjectId
    if (user && String(user).toLowerCase() !== "system") {
      logData.user = user;
    }

    await ActivityLog.create(logData);
  } catch (error) {
    // Fire-and-forget: Do not crash the parent request if logging fails
    console.error("[Activity Log Error]:", error.message);
  }
};