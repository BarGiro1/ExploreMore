import express from 'express';
import commentsController from '../controllers/comments_controllers';
import { authMiddleware } from '../controllers/auth_controller';
const router = express.Router();

router.get('/', commentsController.getAll.bind(commentsController));
router.post('/', authMiddleware, commentsController.create.bind(commentsController));
router.delete("/:id",authMiddleware, commentsController.delete_.bind(commentsController));
router.get("/:id",commentsController.getById.bind(commentsController));

export default router;
