import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
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

    description: {
      type: String,
      required: true,
    },

    techStack: {
      type: [String],
      default: [],
    },

    projectLink: {
      type: String,
      default: "",
    },

    githubLink: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Completed", "Ongoing"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("EstablishmentProject", projectSchema);