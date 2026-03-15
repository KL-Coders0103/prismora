const { processQuery } = require("../services/chatService");
const { logActivity } = require("../services/activityService");


exports.chatQuery = async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || message.trim() === "") {

      return res.status(400).json({
        message: "Query message is required"
      });

    }

    if (message.length > 500) {

      return res.status(400).json({
        message: "Query too long (max 500 characters)"
      });

    }

    const reply = await processQuery(message);

    await logActivity(
      req.user?.id || null,
      "ai_chat_query",
      { query: message }
    );

    res.json({
      reply
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};