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
    const { name, email, password } = req.body;

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
      role: "viewer" // 🔒 FORCE VIEWER ALWAYS
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("[Register Error]:", error);
    res.status(500).json({ message: "Failed to register user." });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account disabled." });
    }

    const token = generateToken(user);

    user.lastLogin = new Date();
    await user.save();

    logActivity(user._id, "user_login").catch(console.error);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login failed." });
  }
};

// USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").lean();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: "Cannot delete yourself." });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await logActivity(req.user.id, "user_deleted", {
      deletedUserId: req.params.id
    });

    res.status(200).json({ message: "User deleted." });

  } catch {
    res.status(500).json({ message: "Delete failed." });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = ["admin", "analyst", "viewer"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role." });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = role;
    await user.save();

    await logActivity(req.user.id, "update_user_role", {
      targetUser: user._id,
      newRole: role
    });

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("[Update Role Error]:", error);
    res.status(500).json({ message: "Failed to update role." });
  }
};