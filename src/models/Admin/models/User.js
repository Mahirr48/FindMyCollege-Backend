import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Keep password optional for now (future auth)
    password: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ["SUPER_ADMIN", "COLLEGE", "STUDENT", "AGENT", "ESTABLISHMENT"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "blocked"],
      default: function () {
        return this.role === "SUPER_ADMIN" ? "approved" : "pending";
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Keep index clean

export default mongoose.model("User", userSchema);