const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const { uploadCSV } = require("../controllers/uploadController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g,"_");

    cb(null, uniqueName);

  }
});

const fileFilter = (req, file, cb) => {

  const allowedTypes = [
    "text/csv",
    "application/vnd.ms-excel"
  ];

  const ext = path.extname(file.originalname);

  if (allowedTypes.includes(file.mimetype) || ext === ".csv") {
    cb(null,true);
  } else {
    cb(new Error("Only CSV files allowed"),false);
  }

};

const upload = multer({

  storage,
  fileFilter,

  limits:{
    fileSize:10*1024*1024
  }

});

router.post(
  "/csv",
  authMiddleware,
  roleMiddleware("admin","analyst"),
  upload.single("file"),
  uploadCSV
);

module.exports = router;