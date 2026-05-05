import Project from "../models/establishment.projects.model.js";

/* ================= CREATE ================= */

export const createProject = async (req, res) => {
  try {

    const estId = req.user.id;

    const project = await Project.create({
      establishment: estId,
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack
        ? req.body.techStack.split(",")
        : [],
      projectLink: req.body.projectLink,
      githubLink: req.body.githubLink,
      image: req.file ? "/uploads/" + req.file.filename : "",
      status: req.body.status,
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ================= */

export const getProjects = async (req, res) => {
  try {

    const estId = req.user.id;

    const projects = await Project.find({
      establishment: estId,
    }).sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET SINGLE ================= */

export const getSingleProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE ================= */

export const updateProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (req.body.title !== undefined)
      project.title = req.body.title;

    if (req.body.description !== undefined)
      project.description = req.body.description;

    if (req.body.projectLink !== undefined)
      project.projectLink = req.body.projectLink;

    if (req.body.githubLink !== undefined)
      project.githubLink = req.body.githubLink;

    if (req.body.status !== undefined)
      project.status = req.body.status;

    if (req.body.techStack)
      project.techStack = req.body.techStack.split(",");

    if (req.file)
      project.image = "/uploads/" + req.file.filename;

    await project.save();

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= DELETE ================= */

export const deleteProject = async (req, res) => {
  try {

    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};