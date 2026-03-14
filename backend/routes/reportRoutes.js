const express = require("express");

const router = express.Router();

const {
  downloadExcel,
  downloadPDF
} = require("../controllers/reportsController");

router.get("/sales", downloadExcel);

router.get("/pdf", downloadPDF);

module.exports = router;