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
  saveStep6,
} from "../controllers/agent.profile.controller.js";

const router = express.Router();

/* 🔒 Only logged-in AGENT */
router.use(protect, allowRoles("AGENT"));

/* ================= GET PROFILE ================= */
router.get("/", fetchMyProfile);

/* ================= STEP ROUTES ================= */

router.post("/step/1", saveStep1);
router.post("/step/2", saveStep2);
router.post("/step/3", saveStep3);

router.post(
  "/step/4",
  upload.fields([
    { name: "aadhaarCard", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "agentPhoto", maxCount: 1 },
    { name: "establishmentRegistration", maxCount: 1 },
  ]),
  saveStep4
);

router.post("/step/5", saveStep5);
router.post("/step/6", saveStep6);

export default router;