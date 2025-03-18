 import usersModel from '../models/users_models';
 import { Request, Response } from 'express';

    const getAllUsers = async (req:Request , res: Response) => {
        try {
            const users = await usersModel.find();
            res.send(users);
        } catch (error) {
            res.status(400).send(error);
        }
    }
    const createUsers = async (req:Request , res: Response) => {
        try {
            const userBody = req.body;
            const user = await usersModel.create(userBody);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error});
        }
    }
    const getUserById = async(req:Request , res: Response) => {
        const userId = req.params.id;
        try{
            const user =await usersModel.findById(userId);
            if (user) {
                res.send(user);
            }
            else {
                res.status(404).send('User not found');
            }
        
        }catch(error) {
                res.status(400).send
                (error);
            }
        }
        
    const updateUsers = async (req:Request , res: Response) => {
        const userId = req.params.id;
        const userBody = req.body;
        try {
            const user = await usersModel.findByIdAndUpdate
            (userId, userBody, { new: true });
            if (user) {
                res.send(user);
            }
            else {
                res.status(404).send('User not found');
            }
        } catch (error) {
            res.status(400).send(error);
        }
    }
    export default { getAllUsers, createUsers, getUserById, updateUsers}


        