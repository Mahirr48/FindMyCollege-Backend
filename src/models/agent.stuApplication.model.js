import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
{
  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AgentStudent",
    required: true
  },

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeProfile",
    required: true
  },

  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeCourse",
    required: true
  },

  status: {
    type: String,
    enum: ["APPLIED","APPROVED","REJECTED"],
    default: "APPLIED"
  }

},
{ timestamps:true }
);

export default mongoose.model(
  "AgentStudentApplication",
  applicationSchema
);