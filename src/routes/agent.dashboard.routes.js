import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getAgentDashboard } from "../controllers/agent.dashboard.controller.js";

const router = express.Router();

/* Only agents can access dashboard */
router.use(protect, allowRoles("AGENT"));

router.get("/", getAgentDashboard);

export default router;