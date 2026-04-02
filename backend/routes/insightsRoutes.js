const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { getInsights } = require("../controllers/insightsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const insightsLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI insight requests. Please try again later." }
});

router.get("/", authMiddleware, roleMiddleware("admin", "analyst"), insightsLimiter, getInsights);

module.exports = router;