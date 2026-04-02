const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { chatQuery } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many AI chat requests. Please try again later." }
});

router.post("/", authMiddleware, roleMiddleware("admin", "analyst"), chatLimiter, chatQuery);

module.exports = router;