// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import { allowRoles } from "../middlewares/role.middleware.js";

// import {
//   applyStudentToCourse,
//   getAgentApplications,
//   getAgentCommissions,
//   getStudentApplications,
// } from "../controllers/agent.applications.controller.js";

// import { getApplyOptions } from "../controllers/agent.availabeColleges.controller.js";

// const router = express.Router();

// /* 🔒 Only AGENT can access */
// router.use(protect, allowRoles("AGENT"));

// router.post("/applications", applyStudentToCourse);

// router.get("/applications", getAgentApplications);

// router.get("/students/:id/applications", getStudentApplications);

// router.get("/commissions", getAgentCommissions);

// router.get("/apply-options", getApplyOptions);

// export default router;


/////////////////////////////////////////////////////////////



import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import {
  getAgentApplications,
  getStudentApplications,
  getAgentCommissions,
} from "../controllers/agent.stuApplications.controller.js";

const router = express.Router();

/* 🔒 Only AGENT can access */
router.use(protect, allowRoles("AGENT"));

/* ================= ALL APPLICATIONS ================= */
router.get("/", getAgentApplications);

/* ================= STUDENT APPLICATIONS ================= */
router.get("/students/:id", getStudentApplications);

/* ================= COMMISSIONS ================= */
router.get("/commissions", getAgentCommissions);

export default router;