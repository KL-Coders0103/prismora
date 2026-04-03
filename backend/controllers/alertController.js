const mongoose = require("mongoose");
const Alert = require("../models/Alert");
const { getIO } = require("../sockets/realtimeSocket");

// 🔥 Helper function to safely get User ID (Crash-proof)
const getUserIdStr = (req) => req.user?.id || req.user?._id?.toString();
const getUserIdObj = (req) => new mongoose.Types.ObjectId(getUserIdStr(req));

// 🔥 GET ALL (Alerts Page)
exports.getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    const userId = getUserIdStr(req); 

    const formattedAlerts = alerts.map((alert) => {
      const readByArray = alert.readBy || []; 
      const hasRead = readByArray.some((id) => id.toString() === userId);

      return {
        ...alert.toObject(),
        isRead: hasRead,
      };
    });

    res.json(formattedAlerts);
  } catch (err) {
    console.error("Error fetching alerts:", err);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

// 🔥 GET UNREAD (Navbar)
exports.getUnreadAlerts = async (req, res) => {
  try {
    const userIdObj = getUserIdObj(req);

    // Find alerts where this specific user has NOT read it yet
    const alerts = await Alert.find({ readBy: { $nin: [userIdObj] } })
      .sort({ createdAt: -1 })
      .limit(20);

    const formattedAlerts = alerts.map((alert) => ({
      ...alert.toObject(),
      isRead: false,
    }));

    res.json(formattedAlerts);
  } catch (err) {
    console.error("Error fetching unread alerts:", err);
    res.status(500).json({ message: "Failed to fetch unread alerts" });
  }
};

// 🔥 CREATE ALERT
exports.createAlert = async (req, res) => {
  try {
    const { message, type, severity } = req.body;

    const alert = await Alert.create({
      message,
      type,
      severity,
      readBy: [], 
    });

    const io = getIO();

    // Broadcast to everyone that a new alert exists
    io.emit("alert", {
      _id: alert._id,
      message: alert.message,
      type: alert.type,
      severity: alert.severity,
      createdAt: alert.createdAt,
      isRead: false, 
    });

    res.status(201).json(alert);
  } catch (err) {
    console.error("Error creating alert:", err);
    res.status(500).json({ message: "Failed to create alert" });
  }
};

// 🔥 MARK AS READ
exports.markAsRead = async (req, res) => {
  try {
    const userIdObj = getUserIdObj(req);
    const userIdStr = getUserIdStr(req);

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { readBy: userIdObj } }, // Prevents duplicate IDs
      { new: true }
    );

    const io = getIO();
    
    // ✅ FIX: Send the userId along with the alert ID so frontend knows WHO read it
    io.emit("alert_read", { id: alert._id, userId: userIdStr });

    res.json(alert);
  } catch (err) {
    console.error("Error marking alert as read:", err);
    res.status(500).json({ message: "Failed to update alert" });
  }
};

// 🔥 DELETE ALERT
exports.deleteAlert = async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    
    const io = getIO();
    io.emit("alert_deleted", { id: req.params.id });

    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("Error deleting alert:", err);
    res.status(500).json({ message: "Failed to delete alert" });
  }
};