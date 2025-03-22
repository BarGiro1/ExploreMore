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
                const items= await this.model.find({ owner: ownerFilter });
                res.send(items);
            }
            else {
                const items = await this.model.find();
                res.send(items);
            }
        }
        catch (error) {
            res.status
            (400).send(error);
        }
     };
     
    async create(req:Request , res: Response)  {
        const itemBody = req.body;
        try {
        
            const item = await this.model.create(itemBody);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error});
        }
    };
        
    async getById (req:Request , res: Response)  {
        const itemId = req.params.id;
        try{
            const item =await this.model.findById(itemId);
            if (item) {
                res.send(item);
            }
            else {
                res.status(404).send('Post not found');
            }
        }catch(error) {
                res.status(400).send(error);
            }
    }; 
    
    async delete_(req: Request, res: Response) {
        const itemId = req.params.id;
        if (!itemId) {
            return res.status(400).json({ error: "ID is required" });
        }
    
        try {
            const item = await this.model.findByIdAndDelete(itemId);
            if (!item) {
                return res.status(404).json({ error: "Comment not found" });
            }
            return res.json({ message: "Deleted successfully", _id: item._id });
        } catch (error) {
            console.error("Error deleting item:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    
    
    async update(req: Request, res: Response) {
        const itemId = req.params.id;
        if (!itemId) {
            return res.status(400).json({ error: "ID is required" });
        }
    
        const itemBody = req.body;
        if (!itemBody || Object.keys(itemBody).length === 0) {
            return res.status(400).json({ error: "Update data is required" });
        }
    
        try {
            const item = await this.model.findByIdAndUpdate(itemId, itemBody, { new: true });
            if (!item) {
                return res.status(404).json({ error: "Not found" });
            }
            return res.json(item);
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

   
  

