// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import { allowRoles } from "../middlewares/role.middleware.js";
// import {
//   addPayment,
//   getPaymentsByStudent,
//   updateStudentPayment,
// } from "../controllers/establishment.payments.controller.js";

// const router = express.Router();

// // 🔒 Only establishments
// router.use(protect, allowRoles("ESTABLISHMENT"));

// router.post("/", addPayment);
// router.get("/:studentId", getPaymentsByStudent);
// router.put("/student/:id", updateStudentPayment);

// export default router;



///////////////////////////////////////////////////


import express from "express";
import {
  addPayment,
  generateReceiptPDF,
  getPaymentsByStudent,
  updateStudentPayment,
} from "../controllers/establishment.payments.controller.js";

const router = express.Router();

/* ================= PAYMENTS ================= */

router.post("/", addPayment);

router.get("/receipt/:paymentId", generateReceiptPDF);

router.get("/:studentId", getPaymentsByStudent);

router.put("/student/:id", updateStudentPayment);

export default router;
