const express = require("express");

const router = express.Router();

const {
  getAlerts,
  createAlert,
  markAsRead,
  deleteAlert
} = require("../controllers/alertController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");

const alertLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  getAlerts
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  alertLimiter,
  createAlert
);

router.patch(
  "/:id/read",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  markAsRead
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAlert
);

module.exports = router;