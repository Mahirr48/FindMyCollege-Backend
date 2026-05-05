import mongoose from "mongoose";

const establishmentCourseSchema = new mongoose.Schema(
  {
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: String,
      required: true,
    },

    fees: {
      type: Number,
      required: true,
    },

    mode: [
      {
        type: String,
        enum: ["ONLINE", "OFFLINE"],
        required: true,
      },
    ],

    totalStudents: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("EstablishmentCourse", establishmentCourseSchema);
