import likesModel from '../models/likes_models';
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
     try {
         const likeBody = req.body;
         const like = await likesModel.create(likeBody);
         res.status(201).json(like);
     } catch (error) {
         res.status(400).json({ error});
     }
 }
 
 const deleteLike = async (req:Request , res: Response) => {
     const likeId = req.params.id;
     try {
         const like = await likesModel.findByIdAndDelete(likeId);
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