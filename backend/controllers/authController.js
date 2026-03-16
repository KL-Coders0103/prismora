const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { logActivity } = require("../services/activityService");


// REGISTER
exports.register = async (req, res) => {

  try {

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role
    });

    await logActivity(user._id, "user_register", {
      email: user.email
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// LOGIN
exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    if (!user.isActive) {
  return res.status(403).json({
    message: "Account disabled"
  });
}

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    await logActivity(user._id, "user_login");

    res.json({
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

    console.log("",error);

    res.status(500).json({
      error: error.message
    });

  }

};



// GET ALL USERS
exports.getUsers = async (req, res) => {

  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// DELETE USER
exports.deleteUser = async (req, res) => {

  try {

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await logActivity(req.params.id, "user_deleted", {
      deleteUser: req.params.id
    });

    res.json({
      message: "User deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};