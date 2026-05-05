import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import {
  applyAdmission,
  getMyAdmissions,
  approveAdmission,
  rejectAdmission,
} from "../controllers/college.admission.controller.js";

const router = express.Router();

/* ===============================
   PUBLIC ROUTE (Student Apply)
================================ */
router.post("/apply", applyAdmission);

/* ===============================
   🔒 ONLY LOGGED-IN COLLEGE
================================ */
router.use(protect, allowRoles("COLLEGE"));

router.get("/", getMyAdmissions);
router.patch("/:id/approve", approveAdmission);
router.patch("/:id/reject", rejectAdmission);

export default router;
