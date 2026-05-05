import express from "express";

import {
  getContact,
  updateContact
} from "../controllers/establishment.contact.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

/* GET CONTACT */

router.get(
  "/contact",
  protect,
  allowRoles("ESTABLISHMENT"),
  getContact
);

/* UPDATE CONTACT */

router.put(
  "/contact",
  protect,
  allowRoles("ESTABLISHMENT"),
  updateContact
);

export default router;