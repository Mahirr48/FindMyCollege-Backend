import Withdrawal from "../../../models/Admin/models/withdrawal.js";
import Agent from "../../../models/Admin/models/Agent.js";

/* =========================
   Agent Request Withdrawal
========================= */

export const requestWithdrawal = async (req, res) => {
  try {
    const { amount } = req.body;

    const agent = await Agent.findById(req.user._id);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (amount > agent.walletBalance) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const withdrawal = await Withdrawal.create({
      agentId: req.user._id,
      amount,
      status: "Pending",
    });

    res.status(201).json(withdrawal);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Admin Approves Withdrawal
========================= */

export const approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ message: "Withdrawal not found" });
    }

    if (withdrawal.status !== "Pending") {
      return res.status(400).json({ message: "Already processed" });
    }

    const agent = await Agent.findById(withdrawal.agentId);

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    if (withdrawal.amount > agent.walletBalance) {
      return res.status(400).json({ message: "Agent balance insufficient" });
    }

    // Deduct first
    agent.walletBalance -= withdrawal.amount;
    await agent.save();

    // Then update withdrawal
    withdrawal.status = "Approved";
    await withdrawal.save();

    res.json({ message: "Withdrawal Approved Successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   Admin View All Withdrawals
========================= */

export const getAllWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find()
      .populate("agentId", "name email walletBalance")
      .sort({ createdAt: -1 });

    res.json(withdrawals);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};