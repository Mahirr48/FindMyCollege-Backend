import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // 1 establishment = 1 about
    },

    title: {
      type: String,
      default: "",
    },

    subtitle: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    mission: {
      type: String,
      default: "",
    },

    vision: {
      type: String,
      default: "",
    },

    highlights: {
      type: [String],
      default: [],
    },

    heroImage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EstablishmentAbout", aboutSchema);