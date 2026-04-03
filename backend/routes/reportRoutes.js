const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { downloadExcel, downloadPDF } = require("../controllers/reportsController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const reportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 40, // slightly increased
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many report generations requested. Please wait." }
});

// ✅ FIXED ORDER
router.get(
  "/excel",
  reportLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  downloadExcel
);

router.get(
  "/pdf",
  reportLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst", "viewer"),
  downloadPDF
);

module.exports = router;