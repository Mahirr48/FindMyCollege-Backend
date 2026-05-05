import mongoose from "mongoose";

const EstablishmentProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    /* ================= BASIC INFO ================= */
    establishmentName: String,
    authorizedPerson: String,
    email: String,
    mobile: String,

    /* ================= STEP 2 ================= */
    establishmentType: {
      types: { type: [String], default: [] },
      otherType: { type: String, default: null },
    },

    /* ================= STEP 3 ================= */
    address: {
      state: String,
      district: String,
      city: String,
      pincode: String,
      fullAddress: String,
    },

    /* ================= STEP 4 ================= */
    infrastructure: {
      classrooms: Number,
      capacity: Number,
      staff: Number,
      modes: [String], // ONLINE / OFFLINE
    },

    /* ================= STEP 5 ================= */
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

    /* ================= STEP 6 ================= */
    declarations: {
      infoCorrect: Boolean,
      agreePolicy: Boolean,
      acceptTerms: Boolean,
      declaredAt: Date,
    },

    /* ================= PROGRESS TRACKING ================= */
    completedSteps: { type: [Number], default: [] },
    completionPercentage: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved"],
      default: "draft",
    },

    profileCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model(
  "EstablishmentProfile",
  EstablishmentProfileSchema,
);
