import CollegeAbout from "../models/college.about.model.js";

/* ================= GET ABOUT ================= */

export const getCollegeAbout = async (req, res) => {
  try {

    const college = req.user.id;

    const sections = await CollegeAbout.find({
      college
    }).sort({ createdAt: -1 });

    res.json(sections);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to load about sections"
    });

  }
};


/* ================= CREATE SECTION ================= */

export const createCollegeAbout = async (req, res) => {
  try {

    const college = req.user.id;

    const section = new CollegeAbout({

      college,

      title: req.body.title,

      description: req.body.description,

      type: req.body.type || "CARD",

      image: req.file
        ? {
            path: req.file.path.replace(/\\/g, "/"),
            originalName: req.file.originalname,
          }
        : null,

    });

    await section.save();

    res.status(201).json(section);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to create section"
    });

  }
};


/* ================= DELETE SECTION ================= */

export const deleteCollegeAbout = async (req, res) => {
  try {

    const { id } = req.params;

    await CollegeAbout.findByIdAndDelete(id);

    res.json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Failed to delete section"
    });

  }
};