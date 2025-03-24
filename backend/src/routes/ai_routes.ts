import express from 'express';
import { generateFromAI } from '../controllers/ai_controller';

const router = express.Router();
router.post('/generate', generateFromAI);

export default router;
