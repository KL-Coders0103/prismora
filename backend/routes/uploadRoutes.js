const express = require("express");
const multer = require("multer");
const router = express.Router();

const { uploadCSV } = require("../controllers/uploadController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  }
});


// FILE FILTER (ONLY CSV)
const fileFilter = (req, file, cb) => {

  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }

};


// UPLOAD LIMIT
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});



// DATASET UPLOAD
router.post(
  "/csv",
  authMiddleware,
  roleMiddleware(["admin", "analyst"]),
  upload.single("file"),
  uploadCSV
);


module.exports = router;