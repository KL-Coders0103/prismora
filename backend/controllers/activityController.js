const ActivityLog = require("../models/ActivityLog"); // Adjust path if your models folder is elsewhere

// 🔥 GET ACTIVITY LOGS (For the Frontend UI)
exports.getInsights = async (req, res) => {
  try {
    // Fetch the latest 100 logs to keep the payload light and fast
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("user", "name email") // Fetch name & email from the User collection
      .lean(); // lean() makes the query much faster since we just need raw JSON

    // Map the database 'metadata' field to the 'details' field your frontend expects
    const formattedLogs = logs.map((log) => ({
      _id: log._id,
      action: log.action,
      user: log.user,
      entity: log.entity,
      details: log.metadata, // Connects to log.details in your React code
      createdAt: log.createdAt,
    }));

    // Send a direct array, which fixes your "No activity recorded yet" bug!
    res.status(200).json(formattedLogs);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ message: "Failed to fetch activity logs." });
  }
};

// 🔥 UTILITY FUNCTION: Create a new log 
// (You can import and call this from your other controllers when a user does something)
exports.logActivity = async (userId, action, entity = "", metadata = {}) => {
  try {
    await ActivityLog.create({
      user: userId, // Can be null for system actions
      action,
      entity,
      metadata,
    });
  } catch (error) {
    console.error("[Activity Log Error]: Failed to save log -", error);
  }
};