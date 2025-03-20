 import postModel,{IPost} from '../models/posts_models';
 import { Request, Response } from 'express';
import createController from './base_controller';


const post_controllers= createController<IPost>(postModel);

export default post_controllers;