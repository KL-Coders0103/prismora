const { Server } = require("socket.io");

let io = null;

// INIT SOCKET
const initSocket = (server) => {
  const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",")
    : ["http://localhost:5173"];

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    try {
      console.log(`🔌 Socket connected: ${socket.id}`);

      // =========================
      // JOIN DASHBOARD ROOM
      // =========================
      socket.on("join_dashboard", (user) => {
        try {
          if (!user || !user.role) {
            console.warn("⚠️ Invalid socket join attempt");
            return;
          }

          // General dashboard room
          socket.join("dashboard");

          // Role-based rooms (VERY IMPORTANT)
          socket.join(`role_${user.role}`);

          console.log(`👤 ${socket.id} joined dashboard (${user.role})`);
        } catch (err) {
          console.error("Socket join error:", err.message);
        }
      });

      // =========================
      // DISCONNECT
      // =========================
      socket.on("disconnect", (reason) => {
        console.log(`🚫 Socket disconnected: ${socket.id} (${reason})`);
      });

      // =========================
      // ERROR HANDLER
      // =========================
      socket.on("error", (err) => {
        console.error(`❌ Socket error (${socket.id}):`, err.message);
      });

    } catch (err) {
      console.error("Socket connection error:", err.message);
    }
  });
};

// SAFE IO GETTER
const getIO = () => {
  if (!io) {
    console.warn("⚠️ Socket.io not initialized yet");
    return null;
  }
  return io;
};

// =========================
// ALERT BROADCAST
// =========================
const sendAlert = (alert) => {
  const socket = getIO();
  if (!socket) return;

  socket.to("dashboard").emit("alert", alert);
};

// =========================
// ROLE BASED ALERT
// =========================
const sendRoleAlert = (role, alert) => {
  const socket = getIO();
  if (!socket) return;

  socket.to(`role_${role}`).emit("alert", alert);
};

// =========================
// GENERAL NOTIFICATION
// =========================
const sendNotification = (data) => {
  const socket = getIO();
  if (!socket) return;

  socket.to("dashboard").emit("notification", data);
};

module.exports = {
  initSocket,
  getIO,
  sendAlert,
  sendNotification,
  sendRoleAlert
};