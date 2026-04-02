const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const { uploadCSV } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure upload directory exists securely
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["text/csv", "application/vnd.ms-excel"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.includes(file.mimetype) || ext === ".csv") {
    cb(null, true);
  } else {
    cb(new Error("INVALID_TYPE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit synced with frontend
}).single("file");

// Wrapper to catch Multer errors and return clean JSON
const multerErrorHandler = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File is too large. Maximum size is 5MB." });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      if (err.message === "INVALID_TYPE") {
        return res.status(400).json({ message: "Invalid file format. Only CSV files are allowed." });
      }
      return res.status(500).json({ message: err.message });
    }
    next();
  });
};

router.post(
  "/csv",
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  multerErrorHandler,
  uploadCSV
);

module.exports = router;