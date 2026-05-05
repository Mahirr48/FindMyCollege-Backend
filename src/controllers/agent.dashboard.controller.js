// // import Student from "../models/Student.js";

// import AgentProfile from "../models/agent.profile.model.js";

// export const getAgentDashboard = async (req, res) => {
//   try {
//     const agentId = req.user._id;

//     /* ================= STUDENT METRICS ================= */
//     const totalStudents = await Student.countDocuments({
//       agent: agentId, // adjust field name if different
//     });

//     /* ================= APPLICATION METRICS ================= */
//     const totalApplications = await Application.countDocuments({
//       agent: agentId,
//     });

//     const approved = await Application.countDocuments({
//       agent: agentId,
//       status: "APPROVED",
//     });

//     const pending = await Application.countDocuments({
//       agent: agentId,
//       status: "APPLIED",
//     });

//     /* ================= APPROVAL RATE ================= */
//     const approvalRate =
//       totalApplications > 0
//         ? Math.round((approved / totalApplications) * 100)
//         : 0;

//     /* ================= RECENT APPLICATIONS ================= */
//     const recentApplicationsRaw = await Application.find({
//       agent: agentId,
//     })
//       .sort({ createdAt: -1 })
//       .limit(5)
//       .populate("studentId", "fullName");

//     const recentApplications = recentApplicationsRaw.map((app) => ({
//       studentName: app.studentId?.fullName || "Unknown",
//       status: app.status,
//     }));

//     /* ================= PROFILE COMPLETION ================= */
//     const profile = await AgentProfile.findOne({
//       userId: agentId,
//     }).select("completionPercentage");

//     res.json({
//       totalStudents,
//       totalApplications,
//       approved,
//       pending,
//       approvalRate,
//       profileCompletion: profile?.completionPercentage || 0,
//       recentApplications,
//     });

//   } catch (err) {
//     console.error("AGENT DASHBOARD ERROR:", err);
//     res.status(500).json({ message: "Dashboard failed" });
//   }
// };


///////////////////////////////////////////////////



import Student from "../models/agent.student.model.js";
import AgentProfile from "../models/agent.profile.model.js";

export const getAgentDashboard = async (req, res) => {
  try {
    const agentId = req.user._id;

    /* ================= STUDENT METRICS ================= */
    const totalStudents = await Student.countDocuments({
      agentId: agentId,
    });

    /* ================= APPLICATION METRICS ================= */
    const totalApplications = await Application.countDocuments({
      agentId: agentId,
    });

    const approved = await Application.countDocuments({
      agentId: agentId,
      status: "APPROVED",
    });

    const pending = await Application.countDocuments({
      agentId: agentId,
      status: "APPLIED",
    });

    /* ================= APPROVAL RATE ================= */
    const approvalRate =
      totalApplications > 0
        ? Math.round((approved / totalApplications) * 100)
        : 0;

    /* ================= RECENT APPLICATIONS ================= */
    const recentApplicationsRaw = await Application.find({
      agentId: agentId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("studentId", "fullName");

    const recentApplications = recentApplicationsRaw.map((app) => ({
      studentName: app.studentId?.fullName || "Unknown",
      status: app.status,
    }));

    /* ================= PROFILE COMPLETION ================= */
    const profile = await AgentProfile.findOne({
      userId: agentId,
    }).select("completionPercentage");

    res.json({
      totalStudents,
      totalApplications,
      approved,
      pending,
      approvalRate,
      profileCompletion: profile?.completionPercentage || 0,
      recentApplications,
    });

  } catch (err) {
    console.error("AGENT DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Dashboard failed" });
  }
};