import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { getDashboardStats } from "../controllers/establishment.dashboard.controller.js";

const router = express.Router();

//  Only establishments can access dashboard
router.use(protect, allowRoles("ESTABLISHMENT"));

router.get("/", getDashboardStats);

export default router;
