const express = require("express");

const router = express.Router();

const {
  downloadExcel,
  downloadPDF
} = require("../controllers/reportsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const rateLimit = require("express-rate-limit");

const reportLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20
});

router.get(
  "/excel",
  authMiddleware,
  roleMiddleware("admin","analyst","viewer"),
  reportLimiter,
  downloadExcel
);

router.get(
  "/pdf",
  authMiddleware,
  roleMiddleware("admin","analyst","viewer"),
  reportLimiter,
  downloadPDF
);

module.exports = router;