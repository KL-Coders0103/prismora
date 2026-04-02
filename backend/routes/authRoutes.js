const express = require("express");
const router = express.Router();

const { register, login, getUsers, deleteUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// PUBLIC ROUTES
router.post("/register", register);
router.post("/login", login);

// PROTECTED ROUTES (ADMIN ONLY)
router.get("/", authMiddleware, roleMiddleware("admin"), getUsers);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

module.exports = router;