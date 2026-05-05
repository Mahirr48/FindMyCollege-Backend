import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { payFees, getPayments } from "../controllers/college.payment.controller.js";

const router = express.Router();

/*  Only logged-in COLLEGE */
router.use(protect, allowRoles("COLLEGE"));

/* ================= COLLECT FEES ================= */
router.post("/collect/:admissionId", payFees);

/* ================= GET LEDGER ================= */
router.get("/", getPayments);

export default router;
