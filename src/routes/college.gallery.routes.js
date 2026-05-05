import express from "express";

import {
  getCollegeGallery,
  createOrUpdateCollegeGallery,
  deleteCollegeSingleImage,
} from "../controllers/college.gallery.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import { uploadGallery } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= GET ================= */

router.get(
  "/gallery",
  protect,
  allowRoles("COLLEGE"),
  getCollegeGallery
);

/* ================= CREATE / UPDATE ================= */

router.put(
  "/gallery",
  protect,
  allowRoles("COLLEGE"),
  uploadGallery,
  createOrUpdateCollegeGallery
);

/* ================= DELETE IMAGE ================= */

router.delete(
  "/gallery/image",
  protect,
  allowRoles("COLLEGE"),
  deleteCollegeSingleImage
);

export default router;