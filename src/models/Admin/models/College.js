import mongoose from "mongoose";

const collegeSchema = new mongoose.Schema(
  {
    /* ================= BASIC DETAILS ================= */
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: String,
    password: { type: String, required: true },

    authorizedPerson: String,
    designation: String,
    website: String,

    /* ================= COLLEGE TYPE ================= */
    collegeType: {
      type: String,
      enum: ["Government", "Private"],
    },

    /* ================= ADDRESS ================= */
    state: String,
    city: String,
    pincode: String,
    fullAddress: String,

    /* ================= DOCUMENTS ================= */
    registrationCertificate: String,
    approvalCertificate: String,
    collegeLogo: String,

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["Pending", "Active"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.College ||
  mongoose.model("College", collegeSchema);