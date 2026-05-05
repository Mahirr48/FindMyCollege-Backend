
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
  getFullProfile
} from "../controllers/establishment.profile.controller.js";

const router = express.Router();

/* 🔒 Only logged-in ESTABLISHMENT */
router.use(protect, allowRoles("ESTABLISHMENT"));

router.get("/", fetchMyProfile);

router.post("/step/1", saveStep1);
router.post("/step/2", saveStep2);
router.post("/step/3", saveStep3);
router.post("/step/4", saveStep4);

router.post(
  "/step/5",
  upload.fields([
    { name: "gst", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "registrationCert", maxCount: 1 },
    { name: "ownerPhoto", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  saveStep5
);

router.post("/step/6", saveStep6);

router.get("/full", getFullProfile);  


export default router;
