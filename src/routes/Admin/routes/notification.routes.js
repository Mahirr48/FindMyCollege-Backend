import express from "express";
import Notification from "../../../models/Admin/models/Notification.js";

const router = express.Router();

/* =========================
   GET ALL NOTIFICATIONS
========================= */

router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });

    res.json(notifications || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   MARK ALL AS READ
========================= */

router.put("/mark-all-read", async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });

    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error marking notifications" });
  }
});

export default router;
