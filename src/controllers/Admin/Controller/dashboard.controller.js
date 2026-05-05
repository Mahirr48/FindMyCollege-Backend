import Student from "../../../models/Admin/models/Student.js";
import Agent from "../../../models/Admin/models/Agent.js";
import College from "../../../models/Admin/models/College.js";
import Establishment from "../../../models/Admin/models/Establishment.js";
import StudentProfile from "../../../models/student.profile.model.js"; // ✅ added

export const getDashboardStats = async (req, res) => {
  try {
    const [
      students,
      agents,
      colleges,
      establishments,
      approved,
      pending,
      rejected,
    ] = await Promise.all([
      StudentProfile.countDocuments(), // ✅ students count

      Agent.countDocuments({
        status: { $in: ["VERIFIED", "ACCOUNT_CREATED"] },
      }),

      Request.countDocuments({
        role: "College",
        status: { $in: ["VERIFIED", "ACCOUNT_CREATED"] },
      }),

      Request.countDocuments({
        role: "Establishment",
        status: { $in: ["VERIFIED", "ACCOUNT_CREATED"] },
      }),

      // Status counts (for pie chart)
      Agent.countDocuments({ status: "ACCOUNT_CREATED" }),
      Agent.countDocuments({ status: "PENDING" }),
      Agent.countDocuments({ status: "REJECTED" }),
    ]);

    /* ================= MONTHLY APPLICATIONS ================= */

    const monthlyApplications = await Agent.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formattedMonths = monthlyApplications.map((m) => ({
      month: m._id,
      apps: m.count,
    }));

    res.status(200).json({
      stats: {
        students,
        agents,
        colleges,
        establishments,
      },

      statusData: [
        { name: "Approved", value: approved },
        { name: "Pending", value: pending },
        { name: "Rejected", value: rejected },
      ],

      applicationsData: formattedMonths,
    });
  } catch (error) {
    console.error("Dashboard fetch failed:", error);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};
