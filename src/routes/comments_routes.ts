import express from 'express';
import commentsController from '../controllers/comments_controllers';
const router = express.Router();

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

export default router;
