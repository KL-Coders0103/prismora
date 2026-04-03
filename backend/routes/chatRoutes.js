const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { chatQuery } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ FIXED LIMIT (AI SAFE)
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40, // 🔥 increased
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI chat requests. Please try again later." }
});

// ✅ FIXED ORDER
router.post(
  "/",
  chatLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  chatQuery
);

module.exports = router;