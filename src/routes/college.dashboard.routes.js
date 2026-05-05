import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getDashboardStats } from "../controllers/college.dashboard.controller.js";

const router = express.Router();

/* 🔒 Only logged-in COLLEGE users */
router.use(protect, allowRoles("COLLEGE"));

/* ================= DASHBOARD ================= */
router.get("/", getDashboardStats);

export default router;
