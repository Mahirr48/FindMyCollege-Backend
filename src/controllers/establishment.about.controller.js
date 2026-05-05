import About from "../models/establishment.about.model.js";

/* ================= GET ABOUT ================= */

export const getAbout = async (req, res) => {
  try {

    const estId = req.user.id;

    const about = await About.findOne({
      establishment: estId,
    });

    if (!about) {
      return res.json(null);
    }

    res.json(about);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= CREATE OR UPDATE ================= */

export const upsertAbout = async (req, res) => {
  try {

    const estId = req.user.id;

    const updated = await About.findOneAndUpdate(
      { establishment: estId },
      {
        ...req.body,
        establishment: estId,
      },
      { new: true, upsert: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* ================= DELETE ================= */

export const deleteAbout = async (req, res) => {
  try {

    const estId = req.user.id;

    await About.findOneAndDelete({
      establishment: estId,
    });

    res.json({ message: "About deleted successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};