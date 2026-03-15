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



// GET ALERTS
router.get(
  "/",
  authMiddleware,
  getAlerts
);


// CREATE ALERT
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  createAlert
);


// MARK ALERT AS READ
router.patch(
  "/:id/read",
  authMiddleware,
  markAsRead
);


// DELETE ALERT
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteAlert
);


module.exports = router;