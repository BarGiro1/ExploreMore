import express, { Router } from 'express';
 const router = express.Router();
 import likesController from '../controllers/likes_controllers';
 
 router.get('/user/:userId',likesController.getLikesByUser);
 router.delete('/:id', likesController.deleteLike);
 router.post('/', likesController.createLike);
 
 export default router;