import AgentProfile from "../models/agent.profile.model.js";

const TOTAL_STEPS = 6;

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

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    }).populate("userId", "name email mobile");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      ...profile.toObject(),

      // Always return user info
      fullName: profile.fullName || profile.userId.name,
      email: profile.userId.email,
      mobile: profile.userId.mobile,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ================= STEP 1 – BASIC ================= */
export const saveStep1 = async (req, res) => {
  try {
    const { fullName, email, mobile, dob, gender } = req.body;

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.fullName = fullName;
    profile.email = email;
    profile.mobile = mobile;
    profile.dateOfBirth = dob;
    profile.gender = gender;

    markStep(profile, 1);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 2 – AGENT TYPE ================= */
export const saveStep2 = async (req, res) => {
  try {
    const { agentType, establishmentName } = req.body;

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.agentType = agentType;
    profile.establishmentName = establishmentName;

    markStep(profile, 2);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 3 – ADDRESS ================= */
export const saveStep3 = async (req, res) => {
  try {
    const { state, district, city, pincode, fullAddress } = req.body;

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.address = {
      state,
      district,
      city,
      pincode,
      fullAddress,
    };

    markStep(profile, 3);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 4 – DOCUMENTS ================= */
export const saveStep4 = async (req, res) => {
  try {
    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    const docs = {};

    Object.keys(req.files).forEach((key) => {
      docs[key] = req.files[key][0].path;
    });

    profile.documents = {
      ...profile.documents,
      ...docs,
    };

    markStep(profile, 4);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 5 – BANK ================= */
export const saveStep5 = async (req, res) => {
  try {
    const {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
    } = req.body;

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.bankDetails = {
      accountHolderName,
      bankName,
      accountNumber,
      ifscCode,
    };

    markStep(profile, 5);
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= STEP 6 – DECLARATIONS ================= */
export const saveStep6 = async (req, res) => {
  try {
    const { d1, d2, d3 } = req.body;

    const profile = await AgentProfile.findOne({
      userId: req.user._id,
    });

    if (!profile)
      return res.status(404).json({ message: "Profile not found" });

    profile.declarations = {
      infoCorrect: d1,
      agreePolicy: d2,
      acceptTerms: d3,
      acceptedAt: new Date(),
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