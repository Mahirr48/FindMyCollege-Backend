import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { applyEstablishment } from "../controllers/establishment.application.controller.js";


const router = express.Router();

router.post(
  "/apply",
  upload.fields([
    { name: "businessProof", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  applyEstablishment,
);

export default router;
