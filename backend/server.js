require("dotenv").config();
const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./sockets/realtimeSocket");

const PORT = process.env.PORT || 5000;

// Initialize Server
const startServer = async () => {
  try {
    await connectDB();

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
      console.log(`🚀 PRISMORA API running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });

    // --- GRACEFUL SHUTDOWN HANDLERS ---
    const gracefulShutdown = () => {
      console.log("🛑 Received shutdown signal, closing server...");
      server.close(async () => {
        console.log("HTTP server closed.");
        if (mongoose.connection.readyState === 1) {
          await mongoose.connection.close(false);
          console.log("MongoDB connection safely closed.");
        }
        process.exit(0);
      });

      // Force close if it takes too long (10 seconds)
      setTimeout(() => {
        console.error("Forcing shutdown after 10s...");
        process.exit(1);
      }, 10000);
    };

    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

// Global Exception Catchers
process.on("unhandledRejection", (err) => {
  console.error("🔥 Unhandled Promise Rejection:", err);
  // Optional: Trigger graceful shutdown here in production
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  process.exit(1); // Uncaught exceptions leave Node in an undefined state. MUST exit.
});