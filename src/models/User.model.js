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
      sparse: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Please enter a valid mobile number"],
    },

    password: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "STUDENT",
        "AGENT",
        "COLLEGE",
        "ESTABLISHMENT",
      ],
      required: true,
    },

    /* =========================
       STATUS SYSTEM (MERGED)
    ========================= */

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "PENDING",
        "BLOCKED",
        "pending",
        "approved",
        "rejected",
        "blocked",
      ],
      default: function () {
        if (this.role === "SUPER_ADMIN") return "approved";
        return "PENDING";
      },
    },

    /* =========================
       ADMIN PANEL FIELD
    ========================= */

    isActive: {
      type: Boolean,
      default: true,
    },

    /* =========================
       PORTAL AUTH SYSTEM
    ========================= */

    inviteToken: {
      type: String,
      default: null,
    },

    inviteExpires: {
      type: Date,
      default: null,
    },

    mustChangePassword: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
