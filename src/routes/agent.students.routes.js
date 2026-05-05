import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import uploadExcel from "../middlewares/excelUpload.middleware.js";

import { importStudents } from "../controllers/agent.import.controller.js";

import {
  getAllStudents,
  getStudentById,
  deleteStudent,

  savePersonalDetails,
  saveEducationDetails,
  uploadStudentDocuments,
  saveSelectedColleges,
  finalSubmitApplication,

} from "../controllers/agent.students.controller.js";

import { getAvailableColleges } from "../controllers/agent.availableColleges.controller.js";

const router = express.Router();

router.use(protect, allowRoles("AGENT"));

/* ================= STUDENTS LIST ================= */
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.delete("/:id", deleteStudent);

/* ================= IMPORT ================= */
router.post("/import", uploadExcel.single("file"), importStudents);

/* ================= STEP 1 ================= */
router.put("/:id/personal", savePersonalDetails);

/* ================= STEP 2 ================= */
router.put("/:id/education", saveEducationDetails);

/* ================= STEP 3 ================= */
router.post(
  "/:id/documents",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "signature", maxCount: 1 },
    { name: "aadhaarCard", maxCount: 1 },
    { name: "tenthMarksheet", maxCount: 1 },
    { name: "twelfthMarksheet", maxCount: 1 },
    { name: "leavingCertificate", maxCount: 1 },
    { name: "lastSemesterMarksheet", maxCount: 1 },
  ]),
  uploadStudentDocuments
);

/* ================= STEP 4 ================= */
router.post("/:id/select-colleges", saveSelectedColleges);

/* ================= STEP 5 ================= */
router.post("/:id/final-submit", finalSubmitApplication);

/* ================= APPLY OPTIONS ================= */
router.get("/apply-options", getAvailableColleges);

export default router;