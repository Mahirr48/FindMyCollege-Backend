import express from "express";

import {
  getCollegesByDistrict,
  getCollegeBySlug,
  getCollegeById
} from "../controllers/college.publicProfile.controller.js";

const router = express.Router();

/* ================= DIRECTORY ================= */

router.get(
  "/district/:districtKey",
  getCollegesByDistrict
);

/* ================= COLLEGE PAGE ================= */

router.get(
  "/view/:districtKey/:slug",
  getCollegeBySlug
);

/* ================= COLLEGE BY ID ================= */

router.get(
  "/id/:collegeId",
  getCollegeById
);

export default router;