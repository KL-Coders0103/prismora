const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile, updatePassword } = require("../controllers/profileController");

// ✅ UPDATED LIMIT
const profileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many profile requests. Please wait." }
});

// ✅ ORDER FIXED
router.get("/", profileLimiter, authMiddleware, getProfile);
router.put("/", profileLimiter, authMiddleware, updateProfile);
router.put("/password", profileLimiter, authMiddleware, updatePassword);

module.exports = router;