const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { getInsights } = require("../controllers/insightsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ UPDATED LIMITER (AI SAFE)
const insightsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // 🔥 increased (AI needs more calls)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI insight requests. Please try again later." }
});

// ✅ ORDER FIXED (LIMITER FIRST)
router.get(
  "/",
  insightsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  getInsights
);

module.exports = router;