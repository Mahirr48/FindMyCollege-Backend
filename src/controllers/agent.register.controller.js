import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import AgentProfile from "../models/agent.profile.model.js";
import Agent from "../models/Admin/models/Agent.js";
import Request from "../models/Admin/models/Request.js";

export const registerAgent = async (req, res) => {
  try {
    const {
      fullName,
      email,
      mobile,
      password,
      city,
      pan,
      bankAccount,
      ifsc,
      experience,
    } = req.body;

    /* ================= BASIC VALIDATION ================= */
    if (!fullName || !email || !mobile || !password) {
      return res.status(400).json({
        message: "Full name, email, mobile and password are required",
      });
    }

    /* ================= CHECK EXISTING ================= */
    const exists = await User.findOne({
      $or: [{ email }, { mobile }],
    });

    if (exists) {
      return res.status(400).json({
        message: "Agent already exists",
      });
    }

    /* ================= HASH PASSWORD ================= */
    const hashed = await bcrypt.hash(password, 12);

    /* ================= CREATE USER ================= */
    const user = await User.create({
      name: fullName,
      email,
      mobile,
      password: hashed,
      role: "AGENT",
      status: "PENDING",
      mustChangePassword: false,
    });

    /* ================= CREATE PROFILE ================= */
    await AgentProfile.create({
      userId: user._id,
      fullName,
      email,
      mobile,

      city: city || "",
      pan: pan || "",

      bankDetails: {
        accountNumber: bankAccount || "",
        ifscCode: ifsc || "",
      },

      experience: experience || "",

      completedSteps: [],
      completionPercentage: 0,
      status: "PENDING",
      profileCompleted: false,
    });

    /* ================= CREATE REQUEST FOR ADMIN ================= */

    await Request.create({
      userId: user._id,

      fullName,
      email,
      contactNumber: mobile,
      password: hashed,

      role: "Agent",

      panNumber: pan,
      bankAccountNumber: bankAccount,
      ifscCode: ifsc,
      experience: experience,

      status: "PENDING",
    });

    res.status(201).json({
      message: "Agent registered successfully. Awaiting admin approval.",
    });
  } catch (err) {
    console.error("Agent register error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
