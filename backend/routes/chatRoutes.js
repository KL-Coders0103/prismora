const express = require("express");

const router = express.Router();

const { chatQuery } = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// AI CHAT QUERY
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  chatQuery
);


module.exports = router;