import mongoose from "mongoose";

const establishmentApplicationSchema = new mongoose.Schema(
  {
    establishmentName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    website: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    authorizedPerson: { type: String, required: true },
    designation: { type: String, required: true },
    category: { type: String, required: true },
    experience: { type: String, required: true },

    documents: {
      businessProof: String,
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
  { timestamps: true },
);

export default mongoose.model(
  "EstablishmentApplication",
  establishmentApplicationSchema,
);
