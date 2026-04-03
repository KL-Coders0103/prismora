const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const { uploadCSV } = require("../controllers/uploadController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const uploadDir = path.join(__dirname, "../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ UPLOAD RATE LIMIT (IMPORTANT)
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many uploads. Please wait." }
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // ✅ SAFER FILE NAME
    const cleanName = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .slice(0, 50);

    const uniqueName = `${Date.now()}-${cleanName}`;
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
  limits: { fileSize: 5 * 1024 * 1024 }
}).single("file");

// Multer error handler
const multerErrorHandler = (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large (max 5MB)." });
      }
      return res.status(400).json({ message: err.message });
    } else if (err) {
      if (err.message === "INVALID_TYPE") {
        return res.status(400).json({ message: "Only CSV files allowed." });
      }
      return res.status(500).json({ message: err.message });
    }
    next();
  });
};

// ✅ FIXED ORDER
router.post(
  "/csv",
  uploadLimiter,
  authMiddleware,
  roleMiddleware("admin", "analyst"),
  multerErrorHandler,
  uploadCSV
);

module.exports = router;