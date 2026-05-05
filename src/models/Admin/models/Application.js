import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    college: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "Submitted",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Application", applicationSchema);
