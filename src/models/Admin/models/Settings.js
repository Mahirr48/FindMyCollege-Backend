import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    agentRegistration: { type: Boolean, default: true },
    collegeRegistration: { type: Boolean, default: true },
    agentApprovalRequired: { type: Boolean, default: true },
    collegeApprovalRequired: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);