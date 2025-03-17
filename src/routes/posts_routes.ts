import express, { Router } from 'express';
const router = express.Router();
import postController from '../controllers/posts_controllers';

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get("/:id",(req,res)=>{
    postController.getPostById(req,res);
});
router.get('/user/:userId', postController.getPostByOwner)
router.delete("/:id", postController.deletePost);
router.put("/:id", postController.updatePost);

export default router;
