/*import express, { Router } from 'express';
const router = express.Router();
import postController from '../controllers/posts_controllers';

router.get('/', postController.getAll.bind(postController));
router.post('/', postController.create.bind(postController));
router.get("/:id",(req,res)=>{
    postController.getById(req,res);
});
router.delete("/:id",(req,res)=>{
    postController.delete_(req,res);
});
router.put("/:id",(req,res)=>{
    postController.update(req,res);
}
);

export default router;
*/
import express from 'express';
const router = express.Router();
import postController from '../controllers/posts_controllers';

router.get('/', postController.getAll);
router.post('/', postController.create);
router.get("/:id", postController.getById);
router.delete("/:id", postController.delete_.bind(postController));
router.put("/:id", postController.update.bind(postController));

export default router;
