import mongoose from "mongoose";
import CollegeAdmission from "../models/college.admission.model.js";
import Course from "../models/college.courses.model.js";
import Payment from "../models/college.payment.model.js";

/* ================= APPLY ADMISSION ================= */
export const applyAdmission = async (req, res) => {
  try {
    const { studentName, email, phone, courseId, studentProfile } = req.body;

    if (!studentName || !email || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.availableSeats <= 0) {
      return res.status(400).json({ message: "Seats full" });
    }

    const admission = await CollegeAdmission.create({
      college: course.collegeId,
      studentName,
      email,
      phone,
      course: courseId,
      studentProfile,
    });

    res.status(201).json(admission);
  } catch (err) {
    console.error("APPLY ADMISSION ERROR:", err);
    res.status(500).json({ message: "Failed to apply admission" });
  }
};

/* ================= GET COLLEGE ADMISSIONS ================= */
export const getMyAdmissions = async (req, res) => {
  try {
    const admissions = await CollegeAdmission.find({
      college: req.user._id,
    })
      .populate("course", "name fees")
      .sort({ createdAt: -1 });

    res.json(admissions);
  } catch (err) {
    console.error("GET ADMISSIONS ERROR:", err);
    res.status(500).json({ message: "Failed to load admissions" });
  }
};

/* ================= APPROVE ADMISSION ================= */
export const approveAdmission = async (req, res) => {
  try {
    const admission = await CollegeAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    if (admission.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    if (admission.college.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Lock seat
    const course = await Course.findOneAndUpdate(
      {
        _id: admission.course,
        availableSeats: { $gt: 0 },
      },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!course) {
      return res.status(400).json({ message: "Seats full" });
    }

    admission.status = "approved";
    await admission.save();

    /* ================= CREATE PAYMENT ================= */
    const existingPayment = await Payment.findOne({
      admissionId: admission._id,
    });

    if (!existingPayment) {
      await Payment.create({
        userId: admission.college,   // ✅ FIXED
        admissionId: admission._id,
        studentName: admission.studentName,
        courseName: course.name,
        totalAmount: Number(course.fees),
        paidAmount: 0,
        status: "PENDING",
      });
    }

    res.json({ message: "Admission approved successfully" });
  } catch (err) {
    console.error("APPROVE ERROR:", err);
    res.status(500).json({ message: "Approve failed" });
  }
};

/* ================= REJECT ADMISSION ================= */
export const rejectAdmission = async (req, res) => {
  try {
    const admission = await CollegeAdmission.findById(req.params.id);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    if (admission.status !== "pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    if (admission.college.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    admission.status = "rejected";
    await admission.save();

    res.json({ message: "Admission rejected" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reject admission" });
  }
};
