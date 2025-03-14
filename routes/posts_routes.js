const express = require('express');
const router = express.Router();
const postController = require('../controllers/posts_controllers');

router.get('/', postController.getAllPosts);
router.post('/', postController.createPost);
router.get("/:id", postController.getPostById);
router.get("/", postController.getPostByOwner);
router.delete("/:id", postController.deletePost);

module.exports = router;