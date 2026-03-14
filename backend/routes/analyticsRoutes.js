const express = require("express");
const router = express.Router();

const {
  getTotalRevenue,
  salesByCategory,
  salesByRegion,
  monthlyRevenue,
  topProducts,
  productPerformance
} = require("../controllers/analyticsController");


router.get("/revenue", getTotalRevenue);

router.get("/category", salesByCategory);

router.get("/region", salesByRegion);

router.get("/monthly-revenue", monthlyRevenue);

router.get("/top-products", topProducts);

router.get("/product-performance", productPerformance);

module.exports = router;