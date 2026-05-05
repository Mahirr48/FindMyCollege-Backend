import Agent from "../../../models/Admin/models/Agent.js";
import Student from "../../../models/Admin/models/Student.js";

/* =========================
   CREATE AGENT
========================= */
export const createAgent = async (req, res) => {
  try {
    const agent = await Agent.create({
      ...req.body,
      status: "Pending",
    });

    res.status(201).json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET ALL AGENTS
========================= */
export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ createdAt: -1 });
    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET AGENT BY ID
========================= */
export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   UPDATE AGENT
========================= */
export const updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   DELETE AGENT
========================= */
export const deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({ message: "Agent Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   AGENT PERFORMANCE
========================= */
export const getAgentPerformance = async (req, res) => {
  try {
    const agentId = req.params.id;

    if (req.user.role === "AGENT" && req.user._id.toString() !== agentId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const students = await Student.find({ agentId })
      .select("firstName lastName email status createdAt")
      .sort({ createdAt: -1 });

    const stats = {
      total: students.length,
      pending: students.filter((s) => s.status === "Pending").length,
      approved: students.filter((s) => s.status === "Approved").length,
      rejected: students.filter((s) => s.status === "Rejected").length,
    };

    res.json({
      agentId,
      stats,
      students,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   GET PENDING AGENT REQUESTS
========================= */
export const getPendingAgentRequests = async (req, res) => {
  try {
    const agents = await Agent.find({ status: "Pending" }).sort({
      createdAt: -1,
    });

    res.json(agents);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   APPROVE AGENT
========================= */
export const approveAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { status: "Active" },
      { returnDocument: "after" },
    );

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({
      message: "Agent approved successfully",
      agent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   REJECT AGENT
========================= */
export const rejectAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { status: "Suspended" },
      { returnDocument: "after" },
    );

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json({
      message: "Agent rejected",
      agent,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
