import express from "express";
import multer from "multer";
import * as controller from "../../../controllers/Admin/Controller/agent.controller.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import Agent from "../../../models/Admin/models/Agent.js";
import { verifyToken } from "../../../middlewares/auth.middleware.js";

const router = express.Router();

/* =========================
   CRUD
========================= */

// Create Agent (Admin Only)
router.post("/", allowRoles("ADMIN"), controller.createAgent);

// Get All Agents (Admin Only)
router.get("/", verifyToken, allowRoles("ADMIN"), controller.getAgents);

// Get Agent By ID
router.get(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "AGENT"),
  controller.getAgentById,
);

// Update Agent (Admin Only)
router.put("/:id", controller.updateAgent);

// Delete Agent (Admin Only)
router.delete("/:id", verifyToken, allowRoles("ADMIN"), controller.deleteAgent);

// Performance Report
router.get(
  "/:id/performance",
  allowRoles("ADMIN", "AGENT"),
  controller.getAgentPerformance,
);

// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ Upload PAN Card Example
router.put("/:id/upload-pan", upload.single("panCard"), async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      { panCard: `/uploads/${req.file.filename}` },
      { new: true },
    );

    res.json(agent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* =========================
   AGENT REQUEST MODULE
========================= */

// Get Pending Agent Requests
router.get(
  "/requests/pending",
  allowRoles("ADMIN"),
  controller.getPendingAgentRequests,
);

// Approve Agent
router.put(
  "/requests/:id/approve",
  allowRoles("ADMIN"),
  controller.approveAgent,
);

// Reject Agent
router.put("/requests/:id/reject", allowRoles("ADMIN"), controller.rejectAgent);

router.post("/", verifyToken, allowRoles("ADMIN"), controller.createAgent);

router.get(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "AGENT"),
  controller.getAgentById,
);

router.delete("/:id", verifyToken, allowRoles("ADMIN"), controller.deleteAgent);

export default router;
