import express from "express";

import {
  createProject,
  getProjects,
  getSingleProject,
  updateProject,
  deleteProject,
} from "../controllers/establishment.projects.controller.js";

import { protect } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { uploadProject } from "../middlewares/upload.middleware.js";

const router = express.Router();

/* CREATE */

router.post(
  "/projects",
  protect,
  allowRoles("ESTABLISHMENT"),
  uploadProject,
  createProject
);

/* GET ALL */

router.get(
  "/projects",
  protect,
  allowRoles("ESTABLISHMENT"),
  getProjects
);

/* GET SINGLE */

router.get(
  "/projects/:id",
  protect,
  allowRoles("ESTABLISHMENT"),
  getSingleProject
);

/* UPDATE */

router.put(
  "/projects/:id",
  protect,
  allowRoles("ESTABLISHMENT"),
  uploadProject,
  updateProject
);

/* DELETE */

router.delete(
  "/projects/:id",
  protect,
  allowRoles("ESTABLISHMENT"),
  deleteProject
);

export default router;