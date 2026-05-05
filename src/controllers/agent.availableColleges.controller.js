

// import AgentPartner from "../models/agent.partner.model.js";
// import Course from "../models/college.courses.model.js";

// /* ================= GET AVAILABLE COLLEGES (STEP 4) ================= */
// export const getAvailableColleges = async (req, res) => {
//   try {
//     /* 1️⃣ Get approved partner colleges for this agent */
//     const approvedPartners = await AgentPartner.find({
//       agentId: req.user._id,
//       status: "APPROVED",
//     }).select("collegeId");

//     /* If no approved partners, return empty list */
//     if (!approvedPartners.length) {
//       return res.json([]);
//     }

//     const collegeIds = approvedPartners.map((p) => p.collegeId);

//     /* 2️⃣ Fetch active courses from approved colleges */
//     const courses = await Course.find({
//       collegeId: { $in: collegeIds },
//       status: "ACTIVE",
//     })
//       .populate("collegeId", "name city state")
//       .lean();

//     /* 3️⃣ Format response for frontend */
//     const response = courses.map((c) => ({
//       collegeId: c.collegeId?._id,
//       collegeName: c.collegeId?.name,
//       city: c.collegeId?.city,
//       state: c.collegeId?.state,
//       courseId: c._id,
//       courseName: c.name,
//       seatsAvailable: c.seats?.available || 0,
//       collegeFees: c.fees?.collegeFees || 0,
//       agentFees: c.fees?.agentFees || 0,
//     }));

//     res.json(response);
//   } catch (err) {
//     console.error("AVAILABLE COLLEGES ERROR:", err);
//     res.status(500).json({ message: "Failed to load colleges" });
//   }
// };


//////////////////////////////////////////////



import AgentPartner from "../models/agent.partner.model.js";
import Course from "../models/college.courses.model.js";

/* ================= GET AVAILABLE COLLEGES ================= */

export const getAvailableColleges = async (req, res) => {
  try {

    /* 1️⃣ Get approved partners */

    const partners = await AgentPartner.find({
      agentId: req.user._id,
      status: "APPROVED"
    }).populate({
      path: "collegeId",
      select: "collegeName address userId"
    });

    if (!partners.length) return res.json([]);

    const result = [];

    for (const partner of partners) {

      const collegeProfile = partner.collegeId;

      if (!collegeProfile) continue;

      /* 2️⃣ Fetch active courses for that college */

      const courses = await Course.find({
        college: collegeProfile.userId,
        isActive: true,
        availableSeats: { $gt: 0 }
      }).lean();

      for (const c of courses) {

        result.push({
          collegeId: collegeProfile._id,
          collegeName: collegeProfile.collegeName,
          city: collegeProfile.address?.city,
          state: collegeProfile.address?.state,

          courseId: c._id,
          courseName: c.name,
          seatsAvailable: c.availableSeats,

          collegeFees: c.fees?.collegeFees,
          agentFees: c.fees?.agentFees
        });

      }

    }

    res.json(result);

  } catch (err) {

    console.error("AVAILABLE COLLEGES ERROR:", err);

    res.status(500).json({
      message: "Failed to load colleges"
    });

  }
};