import Student from "../../../models/Admin/models/Student.js";
import { logAction } from "../../../services/audit.service.js";
import { sendNotification } from "../../../services/notification.service.js";
import { uploadFile } from "../../../services/upload.service.js";
import mongoose from "mongoose";
import Application from "../../../models/Admin/models/Application.js";

/* =========================
   Create Student
========================= */
export const createStudent = async (req, res) => {
  try {
    const data = req.body;

    if (!data.basicDetails?.fullName || !data.basicDetails?.email) {
      return res.status(400).json({
        message: "Full Name and Email are required",
      });
    }

    const student = await Student.create({
      basicDetails: {
        fullName: data.basicDetails.fullName,
        email: data.basicDetails.email,
        mobile: data.basicDetails.mobile,
        dob: data.basicDetails.dob,
        gender: data.basicDetails.gender,
      },

      address: data.address || {},
      education: data.education || {},

      agentId: data.agentId,
      collegeId: data.collegeId,
    });

    await Application.create({
      studentId: student._id, // 🔥 VERY IMPORTANT
      student: data.basicDetails.fullName,
      college: "N/A",
      course: "N/A",
      status: "New Student",
    });

    await sendNotification({
      userId: student._id,
      message: `${data.basicDetails.fullName} registered`,
    });

    await logAction("Student created", student._id);

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   Get Students (with filters)
========================= */
export const getStudents = async (req, res) => {
  try {
    const {
      search = "",
      status,
      collegeId,
      agentId,
      page = 1,
      limit = 10,
    } = req.query;

    const filters = {};

    if (status) filters.status = status;
    if (collegeId) filters.collegeId = collegeId;
    if (agentId) filters.agentId = agentId;

    if (search) {
      filters.$or = [
        { "basicDetails.fullName": { $regex: search, $options: "i" } },
        { "basicDetails.email": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const students = await Student.find(filters)
      .populate("collegeId", "name")
      .populate("agentId", "name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(filters);

    res.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: students,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findById(id)
      .populate("collegeId", "name")
      .populate("agentId", "name");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    console.error(err); // IMPORTANT
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Update Student
========================= */
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const student = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await logAction("Student updated", id);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* =========================
   Delete Student
========================= */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Delete request received for ID:", id);

    /* Validate ObjectId */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    /* Try deleting directly */
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    /* Remove student applications (optional safety) */
    await Application.deleteMany({ studentId: id });

    /* Log action */
    await logAction("Student deleted", id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (err) {
    console.error("Delete student error:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

/* =========================
   Update Status (Admin)
========================= */
// export const updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true },
//     );

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     await sendNotification({
//       userId: student._id,
//       message: `Your application status changed to ${status}`,
//     });

//     await logAction("Student status updated", req.params.id);
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
/* =========================
   Assign College
========================= */
export const assignCollege = async (req, res) => {
  try {
    const { collegeId } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { collegeId },
      { new: true },
    );

    await logAction("College assigned", req.params.id);

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Add Admin Remarks
========================= */
export const addRemarks = async (req, res) => {
  try {
    const { adminRemarks } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { adminRemarks },
      { new: true },
    );

    await logAction("Admin remark added", req.params.id);

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Add Document
========================= */
export const addDocument = async (req, res) => {
  try {
    const { type, fileUrl, status } = req.body;
    const { id } = req.params;

    const allowedTypes = [
      "tenthMarksheet",
      "twelfthMarksheet",
      "aadhaarCard",
      "passportPhoto",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const student = await Student.findOne({ _id: id });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          [`documents.${type}`]: {
            fileUrl,
            status: status || "Pending",
            uploadedAt: new Date(),
          },
        },
      },
      { new: true },
    );

    await logAction(`Document ${type} uploaded`, id);

    res.json({
      message: `${type} uploaded successfully`,
      student: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Verify Document
========================= */
export const verifyDocument = async (req, res) => {
  try {
    const { type, status, remark } = req.body;

    const allowedTypes = [
      "tenthMarksheet",
      "twelfthMarksheet",
      "aadhaarCard",
      "passportPhoto",
    ];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid document type" });
    }

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.documents?.[type]) {
      return res.status(400).json({ message: "Document not uploaded" });
    }

    student.documents[type].status = status;
    student.documents[type].remark = remark;

    await student.save();

    await logAction("Document verified", req.params.id);

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Update Pipeline Stage
========================= */
// export const updatePipelineStage = async (req, res) => {
//   try {
//     const { pipelineStage } = req.body;

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       { pipelineStage },
//       { new: true },
//     );

//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     await logAction("Pipeline stage updated", req.params.id);
//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
/* =========================
   Issue Offer Letter
========================= */
// export const issueOfferLetter = async (req, res) => {
//   try {
//     let offerUrl = req.body.offerLetterUrl;

//     if (req.file) {
//       offerUrl = await uploadFile(req.file);
//     }

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       {
//         offerLetter: {
//           issued: true,
//           offerDate: new Date(),
//           offerLetterUrl: offerUrl,
//           status: "Pending",
//         },
//         pipelineStage: "Offer Letter Issued",
//       },
//       { new: true },
//     );

//     await sendNotification({
//       userId: student._id,
//       message: "Offer letter issued.",
//     });

//     await logAction("Offer letter issued", req.params.id);

//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/* =========================
   Update Offer Status
========================= */
// export const updateOfferStatus = async (req, res) => {
//   try {
//     const { status } = req.body;

//     const student = await Student.findById(req.params.id);

//     student.offerLetter.status = status;

//     if (status === "Accepted") {
//       student.pipelineStage = "Enrolled";
//       student.status = "Approved";
//     }

//     await student.save();

//     await logAction("Offer status updated", req.params.id);

//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/* =========================
   Record Payment
========================= */
// export const recordPayment = async (req, res) => {
//   try {
//     const paymentData = req.body;

//     const student = await Student.findByIdAndUpdate(
//       req.params.id,
//       {
//         payment: {
//           ...paymentData,
//           paymentDate: new Date(),
//           status: "Paid",
//         },
//       },
//       { new: true },
//     );

//     await logAction("Payment recorded", req.params.id);

//     res.json(student);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

/* =========================
   Confirm Enrollment
========================= */
export const confirmEnrollment = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.payment || student.payment.status !== "Paid") {
      return res.status(400).json({
        message: "Payment not completed",
      });
    }

    student.pipelineStage = "Enrolled";
    student.status = "Approved";

    await student.save();

    await logAction("Enrollment confirmed", req.params.id);

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const applyToCollege = async (req, res) => {
  try {
    const { studentId, collegeId, collegeName, courseName } = req.body;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.applications.push({
      collegeId,
      collegeName,
      courseName,
      status: "Applied",
      appliedAt: new Date(),
    });

    await student.save();

    res.json({ success: true, data: student });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
