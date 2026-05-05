import mongoose from "mongoose";

const collegeStudentApplicationSchema = new mongoose.Schema(
{
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  agentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
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

  source: {
    type: String,
    enum: ["SELF","AGENT"],
    required: true
  },

  status: {
    type: String,
    enum: ["APPLIED","APPROVED","REJECTED"],
    default: "APPLIED"
  },

  commissionStatus: {
    type: String,
    enum: ["PENDING","PAID"],
    default: "PENDING"
  },

  fees: {
    type: Number,
    default: 0
  }

},
{ timestamps: true }
);

export default mongoose.model(
  "CollegeStudentApplication",
  collegeStudentApplicationSchema
);