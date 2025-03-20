import express, { Router } from 'express';
 const router = express.Router();
 import usersController from '../controllers/users_controllers';
 
 router.post('/', usersController.createUsers);
 router.put("/:id", usersController.updateUsers);
 router.get('/', usersController.getAllUsers);
 router.get("/:id", usersController.getUserById);
 
 export default router;