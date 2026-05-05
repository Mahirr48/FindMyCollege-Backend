import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
  addStudent,
  getStudents,
} from "../controllers/establishment.students.controller.js";

const router = express.Router();

// 🔒 Only establishments
router.use(protect, allowRoles("ESTABLISHMENT"));

router.post("/", addStudent);
router.get("/", getStudents);

export default router;
