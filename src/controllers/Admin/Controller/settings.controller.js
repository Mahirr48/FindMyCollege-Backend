import Settings from "../../../../../../FM_Admin/Backend/src/models/settings.js";
import Admin from "../models/admin.js";
import bcrypt from "bcryptjs";

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true }
      );
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.user.id,
      { name, email },
      { new: true }
    );

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: "Password change failed" });
  }
};