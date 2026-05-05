import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    logo: {
      type: String,
      default: "",
    },

    banner: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("CollegeGallery", gallerySchema);