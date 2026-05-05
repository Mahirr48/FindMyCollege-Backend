import express from "express";

import {
  getCollegeContact,
  updateCollegeContact
} from "../controllers/college.contact.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* GET CONTACT */

router.get(
  "/contact",
  protect,
  allowRoles("COLLEGE"),
  getCollegeContact
);

/* UPDATE CONTACT */

router.put(
  "/contact",
  protect,
  allowRoles("COLLEGE"),
  updateCollegeContact
);

export default router;