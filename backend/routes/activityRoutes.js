const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { getLogs } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const activityLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/", authMiddleware, roleMiddleware("admin"), activityLimiter, getLogs);

module.exports = router;