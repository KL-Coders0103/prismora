const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true, // Mongoose automatically builds a unique index for this
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ["admin", "analyst", "viewer"],
      default: "viewer" // Defaulting to viewer is safer for SaaS until admin upgrades them
    },
    avatar: {
      type: String,
      default: ""
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

// HASH PASSWORD BEFORE SAVE
// model/User.js

// Password hash karne ka middleware
userSchema.pre('save', async function () {
  // Agar password modify nahi hua toh aage badho (Don't call next here)
  if (!this.isModified('password')) {
    return; 
  }

  // Password hash karo
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  
  // NOTE: Async function mein 'next()' call karne ki zaroorat nahi hoti!
});

// PASSWORD COMPARISON METHOD
userSchema.methods.matchPassword = async function (enteredPassword) {
  // 'this.password' is the hashed password from DB
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);