const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {
  dashboardSummary,
  salesByCategory,
  salesByRegion,
  monthlyRevenue,
  topProducts,
  productPerformance,
  customerByRegion,
  customerRevenue,
  generateCEOSummary,
  handleChatQuery
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ NEW LIMITER (PROTECT DB)
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

// Dashboard
router.get("/dashboard",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  dashboardSummary
);

router.get("/revenue/monthly",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  monthlyRevenue
);

router.get("/sales/category",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  salesByCategory
);

router.get("/sales/region",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  salesByRegion
);

router.get("/products/top",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  topProducts
);

router.get("/products/performance",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  productPerformance
);

router.get("/customers/region",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  customerByRegion
);

router.get("/customers/revenue",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  customerRevenue
);

router.get("/ceo-summary",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin"),
  generateCEOSummary
);

router.post("/chat",
  analyticsLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  handleChatQuery
);

module.exports = router;