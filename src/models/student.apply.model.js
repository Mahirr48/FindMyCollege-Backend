// import mongoose from "mongoose";

// const StudentApplicationSchema = new mongoose.Schema({
//     studentId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },


//    collegeSlug: {type: String, required: true},

//     fullName: String,
//     dob: String,
//     gender: String,
//     nationality: String,
//     idNumber: String,

//     permanentAddress: String,
//     currentAddress: String,
//     mobile: String,
//     email: String,

//     fatherName: String,
//     fatheroccupation: String,
//     motherName: String,
//     motherOccupation: String,
//     parentContact: String,
//     annualIncome: String,

//     previousInstitute: String,
//     board: String,
//     rollNumber: String,
//     yearOfPassing: String,
//     subjects: String,
//     marks: String,
//     percentage: String,

//     course: String,
//     stream: String,
//     studyNote: String,
//     examMode: String,
//     examScore: String,

//     hostel: String,
//     transport: String,

//     photo: String,
//     signature: String,
//     marksheet10: String,
//     marksheet12: String,
//     tc: String,
//     characterCert: String,
//     idProof: String,
    
//     migrationCert: String,
// casteCert: String,
// incomeCert: String,



//     status: {
//         type: String,
//         default: "SUBMITTED",
//     },


//   createdAt: {type: Date, default: Date.now()}

// });


// export default mongoose.model("Student Application", StudentApplicationSchema);


/////////////////////////////////////////////////////////////



import mongoose from "mongoose";

const StudentApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CollegeProfile",
      required: true,
    },

    /* ================= PERSONAL INFO ================= */

    fullName: String,
    dob: String,
    gender: String,
    nationality: String,
    idNumber: String,

    /* ================= CONTACT ================= */

    permanentAddress: String,
    currentAddress: String,
    mobile: String,
    email: String,

    /* ================= PARENT DETAILS ================= */

    fatherName: String,
    fatherOccupation: String,
    motherName: String,
    motherOccupation: String,
    parentContact: String,
    annualIncome: String,

    /* ================= ACADEMIC ================= */

    previousInstitute: String,
    board: String,
    rollNumber: String,
    yearOfPassing: String,
    subjects: String,
    marks: String,
    percentage: String,

    /* ================= COURSE ================= */

    stream: String,
    studyMode: String,
    examName: String,
    examRoll: String,
    examScore: String,

    /* ================= DOCUMENTS ================= */

    documents: [
      {
        documentType: String,
        fileUrl: String,
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    /* ================= APPLICATION STATUS ================= */

    status: {
      type: String,
      enum: ["SUBMITTED", "UNDER_REVIEW", "APPROVED", "REJECTED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

/* 🚫 Prevent duplicate applications */
StudentApplicationSchema.index(
  { studentId: 1, collegeId: 1 },
  { unique: true }
);

export default mongoose.model("StudentApplication", StudentApplicationSchema);