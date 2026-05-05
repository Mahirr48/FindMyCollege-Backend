import AgentStudentApplication from "../models/agent.stuApplication.model.js"

/* ================= GET STUDENT APPLICATIONS ================= */
export const getStudentApplications = async (req, res) => {
  try {
    const applications = await AgentStudentApplication.find({
      studentId: req.params.id,
      agentId: req.user._id,
    })
      .populate("collegeId", "name city")
      .populate("courseId", "name")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications" });
  }
};

/* ================= GET AGENT APPLICATIONS ================= */
export const getAgentApplications = async (req, res) => {
  try {
    const applications = await AgentStudentApplication.find({
      agentId: req.user._id,
    })
      .populate({
        path: "studentId",
        select: "fullName mobile state city",
      })
      .populate({
        path: "collegeId",
        select: "collegeName address.city address.state collegeType",
      })
      .populate({
        path: "courseId",
        select: "name fees totalSeats availableSeats",
      })
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      applicationId: app._id,
      status: app.status,
      commissionStatus: app.commissionStatus,
      appliedDate: app.createdAt,

      student: {
        id: app.studentId?._id,
        fullName: app.studentId?.fullName,
        mobile: app.studentId?.mobile,
        state: app.studentId?.state,
        city: app.studentId?.city,
      },

      college: {
        id: app.collegeId?._id,
        name: app.collegeId?.collegeName,
        city: app.collegeId?.address?.city,
        state: app.collegeId?.address?.state,
        type: app.collegeId?.collegeType,
      },

      course: {
        id: app.courseId?._id,
        name: app.courseId?.name,
        totalSeats: app.courseId?.totalSeats,
        availableSeats: app.courseId?.availableSeats,
        fees: app.courseId?.fees,
      },

      fees: app.fees,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err);
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

/* ================= GET COMMISSIONS ================= */
export const getAgentCommissions = async (req, res) => {
  try {
    const commissions = await AgentStudentApplication.find({
      agentId: req.user._id,
      commissionStatus: { $in: ["EARNED", "PAID"] },
    })
      .populate("studentId", "fullName")
      .populate("collegeId", "name")
      .populate("courseId", "name")
      .sort({ createdAt: -1 });

    res.json(commissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch commissions" });
  }
};