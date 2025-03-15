import express from 'express';
const router = express.Router();
import postController from '../controllers/posts_controllers';

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get("/:id",(req,res)=>{
    postController.getPostById(req,res);
});
router.get("/", postController.getPostByOwner);
router.delete("/:id", postController.deletePost);

export default router;