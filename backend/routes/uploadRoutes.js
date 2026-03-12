const express = require("express");
const multer = require("multer");
const router = express.Router();

const { uploadCSV } = require("../controllers/uploadController");

const upload = multer({ dest: "uploads/" });

router.post("/csv", upload.single("file"), uploadCSV);

module.exports = router;