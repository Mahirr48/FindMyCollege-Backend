import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // ================= BASIC DETAILS =================
    basicDetails: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },
      mobile: {
        type: String,
        trim: true,
      },
      dob: Date,
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
      },
    },

    // ================= ADDRESS =================
    address: {
      state: String,
      city: String,
      pincode: String,
      fullAddress: String,
    },

    // ================= EDUCATION =================
    education: {
      graduation: {
        collegeName: String,
        year: String,
        percentage: String,
      },
      class12: {
        board: String,
        year: String,
        percentage: String,
      },
      class10: {
        board: String,
        year: String,
        percentage: String,
      },
    },

    // ================= APPLICATIONS =================
    applications: [
      {
        collegeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "College",
        },
        collegeName: String,
        courseName: String,

        applicationFee: {
          type: Number,
          default: 0,
        },

        status: {
          type: String,
          enum: ["Applied", "Under Review", "Approved", "Rejected"],
          default: "Applied",
        },

        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // ================= RELATIONS =================
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agent",
    },

    // Overall assigned college (optional)
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
    },

    // ================= STUDENT STATUS =================
    overallStatus: {
      type: String,
      enum: ["Active", "Blocked", "Completed", "draft"],
      default: "draft",
    },

    // ================= DOCUMENTS =================
    documents: {
      tenthMarksheet: {
        fileUrl: String,
        status: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
      },
      twelfthMarksheet: {
        fileUrl: String,
        status: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
      },
      aadhaarCard: {
        fileUrl: String,
        status: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
      },
      passportPhoto: {
        fileUrl: String,
        status: {
          type: String,
          enum: ["Pending", "Verified", "Rejected"],
          default: "Pending",
        },
      },
    },

    adminRemarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

/* =========================
   INDEX (IMPORTANT)
========================= */
studentSchema.index({ "basicDetails.email": 1 }, { unique: true });

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
