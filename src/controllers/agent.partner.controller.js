// import AgentPartner from "../models/agent.partner.model.js";
// import Course from "../models/college.courses.model.js";

// /* ================= SEND PARTNER REQUEST ================= */
// export const requestPartner = async (req, res) => {
//   try {
//     const { collegeId } = req.body;

//     const exists = await AgentPartner.findOne({
//       agentId: req.user._id,
//       collegeId,
//     });

//     if (exists) {
//       return res.status(400).json({
//         message: "Partner request already exists",
//       });
//     }

//     await AgentPartner.create({
//       agentId: req.user._id,
//       collegeId,
//       status: "PENDING",
//     });

//     res.status(201).json({
//       message: "Partner request sent successfully",
//     });
//   } catch (err) {
//     console.error("PARTNER REQUEST ERROR:", err);
//     res.status(500).json({ message: "Request failed" });
//   }
// };

// /* ================= GET PARTNER STATUS ================= */
// export const getPartnerStatus = async (req, res) => {
//   try {
//     const { collegeId } = req.params;

//     const partner = await AgentPartner.findOne({
//       agentId: req.user._id,
//       collegeId,
//     });

//     res.json({
//       status: partner ? partner.status : "NONE",
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch partner status" });
//   }
// };

// /* ================= GET MY APPROVED PARTNERS ================= */
// export const getMyPartners = async (req, res) => {
//   try {
//     const partners = await AgentPartner.find({
//       agentId: req.user._id,
//       status: "APPROVED",
//     }).populate({
//       path: "collegeId",
//       select: "collegeName address collegeType email mobile userId",
//     });

//     res.json(partners);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch partners" });
//   }
// };

// /* ================= GET PARTNER COLLEGES WITH COURSES ================= */
// /* Used in Colleges & Courses page AND Student Step 4 */

// export const getPartnerCollegesWithCourses = async (req, res) => {
//   try {
//     const partners = await AgentPartner.find({
//       agentId: req.user._id,
//       status: "APPROVED",
//     }).populate({
//       path: "collegeId",
//       select: "collegeName address collegeType email mobile userId",
//     });

//     if (!partners.length) {
//       return res.json([]);
//     }

//     const result = [];

//     for (const partner of partners) {
//       const collegeProfile = partner.collegeId;
//       if (!collegeProfile) continue;

//       /* Fetch courses linked via UserId */
//       const courses = await Course.find({
//         college: collegeProfile.userId,
//         isActive: true,
//       }).lean();

//       result.push({
//         collegeId: collegeProfile._id,
//         collegeName: collegeProfile.collegeName,
//         collegeType: collegeProfile.collegeType,
//         email: collegeProfile.email,
//         mobile: collegeProfile.mobile,
//         city: collegeProfile.address?.city,
//         state: collegeProfile.address?.state,
//         courses: courses.length
//           ? courses.map((c) => ({
//               courseId: c._id,
//               courseName: c.name,
//               seatsAvailable: c.availableSeats,
//               totalSeats: c.totalSeats,
//               fees: c.fees,
//               semesters: c.semesters,
//             }))
//           : [],
//       });
//     }

//     res.json(result);
//   } catch (err) {
//     console.error("GET PARTNER COLLEGES ERROR:", err);
//     res.status(500).json({
//       message: "Failed to load partner colleges",
//     });
//   }
// };


////////////////////////////////////////////////


import AgentPartner from "../models/agent.partner.model.js";
import Course from "../models/college.courses.model.js";

/* ================= SEND PARTNER REQUEST ================= */

export const requestPartner = async (req, res) => {
  try {

    const { collegeId } = req.body;

    const exists = await AgentPartner.findOne({
      agentId: req.user._id,
      collegeId
    });

    if (exists) {
      return res.status(400).json({
        message: "Partner request already exists"
      });
    }

    await AgentPartner.create({
      agentId: req.user._id,
      collegeId,
      status: "PENDING"
    });

    res.status(201).json({
      message: "Partner request sent successfully"
    });

  } catch (err) {

    console.error("PARTNER REQUEST ERROR:", err);

    res.status(500).json({
      message: "Request failed"
    });

  }
};

/* ================= GET PARTNER STATUS ================= */

export const getPartnerStatus = async (req, res) => {
  try {

    const { collegeId } = req.params;

    const partner = await AgentPartner.findOne({
      agentId: req.user._id,
      collegeId
    });

    res.json({
      status: partner ? partner.status : "NONE"
    });

  } catch (err) {

    res.status(500).json({
      message: "Failed to fetch partner status"
    });

  }
};

/* ================= GET MY PARTNER COLLEGES WITH COURSES ================= */

export const getPartnerCollegesWithCourses = async (req, res) => {
  try {

    const partners = await AgentPartner.find({
      agentId: req.user._id,
      status: "APPROVED"
    }).populate({
      path: "collegeId",
      select: "collegeName address collegeType email mobile userId"
    });

    if (!partners.length) {
      return res.json([]);
    }

    const result = [];

    for (const partner of partners) {

      const college = partner.collegeId;

      if (!college) continue;

      const courses = await Course.find({
        college: college.userId,
        isActive: true
      }).lean();

      result.push({
        collegeId: college._id,
        collegeName: college.collegeName,
        collegeType: college.collegeType,
        email: college.email,
        mobile: college.mobile,
        city: college.address?.city,
        state: college.address?.state,

        courses: courses.map((c) => ({
          courseId: c._id,
          courseName: c.name,
          seatsAvailable: c.availableSeats,
          totalSeats: c.totalSeats,
          fees: c.fees,
          semesters: c.semesters
        }))
      });

    }

    res.json(result);

  } catch (err) {

    console.error("GET PARTNER COLLEGES ERROR:", err);

    res.status(500).json({
      message: "Failed to load partner colleges"
    });

  }
};

/* ================= GET MY PARTNERS ================= */

export const getMyPartners = async (req, res) => {
  try {

    const partners = await AgentPartner.find({
      agentId: req.user._id,
      status: "APPROVED"
    }).populate({
      path: "collegeId",
      select: "collegeName address collegeType email mobile"
    });

    res.json(partners);

  } catch (err) {

    console.error("GET MY PARTNERS ERROR:", err);

    res.status(500).json({
      message: "Failed to fetch partners"
    });

  }
};