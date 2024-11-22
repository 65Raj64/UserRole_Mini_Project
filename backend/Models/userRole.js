const mongoose = require("mongoose");

const UserroleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: Number, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: { type: mongoose.Schema.Types.ObjectId },
    images: [String],
    isActive: {
      type: Boolean,
       default: false
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserRole", UserroleSchema);
