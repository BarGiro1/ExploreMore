 import postModel from '../models/posts_models';
 import { Request, Response } from 'express';


 const getAllPosts = async (req:Request , res: Response) => {
    const ownerFilter = req.query.owner;
    const createdAtFilter = req.query.createdAt;
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
        (400).send(error);
    }
};


const createPost = async (req:Request , res: Response) => {
    try {
        const postBody = req.body;
        const post = await postModel.create(postBody);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error});
    }
};
    
   
 const getPostById = async(req:Request , res: Response) => {
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
            res.status(400).send(error);
        }
    };
    const getPostByOwner = async (req:Request , res: Response) => {
        const owner = req.query.owner;
        try {
            const posts = await postModel.find({ owner: owner });
            res.send(posts);
        } catch (error) {
            res.status(400).send(error);
        }
    };    
 const deletePost = async (req:Request , res: Response) => {
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
        res.status(400).send(error);
    }
}
const updatePost = async (req:Request , res: Response) => {
    const postId = req.params.id;
    const postBody = req.body;
    try {
        const post = await postModel.findByIdAndUpdate(postId, postBody, { new: true });
        if (post) {
            res.send(post);
        }
        else {
            res.status(404).send('Post not found');
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export default {
    getAllPosts,
    createPost,
    getPostById,
    getPostByOwner,
    deletePost,
    updatePost
};