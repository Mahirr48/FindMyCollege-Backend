import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/college.courses.controller.js";

const router = express.Router();

/* 🔒 Only logged-in COLLEGE */
router.use(protect, allowRoles("COLLEGE"));

/* ================= ROUTES ================= */

router.post("/", createCourse);
router.get("/", getCourses);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
