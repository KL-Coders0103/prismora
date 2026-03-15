const Alert = require("../models/Alert");
const Sales = require("../models/Sales");
const { sendAlert } = require("../sockets/realtimeSocket");



// CREATE ALERT
exports.createAlert = async (
  message,
  type = "info",
  severity = "medium",
  source = "system",
  metadata = {}
) => {

  try {

    const alert = await Alert.create({
      message,
      type,
      severity,
      source,
      metadata
    });

    sendAlert(alert);

    return alert;

  } catch (error) {

    console.error("Alert creation error:", error.message);

  }

};



// AI ANOMALY DETECTION
exports.detectRevenueAnomaly = async () => {

  try {

    const revenue = await Sales.aggregate([
      {
        $group: {
          _id: "$region",
          revenue: { $sum: "$revenue" }
        }
      }
    ]);

    revenue.forEach(async (region) => {

      if (region.revenue > 150000) {

        await exports.createAlert(
          `Revenue spike detected in ${region._id} region`,
          "warning",
          "high",
          "analytics",
          { region: region._id }
        );

      }

    });

  } catch (error) {

    console.error("Anomaly detection error:", error.message);

  }

};