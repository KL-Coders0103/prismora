const { processQuery } = require("../services/chatService");
const { logActivity } = require("../services/activityService");

exports.chatQuery = async (req, res) => {

  try {

    let { message } = req.body;

    if (!message || message.trim() === "") {

      return res.status(400).json({
        message: "Query message is required"
      });

    }

    message = message.trim();

    if (message.length > 500) {

      return res.status(400).json({
        message: "Query too long (max 500 characters)"
      });

    }

    const reply = await processQuery(message);

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