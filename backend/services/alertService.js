const Alert = require("../models/Alert");
const { sendAlert } = require("../sockets/realtimeSocket");

exports.createAlert = async (message, type = "info") => {

  const alert = await Alert.create({
    message,
    type
  });

  sendAlert(message);

  return alert;

};