const Alert = require("../models/Alert");

exports.getAlerts = async (req, res) => {

  try {

    const alerts = await Alert.find().sort({ createdAt: -1 });

    res.json(alerts);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


exports.createAlert = async (req, res) => {

  try {

    const { message, type } = req.body;

    const alert = await Alert.create({
      message,
      type
    });

    res.json(alert);

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};