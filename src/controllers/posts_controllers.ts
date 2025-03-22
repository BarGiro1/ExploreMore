import postModel,{IPost} from '../models/posts_models';
 import { Request, Response } from 'express';
import BaseController from './base_controller';
import { Types } from 'mongoose';
import PostModel from '../models/posts_models';

class PostController extends BaseController<IPost>{
    constructor(){
        super(postModel);
    }
    async create(req:Request , res: Response)  {
        const userId = req.params.userId;
        const post ={
            ...req.body,
            owner:userId

        }
       req.body=post;
        super.create(req,res);
     };


    async getAll(req:Request , res: Response) {
        const ownerFilter = req.query.owner;
        const createdAtFilter = req.query.createdAt;
        var posts;
        try {
            if (ownerFilter) {
                posts = await postModel.find({ owner: ownerFilter });
            }
            else {
                posts = await PostModel.aggregate([
                    {
                    $lookup: {
                        from: "likes",
                        localField: "_id", // Post ID
                        foreignField: "postId", 
                        as: "likes",
                    },
                    },
                    {
                    $addFields: {
                        isLikedByCurrentUser: {
                        $gt: [
                            {
                            $size: {
                                $filter: {
                                input: "$likes",
                                as: "like",
                                cond: { $eq: ["$$like.userId", new Types.ObjectId(req.params.userId)] },
                                },
                            },
                            },
                            0,
                        ],
                        },
                        isCreatedByCurrentUser: {
                            $eq: ["$owner", new Types.ObjectId(req.params.userId)],
                        },
                    },
                    },
                    {
                    $project: {
                        likes: 0, // Exclude likes array if not needed
                    },
                    },
                ]);
            }
console.log(posts);
            res.send(posts);

        }
        catch (error) {
            res.status
            (400).send(error);
        }
};



}
export default new PostController();
