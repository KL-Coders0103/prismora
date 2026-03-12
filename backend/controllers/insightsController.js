const { generateInsights } = require("../services/aiService");

exports.getInsights = async (req, res) => {

  try {

    const insights = await generateInsights();

    res.json({
      insights
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};