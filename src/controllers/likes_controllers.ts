<<<<<<< Updated upstream
 import likesModel , {ILikes} from '../models/likes_models';
 import { Request, Response } from 'express';
 import createController from './base_controller';

 const likes_controllers= createController<ILikes>(likesModel);

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
=======
import likesModel, { ILikes } from "../models/likes_models";
import BaseController from "./base_controller";

const likesController = new BaseController<ILikes>(likesModel);
>>>>>>> Stashed changes

export default likesController;
