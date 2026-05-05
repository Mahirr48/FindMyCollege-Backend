import Establishment from "../../../models/Admin/models/Establishment.js";

/* ================= CREATE ================= */

export const createEstablishment = async (req, res) => {
  try {
    const establishment = await Establishment.create(req.body);
    res.json(establishment);
  } catch (error) {
    res.status(500).json({ message: "Create failed" });
  }
};

/* ================= GET ================= */

export const getEstablishments = async (req, res) => {
  try {
    const establishments = await Establishment.find();
    res.json(establishments);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
};

/* ================= UPDATE ================= */

export const updateEstablishment = async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(establishment);
  } catch {
    res.status(500).json({ message: "Update failed" });
  }
};

/* ================= DELETE ================= */

export const deleteEstablishment = async (req, res) => {
  try {
    await Establishment.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};