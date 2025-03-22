import commentsModel,{IComments} from '../models/comments_models';
import { Request, Response } from 'express';
import BaseController from './base_controller';
import PostModel from '../models/posts_models';
import { Types } from 'mongoose';

class CommentController extends BaseController<IComments>{
    constructor(){
        super(commentsModel);
    }

    async create(req:Request , res: Response)  {
        console.log('Create comment');
        const userId = req.params.userId;
        const comment ={
            ...req.body,
            userId:userId
        }
        req.body=comment;
        super.create(req,res);
        

        // increase the number of comments in the post
        await PostModel.findByIdAndUpdate(req.body.postId, { $inc: { numOfComments: 1 } });
     }

    async delete_(req: Request, res: Response) {
        console.log('Delete comment', req.body);
        const userId = req.params.userId;
        const comment = await commentsModel.findByIdAndDelete(req.params.id);

        if (!comment) {
            return res.status(404).send('Comment not found');
        }
        // decrease the number of comments in the post
        await PostModel.findByIdAndUpdate(comment.postId, { $inc: { numOfComments: -1 } });

        return super.delete_(req, res);
    }

    async getAll(req:Request , res: Response) {
        console.log('Get all comments', req.query);
        const postId = req.query.postId;
        if (!postId) {
            res.status(400).send('Post ID is required');
            return;
        }

        // get all comments for the post (and add the user info)
        const comments = await commentsModel.aggregate([
            {
                $match: { postId: new Types.ObjectId(postId.toString()) },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: 1,
                    postId: 1,
                    userId: 1,
                    content: 1,
                    createdAt: 1,
                    user: {
                        _id: 1,
                        username: 1,
                        email: 1,
                    },
                },
            },
        ]);
        console.log('Get all comments', comments);
        res.send(comments);

    }
}


export default new CommentController();
