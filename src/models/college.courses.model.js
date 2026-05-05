import mongoose from "mongoose";

const collegeCourseSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    fees: {
      type: Number,
      required: true,
      min: 0,
    },

    semesters: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    totalSeats: {
      type: Number,
      required: true,
      min: 1,
    },

    availableSeats: {
      type: Number,
      required: true,
      min: 0,
    },

    totalStudents: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeCourse", collegeCourseSchema);
