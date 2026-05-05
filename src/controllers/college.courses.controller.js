import Course from "../models/college.courses.model.js";
import Admission from "../models/college.admission.model.js";
import mongoose from "mongoose";

/* ================= CREATE COURSE ================= */
export const createCourse = async (req, res) => {
  try {
    const { name, fees, semesters, totalSeats } = req.body;

    if (!name || !fees || !semesters || !totalSeats) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const course = await Course.create({
      college: req.user._id, // ✅ FIXED HERE
      name: name.trim(),
      fees: Number(fees),
      semesters: Number(semesters),
      totalSeats: Number(totalSeats),
      availableSeats: Number(totalSeats),
    });

    res.status(201).json(course);
  } catch (err) {
    console.error("CREATE COURSE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET MY COURSES ================= */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({
      college: req.user._id, // ✅ FIXED HERE
    }).sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= UPDATE COURSE ================= */
export const updateCourse = async (req, res) => {
  try {
    const { name, fees, semesters, totalSeats } = req.body;
    const courseId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const course = await Course.findOne({
      _id: courseId,
      college: req.user._id, // ✅ FIXED HERE
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const filledSeats = course.totalSeats - course.availableSeats;
    const newTotalSeats = Number(totalSeats);

    if (newTotalSeats < filledSeats) {
      return res.status(400).json({
        message: "Cannot reduce seats below filled count",
      });
    }

    const diff = newTotalSeats - course.totalSeats;

    course.name = name.trim();
    course.fees = Number(fees);
    course.semesters = Number(semesters);
    course.totalSeats = newTotalSeats;
    course.availableSeats += diff;

    await course.save();

    res.json(course);
  } catch (err) {
    console.error("UPDATE COURSE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DELETE COURSE ================= */
export const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await Course.findOne({
      _id: courseId,
      college: req.user._id, // ✅ FIXED HERE
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const admissionsCount = await Admission.countDocuments({
      course: courseId, // ✅ FIXED HERE
    });

    if (admissionsCount > 0) {
      return res.status(400).json({
        message: "Cannot delete course with active admissions",
      });
    }

    await course.deleteOne();

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error("DELETE COURSE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
