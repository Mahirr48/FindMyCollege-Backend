import crypto from "crypto";

import User from "../models/User.model.js";
import Agent from "../models/Admin/models/Agent.js";
import Withdrawal from "../models/Admin/models/withdrawal.js";
import Request from "../models/Admin/models/Request.js";
import Establishment from "../models/Admin/models/Establishment.js";

import CollegeApplication from "../models/college.application.model.js";
import EstablishmentApplication from "../models/establishment.application.model.js";

import CollegeProfile from "../models/college.profile.model.js";
import EstablishmentProfile from "../models/establishment.profile.model.js";

/* =====================================================
   GET PENDING COLLEGES
===================================================== */

export const getPendingColleges = async (req, res) => {
  try {
    const colleges = await CollegeApplication.find({
      status: "PENDING",
    }).sort({ createdAt: -1 });

    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   APPROVE COLLEGE
===================================================== */

export const approveCollege = async (req, res) => {
  try {
    const college = await CollegeApplication.findByIdAndUpdate(
      req.params.id,
      { status: "APPROVED" },
      { new: true },
    );

    res.json({ message: "College Approved", college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   REJECT COLLEGE
===================================================== */

export const rejectCollege = async (req, res) => {
  try {
    await CollegeApplication.findByIdAndUpdate(req.params.id, {
      status: "REJECTED",
    });

    res.json({ message: "College Rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   BLOCK USER
===================================================== */

export const blockUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      status: "blocked",
    });

    res.json({ message: "User blocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   VERIFY COLLEGE
===================================================== */

export const verifyCollege = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({ message: "Invalid state" });
    }

    if (request.role !== "College") {
      return res.status(400).json({ message: "Not a college request" });
    }

    request.status = "VERIFIED";
    await request.save();

    res.json({
      message: "College verified successfully",
      data: request,
    });
  } catch (error) {
    console.error("Verify college error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   CREATE COLLEGE ACCOUNT
===================================================== */

export const createCollegeAccount = async (req, res) => {
  try {
    let app = await CollegeApplication.findById(req.params.id);

    /* If not found in CollegeApplication, check Request collection */
    if (!app) {
      const request = await Request.findById(req.params.id);

      if (!request) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (request.status !== "VERIFIED") {
        return res.status(400).json({ message: "Verify first" });
      }

      let user = await User.findOne({ email: request.email });

      if (!user) {
        user = await User.create({
          name: request.fullName,
          email: request.email,
          mobile: request.contactNumber,
          role: "COLLEGE",
          status: "ACTIVE",
          password: null,
          mustChangePassword: true,
        });
      }

      const existingProfile = await CollegeProfile.findOne({
        userId: user._id,
      });

      if (!existingProfile) {
        await CollegeProfile.create({
          userId: user._id,
          collegeName: request.fullName,
          email: request.email,
          mobile: request.contactNumber,
          address: request.fullAddress,
          city: request.city,
          state: request.state,
          authorizePerson: request.authorizedPerson,
        });
      }

      const inviteToken = crypto.randomBytes(32).toString("hex");

      user.inviteToken = inviteToken;
      user.inviteExpires = Date.now() + 86400000;

      await user.save();

      request.status = "ACCOUNT_CREATED";
      request.userId = user._id;

      await request.save();

      console.log(
        `Set Password: http://localhost:5173/set-password/${inviteToken}`,
      );

      return res.json({
        message: "College account created successfully",
        userId: user._id,
      });
    }

    /* ===== ORIGINAL LOGIC (kept exactly the same) ===== */

    if (app.status !== "VERIFIED") {
      return res.status(400).json({ message: "Verify first" });
    }

    let user = await User.findOne({ email: app.email });

    if (!user) {
      user = await User.create({
        name: app.collegeName,
        email: app.email,
        mobile: app.mobile,
        role: "COLLEGE",
        status: "ACTIVE",
        password: null,
        mustChangePassword: true,
      });
    }

    const existingProfile = await CollegeProfile.findOne({ userId: user._id });

    if (!existingProfile) {
      await CollegeProfile.create({
        userId: user._id,
        collegeName: app.collegeName,
        email: app.email,
        mobile: app.mobile,
        address: app.address,
        city: app.city,
        state: app.state,
        authorizePerson: app.authorizedPerson,
      });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");

    user.inviteToken = inviteToken;
    user.inviteExpires = Date.now() + 86400000;

    await user.save();

    app.status = "ACCOUNT_CREATED";
    app.userId = user._id;
    app.accountCreatedAt = new Date();

    await app.save();

    console.log(
      `Set Password: http://localhost:5173/set-password/${inviteToken}`,
    );

    res.json({
      message: "College account created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Create college account error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   VERIFY ESTABLISHMENT
===================================================== */

export const verifyEstablishment = async (req, res) => {
  try {
    const app = await EstablishmentApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.status !== "PENDING") {
      return res.status(400).json({ message: "Invalid state" });
    }

    app.status = "VERIFIED";
    app.verifiedAt = new Date();

    await app.save();

    res.json({
      message: "Establishment verified successfully",
      status: app.status,
    });
  } catch (err) {
    console.error("Verify establishment error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   CREATE ESTABLISHMENT ACCOUNT
===================================================== */

export const createEstablishmentAccount = async (req, res) => {
  try {
    const app = await EstablishmentApplication.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.status !== "VERIFIED") {
      return res.status(400).json({ message: "Verify first" });
    }

    let user = await User.findOne({ email: app.email });

    if (!user) {
      user = await User.create({
        name: app.establishmentName,
        email: app.email,
        mobile: app.mobile,
        role: "ESTABLISHMENT",
        status: "ACTIVE",
        password: null,
        mustChangePassword: true,
      });
    }

    const existingProfile = await EstablishmentProfile.findOne({
      userId: user._id,
    });

    if (!existingProfile) {
      await EstablishmentProfile.create({
        userId: user._id,
        establishmentName: app.establishmentName,
        email: app.email,
        mobile: app.mobile,
        address: app.address,
        city: app.city,
      });
    }

    const inviteToken = crypto.randomBytes(32).toString("hex");

    user.inviteToken = inviteToken;
    user.inviteExpires = Date.now() + 86400000;

    await user.save();

    app.status = "ACCOUNT_CREATED";
    app.userId = user._id;
    app.accountCreatedAt = new Date();

    await app.save();

    console.log(
      `Set password: http://localhost:5173/set-password/${inviteToken}`,
    );

    res.json({
      message: "Establishment account created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("Create establishment account error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   APPROVE AGENT
===================================================== */

export const approveAgent = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    /* Update request status */
    // request.status = "ACCOUNT_CREATED";
    // await request.save();

    /* Create agent record */
    await Agent.create({
      name: request.fullName,
      email: request.email,
      mobile: request.contactNumber,
      status: "ACTIVE",
    });

    res.json({
      message: "Agent approved successfully",
    });
  } catch (error) {
    console.error("Approve agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectAgent = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "REJECTED";
    await request.save();

    res.json({
      message: "Agent rejected",
    });
  } catch (error) {
    console.error("Reject agent error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getEstablishmentById = async (req, res) => {
  try {
    /* 1️⃣ Try to find in EstablishmentApplication (pending requests) */
    let establishment = await EstablishmentApplication.findById(req.params.id);

    /* 2️⃣ If not found, check real establishment collection */
    if (!establishment) {
      establishment = await Establishment.findById(req.params.id);
    }

    /* 3️⃣ Still not found */
    if (!establishment) {
      return res.status(404).json({ message: "Establishment not found" });
    }

    res.json(establishment);
  } catch (error) {
    console.error("Fetch establishment error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    /* 1️⃣ Try Request collection first */
    let college = await Request.findById(req.params.id);

    /* 2️⃣ If not found, check CollegeApplication */
    if (!college) {
      college = await CollegeApplication.findById(req.params.id);
    }

    /* 3️⃣ If still not found */
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json(college);
  } catch (error) {
    console.error("Fetch college error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "REJECTED";
    await request.save();

    res.status(200).json({
      message: "Request rejected successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
