const express = require("express");

const router = express.Router();

const { getLogs } = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");

const activityLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50
});

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  activityLimiter,
  getLogs
);

module.exports = router;