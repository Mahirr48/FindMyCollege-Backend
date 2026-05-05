import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { applyToCollege, deleteApplication, getMyApplications, getSingleApplication } from "../controllers/student.apply.controller.js";

const router = express.Router();

/* 🔒 Only logged-in STUDENT */
router.use(protect, allowRoles("STUDENT"));

router.get("/applications", getMyApplications);
router.delete("/applications/:id", deleteApplication);
router.get("/applications/:id", getSingleApplication);

router.post(
  "/apply/:collegeSlug",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "marksheet10", maxCount: 1 },
    { name: "marksheet12", maxCount: 1 },
    { name: "tc", maxCount: 1 },
    { name: "characterCert", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "migrationCert", maxCount: 1 },
    { name: "casteCert", maxCount: 1 },
    { name: "incomeCert", maxCount: 1 },
  ]),
  applyToCollege
);

export default router;
