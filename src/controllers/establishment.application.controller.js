import fs from "fs";
import EstablishmentApplication from "../models/establishment.application.model.js";

const MIN_FILE_SIZE = 500 * 1024; // 500 KB

export const applyEstablishment = async (req, res) => {
  try {
    const {
      establishmentName,
      email,
      mobile,
      website,
      address,
      city,
      state,
      authorizedPerson,
      designation,
      category,
      experience,
    } = req.body;

    const files = req.files || {};

    const businessProof = files?.businessProof?.[0];
    const idProof = files?.idProof?.[0];

    const gst = files?.gst?.[0];
    const pan = files?.pan?.[0];
    const addressProof = files?.addressProof?.[0];
    const registrationCert = files?.registrationCert?.[0];
    const ownerPhoto = files?.ownerPhoto?.[0];
    const companyLogo = files?.companyLogo?.[0];

    /* ================= APPLY PAGE FILES ================= */

    if (businessProof || idProof) {
      if (!businessProof || !idProof) {
        return res.status(400).json({
          message: "All required documents must be uploaded",
        });
      }

      const fileList = [businessProof, idProof];

      for (const file of fileList) {
        if (file.size < MIN_FILE_SIZE) {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }

          return res.status(400).json({
            message: `${file.fieldname} must be at least 500 KB`,
          });
        }
      }

      const application = await EstablishmentApplication.create({
        establishmentName,
        email,
        mobile,
        website: website || "",
        address,
        city,
        state,
        authorizedPerson,
        designation,
        category,
        experience,

        status: "PENDING",

        documents: {
          businessProof: businessProof.path,
          idProof: idProof.path,
        },
      });

      return res.status(201).json({
        message: "Establishment application submitted",
        applicationId: application._id,
      });
    }

    /* ================= PROFILE FILES ================= */

    if (
      !gst ||
      !pan ||
      !addressProof ||
      !registrationCert ||
      !ownerPhoto ||
      !companyLogo
    ) {
      return res.status(400).json({
        message: "All required documents must be uploaded",
      });
    }

    const fileList = [
      gst,
      pan,
      addressProof,
      registrationCert,
      ownerPhoto,
      companyLogo,
    ];

    for (const file of fileList) {
      if (file.size < MIN_FILE_SIZE) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        return res.status(400).json({
          message: `${file.fieldname} must be at least 500 KB`,
        });
      }
    }

    const application = await EstablishmentApplication.create({
      establishmentName,
      email,
      mobile,
      website: website || "",
      address,
      city,
      state,
      authorizedPerson,
      designation,
      category,
      experience,

      status: "PENDING",

      documents: {
        gst: gst.path,
        pan: pan.path,
        addressProof: addressProof.path,
        registrationCert: registrationCert.path,
        ownerPhoto: ownerPhoto.path,
        companyLogo: companyLogo.path,
      },
    });

    return res.status(201).json({
      message: "Establishment application submitted",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("Apply establishment error:", error);

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

/* ================= ADMIN REQUESTS ================= */

export const getEstablishmentRequests = async (req, res) => {
  try {
    const requests = await EstablishmentApplication.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= APPROVE ================= */

export const approveEstablishment = async (req, res) => {
  try {
    const establishment = await EstablishmentApplication.findById(
      req.params.id,
    );

    if (!establishment) {
      return res.status(404).json({ message: "Request not found" });
    }

    establishment.status = "APPROVED";

    await establishment.save();

    res.json({ message: "Establishment approved" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET APPROVED ================= */

export const getEstablishments = async (req, res) => {
  try {
    const establishments = await EstablishmentApplication.find({
      status: "APPROVED",
    });

    res.json(establishments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
