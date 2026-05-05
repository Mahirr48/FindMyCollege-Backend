import mongoose from "mongoose";

const CollegeProfileSchema = new mongoose.Schema(
  {
    /* ================= LINK TO USER ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= STEP 1 - BASIC INFO ================= */
    collegeName: String,
    authorizedPerson: String,
    email: String,
    mobile: String,

    /* ================= STEP 2 - TYPE ================= */
    collegeType: String,

    /* ================= STEP 3 - ADDRESS ================= */
    address: {
      state: String,
      city: String,
      address: String,
      pincode: String,
    },

    /* ================= STEP 4 - DOCUMENTS ================= */
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

    /* ================= STEP 5 - DECLARATIONS ================= */
    declarations: {
      infoCorrect: Boolean,
      agreePolicy: Boolean,
      acceptTerms: Boolean,
      declaredAt: Date,
    },

    /* ================= PROGRESS TRACKING ================= */
    completedSteps: {
      type: [Number],
      default: [],
    },

    completionPercentage: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "draft",
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeProfile", CollegeProfileSchema); 

