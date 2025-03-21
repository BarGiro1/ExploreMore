import { Request, Response } from 'express';
import { Model } from 'mongoose';


class BaseController<T>{
     model:Model<T>;
    constructor(model:Model<T>){
        this.model=model;
    }

    async getAll(req:Request , res: Response) {
        const ownerFilter = req.query.owner;
        const createdAtFilter = req.query.createdAt;
        try {
            if (ownerFilter) {
                const posts= await this.model.find({ owner: ownerFilter });
                res.send(posts);
            }
            else {
                const posts = await this.model.find();
                res.send(posts);
            }
        }
        catch (error) {
            res.status
            (400).send(error);
        }
     };
     
async create(req:Request , res: Response)  {
    const postBody = req.body;
    try {
      
        const post = await this.model.create(postBody);
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error});
    }
 };
    
async getById (req:Request , res: Response)  {
    const postId = req.params.id;
    try{
        const post =await this.model.findById(postId);
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
    async delete_(req: Request, res: Response) {
        const commentId = req.params.id;
        if (!commentId) {
            return res.status(400).json({ error: "ID is required" });
        }
    
        try {
            const comment = await this.model.findByIdAndDelete(commentId);
            if (!comment) {
                return res.status(404).json({ error: "Comment not found" });
            }
            return res.json({ message: "Deleted successfully", _id: comment._id });
        } catch (error) {
            console.error("Error deleting comment:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
    
    async update(req: Request, res: Response) {
        const postId = req.params.id;
        if (!postId) {
            return res.status(400).json({ error: "ID is required" });
        }
    
        const postBody = req.body;
        if (!postBody || Object.keys(postBody).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }
    
        try {
            const post = await this.model.findByIdAndUpdate(postId, postBody, { new: true });
            if (!post) {
                return res.status(404).json({ error: "Not found" });
            }
            return res.json(post);
        } catch (error) {
            console.error("Error updating:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
}

/*const createController=<T>(model:Model<T>) => {
    return new BaseController(model);
}

*/
export default BaseController;

   
  

