import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /* 🔹 Basic Info */
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: String,
    password: { type: String, required: true },
    agencyName: String,

    dob: String,
    gender: String,
    agentType: String,

    /* 🔹 Address */
    state: String,
    district: String,
    city: String,
    pincode: String,
    fullAddress: String,

    /* 🔹 Documents */
    aadhaarFileName: String,
    panFileName: String,
    addressProofFileName: String,
    photoFileName: String,

    /* 🔹 Bank */
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,

    /* 🔹 Business */
    commissionRate: { type: Number, default: 10 },

    status: {
      type: String,
      enum: ["Pending", "Active", "Suspended"],
      default: "Pending",
    },

    totalStudents: { type: Number, default: 0 },
    totalApproved: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Agent ||
  mongoose.model("Agent", agentSchema);