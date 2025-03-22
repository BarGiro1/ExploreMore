import express, { Router } from 'express';
const router = express.Router();
import likesController from '../controllers/likes_controllers';
import { authMiddleware } from '../controllers/auth_controller';
 
router.delete('/:id', authMiddleware, likesController.deleteLike);
router.post('/', authMiddleware, likesController.createLike);
 
 export default router;