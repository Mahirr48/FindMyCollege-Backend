import mongoose from "mongoose";

const establishmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    authorizedPerson: {
      type: String,
      trim: true,
    },

    designation: {
      type: String,
      trim: true,
    },

    coachingCategory: {
      type: String,
      trim: true,
    },

    yearsOfExperience: {
      type: Number,
    },

    businessCertificate: {
      type: String,
    },

    idProof: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    role: {
      type: String,
      default: "ESTABLISHMENT",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Establishment ||
  mongoose.model("Establishment", establishmentSchema);
