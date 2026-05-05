import mongoose from "mongoose";

const collegePaymentSchema = new mongoose.Schema(
  {
    /* ================= OWNER ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= LINK TO ADMISSION ================= */
    admissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeAdmission",
      required: true,
      unique: true,
    },

    /* ================= SNAPSHOT INFO ================= */
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    courseName: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= FINANCIALS ================= */
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegePayment", collegePaymentSchema);
