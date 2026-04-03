const { processQuery } = require("../services/chatService");
const { logActivity } = require("../services/activityService");
const {
  forecastSales,
  detectAnomaly,
  predictChurn,
  recommendProducts
} = require("../services/mlService");

const Sales = require("../models/Sales");

// 🔥 SMART INTENT (IMPROVED)
const detectIntent = (msg) => {
  const q = msg.toLowerCase();

  if (/forecast|future|predict|next/i.test(q)) return "forecast";
  if (/anomaly|issue|problem|weird/i.test(q)) return "anomaly";
  if (/churn|leave|customer loss/i.test(q)) return "churn";
  if (/recommend|suggest|improve/i.test(q)) return "recommend";

  // 🔥 SYSTEM QUESTIONS
  if (/what is|about|system|prismora|how does it work/i.test(q))
    return "system";

  return "general";
};

exports.chatQuery = async (req, res) => {
  try {
    let { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message required." });
    }

    const intent = detectIntent(message);

    const latestSale = await Sales.findOne().sort({ date: -1 });

    const inputData = latestSale
      ? {
          price: latestSale.price,
          quantity: latestSale.quantity,
          revenue: latestSale.revenue
        }
      : null;

    let reply = "";

    switch (intent) {
      case "forecast": {
        const result = await forecastSales(30);

        reply = result?.prediction
          ? `📈 Sales Forecast:\n\nExpected revenue for next 30 days is ₹${result.prediction.toFixed(2)}.\n\n${result.insight || ""}`
          : "⚠️ Forecast model unavailable.";
        break;
      }

      case "anomaly": {
        const result = inputData ? await detectAnomaly(inputData) : null;

        reply =
          result?.insight ||
          "✅ No anomalies detected in recent sales.";
        break;
      }

      case "churn": {
        const result = inputData ? await predictChurn(inputData) : null;

        reply =
          result?.insight ||
          "ℹ️ Churn prediction not available.";
        break;
      }

      case "recommend": {
        const product = latestSale?.product || "Laptop";
        const result = await recommendProducts(product);

        reply = result?.recommendations?.length
          ? `💡 Recommendations:\n\n• ${result.recommendations.join("\n• ")}`
          : "⚠️ Unable to generate recommendations.";
        break;
      }

      // 🔥 NEW SYSTEM RESPONSE
      case "system": {
        reply = `🤖 PRISMORA is an AI-powered Business Intelligence platform.

It helps you:
• Analyze sales & customer data
• Detect anomalies automatically
• Predict future sales using ML
• Get AI-driven insights & recommendations

Think of it as your smart business assistant 🚀`;
        break;
      }

      default:
        reply = await processQuery(message);
    }

    const userId = req.user?.id || req.user?._id || "system";
    logActivity(userId, "ai_chat_query").catch(() => {});

    res.status(200).json({ reply });

  } catch (error) {
    console.error("[AI Chat Error]:", error);
    res.status(500).json({ message: "AI chat failed." });
  }
};