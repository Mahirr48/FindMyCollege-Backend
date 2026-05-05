import fs from "fs";
import CollegeApplication from "../models/college.application.model.js";
import Request from "../models/Admin/models/Request.js";

const MIN_FILE_SIZE = 100 * 1024;

/* ================= APPLY COLLEGE ================= */

export const applyCollege = async (req, res) => {
  try {

    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        message: "Files not received",
      });
    }

    const affiliationFile = req.files?.affiliationDoc?.[0];
    const idProofFile = req.files?.idProof?.[0];

    if (!affiliationFile || !idProofFile) {
      return res.status(400).json({
        message: "Both documents are required",
      });
    }

    if (affiliationFile.size < MIN_FILE_SIZE) {
      if (fs.existsSync(affiliationFile.path)) {
        fs.unlinkSync(affiliationFile.path);
      }

      return res.status(400).json({
        message: "Affiliation document must be at least 500 KB",
      });
    }

    if (idProofFile.size < MIN_FILE_SIZE) {
      if (fs.existsSync(idProofFile.path)) {
        fs.unlinkSync(idProofFile.path);
      }

      return res.status(400).json({
        message: "ID proof must be at least 500 KB",
      });
    }

    /* ================= SAVE APPLICATION ================= */

    const application = await CollegeApplication.create({
      collegeName: req.body.collegeName,
      email: req.body.email,
      mobile: req.body.mobile,
      website: req.body.website || "",
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      authorizedPerson: req.body.authorizedPerson,
      designation: req.body.designation,

      documents: {
        affiliationDoc: affiliationFile.path,
        idProof: idProofFile.path,
      },

      status: "PENDING",
    });

    /* ================= CREATE ADMIN REQUEST ================= */

    await Request.create({
      role: "College",
      fullName: req.body.collegeName,
      email: req.body.email,
      contactNumber: req.body.mobile,

      website: req.body.website,
      state: req.body.state,
      city: req.body.city,
      fullAddress: req.body.address,

      authorizedPerson: req.body.authorizedPerson,
      designation: req.body.designation,

      affiliationCertificate: affiliationFile.path,
      authorizedPersonIdProof: idProofFile.path,

      status: "PENDING",
    });

    return res.status(201).json({
      message: "College application submitted successfully",
      applicationId: application._id,
    });

  } catch (error) {

    console.error("Apply college error:", error);

    if (req.files) {
      Object.values(req.files)
        .flat()
        .forEach((file) => {
          if (file?.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        });
    }

    return res.status(500).json({
      message: "Server error",
    });
  }
};