const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

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

// --- SECURITY & PROXY ---
// Trust the reverse proxy (Nginx/Render/AWS) so rate limiting reads the real Client IP
app.set("trust proxy", 1); 

app.use(helmet()); // Sets various HTTP headers for security

// --- CORS Configuration ---
const allowedOrigins = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(",") : ["http://localhost:5173"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(compression()); // Compress response bodies (GZIP)

// --- RATE LIMITING ---
// Protects against basic DDoS and brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 200, 
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use("/api/", limiter); // Apply rate limiter to API routes only

// --- PARSERS & LOGGING ---
app.use(express.json({ limit: "10mb" })); // Increased limit for JSON parsing
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// --- HEALTH CHECK ---
app.get("/", (req, res) => {
  res.status(200).json({ status: "success", message: "PRISMORA AI Analytics API Running" });
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
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// --- GLOBAL ERROR HANDLER ---
app.use(errorMiddleware);

module.exports = app;