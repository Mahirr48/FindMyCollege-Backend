import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
  createCourse,
  getMyCourses,
  updateCourse,
  deleteCourse,
} from "../controllers/establishment.courses.controller.js";

const router = express.Router();

// 🔒 Only logged-in establishments
router.use(protect, allowRoles("ESTABLISHMENT"));

router.post("/", createCourse);
router.get("/", getMyCourses);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export default router;
