import mongoose from "mongoose";

const collegeAdmissionSchema = new mongoose.Schema(
  {
    /* ================= COLLEGE OWNER ================= */
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= STUDENT INFO ================= */
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    /* ================= COURSE ================= */
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeCourse",   // ✅ FIXED
      required: true,
    },

    /* ================= ACADEMIC PROFILE ================= */
    studentProfile: {
      tenthMarks: {
        type: Number,
        min: 0,
        max: 100,
      },
      twelfthMarks: {
        type: Number,
        min: 0,
        max: 100,
      },
      schoolName: String,
      board: String,
      yearOfPassing: Number,
    },

    /* ================= PAYMENT ================= */
    paymentType: {
      type: String,
      enum: ["FULL", "EMI"],
      default: "EMI",
    },

    feeCollected: {
      type: Boolean,
      default: false,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeAdmission", collegeAdmissionSchema);
