const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { logActivity } = require("../services/activityService");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "A user with that email already exists." });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || "viewer"
    });

    const token = generateToken(user);

    // Don't await logActivity in the critical response path for registration
    logActivity(user._id, "user_register", { email: user.email }).catch(console.error);

    res.status(201).json({
      message: "User registered successfully",
      token, // UX Upgrade: Auto-login after registration
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("[Auth Register Error]:", error);
    res.status(500).json({ message: "Failed to register user." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." }); // Prevent enumeration
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "This account has been disabled. Contact an administrator." });
    }

    const token = generateToken(user);

    user.lastLogin = new Date();
    await user.save();

    logActivity(user._id, "user_login").catch(console.error);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("[Auth Login Error]:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

// GET ALL USERS (Admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// DELETE USER (Admin)
exports.deleteUser = async (req, res) => {
  try {
    // Prevent an admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "You cannot delete your own active session account." });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fixed Bug: Actor is req.user.id, NOT req.params.id
    await logActivity(req.user.id, "user_deleted", { deletedUserId: req.params.id });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("[Delete User Error]:", error);
    res.status(500).json({ message: "Failed to delete user." });
  }
};