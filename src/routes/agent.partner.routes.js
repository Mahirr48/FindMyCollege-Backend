// import express from "express";
// import { protect } from "../middlewares/auth.middleware.js";
// import { allowRoles } from "../middlewares/role.middleware.js";

// import {
//   requestPartner,
//   getPartnerStatus,
//   getMyPartners,
// } from "../controllers/agent.partner.controller.js";

// const router = express.Router();

// router.use(protect, allowRoles("AGENT"));

// router.post("/", requestPartner);

// router.get("/:collegeId", getPartnerStatus);

// router.get("/", getMyPartners);

// export default router;





import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

import {
  requestPartner,
  getPartnerStatus,
  getMyPartners,
  getPartnerCollegesWithCourses,
} from "../controllers/agent.partner.controller.js";

const router = express.Router();

router.use(protect, allowRoles("AGENT"));

router.post("/", requestPartner);
router.get("/:collegeId/status", getPartnerStatus);
router.get("/", getMyPartners);
router.get("/colleges", getPartnerCollegesWithCourses);

export default router;