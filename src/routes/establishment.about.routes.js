import express from "express";

import {
  getAbout,
  upsertAbout,
  deleteAbout,
} from "../controllers/establishment.about.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* ================= GET ================= */

router.get(
  "/about",
  protect,
  allowRoles("ESTABLISHMENT"),
  getAbout
);

/* ================= CREATE / UPDATE ================= */

router.post(
  "/about",
  protect,
  allowRoles("ESTABLISHMENT"),
  upsertAbout
);

/* ================= DELETE ================= */

router.delete(
  "/about",
  protect,
  allowRoles("ESTABLISHMENT"),
  deleteAbout
);

export default router;