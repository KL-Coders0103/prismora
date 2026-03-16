const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const insightsRoutes = require("./routes/insightsRoutes");
const chatRoutes = require("./routes/chatRoutes");
const reportRoutes = require("./routes/reportRoutes");
const alertRoutes = require("./routes/alertRoutes");
const activityRoutes = require("./routes/activityRoutes");
const profileRoutes = require("./routes/profileRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials:true
}));

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(limiter);

app.use(express.json({ limit:"10mb" }));
app.use(morgan("dev"));

app.get("/", (req,res)=>{
  res.send("PRISMORA AI Analytics API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/profile", profileRoutes);

app.use((req,res)=>{
  res.status(404).json({
    success:false,
    message:"Route not found"
  });
});

app.use(errorMiddleware);

module.exports = app;