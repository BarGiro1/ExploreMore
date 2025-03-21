import express from 'express';
const router = express.Router();

import postController from '../controllers/posts_controllers';
import { authMiddleware } from '../controllers/auth_controller';


router.get('/', postController.getAll.bind(postController));
router.get('/:id', postController.getById.bind(postController));


router.post('/', authMiddleware, postController.create.bind(postController));
router.put('/:id', authMiddleware, postController.update.bind(postController));
router.delete('/:id', authMiddleware, postController.delete_.bind(postController));

export default router;
