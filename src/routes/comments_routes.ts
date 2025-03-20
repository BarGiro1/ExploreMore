import express from 'express';
import commentsController from '../controllers/comments_controllers';

<<<<<<< Updated upstream
router.get('/', commentsController.getAll.bind(commentsController));
router.post('/', commentsController.create.bind(commentsController));
router.delete("/:id",(req,res)=>{
    commentsController.delete_(req,res);
}
);
router.put("/:id",(req,res)=>{
    commentsController.update(req,res);
}
);
=======
const router = express.Router();

router.get('/', commentsController.getAll);  
router.post('/', commentsController.create);
router.delete("/:id", commentsController.delete);
router.get("/:id", commentsController.getById);
>>>>>>> Stashed changes

export default router;
