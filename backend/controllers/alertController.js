const Alert = require("../models/Alert");
const { getIO } = require("../sockets/realtimeSocket"); // Assuming this returns the socket instance
const { logActivity } = require("../services/activityService");

exports.getAlerts = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100); // Cap at 100

    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(alerts);
  } catch (error) {
    console.error("[Get Alerts Error]:", error);
    res.status(500).json({ message: "Failed to fetch alerts from database." });
  }
};

exports.createAlert = async (req, res) => {
  try {
    const { message, type, severity, source } = req.body;

    if (!message || message.length < 3) {
      return res.status(400).json({ message: "Valid alert message required (min 3 chars)." });
    }

    const allowedTypes = ["system", "sales", "ai", "security"];
    if (type && !allowedTypes.includes(type.toLowerCase())) {
      return res.status(400).json({ message: "Invalid alert type provided." });
    }

    const alert = await Alert.create({
      message,
      type: type?.toLowerCase() || "system",
      severity: severity?.toLowerCase() || "info",
      source
    });

    // Safe Socket Emit
    try {
      const io = getIO();
      if (io) {
        io.emit("alert", {
          _id: alert._id,
          message: alert.message,
          type: alert.type,
          severity: alert.severity,
          createdAt: alert.createdAt
        });
      }
    } catch (socketErr) {
      console.warn("Socket emit failed (Server might be running without WS):", socketErr.message);
    }

    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "create_alert", { message: message.substring(0, 100) });

    res.status(201).json(alert);
  } catch (error) {
    console.error("[Create Alert Error]:", error);
    res.status(500).json({ message: "Failed to create alert." });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "alert_marked_read", { alertId: req.params.id });

    res.status(200).json(alert);
  } catch (error) {
    console.error("[Mark Alert Read Error]:", error);
    res.status(500).json({ message: "Failed to update alert." });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found." });
    }

    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "delete_alert", { alertId: req.params.id });

    res.status(200).json({ message: "Alert deleted successfully." });
  } catch (error) {
    console.error("[Delete Alert Error]:", error);
    res.status(500).json({ message: "Failed to delete alert." });
  }
};