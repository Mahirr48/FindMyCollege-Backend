import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  fetchMyCollegeProfile,
  saveStep1,
  saveStep2,
  saveStep3,
  saveStep4,
  saveStep5,
  getFullCollegeProfile,
} from "../controllers/college.profile.controller.js";

const router = express.Router();

/* 🔒 Only logged-in COLLEGE */
router.use(protect, allowRoles("COLLEGE"));

/* ================= GET PROFILE ================= */
router.get("/", fetchMyCollegeProfile);

/* ================= STEP ROUTES ================= */
router.post("/step/1", saveStep1);
router.post("/step/2", saveStep2);
router.post("/step/3", saveStep3);

/* ================= DOCUMENT UPLOAD ================= */
router.post(
  "/step/4",
  upload.fields([
    { name: "registration", maxCount: 1 },
    { name: "approval", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  saveStep4
);

/* ================= FINAL SUBMIT ================= */
router.post("/step/5", saveStep5);

/* ================= FULL PROFILE VIEW ================= */
router.get("/full", getFullCollegeProfile);

export default router;
