const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const axios = require("axios");

// Routes
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/alertRoutes");
const activityRoutes = require("./routes/activityRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Middleware
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

// --- SECURITY ---
app.set("trust proxy", 1);
app.use(helmet());

// --- CORS (FIXED) ---
app.use(
  cors({
    origin: true, // ✅ allow dynamic origins safely
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// --- COMPRESSION ---
app.use(compression());

// --- RATE LIMIT (UPDATED FOR AI LOAD) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 1000, // ✅ increased
  message: { message: "Too many requests, try again later." },
});
app.use("/api/", limiter);

// --- BODY PARSING ---
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --- LOGGING ---
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "PRISMORA API Running",
  });
});

// ✅ ML HEALTH CHECK (VERY IMPORTANT)
app.get("/health/ml", async (req, res) => {
  try {
    const ML_URL = process.env.ML_API_URL || "http://localhost:5001";
    const response = await axios.get(`${ML_URL}/health`);
    res.json(response.data);
  } catch (err) {
    console.error("ML Health Check Failed:", err.message);
    res.status(500).json({ status: "ML service unavailable" });
  }
});

// --- API ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/profile", profileRoutes);

// --- 404 HANDLER ---
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use(errorMiddleware);

module.exports = app;