import mongoose from "mongoose";

const agentPartnerSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeProfile",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate partner request */
agentPartnerSchema.index(
  { agentId: 1, collegeId: 1 },
  { unique: true }
);

export default mongoose.model("AgentPartner", agentPartnerSchema);