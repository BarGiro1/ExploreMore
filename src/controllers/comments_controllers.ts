 import commentsModel,{IComments} from '../models/comments_models';
 import { Request, Response } from 'express';
 import createController from './base_controller';

 const comments_controllers= createController<IComments>(commentsModel);
 
     export default comments_controllers;

    


    