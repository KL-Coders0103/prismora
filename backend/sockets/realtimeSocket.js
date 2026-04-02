const { Server } = require("socket.io");

let io;

const initSocket = (server) => {
  // Secure CORS origin matching the Express setup
  const allowedOrigins = process.env.CLIENT_URL 
    ? process.env.CLIENT_URL.split(",") 
    : ["http://localhost:5173"];

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join dashboard room for real-time analytics updates
    socket.on("join_dashboard", () => {
      socket.join("dashboard");
      console.log(`👤 User joined dashboard room: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`🚫 Socket disconnected: ${socket.id}`);
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