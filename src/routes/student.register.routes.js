import express from "express";
import { registerStudent } from "../controllers/student.register.controller.js";

const router = express.Router();

/* ================= STUDENT REGISTER ================= */
router.post("/register", registerStudent);

export default router;