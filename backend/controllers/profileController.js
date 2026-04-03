const User = require("../models/User");
const { logActivity } = require("../services/activityService");
const bcrypt = require("bcryptjs"); // 🔥 Added for password verification

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    res.status(200).json(user);

  } catch (error) {
    console.error("[Get Profile Error]:", error);
    res.status(500).json({ message: "Failed to fetch profile." });
  }
};

// UPDATE PROFILE
exports.updateProfile = async (req, res) => {
  try {
    let { name, email } = req.body;
    const updateData = {};

    if (!name && !email) {
      return res.status(400).json({ message: "No data provided." });
    }

    if (name) {
      name = name.trim();
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: "Invalid name length." });
      }
      updateData.name = name;
    }

    if (email) {
      email = email.trim().toLowerCase();

      // ✅ EMAIL VALIDATION
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: "Invalid email format." });
      }

      const exists = await User.findOne({
        email,
        _id: { $ne: req.user.id }
      });

      if (exists) {
        return res.status(400).json({ message: "Email already in use." });
      }

      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await logActivity(req.user.id, "update_profile", {
      updatedFields: Object.keys(updateData)
    });

    res.status(200).json(user);

  } catch (error) {
    console.error("[Update Profile Error]:", error);
    res.status(500).json({ message: "Profile update failed." });
  }
};

// 🔥 UPDATE PASSWORD (NEW)
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // 1. Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide all fields." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    // 2. Fetch User (Include password field which is usually hidden)
    // Note: We DO NOT use .lean() here because we need the Mongoose .save() method later
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 3. Verify Current Password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect current password." });
    }

    // 4. Update Password 
    // (Assuming your User model has a `userSchema.pre('save', ...)` hook that hashes the password automatically)
    user.password = newPassword; 
    await user.save();

    // 5. Log this critical security action
    await logActivity(req.user.id, "update_password", {
      status: "success",
      method: "manual"
    });

    res.status(200).json({ message: "Password updated successfully!" });

  } catch (error) {
    console.error("[Update Password Error]:", error);
    res.status(500).json({ message: "Failed to update password." });
  }
};