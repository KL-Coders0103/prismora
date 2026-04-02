const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/profileController");

const profileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many profile update requests. Please wait." }
});

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, profileLimiter, updateProfile);

module.exports = router;