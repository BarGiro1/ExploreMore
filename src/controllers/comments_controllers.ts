import commentsModel,{IComments} from '../models/comments_models';
 import { Request, Response } from 'express';
 import BaseController from './base_controller';

 const comments_controllers=new BaseController(commentsModel);
 
     export default comments_controllers;
