import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import StudentProfile from "../models/student.profile.model.js";
import Notification from "../models/Admin/models/Notification.js"; // ✅ added

export const registerStudent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      educationLevel,
      course,
      city,
      referralCode,
    } = req.body;

    /* ================= CHECK EXISTING ================= */
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    /* ================= HASH PASSWORD ================= */
    const hashedPassword = await bcrypt.hash(password, 12);

    /* ================= CREATE USER ================= */
    const user = await User.create({
      name: fullName,
      email,
      mobile,
      password: hashedPassword,
      role: "STUDENT",
      status: "ACTIVE",
      mustChangePassword: false,
    });

    /* ================= CREATE STUDENT PROFILE ================= */
    await StudentProfile.create({
      userId: user._id,

      // 🔥 IMPORTANT: Store basic info here also
      fullName,
      email,
      mobile,

      educationLevel,
      intendedCourse: course,

      address: {
        city,
      },

      referralCode,

      // Optional defaults for safety
      completedSteps: [],
      completionPercentage: 0,
      status: "draft",
      profileCompleted: false,
    });

    /* ================= CREATE ADMIN NOTIFICATION ================= */
    await Notification.create({
      userId: user._id,
      message: `New student registered: ${fullName}`,
      read: false,
    });

    res.status(201).json({
      message: "Student registered successfully",
    });
  } catch (err) {
    console.error("Student register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
