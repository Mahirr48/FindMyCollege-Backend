// import StudentApplicationModel from "../models/StudentApplication.model";

// export const applyToCollege = async (req, res) => {
//   try {
//     if (req.user.role !== "STUDENT") {
//       return res.status(403).jsn({ message: "Only students csn apply" });
//     }

//     const application = new StudentApplicationModel({
//       studentId: req.user._id,
//       collegeSlug: req.params.collegeSlug,

//       //form fiels
//       ...req.body,

//       //file paths
//       photo: req.files?.photo?.[0]?.path || null,
//       signature: req.files?.signature?.[0]?.path || null,
//       marksheet10: req.files?.marksheet10?.[0]?.path || null,
//       marksheet12: req.files?.marksheet12?.[0]?.path || null,
//       tc: req.files?.tc?.[0]?.path || null,
//       characterCert: req.files?.characterCert?.[0]?.path || null,
//       idProof: req.files?.idProof?.[0]?.path || null,

//        migrationCert: req.files?.migrationCert?.[0]?.path || null,
//   casteCert: req.files?.casteCert?.[0]?.path || null,
//   incomeCert: req.files?.incomeCert?.[0]?.path || null,
//     });

//     await application.save();

//     res.status(200).json({
//       status:"SUCCESS",
//       message:"Application submitted successfully"
//     })
//   } catch (error) {
//     console.error("Apply error", error);
//     res.status(500).json({ message: "Server error while applying"})
//   }
// };




////////////////////////////////////////////////////




// import StudentApplicationModel from "../models/StudentApplication.model.js";

// /* ================= APPLY TO COLLEGE ================= */
// export const applyToCollege = async (req, res) => {
//   try {
//     /* 🔒 Role Check */
//     if (req.user.role !== "STUDENT") {
//       return res.status(403).json({
//         message: "Only students can apply",
//       });
//     }

//     const { collegeSlug } = req.params;

//     if (!collegeSlug) {
//       return res.status(400).json({
//         message: "College identifier missing",
//       });
//     }

//     /* 🔁 Prevent Duplicate Application */
//     const existingApplication = await StudentApplicationModel.findOne({
//       studentId: req.user._id,
//       collegeSlug,
//     });

//     if (existingApplication) {
//       return res.status(400).json({
//         message: "You have already applied to this college",
//       });
//     }

//     /* 📂 Handle File Uploads */
//     const documents = {};

//     Object.keys(req.files || {}).forEach((key) => {
//       documents[key] = req.files[key][0]?.path || null;
//     });

//     /* 📝 Create Application */
//     const application = await StudentApplicationModel.create({
//       studentId: req.user._id,
//       collegeSlug,
//       ...req.body,

//       documents, // store all files inside one object

//       status: "Under Review",
//       appliedOn: new Date(),
//     });

//     res.status(201).json({
//       status: "SUCCESS",
//       message: "Application submitted successfully",
//       application,
//     });
//   } catch (error) {
//     console.error("Apply error:", error);
//     res.status(500).json({
//       message: "Server error while applying",
//     });
//   }
// };


//////////////////////////////////////////////////

import StudentApplicationModel from "../models/student.apply.model.js"


export const applyToCollege = async (req, res) => {
  try {
    if (req.user.role !== "STUDENT") {
      return res.status(403).json({
        message: "Only students can apply",
      });
    }

    const { collegeSlug } = req.params;

    const existingApplication = await StudentApplicationModel.findOne({
      studentId: req.user._id,
      collegeSlug,
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied to this college",
      });
    }

    /* 📂 Convert Uploaded Files into Array */
    const documents = [];

    Object.keys(req.files || {}).forEach((key) => {
      documents.push({
        documentType: key,
        fileUrl: req.files[key][0]?.path,
        status: "pending",
      });
    });

    const application = await StudentApplicationModel.create({
      studentId: req.user._id,
      collegeSlug,
      ...req.body,
      documents,
      status: "SUBMITTED",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({
      message: "Server error while applying",
    });
  }

};

/////////////////////////////////////

/* ================= GET MY APPLICATIONS ================= */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await StudentApplicationModel.find({
      studentId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

/* ================= GET Single APPLICATIONS ================= */
export const getSingleApplication = async (req, res) => {
  try {
    const application = await StudentApplicationModel.findOne({
      _id: req.params.id,
      studentId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(application);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE APPLICATION ================= */
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await StudentApplicationModel.findOneAndDelete({
      _id: id,
      studentId: req.user._id,
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
    });
  }
};