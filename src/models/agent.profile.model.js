import mongoose from "mongoose";

const AgentProfileSchema = new mongoose.Schema(
  {
    /* ================= USER LINK ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= STEP 1 – BASIC ================= */
    fullName: String,
    email: String,
    mobile: String,
    dateOfBirth: String,
    gender: String,

    /* ================= STEP 2 – AGENT TYPE ================= */
    agentType: {
      type: String,
      enum: ["Individual", "Establishment"],
    },
    establishmentName: String,

    /* ================= STEP 3 – ADDRESS ================= */
    address: {
      state: String,
      district: String,
      city: String,
      pincode: String,
      fullAddress: String,
    },

    /* ================= STEP 4 – DOCUMENTS ================= */
    documents: {
      aadhaarCard: String,
      panCard: String,
      addressProof: String,
      agentPhoto: String,
      establishmentRegistration: String,
    },

    /* ================= STEP 5 – BANK ================= */
    bankDetails: {
      accountHolderName: String,
      bankName: String,
      accountNumber: String,
      ifscCode: String,
    },

    /* ================= STEP 6 – DECLARATIONS ================= */
    declarations: {
      infoCorrect: Boolean,
      agreePolicy: Boolean,
      acceptTerms: Boolean,
      acceptedAt: Date,
    },

    /* ================= PROGRESS ================= */
    completedSteps: { type: [Number], default: [] },
    completionPercentage: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["PENDING", "VERIFIED", "ACCOUNT_CREATED", "REJECTED"],
      default: "PENDING",
    },

    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("AgentProfile", AgentProfileSchema);
