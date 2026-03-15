const express = require("express");
const router = express.Router();

const {
  dashboardSummary,
  getTotalRevenue,
  salesByCategory,
  salesByRegion,
  monthlyRevenue,
  topProducts,
  productPerformance,
  customerByRegion,
  customerRevenue
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");



// DASHBOARD SUMMARY
router.get(
  "/dashboard",
  authMiddleware,
  dashboardSummary
);


// REVENUE
router.get(
  "/revenue",
  authMiddleware,
  getTotalRevenue
);

router.get(
  "/revenue/monthly",
  authMiddleware,
  monthlyRevenue
);


// SALES ANALYTICS
router.get(
  "/sales/category",
  authMiddleware,
  salesByCategory
);

router.get(
  "/sales/region",
  authMiddleware,
  salesByRegion
);


// PRODUCT ANALYTICS
router.get(
  "/products/top",
  authMiddleware,
  topProducts
);

router.get(
  "/products/performance",
  authMiddleware,
  productPerformance
);


// CUSTOMER ANALYTICS
router.get(
  "/customers/region",
  authMiddleware,
  customerByRegion
);

router.get(
  "/customers/revenue",
  authMiddleware,
  customerRevenue
);


module.exports = router;