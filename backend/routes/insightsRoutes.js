const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/insightsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// GET AI INSIGHTS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  getInsights
);


module.exports = router;