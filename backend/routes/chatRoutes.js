const express = require("express");

const router = express.Router();

const { chatQuery } = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  chatLimiter,
  chatQuery
);

module.exports = router;