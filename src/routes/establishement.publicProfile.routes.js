import express from "express";

import {
  getEstablishmentsByDistrict,
  getEstablishmentBySlug,
  getEstablishmentById
} from "../controllers/establishment.publicProfile.controller.js";

const router = express.Router();

/* DIRECTORY */

router.get("/district/:district", getEstablishmentsByDistrict);

/* SINGLE ESTABLISHMENT */

router.get("/view/:district/:slug", getEstablishmentBySlug);

router.get("/id/:establishmentId", getEstablishmentById);

export default router;