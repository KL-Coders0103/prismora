const User = require("../models/User");
const { logActivity } = require("../services/activityService");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean(); // Faster for read-only data

    if (!user) {
      return res.status(404).json({ message: "User profile not found." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("[Get Profile Error]:", error);
    res.status(500).json({ message: "Failed to fetch profile data." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let { name, email } = req.body;
    const updateData = {};

    if (!name && !email) {
      return res.status(400).json({ message: "No data provided to update." });
    }

    if (name) {
      name = name.trim();
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({ message: "Name must be between 2 and 50 characters." });
      }
      updateData.name = name;
    }

    if (email) {
      email = email.trim().toLowerCase();
      // Ensure the email isn't taken by someone else
      const existing = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(400).json({ message: "This email address is already in use by another account." });
      }
      updateData.email = email;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    await logActivity(req.user.id, "update_profile", { fieldsUpdated: Object.keys(updateData) });

    res.status(200).json(user);
  } catch (error) {
    console.error("[Update Profile Error]:", error);
    res.status(500).json({ message: "An error occurred while updating the profile." });
  }
};