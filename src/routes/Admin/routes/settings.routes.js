import express from "express";
import {
  getSettings,
  updateSettings,
  updateProfile,
  changePassword,
} from "../controllers/settings.controller.js";

const router = express.Router();

router.get("/", getSettings);
router.put("/", updateSettings);
router.put("/profile", updateProfile);
router.put("/change-password", changePassword);

export default router;