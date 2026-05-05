import express from "express"
import upload from "../middlewares/upload.middleware.js";
import {applyCollege} from "../controllers/college.application.controller.js"

const router = express.Router();

router.post(
  "/apply",
  upload.fields([
    { name: "affiliationDoc", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  applyCollege
);

export default router;
