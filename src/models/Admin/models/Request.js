import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    /* ======================
       COMMON FIELDS
    ====================== */
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    password: { type: String },

    role: {
      type: String,
      enum: ["Agent", "College", "Establishment"],
      required: true,
    },

    /* ======================
       AGENT FIELDS
    ====================== */
    panNumber: { type: String, trim: true },
    bankAccountNumber: { type: String, trim: true },
    ifscCode: { type: String, trim: true },
    experience: { type: String, trim: true },
    agencyName: { type: String, trim: true },

    /* ======================
       COLLEGE FIELDS
    ====================== */
    website: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pincode: { type: String, trim: true },
    fullAddress: { type: String, trim: true },
    authorizedPerson: { type: String, trim: true },
    designation: { type: String, trim: true },
    affiliationCertificate: { type: String },
    authorizedPersonIdProof: { type: String },

    /* ======================
       STATUS
    ====================== */
    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "ACCOUNT_CREATED", "REJECTED"],
      default: "PENDING",
    },

    adminRemark: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Request", requestSchema);
