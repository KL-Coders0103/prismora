const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { getAlerts, createAlert, markAsRead, deleteAlert, getUnreadAlerts } = require("../controllers/alertController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const alertLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60, // ✅ increased for real-time alerts
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ CONSISTENT + SAFE ORDER
router.get(
  "/",
  alertLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  getAlerts
);

router.get(
  "/unread",
  alertLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  getUnreadAlerts
);
  
router.post(
  "/",
  alertLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  createAlert
);

router.patch(
  "/:id/read",
  alertLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  markAsRead
);

router.delete(
  "/:id",
  alertLimiter,
  authMiddleware,
  roleMiddleware("admin"),
  deleteAlert
);

module.exports = router;