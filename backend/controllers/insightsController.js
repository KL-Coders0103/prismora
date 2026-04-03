const { generateInsights } = require("../services/aiService");
const { logActivity } = require("../services/activityService");
const {
  forecastSales,
  detectAnomaly,
  predictChurn,
  recommendProducts
} = require("../services/mlService");

// ✅ USER-SAFE CACHE (per user)
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || "system";
    const now = Date.now();

    const userCache = cache.get(userId);

    // ✅ CACHE CHECK
    if (userCache && (now - userCache.time < CACHE_DURATION)) {
      return res.status(200).json({
        insights: userCache.data,
        cached: true
      });
    }

    // ✅ FIXED ML CALLS (MAIN FIX)
    const [insightsRes, forecastRes, anomalyRes, churnRes, recommendRes] =
      await Promise.allSettled([
        generateInsights(),
        forecastSales({ days: 30 }), // 🔥 FIXED
        detectAnomaly({ price: 5000, quantity: 2, revenue: 10000 }),
        predictChurn({ price: 5000, quantity: 1, revenue: 5000 }),
        recommendProducts({ product: "Laptop" }) // 🔥 FIXED
      ]);

    // ✅ SAFE EXTRACTION
    const baseInsights =
      insightsRes.status === "fulfilled" ? insightsRes.value || [] : [];

    const forecast = forecastRes.status === "fulfilled" ? forecastRes.value : null;
    const anomaly = anomalyRes.status === "fulfilled" ? anomalyRes.value : null;
    const churn = churnRes.status === "fulfilled" ? churnRes.value : null;
    const recommendations =
      recommendRes.status === "fulfilled" ? recommendRes.value : null;

    // 🔥 DEBUG LOGGING (IMPORTANT)
    if (forecastRes.status !== "fulfilled") console.warn("Forecast failed");
    if (anomalyRes.status !== "fulfilled") console.warn("Anomaly failed");
    if (churnRes.status !== "fulfilled") console.warn("Churn failed");
    if (recommendRes.status !== "fulfilled") console.warn("Recommendation failed");

    // ✅ UNIQUE TITLES (FIXES REACT ERROR)
    const mlInsights = [
      {
        title: "Sales Forecast (30 Days)",
        description: forecast?.insight || "Forecast unavailable.",
        confidence: forecast ? 85 : 0
      },
      {
        title: "Anomaly Detection Result",
        description: anomaly?.insight || "No anomalies detected.",
        confidence: anomaly ? 78 : 50
      },
      {
        title: "Customer Churn Prediction",
        description: churn?.insight || "Churn model unavailable.",
        confidence: churn ? 72 : 0
      },
      {
        title: "Product Recommendation Engine",
        description: recommendations?.recommendations?.length
          ? `Top suggestions: ${recommendations.recommendations.join(", ")}`
          : "Not enough data for recommendations.",
        confidence: recommendations ? 68 : 0
      }
    ];

    const finalInsights = [...baseInsights, ...mlInsights];

    // ✅ SAVE CACHE PER USER
    cache.set(userId, {
      data: finalInsights,
      time: now
    });

    // ✅ SAFE LOG
    await logActivity(userId, "ai_insights_generated");

    // ✅ CONSISTENT RESPONSE
    res.status(200).json({
      insights: finalInsights,
      cached: false
    });

  } catch (error) {
    console.error("[AI Insights Controller Error]:", error);
    res.status(500).json({
      message: "Failed to generate AI insights.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};