import express from 'express';
import commentsController from '../controllers/comments_controllers';
const router = express.Router();

router.get('/', commentsController.getAll.bind(commentsController));
router.post('/', commentsController.create.bind(commentsController));
router.delete("/:id",commentsController.delete_.bind(commentsController));
router.get("/:id",commentsController.getById.bind(commentsController));

export default router;
