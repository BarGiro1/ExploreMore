import express from 'express';
import likesController from '../controllers/likes_controllers';

const router = express.Router();

router.get('/', likesController.getAll);
router.post('/', likesController.create);
router.delete('/:id', likesController.delete); 
router.get('/:id', likesController.getById); 

export default router;
