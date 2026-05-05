import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      required: true,
      unique: true,
      
    },

    type: {
      type: String,
      enum: ["INFO", "CARD"],
      default: "CARD",
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      path: String,
      originalName: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeAbout", AboutUsSchema);