<<<<<<< Updated upstream
 import postModel,{IPost} from '../models/posts_models';
 import { Request, Response } from 'express';
import createController from './base_controller';
=======
import postsModel, { IPost } from "../models/posts_models";
import BaseController from "./base_controller";
>>>>>>> Stashed changes

const postsController = new BaseController<IPost>(postsModel);

<<<<<<< Updated upstream
const post_controllers= createController<IPost>(postModel);

export default post_controllers;
=======
export default postsController;
>>>>>>> Stashed changes
