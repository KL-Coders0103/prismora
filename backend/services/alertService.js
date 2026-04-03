const Alert = require("../models/Alert");
const Sales = require("../models/Sales");
const { getIO } = require("../sockets/realtimeSocket");

// CREATE ALERT
exports.createAlert = async (
  message,
  type = "info",
  severity = "medium",
  source = "system",
  metadata = {}
) => {
  try {
    if (!message || message.trim().length < 3) return null;

    const alert = await Alert.create({
      message: message.trim(),
      type: type.toLowerCase(),
      severity: severity.toLowerCase(),
      source,
      metadata
    });

    // SAFE SOCKET EMIT
    try {
      const io = getIO?.();
      if (io) {
        io.emit("alert", {
          _id: alert._id,
          message: alert.message,
          type: alert.type,
          severity: alert.severity,
          createdAt: alert.createdAt
        });
      }
    } catch (e) {
      console.warn("Socket emit skipped");
    }

    return alert;

  } catch (error) {
    console.error("[Alert Service Error]:", error.message);
    return null;
  }
};

// ANOMALY DETECTION
exports.detectRevenueAnomaly = async () => {
  try {
    const revenue = await Sales.aggregate([
      { $group: { _id: "$region", revenue: { $sum: "$revenue" } } }
    ]);

    for (const region of revenue) {
      if (region.revenue > 150000) {
        await exports.createAlert(
          `Revenue spike detected in ${region._id || "Unknown"} region`,
          "analytics",
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