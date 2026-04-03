const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { getInsights } = require("../controllers/activityController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const activityLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100, // ✅ slightly increased
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ CONSISTENT ORDER
router.get(
  "/",
  activityLimiter,
  authMiddleware,
  roleMiddleware("admin"),
  getInsights
);

module.exports = router;