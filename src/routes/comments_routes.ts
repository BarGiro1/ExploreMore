import express, { Router } from 'express';
const router = express.Router();
import commentsController from '../controllers/comments_controllers';

router.get('/', commentsController.getAllComments);
router.post('/', commentsController.createComments);
router.delete("/:id", commentsController.deleteComments);
router.put("/:id", commentsController.updateComments);

export default router;
