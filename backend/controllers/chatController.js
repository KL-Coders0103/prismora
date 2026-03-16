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

      return res.status(400).json({
        message: "Query message is required"
      });

    }

    message = message.trim().toLowerCase();

    if (message.length > 500) {

      return res.status(400).json({
        message: "Query too long (max 500 characters)"
      });

    }

    let reply = "";

    // =========================
    // SALES FORECAST
    // =========================

    if (message.includes("forecast") || message.includes("predict sales")) {

      const result = await forecastSales(30);

      reply = `Predicted sales: ₹${result?.prediction?.toFixed(2)}. ${result?.insight}`;

    }

    // =========================
    // ANOMALY DETECTION
    // =========================

    else if (message.includes("anomaly")) {

      const result = await detectAnomaly({
        price: 5000,
        quantity: 2,
        revenue: 10000
      });

      reply = result?.insight;

    }

    // =========================
    // CHURN PREDICTION
    // =========================

    else if (message.includes("churn")) {

      const result = await predictChurn({
        price: 5000,
        quantity: 1,
        revenue: 5000
      });

      reply = result?.insight;

    }

    // =========================
    // PRODUCT RECOMMENDATION
    // =========================

    else if (message.includes("recommend")) {

      const result = await recommendProducts("Laptop");

      reply = `Recommended products: ${result?.recommendations?.join(", ")}`;

    }

    // =========================
    // DEFAULT AI QUERY
    // =========================

    else {

      reply = await processQuery(message);

    }


    await logActivity(
      req.user?.id || null,
      "ai_chat_query",
      { query: message.substring(0, 100) }
    );

    res.json({
      reply
    });

  } catch (error) {

    console.error("AI chat error:", error);

    res.status(500).json({
      message: "Failed to process AI query"
    });

  }

};