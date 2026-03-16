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
      unique: true,
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
      default: "analyst"
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


// INDEXES (Important for performance)
userSchema.index({ email: 1 }, {unique: true});


// HASH PASSWORD BEFORE SAVE
userSchema.pre("save", async function () {

  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

});


// PASSWORD COMPARISON METHOD
userSchema.methods.comparePassword = async function (candidatePassword) {

  return bcrypt.compare(candidatePassword, this.password);

};

module.exports = mongoose.model("User", userSchema);