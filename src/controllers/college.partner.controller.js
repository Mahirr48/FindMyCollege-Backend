// import AgentPartner from "../models/agent.partner.model.js";

// /* ================= GET ALL PARTNER REQUESTS ================= */
// export const getCollegePartnerRequests = async (req, res) => {
//   try {
//     const requests = await AgentPartner.find({
//       collegeId: req.user.collegeId,
//     })
//       .populate("agentId", "name email mobile")
//       .sort({ createdAt: -1 });

//     res.json(requests);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch requests" });
//   }
// };

// /* ================= APPROVE / REJECT REQUEST ================= */
// export const updatePartnerStatus = async (req, res) => {
//   try {
//     const { status } = req.body; // APPROVED or REJECTED

//     const request = await AgentPartner.findById(req.params.id);

//     if (!request) {
//       return res.status(404).json({ message: "Request not found" });
//     }

//     request.status = status;
//     await request.save();

//     res.json({ message: "Partner status updated" });
//   } catch (err) {
//     res.status(500).json({ message: "Update failed" });
//   }
// };



////////////////////////////////////////////////////

import AgentPartner from "../models/agent.partner.model.js";
import CollegeProfile from "../models/college.profile.model.js";

/* ================= GET ALL PARTNER REQUESTS ================= */
export const getCollegePartnerRequests = async (req, res) => {
  try {
    /* 1️⃣ Find CollegeProfile using logged-in user's ID */
    const college = await CollegeProfile.findOne({
      userId: req.user._id,
    });

    if (!college) {
      return res.status(404).json({
        message: "College profile not found",
      });
    }

    /* 2️⃣ Fetch partner requests using CollegeProfile._id */
    const requests = await AgentPartner.find({
      collegeId: college._id,
    })
      .populate("agentId", "name email mobile")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("GET PARTNER REQUESTS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch partner requests",
    });
  }
};

/* ================= APPROVE / REJECT REQUEST ================= */
export const updatePartnerStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const request = await AgentPartner.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Partner request not found",
      });
    }

    request.status = status;
    await request.save();

    res.json({
      message: "Partner status updated successfully",
    });
  } catch (err) {
    console.error("UPDATE PARTNER STATUS ERROR:", err);
    res.status(500).json({
      message: "Failed to update partner status",
    });
  }
};