import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    phone: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    website: {
      type: String,
      default: ""
    },

    workingHours: {
      type: String,
      default: ""
    }

  },
  { timestamps: true }
);

export default mongoose.model("EstablishmentContact", contactSchema);