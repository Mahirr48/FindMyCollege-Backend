import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import {
  getCollegePartnerRequests,
  updatePartnerStatus,
} from "../controllers/college.partner.controller.js";

const router = express.Router();

router.use(protect, allowRoles("COLLEGE"));

router.get("/", getCollegePartnerRequests);

router.patch("/:id", updatePartnerStatus);

export default router;