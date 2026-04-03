const ActivityLog = require("../models/ActivityLog");

// SIMPLE IN-MEMORY THROTTLE (prevents spam)
const lastLogs = new Map();

exports.logActivity = async (
  user = null,
  action,
  metadata = {},
  entity = ""
) => {
  try {
    const key = `${user}-${action}`;
    const now = Date.now();

    // 🔥 THROTTLE (1 log per 2 sec per action)
    if (lastLogs.has(key) && now - lastLogs.get(key) < 2000) {
      return;
    }

    lastLogs.set(key, now);

    const logData = {
      action: action?.trim(),
      metadata,
      entity
    };

    if (user && String(user).toLowerCase() !== "system") {
      logData.user = user;
    }

    await ActivityLog.create(logData);

  } catch (error) {
    console.error("[Activity Log Error]:", error.message);
  }
};