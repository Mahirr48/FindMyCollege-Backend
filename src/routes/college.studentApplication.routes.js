import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import {
getCollegeApplications,
viewApplication,
approveApplication,
rejectApplication
} from "../controllers/college.studentApplication.controller.js";

const router=express.Router();

router.use(protect,allowRoles("COLLEGE"));

router.get("/",getCollegeApplications);

router.get("/:id",viewApplication);

router.patch("/:id/approve",approveApplication);

router.patch("/:id/reject",rejectApplication);

export default router;