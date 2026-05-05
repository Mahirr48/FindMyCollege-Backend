import express from "express";
import Request from "../../../models/Admin/models/Request.js";
import Agent from "../../../models/Admin/models/Agent.js";
import College from "../../../models/Admin/models/College.js";
import Establishment from "../../../models/Admin/models/Establishment.js";
import EstablishmentApplication from "../../../models/establishment.application.model.js";

const router = express.Router();

/* =========================
   CREATE REQUEST
========================= */
router.post("/", async (req, res) => {
  try {
    const request = await Request.create({
      ...req.body,
      status: "PENDING",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   GET ALL REQUESTS
========================= */
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    const establishmentApps = await EstablishmentApplication.find({
      status: "PENDING",
    });

    const establishmentRequests = establishmentApps.map((app) => ({
      _id: app._id,
      fullName: app.establishmentName,
      email: app.email,
      contactNumber: app.mobile,
      role: "Establishment",
      status: "PENDING",
      createdAt: app.createdAt,
    }));

    res.json([...requests, ...establishmentRequests]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   APPROVE REQUEST
========================= */
router.put("/:id/approve", async (req, res) => {
  try {
    /* CHECK ESTABLISHMENT APPLICATION */
    const establishmentApp = await EstablishmentApplication.findById(
      req.params.id,
    );

    if (establishmentApp) {
      const existing = await Establishment.findOne({
        email: establishmentApp.email,
      });

      if (!existing) {
        await Establishment.create({
          name: establishmentApp.establishmentName,
          email: establishmentApp.email,
          mobile: establishmentApp.mobile,
          website: establishmentApp.website || "",

          address: establishmentApp.address,
          city: establishmentApp.city,
          state: establishmentApp.state,

          authorizedPerson: establishmentApp.authorizedPerson,
          designation: establishmentApp.designation,

          coachingCategory: establishmentApp.category,

          /* ⭐ FIX HERE */
          yearsOfExperience: Number(establishmentApp.experience) || 0,

          businessCertificate: establishmentApp.documents?.businessProof || "",

          idProof: establishmentApp.documents?.idProof || "",

          status: "APPROVED",
        });
      }

      establishmentApp.status = "ACCOUNT_CREATED";
      await establishmentApp.save();

      return res.json({
        message: "Establishment approved successfully",
      });
    }

    /* NORMAL REQUEST FLOW */

    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    /* APPROVE AGENT */
    if (request.role === "Agent") {
      const existingAgent = await Agent.findOne({ email: request.email });

      if (!existingAgent) {
        await Agent.create({
          name: request.fullName,
          email: request.email,
          mobile: request.contactNumber,
          password: request.password || "123456",

          agencyName: request.agencyName,
          panNumber: request.panNumber,

          bankAccountNumber: request.bankAccountNumber,
          ifscCode: request.ifscCode,

          experience: request.experience,
          status: "Active",
        });
      }
    }

    /* APPROVE COLLEGE */
    if (request.role === "College") {
      const existingCollege = await College.findOne({ email: request.email });

      if (!existingCollege) {
        await College.create({
          name: request.fullName,
          email: request.email,
          mobile: request.contactNumber,
          password: request.password || "123456",

          website: request.website,
          state: request.state,
          city: request.city,
          pincode: request.pincode,

          fullAddress: request.fullAddress,

          authorizedPerson: request.authorizedPerson,
          designation: request.designation,

          affiliationCertificate: request.affiliationCertificate,
          authorizedPersonIdProof: request.authorizedPersonIdProof,

          status: "Active",
        });
      }
    }

    await Request.findByIdAndDelete(req.params.id);

    res.json({
      message: "Request approved successfully",
    });
  } catch (error) {
    console.error("Approve request error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/* =========================
   GET REQUEST BY ID
========================= */
router.get("/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) return res.json(request);

    const establishmentApp = await EstablishmentApplication.findById(
      req.params.id,
    );

    if (establishmentApp) {
      return res.json({
        _id: establishmentApp._id,

        fullName: establishmentApp.establishmentName,
        email: establishmentApp.email,
        contactNumber: establishmentApp.mobile,
        role: "Establishment",

        establishmentName: establishmentApp.establishmentName,
        website: establishmentApp.website,
        fullAddress: establishmentApp.address,
        city: establishmentApp.city,
        state: establishmentApp.state,

        authorizedPerson: establishmentApp.authorizedPerson,
        designation: establishmentApp.designation,

        coachingCategory: establishmentApp.category,
        yearsOfExperience: establishmentApp.experience,

        businessCertificate: establishmentApp.documents?.businessProof,
        idProof: establishmentApp.documents?.idProof,

        status: "PENDING",
        createdAt: establishmentApp.createdAt,
      });
    }

    res.status(404).json({ message: "Request not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   REJECT REQUEST
========================= */
router.put("/:id/reject", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (request) {
      await Request.findByIdAndDelete(req.params.id);

      return res.json({
        message: "Request rejected successfully",
      });
    }

    const establishmentApp = await EstablishmentApplication.findById(
      req.params.id,
    );

    if (establishmentApp) {
      establishmentApp.status = "REJECTED";
      await establishmentApp.save();

      return res.json({
        message: "Establishment request rejected",
      });
    }

    res.status(404).json({ message: "Request not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
