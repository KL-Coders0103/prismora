const express = require("express");

const router = express.Router();

const { chatQuery } = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");


// AI chat rate limiter
const chatLimiter = rateLimit({

  windowMs: 60 * 1000,

  max: 15,

  message: {
    message: "Too many AI chat requests. Please try again later."
  }

});


router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  chatLimiter,
  chatQuery
);


module.exports = router;