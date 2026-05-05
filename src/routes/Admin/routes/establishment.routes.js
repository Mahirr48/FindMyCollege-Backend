import express from "express";
import Establishment from "../../../models/Admin/models/Establishment.js";
import EstablishmentApplication from "../../../models/establishment.application.model.js";

const router = express.Router();

/* ==========================
   Register Establishment
========================== */
router.post("/", async (req, res) => {
  try {
    /* ===== CREATE APPLICATION ===== */

    const application = await EstablishmentApplication.create({
      establishmentName: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      website: req.body.website || "",
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      authorizedPerson: req.body.authorizedPerson,
      designation: req.body.designation,
      category: req.body.coachingCategory,
      experience: req.body.yearsOfExperience,
      status: "PENDING",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Create establishment application error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Get Establishments
========================== */
router.get("/", async (req, res) => {
  try {
    const { status } = req.query;

    const filter = status ? { status } : {};

    const establishments = await Establishment.find(filter).sort({
      createdAt: -1,
    });

    res.json(establishments);
  } catch (error) {
    console.error("Fetch establishments error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Get Single Establishment
========================== */
router.get("/:id", async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id);

    if (!establishment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establishment);
  } catch (error) {
    console.error("Fetch establishment error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Approve Establishment
========================== */
router.put("/approve/:id", async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true },
    );

    if (!establishment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establishment);
  } catch (error) {
    console.error("Approve establishment error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Reject Establishment
========================== */
router.put("/reject/:id", async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { status: "REJECTED" },
      { new: true },
    );

    if (!establishment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establishment);
  } catch (error) {
    console.error("Reject establishment error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Delete Establishment
========================== */
router.delete("/:id", async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndDelete(req.params.id);

    if (!establishment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Delete establishment error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==========================
   Duplicate Get
========================== */
router.get("/details/:id", async (req, res) => {
  try {
    const establishment = await Establishment.findById(req.params.id);

    if (!establishment) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(establishment);
  } catch (error) {
    console.error("Fetch establishment details error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
