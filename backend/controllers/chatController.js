const { processQuery } = require("../services/chatService");

exports.chatQuery = async (req, res) => {

  try {

    const { message } = req.body;

    const reply = await processQuery(message);

    res.json({
      reply
    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};