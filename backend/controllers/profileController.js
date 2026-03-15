const User = require("../models/User");
const { logActivity } = require("../services/activityService");


// GET USER PROFILE
exports.getProfile = async (req, res) => {

  try {

    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};



// UPDATE PROFILE
exports.updateProfile = async (req, res) => {

  try {

    const { name, email } = req.body;

    if (!name && !email) {

      return res.status(400).json({
        message: "Nothing to update"
      });

    }

    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    await logActivity(
      req.user.id,
      "update_profile",
      updateData
    );

    res.json(user);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};