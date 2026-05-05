import mongoose from "mongoose";

const establishmentStudentSchema = new mongoose.Schema(
  {
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    phone: {
      type: String,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EstablishmentCourse",
      required: true,
    },

    totalFees: {
      type: Number,
      default: 0,
    },

    paidFees: {
      type: Number,
      default: 0,
    },

    installmentAllowed: {
      type: Boolean,
      default: false,
    },

    installmentDetails: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "EstablishmentStudent",
  establishmentStudentSchema
);
