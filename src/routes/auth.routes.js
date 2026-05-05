import express from 'express';
import { checkIdentifier, forgotPassword, login, resetPassword, setPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/check-identifier", checkIdentifier)
router.post("/login",login);
router.post("/set-password", setPassword);
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)


export default router; 