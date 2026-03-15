const { Server } = require("socket.io");

let io;

const initSocket = (server) => {

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Join dashboard room
    socket.on("join_dashboard", () => {

      socket.join("dashboard");

      console.log("User joined dashboard room");

    });

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

};


// SEND ALERT TO ALL DASHBOARD USERS
const sendAlert = (alert) => {

  if (io) {

    io.to("dashboard").emit("alert", alert);

  }

};


// SEND GENERAL NOTIFICATION
const sendNotification = (data) => {

  if (io) {

    io.to("dashboard").emit("notification", data);

  }

};


const getIO = () => io;

module.exports = {
  initSocket,
  getIO,
  sendAlert,
  sendNotification
};