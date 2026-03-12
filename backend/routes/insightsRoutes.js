const express = require("express");
const router = express.Router();

const { getInsights } = require("../controllers/insightsController");

router.get("/", getInsights);

module.exports = router;