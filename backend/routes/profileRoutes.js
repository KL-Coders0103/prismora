const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");



// GET USER PROFILE
router.get(
  "/",
  authMiddleware,
  getProfile
);



// UPDATE PROFILE
router.put(
  "/",
  authMiddleware,
  updateProfile
);


module.exports = router;