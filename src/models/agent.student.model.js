import mongoose from "mongoose";

const appliedCollegeSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeProfile", // 🔥 Important: match your real college model
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CollegeCourse",
  },
  status: {
    type: String,
    enum: ["Applied", "Approved", "Rejected"],
    default: "Applied",
  },
});

const studentSchema = new mongoose.Schema(
  {
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    dob: Date,
    gender: String,

    state: String,
    city: String,
    pincode: String,
    fullAddress: String,

    /* 10th */
    tenthBoard: String,
    tenthYear: Number,
    tenthMarksObtained: Number,
    tenthTotalMarks: Number,
    tenthPercentage: Number,

    /* 12th */
    twelfthBoard: String,
    twelfthYear: Number,
    twelfthMarksObtained: Number,
    twelfthTotalMarks: Number,
    twelfthPercentage: Number,

    /* DOCUMENTS */
    documents: {
      photo: String,
      signature: String,
      aadhaar: String,
      tenthMarksheet: String,
      twelfthMarksheet: String,
      lastSemesterMarksheet: String,
      leavingCertificate: String,
    },

    /* STEP 4 STORAGE */
    appliedColleges: [appliedCollegeSchema],

    declarationAccepted: {
      type: Boolean,
      default: false,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },

    finalSubmitted: {
      type: Boolean,
      default: false,
    },

    createdVia: {
      type: String,
      enum: ["AGENT", "SELF", "EXCEL"],
      default: "AGENT",
    },
  },
  { timestamps: true }
);

/* Prevent duplicate mobile per agent */
studentSchema.index({ mobile: 1, agentId: 1 }, { unique: true });

export default mongoose.model("Agent_Student", studentSchema);