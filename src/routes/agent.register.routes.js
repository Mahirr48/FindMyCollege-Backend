import express from 'express'
import { registerAgent } from '../controllers/agent.register.controller.js';


const router = express.Router()

router.post("/register", registerAgent);
export default router