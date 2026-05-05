import Request from "../../../models/Admin/models/Request.js";
import College from "../../../models/Admin/models/College.js"; // 🔥 IMPORTANT

/* REGISTER COLLEGE → CREATE REQUEST */
export const registerCollege = async (req, res) => {
  try {
    const request = await Request.create({
      role: "College",
      fullName: req.body.name,
      email: req.body.email,
      contactNumber: req.body.mobile,
      state: req.body.state,
      city: req.body.city,
      pincode: req.body.pincode,
      fullAddress: req.body.fullAddress,
      password: req.body.password,
      status: "Pending",
    });

    res.status(201).json({
      message: "College registration request submitted",
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ALL ACTIVE COLLEGES */

export const getColleges = async (req, res) => {
  try {
    const colleges = await College.find({ status: "Active" }).sort({ createdAt: -1 });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET COLLEGE BY ID */
export const getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }
    res.json(college);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* APPROVE COLLEGE REQUEST */
export const approveCollege = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Create college from request
    const college = await College.create({
      name: request.fullName,
      email: request.email,
      mobile: request.contactNumber,
      state: request.state,
      city: request.city,
      pincode: request.pincode,
      fullAddress: request.fullAddress,
      password: request.password,
      status: "Active",
    });

    // Mark request approved
    request.status = "Approved";
    await request.save();

    res.json({ message: "College approved successfully", college });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* REJECT COLLEGE REQUEST */
export const rejectCollege = async (req, res) => {
  try {
    await Request.findByIdAndUpdate(req.params.id, {
      status: "Rejected",
    });

    res.json({ message: "College rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCollege = async (req, res) => {
  try {
    const college = await College.findByIdAndDelete(req.params.id);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    res.json({ message: "College deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};