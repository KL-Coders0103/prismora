const express = require("express");
const router = express.Router();

const {
  getTotalRevenue,
  salesByCategory,
  salesByRegion
} = require("../controllers/analyticsController");


router.get("/revenue", getTotalRevenue);

router.get("/category", salesByCategory);

router.get("/region", salesByRegion);

module.exports = router;