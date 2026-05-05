import express from "express";
import * as controller from "../../../controllers/Admin/Controller/student.controller.js";
import { allowRoles } from "../../../middlewares/role.middleware.js";
import { verifyToken } from "../../../middlewares/auth.middleware.js";
import { applyToCollege } from "../../../controllers/Admin/Controller/student.controller.js";

const router = express.Router();

/* =========================
   CREATE + LIST
========================= */

// Create student
router.post(
  "/",
  verifyToken,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  controller.createStudent,
);

// Get all students
router.get(
  "/",
  verifyToken,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  controller.getStudents,
);

// Delete student (FIXED)
router.delete(
  "/:id",
  verifyToken,
  allowRoles("ADMIN", "SUPER_ADMIN"),
  controller.deleteStudent,
);

/* =========================
   SINGLE STUDENT
========================= */

// Get student by ID
router.get("/:id", verifyToken, controller.getStudentById);

// Update student
router.put("/:id", verifyToken, controller.updateStudent);

/* =========================
   COLLEGE / REMARKS
========================= */

router.put("/:id/assign-college", verifyToken, controller.assignCollege);

router.put("/:id/remarks", verifyToken, controller.addRemarks);

/* =========================
   DOCUMENTS
========================= */

router.put("/:id/documents", verifyToken, controller.addDocument);

router.put("/:id/documents/verify", verifyToken, controller.verifyDocument);

/* =========================
   ENROLLMENT
========================= */

router.put("/:id/enroll", verifyToken, controller.confirmEnrollment);

router.post("/apply", verifyToken, applyToCollege);

export default router;
