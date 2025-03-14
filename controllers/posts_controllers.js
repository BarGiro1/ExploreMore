 const postModel = require('../models/posts_models');
 
 const getAllPosts = async (req, res) => {
    const ownerFilter = req.query.owner;
    try {
        if (ownerFilter) {
            const posts= await postModel.find({ owner: ownerFilter });
            res.send(posts);
        }
        else {
            const posts = await postModel.find();
            res.send(posts);
        }
    }
    catch (error) {
        res.status
        (400).send(error.message);
    }};


    const createPost = async (req, res) => {
        try {
            const postBody = req.body;
            const post = await postModel.create(postBody);
            res.status(201).json(post);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };
    
   
 const getPostById = async(req, res) => {
    const postId = req.params.id;
    try{
        const post =await postModel.findById(postId);
        if (post) {
            res.send(post);
        }
        else {
            res.status(404).send('Post not found');
        }
    }catch(error) {
            res.status(400).send(error.message);
        }
    };
    const getPostByOwner = async (req, res) => {
        const owner = req.query.owner;
        try {
            const posts = await postModel.find({ owner: owner });
            res.send(posts);
        } catch (error) {
            res.status(400).send(error.message);
        }
    };    
 const deletePost = async (req, res) => {
    const postId = req.params.id;
    try {
        const post = await postModel.findByIdAndDelete(postId);
        if (post) {
            res.send(post);
        }
        else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
}
 module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    getPostByOwner,
    deletePost
};