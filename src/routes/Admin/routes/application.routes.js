import express from "express";
import Application from "../../../models/Admin/models/Application.js";

const router = express.Router();

/**
 * @route   POST /api/applications/apply
 * @desc    Student Apply
 */
router.post("/apply", async (req, res) => {
  try {
    const { studentId, college, course } = req.body;

    if (!studentId || !college || !course) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newApplication = await Application.create({
      studentId,
      college,
      course,
      status: "Submitted",
    });

    res.status(201).json({
      message: "Application Submitted",
      application: newApplication,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/applications
 * @desc    Get All Applications (Admin)
 */
router.get("/", async (req, res) => {
  try {
    const { studentId } = req.query;

    if (studentId) {
      const applications = await Application.find({ studentId })
        .populate("studentId", "firstName lastName email")
        .sort({ createdAt: -1 });

      return res.json(applications);
    }

    const allApplications = await Application.find()
      .populate("studentId", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json(allApplications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PATCH /api/applications/:id
 * @desc    Update Status
 */
router.patch("/:id", async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Status updated",
      application,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
