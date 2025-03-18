 import commentsModel from '../models/comments_models';
 import { Request, Response } from 'express';

 const getAllComments = async (req:Request , res: Response) => {
    const postId = req.query.postId;
    let comments;
    try {
        if (postId) {
            comments = await commentsModel.find({ postId: postId });
        }
        else {
            comments = await commentsModel.find();
        }
        res.send(comments);
    } catch (error) {
        res.status(400).send(error);
    }
}

const createComments = async (req:Request , res: Response) => {
    try {
        const commentBody = req.body;
        const comment = await commentsModel.create(commentBody);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error});
    }
};
const updateComments = async (req:Request , res: Response) => {
    const commentId = req.params.id;
    const commentBody = req.body;
    try {
        const comment = await commentsModel.findByIdAndUpdate(commentId, commentBody, { new: true });
        if (comment) {
            res.send(comment);
        } else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        res.status(400).send(error);
    }
};
const deleteComments = async (req:Request , res: Response) => {
    const commentId = req.params.id;
    try {
        const comment = await commentsModel.findByIdAndDelete
        (commentId);
        if (comment) {
            res.send(comment);
        }
        else {
            res.status(404).send('Comment not found');
        }
    } catch (error) {
        res
        .status(400)
        .send
        (error);
    }
    
    };
     export default { getAllComments, createComments, deleteComments, updateComments };

    


    