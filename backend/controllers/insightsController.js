const { generateInsights } = require("../services/aiService");
const { logActivity } = require("../services/activityService");

let cachedInsights = null;
let lastGenerated = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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

    cachedInsights = insights;
    lastGenerated = now;

    await logActivity(
      req.user?.id || null,
      "ai_insights_generated"
    );

    res.json({
      insights
    });

  } catch (error) {

    console.error("AI insights error:", error);

    res.status(500).json({
      message: "Failed to generate AI insights"
    });

  }

};