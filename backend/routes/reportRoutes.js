const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { downloadExcel, downloadPDF } = require("../controllers/reportsController"); // Fixed import name
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const reportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many report generations requested. Please wait." }
});

router.get("/excel", authMiddleware, roleMiddleware("admin", "analyst", "viewer"), reportLimiter, downloadExcel);
router.get("/pdf", authMiddleware, roleMiddleware("admin", "analyst", "viewer"), reportLimiter, downloadPDF);

module.exports = router;