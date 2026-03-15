const express = require("express");

const router = express.Router();

const { getLogs } = require("../controllers/activityController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// GET ACTIVITY LOGS (ADMIN ONLY)
router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getLogs
);


module.exports = router;