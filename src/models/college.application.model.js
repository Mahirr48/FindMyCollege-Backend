import mongoose from "mongoose";

const collegeApplicationSchema = new mongoose.Schema(
  {
    collegeName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    website: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    authorizedPerson: { type: String, required: true },
    designation: { type: String, required: true },

    documents: {
      affiliationDoc: String,
      idProof: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "ACCOUNT_CREATED", "REJECTED"],
      default: "PENDING",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    verifiedAt: Date,
    accountCreatedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("CollegeApplication", collegeApplicationSchema);
