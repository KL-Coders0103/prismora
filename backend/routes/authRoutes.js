const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const { register, login, getUsers, deleteUser, updateUserRole } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ✅ LOGIN RATE LIMIT (CRITICAL SECURITY)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // limit login attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many login attempts. Try again later." }
});

// PUBLIC
router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);

// ADMIN
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);
router.put("/role/:id", authMiddleware, roleMiddleware("admin"), updateUserRole);

module.exports = router;