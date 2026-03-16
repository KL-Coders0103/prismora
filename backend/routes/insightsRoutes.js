const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/insightsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");

const insightsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  insightsLimiter,
  getInsights
);

module.exports = router;