import Payment from "../models/college.payment.model.js";
import Admission from "../models/college.admission.model.js";
import mongoose from "mongoose";

/* ================= PAY FULL FEES ================= */
export const payFees = async (req, res) => {
  try {
    const { admissionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(admissionId)) {
      return res.status(400).json({ message: "Invalid admissionId" });
    }

    const admission = await Admission.findById(admissionId);

    if (!admission || admission.status !== "approved") {
      return res.status(400).json({ message: "Invalid admission" });
    }

    const payment = await Payment.findOne({
      admissionId,
      userId: req.user._id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment record missing" });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({ message: "Already paid" });
    }

    payment.paidAmount = payment.totalAmount;
    payment.status = "PAID";

    await payment.save();

    admission.feeCollected = true;
    await admission.save();

    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET COLLEGE PAYMENTS ================= */
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    const ledger = payments.map((p) => {
      const total = p.totalAmount || 0;
      const paid = p.paidAmount || 0;
      const remaining = total - paid;

      return {
        _id: p._id,
        name: p.studentName,
        course: p.courseName,
        total,
        paid,
        remaining,
        status: p.status,
        createdAt: p.createdAt,
      };
    });

    res.json(ledger);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
