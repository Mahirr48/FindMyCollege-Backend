import EstablishmentProfile from "../models/establishment.profile.model.js";

const TOTAL_STEPS = 6;

const percent = (steps) => Math.round((steps.length / TOTAL_STEPS) * 100);

/* ================= MARK STEP ================= */

const markStep = (profile, step) => {
  if (!profile.completedSteps) profile.completedSteps = [];

  if (!profile.completedSteps.includes(step)) {
    profile.completedSteps.push(step);
  }

  profile.completionPercentage = percent(profile.completedSteps);
};

/* ================= GET PROFILE ================= */

export const fetchMyProfile = async (req, res) => {
  try {
    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STEP 1 ================= */

export const saveStep1 = async (req, res) => {
  try {
    const { establishmentName, authorizedPerson, email, mobile } = req.body;

    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.establishmentName = establishmentName;
    profile.authorizedPerson = authorizedPerson;
    profile.email = email;
    profile.mobile = mobile;

    markStep(profile, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 2 ================= */

export const saveStep2 = async (req, res) => {
  try {
    const { types, otherType } = req.body;

    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.establishmentType = {
      types,
      otherType: types.includes("other") ? otherType : null,
    };

    markStep(profile, 2);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 3 ================= */

export const saveStep3 = async (req, res) => {
  try {
    const { state, district, city, pincode, fullAddress } = req.body;

    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.address = { state, district, city, pincode, fullAddress };

    markStep(profile, 3);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 4 ================= */

export const saveStep4 = async (req, res) => {
  try {
    const { classrooms, capacity, staff, modes } = req.body;

    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.infrastructure = { classrooms, capacity, staff, modes };

    markStep(profile, 4);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 5 ================= */

export const saveStep5 = async (req, res) => {
  try {
    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    if (!profile.documents) profile.documents = [];

    const uploadedDocs = Object.keys(req.files).map((key) => ({
      documentType: key,
      fileUrl: req.files[key][0].path,
      status: "pending",
    }));

    profile.documents = [...profile.documents, ...uploadedDocs];

    markStep(profile, 5);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 6 ================= */

export const saveStep6 = async (req, res) => {
  try {
    const { infoCorrect, agreePolicy, acceptTerms } = req.body;

    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.declarations = {
      infoCorrect,
      agreePolicy,
      acceptTerms,
      declaredAt: new Date(),
    };

    profile.status = "submitted";
    profile.profileCompleted = true;

    markStep(profile, 6);

    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= DASHBOARD STATS ================= */

export const getDashboardStats = async (req, res) => {
  try {
    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    const stats = {
      totalCourses: 0,
      totalStudents: 0,
      newLeads: 0,
      revenue: 0,
      profileCompletion: profile?.completionPercentage || 0,
      profileStatus: profile?.status || "draft",
    };

    res.json(stats);
  } catch {
    res.status(500).json({ message: "Dashboard error" });
  }
};

/* ================= GET FULL PROFILE ================= */

export const getFullProfile = async (req, res) => {
  try {
    const profile = await EstablishmentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.json({
      basicDetails: {
        establishmentName: profile.establishmentName,
        authorizedPerson: profile.authorizedPerson,
        email: profile.email,
        mobile: profile.mobile,
      },

      establishmentType: profile.establishmentType,
      address: profile.address,
      infrastructure: profile.infrastructure,
      documents: profile.documents,
      declarations: profile.declarations,
      status: profile.status,
      completionPercentage: profile.completionPercentage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch full profile",
      error: error.message,
    });
  }
};
