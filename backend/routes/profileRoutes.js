const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const rateLimit = require("express-rate-limit");

const profileLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});

router.get(
  "/",
  authMiddleware,
  getProfile
);

router.put(
  "/",
  authMiddleware,
  profileLimiter,
  updateProfile
);

module.exports = router;