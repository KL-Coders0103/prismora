const express = require("express");

const router = express.Router();

const {
  downloadExcel,
  downloadPDF
} = require("../controllers/reportsController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// DOWNLOAD EXCEL REPORT
router.get(
  "/excel",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  downloadExcel
);


// DOWNLOAD PDF REPORT
router.get(
  "/pdf",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  downloadPDF
);


module.exports = router;