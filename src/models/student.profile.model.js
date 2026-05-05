import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema(
  {
    /* ================= USER LINK ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= STEP 1 – BASIC DETAILS ================= */
    fullName: String,
    email: String,
    mobile: String,
    dateOfBirth: String,
    profileImage: { type: String, default: "" },

    /* ================= STEP 2 – ADDRESS ================= */
    address: {
      state: String,
      city: String,
      pincode: String,
      fullAddress: String,
    },

    /* ================= STEP 3 – EDUCATION ================= */
    educationLevel: String,
    intendedCourse: String,

    education: {
      graduation: {
        collegeName: String,
        year: String,
        percentage: String,
      },
      class12: {
        board: String,
        year: String,
        percentage: String,
      },
      class10: {
        board: String,
        year: String,
        percentage: String,
      },
    },

    /* ================= STEP 4 – DOCUMENTS ================= */
    documents: [
      {
        documentType: String,
        fileUrl: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    /* ================= STEP 5 – CONSENT ================= */
    consent: {
      infoCorrect: Boolean,
      whatsappConsent: Boolean,
      acceptedAt: Date,
    },

    /* ================= REGISTRATION EXTRA ================= */
    referralCode: String,
    source: String,

    /* ================= PROFILE PROGRESS ================= */
    completedSteps: { type: [Number], default: [] },
    completionPercentage: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "ACTIVE", "BLOCKED"],
      default: "draft",
    },

    profileCompleted: { type: Boolean, default: false },

    /* ================= ACCOUNT CONTROL ================= */
    isDeactivated: { type: Boolean, default: false },
    deletionScheduledAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.model("StudentProfile", StudentProfileSchema);
