import Student from "../../../../../../FM_Admin/Backend/src/models/Student.js";
import Agent from "../../../../../../FM_Admin/Backend/src/models/Agent.js";

export const approveApplication = async (req, res) => {
  try {
    const { studentId, applicationId } = req.body;

    const student = await Student.findById(studentId);

    const application = student.applications.id(applicationId);
    application.status = "Approved";

    await student.save();

    // 🔥 If student has agent → update wallet
    if (student.agentId) {
      const agent = await Agent.findById(student.agentId);

      const commission =
        application.applicationFee * (agent.commissionRate / 100);

      agent.walletBalance += commission;
      agent.totalApproved += 1;
      agent.totalRevenue += commission;

      await agent.save();
    }

    res.json({ message: "Application Approved + Commission Updated" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};