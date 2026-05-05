import express from "express";
import {
  requestWithdrawal,
  approveWithdrawal,
  getAllWithdrawals
} from "../../../controllers/Admin/Controller/withdrawal.controller.js";

import { allowRoles } from "../../../middlewares/role.middleware.js";

const router = express.Router();

/* =========================
   Agent
========================= */

router.post(
  "/request",
  allowRoles("AGENT"),
  requestWithdrawal
);

/* =========================
   Admin
========================= */

router.get(
  "/",
  allowRoles("ADMIN"),
  getAllWithdrawals
);

router.put(
  "/approve/:id",
  allowRoles("ADMIN"),
  approveWithdrawal
);

export default router;