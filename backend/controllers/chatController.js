const { processQuery } = require("../services/chatService");
const { logActivity } = require("../services/activityService");
const {
  forecastSales,
  detectAnomaly,
  predictChurn,
  recommendProducts
} = require("../services/mlService");

exports.chatQuery = async (req, res) => {
  try {
    let { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Query message is required." });
    }

    message = message.trim().toLowerCase();

    if (message.length > 500) {
      return res.status(400).json({ message: "Query too long (max 500 characters)." });
    }

    let reply = "";

    // =========================
    // ML: SALES FORECAST
    // =========================
    if (message.includes("forecast") || message.includes("predict sales")) {
      const result = await forecastSales(30);
      if (result && result.prediction) {
        reply = `Predicted sales for the next 30 days: ₹${result.prediction.toFixed(2)}. ${result.insight || ""}`;
      } else {
        reply = "I'm currently unable to connect to the forecasting model. Please try again later.";
      }
    }
    // =========================
    // ML: ANOMALY DETECTION
    // =========================
    else if (message.includes("anomaly") || message.includes("anomalies")) {
      const result = await detectAnomaly({ price: 5000, quantity: 2, revenue: 10000 }); // Placeholder params
      reply = result?.insight || "The anomaly detection model is currently offline. No anomalies can be verified at this moment.";
    }
    // =========================
    // ML: CHURN PREDICTION
    // =========================
    else if (message.includes("churn") || message.includes("leaving")) {
      const result = await predictChurn({ price: 5000, quantity: 1, revenue: 5000 }); // Placeholder params
      reply = result?.insight || "The customer churn prediction engine is currently processing. Please check back later.";
    }
    // =========================
    // ML: PRODUCT RECOMMENDATION
    // =========================
    else if (message.includes("recommend") || message.includes("suggestion")) {
      const result = await recommendProducts("Laptop"); // Placeholder param
      if (result && result.recommendations) {
        reply = `Based on current data, I recommend focusing on: ${result.recommendations.join(", ")}.`;
      } else {
        reply = "I couldn't generate recommendations at this time due to a model timeout.";
      }
    }
    // =========================
    // DEFAULT NLP QUERY (DB Data)
    // =========================
    else {
      reply = await processQuery(message);
    }

    // Log the action securely
    const userId = req.user?.id || req.user?._id || "system";
    await logActivity(userId, "ai_chat_query", { query: message.substring(0, 100) });

    res.status(200).json({ reply });

  } catch (error) {
    console.error("[AI Chat Error]:", error);
    res.status(500).json({ message: "Failed to process AI query due to an internal server error." });
  }
};