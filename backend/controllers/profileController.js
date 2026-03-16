const User = require("../models/User");
const { logActivity } = require("../services/activityService");

exports.getProfile = async (req,res)=>{

  try{

    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    if(!user){
      return res.status(404).json({
        message:"User not found"
      });
    }

    res.json(user);

  }catch(error){

    console.error("Profile fetch error:",error);

    res.status(500).json({
      message:"Failed to fetch profile"
    });

  }

};

exports.updateProfile = async (req,res)=>{

  try{

    let { name,email } = req.body;

    if(!name && !email){

      return res.status(400).json({
        message:"Nothing to update"
      });

    }

    const updateData = {};

    if(name){

      name = name.trim();

      if(name.length < 2 || name.length > 50){
        return res.status(400).json({
          message:"Invalid name"
        });
      }

      updateData.name = name;

    }

    if(email){

      email = email.trim().toLowerCase();

      const existing = await User.findOne({ email });

      if(existing && existing._id.toString() !== req.user.id){

        return res.status(400).json({
          message:"Email already in use"
        });

      }

      updateData.email = email;

    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      {
        new:true,
        runValidators:true
      }
    ).select("-password");

    if(!user){

      return res.status(404).json({
        message:"User not found"
      });

    }

    await logActivity(
      req.user.id,
      "update_profile",
      { fields:Object.keys(updateData) }
    );

    res.json(user);

  }catch(error){

    console.error("Profile update error:",error);

    res.status(500).json({
      message:"Failed to update profile"
    });

  }

};