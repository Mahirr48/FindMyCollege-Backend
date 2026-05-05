import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/* CHECK IDENTIFIER */

export const checkIdentifier = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.json({ status: "USER_NOT_FOUND" });
    }

    if (!user.password || user.mustChangePassword) {
      return res.json({
        status: "SET_PASSWORD_REQUIRED",
        inviteToken: user.inviteToken,
        role: user.role,
      });
    }

    return res.json({
      status: "PASSWORD_REQUIRED",
      role: user.role,
    });
  } catch (error) {
    console.error("Check identifier error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* SET PASSWORD */

export const setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      inviteToken: token,
      inviteExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.inviteToken = null;
    user.inviteExpires = null;
    user.mustChangePassword = false;

    await user.save();

    res.json({ message: "Password set successfully" });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* Forgot Password */

export const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save();

    res.json({
      message: "Reset password token generated",
      token: resetToken,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* Reset Password */

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    user.mustChangePassword = false;

    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

/* LOGIN */

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (!user) {
      return res.status(200).json({ status: "USER_NOT_FOUND" });
    }

    if (user.role === "ADMIN") {
      return res.status(403).json({
        message: "Admin must login from admin panel",
      });
    }

    if (!user.password || user.mustChangePassword) {
      return res.status(200).json({
        status: "SET_PASSWORD_REQUIRED",
        inviteToken: user.inviteToken,
        role: user.role,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.json({
      status: "SUCCESS",
      token,
      role: user.role,
      name: user.name,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
