const Alert = require("../models/Alert");
const Sales = require("../models/Sales");
const { getIO } = require("../sockets/realtimeSocket"); // Adjusted to match your socket setup

// CREATE ALERT
exports.createAlert = async (
  message,
  type = "info",
  severity = "medium",
  source = "system",
  metadata = {}
) => {
  try {
    const alert = await Alert.create({ message, type, severity, source, metadata });

    // Emit via WebSockets
    const io = getIO();
    if (io) {
      io.emit("alert", alert);
    }

    return alert;
  } catch (error) {
    console.error("[Alert Creation Error]:", error.message);
  }
};

// AI ANOMALY DETECTION
exports.detectRevenueAnomaly = async () => {
  try {
    const revenue = await Sales.aggregate([
      { $group: { _id: "$region", revenue: { $sum: "$revenue" } } }
    ]);

    // FIX: Using for...of instead of forEach to respect async/await
    for (const region of revenue) {
      if (region.revenue > 150000) {
        await exports.createAlert(
          `Unusual revenue spike detected in the ${region._id} region.`,
          "analytics", // Matched with Alert schema enums
          "warning",
          "analytics_engine",
          { region: region._id, revenue: region.revenue }
        );
      }
    }
  } catch (error) {
    console.error("[Anomaly Detection Error]:", error.message);
  }
};