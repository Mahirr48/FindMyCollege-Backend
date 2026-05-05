import mongoose from "mongoose";

const collegeContactSchema = new mongoose.Schema(
  {
    college: {
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

    address: {
      type: String,
      default: ""
    },

    locationLink: {
      type: String,
      default: ""
    },

    collegeTiming: {
      type: String,
      default: ""
    }

  },
  { timestamps: true }
);

export default mongoose.model("CollegeContact", collegeContactSchema);