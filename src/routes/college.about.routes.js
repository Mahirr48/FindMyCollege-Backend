import express from "express";

import {
  getCollegeAbout,
  createCollegeAbout,
  deleteCollegeAbout
} from "../controllers/college.about.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

/* IMPORTANT: default import because middleware exports default multerInstance */
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= GET ABOUT ================= */

router.get(
  "/about",
  protect,
  allowRoles("COLLEGE"),
  getCollegeAbout
);

/* ================= CREATE SECTION ================= */

router.post(
  "/about",
  protect,
  allowRoles("COLLEGE"),
  upload.single("image"),
  createCollegeAbout
);

/* ================= DELETE SECTION ================= */

router.delete(
  "/about/:id",
  protect,
  allowRoles("COLLEGE"),
  deleteCollegeAbout
);

export default router;