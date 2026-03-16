const express = require("express");
const router = express.Router();

const {
  dashboardSummary,
  salesByCategory,
  salesByRegion,
  monthlyRevenue,
  topProducts,
  productPerformance,
  customerByRegion,
  customerRevenue
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/dashboard",
  authMiddleware,
  dashboardSummary
);

router.get(
  "/revenue/monthly",
  authMiddleware,
  roleMiddleware("admin","analyst", "viewer"),
  monthlyRevenue
);

router.get(
  "/sales/category",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  salesByCategory
);

router.get(
  "/sales/region",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  salesByRegion
);

router.get(
  "/products/top",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  topProducts
);

router.get(
  "/products/performance",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  productPerformance
);

router.get(
  "/customers/region",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  customerByRegion
);

router.get(
  "/customers/revenue",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  customerRevenue
);

module.exports = router;