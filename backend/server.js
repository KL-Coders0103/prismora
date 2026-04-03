require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets/realtimeSocket");

const PORT = process.env.PORT || 5000;

let server;

// Initialize Server
const startServer = async () => {
  try {
    await connectDB();

    server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
      console.log(
        `🚀 PRISMORA API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`
      );
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// --- GRACEFUL SHUTDOWN ---
let isShuttingDown = false;

const gracefulShutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log("🛑 Shutting down server...");

  try {
    if (server) {
      server.close(() => {
        console.log("HTTP server closed.");
      });
    }

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close(false);
      console.log("MongoDB connection closed.");
    }

    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }

  // Force exit after timeout
  setTimeout(() => {
    console.error("Force shutdown after timeout");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

// --- GLOBAL ERROR HANDLING ---
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1);
});