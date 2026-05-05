import express from "express";

import {
  getPendingColleges,
  approveCollege,
  rejectCollege,
  blockUser,
  approveAgent,
  rejectAgent, // ✅ ADD THIS
  verifyCollege,
  createCollegeAccount,
  verifyEstablishment,
  createEstablishmentAccount,
  getEstablishmentById,
  getCollegeById,
  rejectRequest,
} from "../controllers/admin.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import User from "../models/User.model.js";
import StudentProfile from "../models/student.profile.model.js";
import Request from "../models/Admin/models/Request.js";

/* ===== MISSING IMPORTS (IMPORTANT) ===== */
import CollegeApplication from "../models/college.application.model.js";
import EstablishmentApplication from "../models/establishment.application.model.js";

const router = express.Router();

/* =====================================================
   COLLEGE APPLICATION LIST
===================================================== */

router.get(
  "/college-applications",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const apps = await CollegeApplication.find().sort({ createdAt: -1 });
      res.json(apps);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

router.get("/colleges", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const colleges = await Request.find({
      role: "College",
      status: { $in: ["VERIFIED", "ACCOUNT_CREATED"] },
    }).sort({ createdAt: -1 });

    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   GET PENDING COLLEGE REQUESTS
===================================================== */

router.get(
  "/colleges/pending",
  protect,
  allowRoles("ADMIN"),
  getPendingColleges,
);

/* =====================================================
   COLLEGE APPROVAL / REJECTION
===================================================== */

router.patch(
  "/college/:id/approve",
  protect,
  allowRoles("ADMIN"),
  approveCollege,
);

router.patch(
  "/college/:id/reject",
  protect,
  allowRoles("ADMIN"),
  rejectCollege,
);

/* =====================================================
   BLOCK USER
===================================================== */

router.patch("/user/:id/block", protect, allowRoles("ADMIN"), blockUser);

/* =====================================================
   AGENT MANAGEMENT
===================================================== */

router.patch("/agent/approve/:id", protect, allowRoles("ADMIN"), approveAgent);

router.patch("/agent/reject/:id", protect, allowRoles("ADMIN"), rejectAgent);

/* =====================================================
   COLLEGE APPLICATION FLOW
===================================================== */

router.patch(
  "/colleges/verify/:id",
  protect,
  allowRoles("ADMIN"),
  verifyCollege,
);

router.post(
  "/colleges/create-account/:id",
  protect,
  allowRoles("ADMIN"),
  createCollegeAccount,
);

router.get("/colleges/:id", protect, allowRoles("ADMIN"), getCollegeById);
/* =====================================================
   DELETE COLLEGE
===================================================== */

router.delete(
  "/colleges/:id",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const request = await Request.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "College not found" });
      }

      await request.deleteOne();

      res.json({ message: "College deleted successfully" });
    } catch (error) {
      console.error("Delete college error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* =====================================================
   ESTABLISHMENT APPLICATION LIST
===================================================== */

router.get(
  "/establishment-applications",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const apps = await EstablishmentApplication.find().sort({
        createdAt: -1,
      });
      res.json(apps);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

/* =====================================================
   GET PENDING ESTABLISHMENT REQUESTS (IMPORTANT)
===================================================== */

router.get(
  "/establishments/pending",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const requests = await EstablishmentApplication.find({
        status: "PENDING",
      }).sort({ createdAt: -1 });

      res.json(requests);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
);

/* =====================================================
   ESTABLISHMENT APPLICATION FLOW
===================================================== */

router.patch(
  "/establishment/verify/:id",
  protect,
  allowRoles("ADMIN"),
  verifyEstablishment,
);

router.post(
  "/establishment/create-account/:id",
  protect,
  allowRoles("ADMIN"),
  createEstablishmentAccount,
);

router.get(
  "/establishments/:id",
  protect,
  allowRoles("ADMIN"),
  getEstablishmentById,
);

/* =====================================================
   DELETE ESTABLISHMENT
===================================================== */

router.delete(
  "/establishments/:id",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const deleted = await EstablishmentApplication.findByIdAndDelete(
        req.params.id,
      );

      if (!deleted) {
        return res.status(404).json({ message: "Establishment not found" });
      }

      res.json({
        message: "Establishment deleted successfully",
      });
    } catch (error) {
      console.error("Delete establishment error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* =====================================================
   STUDENT MANAGEMENT
===================================================== */

router.get("/students", protect, async (req, res) => {
  try {
    const students = await StudentProfile.find()
      .populate("userId", "email mobile role status")
      .sort({ createdAt: -1 });

    res.json({
      data: students,
    });
  } catch (error) {
    console.error("Fetch students error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/students/:id", protect, async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.id).populate(
      "userId",
      "name email mobile",
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    console.error("Fetch student error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete(
  "/students/:id",
  protect,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const student = await StudentProfile.findById(req.params.id);

      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }

      await student.deleteOne();

      res.json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Delete student error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
);

/* =====================================================
   ADMIN REQUEST LIST (MISSING ROUTE FIX)
===================================================== */

router.get("/requests", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =====================================================
   DASHBOARD
===================================================== */

router.get("/dashboard", protect, allowRoles("ADMIN"), async (req, res) => {
  try {
    const students = await StudentProfile.countDocuments();

    const colleges = await Request.countDocuments({
      role: "College",
    });

    const agents = await Request.countDocuments({
      role: "Agent",
    });

    const establishments = await Request.countDocuments({
      role: "Establishment",
    });

    const pending = await Request.countDocuments({ status: "PENDING" });
    const verified = await Request.countDocuments({ status: "VERIFIED" });
    const rejected = await Request.countDocuments({ status: "REJECTED" });

    const statusData = [
      { name: "Verified", value: verified },
      { name: "Pending", value: pending },
      { name: "Rejected", value: rejected },
    ];

    res.json({
      stats: {
        students,
        colleges,
        agents,
        establishments,
      },
      applicationsData: [],
      statusData,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.patch(
  "/requests/reject/:id",
  protect,
  allowRoles("ADMIN"),
  rejectRequest,
);

export default router;
