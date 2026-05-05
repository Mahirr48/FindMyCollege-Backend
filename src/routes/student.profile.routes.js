import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";

import {
  fetchMyProfile,
  saveStep1,
  saveStep2,
  saveStep3,
  saveStep4,
  saveStep5,
  getFullProfile,
} from "../controllers/student.profile.controller.js";

const router = express.Router();

/* 🔒 Only logged-in STUDENT */
router.use(protect, allowRoles("STUDENT"));

/* ================= GET PROFILE ================= */
router.get("/", fetchMyProfile);
router.get("/full", getFullProfile);

/* ================= STEP ROUTES ================= */

router.post("/step/1", saveStep1);
router.post("/step/2", saveStep2);
router.post("/step/3", saveStep3);

/* 🔥 STEP 4 = DOCUMENTS (UPLOAD HERE) */
router.post(
  "/step/4",
  upload.fields([
    { name: "tenthMarksheet", maxCount: 1 },
    { name: "twelfthMarksheet", maxCount: 1 },
    { name: "aadhaar", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  saveStep4
);

/* STEP 5 = CONSENT (NO FILES) */
router.post("/step/5", saveStep5);

export default router;
