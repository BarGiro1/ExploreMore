import likesModel from '../models/likes_models';
import PostsModel from '../models/posts_models';
import { Request, Response } from 'express';
 


 const getLikesByUser = async (req:Request , res: Response) => {
     const userId = req.params.userId;
     try {
         const likes = await likesModel.find({ userId: userId });
         res.send(likes);
     } catch (error) {
         res.status(400).send(error);
     }
 }
 const createLike = async (req:Request , res: Response) => {
    console.log(req.body);  
     try {
         const likeBody = {
            ...req.body,
            userId: req.params.userId,
         }
         const like = await likesModel.create(likeBody);
         // increment like count in post

         console.log('Adding like to post');
         await PostsModel.findOneAndUpdate({ _id: req.body.postId }, { $inc: { numOfLikes: 1 } });

         res.status(201).json(like);
     } catch (error) {
         res.status(400).json({ error});
     }
 }
 
 const deleteLike = async (req:Request , res: Response) => {
     const postId = req.params.id;
     try {
        // decrement like count in post
         await PostsModel.findOneAndUpdate({ _id: postId }, { $inc: { numOfLikes: -1 } });
         const like = await likesModel.deleteMany({ postId: postId, userId: req.params.userId });

         if (like) {
             res.send(like);
         }
         else {
             res.status(404).send('Like not found');
         }
     } catch (error) {
         res.status(400).send(error);
     }
 }
 export default { getLikesByUser, createLike, deleteLike };