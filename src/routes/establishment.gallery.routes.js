import express from "express";

import {
  getGallery,
  createOrUpdateGallery,
  deleteSingleImage,
} from "../controllers/establishment.gallery.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import { uploadGallery } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* ================= GET ================= */

router.get(
  "/gallery",
  protect,
  allowRoles("ESTABLISHMENT"),
  getGallery
);

/* ================= CREATE / UPDATE ================= */

router.put(
  "/gallery",
  protect,
  allowRoles("ESTABLISHMENT"),
  uploadGallery,
  createOrUpdateGallery
);

/* ================= DELETE IMAGE ================= */

router.delete(
  "/gallery/image",
  protect,
  allowRoles("ESTABLISHMENT"),
  deleteSingleImage
);

export default router;