import StudentProfile from "../models/student.profile.model.js";

const TOTAL_STEPS = 5;
const percent = (steps) =>
  Math.round((steps.length / TOTAL_STEPS) * 100);

const markStep = (profile, step) => {
  if (!profile.completedSteps.includes(step)) {
    profile.completedSteps.push(step);
  }
  profile.completionPercentage = percent(profile.completedSteps);
};

/* ================= GET PROFILE ================= */
export const fetchMyProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= STEP 1 - BASIC ================= */
export const saveStep1 = async (req, res) => {
  try {
    const { fullName, email, mobile, dateOfBirth } = req.body;

    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.fullName = fullName;
    profile.email = email;
    profile.mobile = mobile;
    profile.dateOfBirth = dateOfBirth;

    markStep(profile, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= STEP 2 - ADDRESS ================= */
export const saveStep2 = async (req, res) => {
  try {
    const { state, city, pincode, fullAddress } = req.body;

    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.address = { state, city, pincode, fullAddress };

    markStep(profile, 2);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= STEP 3 - EDUCATION ================= */
export const saveStep3 = async (req, res) => {
  try {
    const { graduation, class12, class10 } = req.body;

    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.education = {
      graduation,
      class12,
      class10,
    };

    markStep(profile, 3);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* ================= STEP 4 - DOCUMENTS ================= */
export const saveStep4 = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    profile.documents = Object.keys(req.files).map((key) => ({
      documentType: key,
      fileUrl: req.files[key][0].path,
      status: "pending",
    }));

    markStep(profile, 4);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 5 - CONSENT ================= */
export const saveStep5 = async (req, res) => {
  try {
    const { infoCorrect, whatsappConsent } = req.body;

    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.consent = {
      infoCorrect,
      whatsappConsent,
      acceptedAt: new Date(),
    };

    profile.status = "submitted";
    profile.profileCompleted = true;

    markStep(profile, 5);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




/* ================= FULL PROFILE (VIEW PAGE) ================= */
export const getFullProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    res.json({
      basicDetails: {
        name: profile.name,
        email: profile.email,
        mobile: profile.mobile,
        dateOfBirth: profile.dateOfBirth,
      },
      address: profile.address,
      education: profile.education,
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
