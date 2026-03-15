const Alert = require("../models/Alert");
const { getIO } = require("../sockets/realtimeSocket");
const { logActivity } = require("../services/activityService");


// GET ALL ALERTS
exports.getAlerts = async (req, res) => {

  try {

    const alerts = await Alert.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(alerts);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// CREATE ALERT
exports.createAlert = async (req, res) => {

  try {

    const { message, type, severity, source } = req.body;

    const alert = await Alert.create({
      message,
      type,
      severity,
      source
    });

    const io = getIO();

    if (io) {
      io.emit("alert", alert);
    }

    await logActivity(
      req.user?.id || null,
      "create_alert",
      { message }
    );

    res.status(201).json(alert);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// MARK ALERT AS READ
exports.markAsRead = async (req, res) => {

  try {

    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    res.json(alert);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// DELETE ALERT
exports.deleteAlert = async (req, res) => {

  try {

    const alert = await Alert.findByIdAndDelete(req.params.id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found"
      });
    }

    res.json({
      message: "Alert deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};