import EstablishmentCourse from "../models/establishment.course.model.js";

export const createCourse = async (req, res) => {
  try {
    const { title, duration, fees, mode } = req.body;

    if (!title || !duration || !fees || !Array.isArray(mode) || mode.length === 0) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const course = await EstablishmentCourse.create({
      establishment: req.user._id,
      title,
      duration,
      fees,
      mode,
    });

    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const courses = await EstablishmentCourse.find({
      establishment: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const course = await EstablishmentCourse.findOneAndUpdate(
      {
        _id: req.params.id,
        establishment: req.user._id,
      },
      req.body,
      { new: true }
    );

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await EstablishmentCourse.findOneAndDelete({
      _id: req.params.id,
      establishment: req.user._id,
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
