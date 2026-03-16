const { generateInsights } = require("../services/aiService");
const { logActivity } = require("../services/activityService");

const {
  forecastSales,
  detectAnomaly,
  predictChurn,
  recommendProducts
} = require("../services/mlService");


let cachedInsights = null;
let lastGenerated = null;

const CACHE_DURATION = 5 * 60 * 1000;


exports.getInsights = async (req, res) => {

  try {

    const now = Date.now();

    if (
      cachedInsights &&
      lastGenerated &&
      now - lastGenerated < CACHE_DURATION
    ) {

      return res.json({
        insights: cachedInsights,
        cached: true
      });

    }

    const insights = await generateInsights();

    const forecast = await forecastSales(30);

    const anomaly = await detectAnomaly({
      price: 5000,
      quantity: 2,
      revenue: 10000
    });

    const churn = await predictChurn({
      price: 5000,
      quantity: 1,
      revenue: 5000
    });

    const recommendations = await recommendProducts("Laptop");


    const mlInsights = [
      {
        title: "Sales Forecast",
        description: forecast?.insight,
        confidence: 80
      },
      {
        title: "Anomaly Detection",
        description: anomaly?.insight,
        confidence: 75
      },
      {
        title: "Customer Churn Risk",
        description: churn?.insight,
        confidence: 70
      },
      {
        title: "Product Recommendation",
        description: `Recommended products: ${recommendations?.recommendations?.join(", ")}`,
        confidence: 65
      }
    ];


    const finalInsights = [
      ...insights,
      ...mlInsights
    ];


    cachedInsights = finalInsights;
    lastGenerated = now;


    await logActivity(
      req.user?.id || null,
      "ai_insights_generated"
    );


    res.json({
      insights: finalInsights
    });

  } catch (error) {

    console.error("AI insights error:", error);

    res.status(500).json({
      message: "Failed to generate AI insights"
    });

  }

};