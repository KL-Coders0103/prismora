const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getUsers,
  deleteUser
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");



// AUTH
router.post("/register", register);
router.post("/login", login);



// USER MANAGEMENT (ADMIN ONLY)
router.get(
  "/users",
  authMiddleware,
  roleMiddleware("admin"),
  getUsers
);

router.delete(
  "/users/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteUser
);


module.exports = router;