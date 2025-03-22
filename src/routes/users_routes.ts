import express, { Router } from 'express';
const router = express.Router();
import usersController from '../controllers/users_controllers';
import { authMiddleware } from '../controllers/auth_controller';
 
router.get('/me', authMiddleware, usersController.getMe);
router.post('/', authMiddleware, usersController.createUsers);
router.put("/", authMiddleware, usersController.updateUsers);
router.get('/', usersController.getAllUsers);
router.get("/:id", usersController.getUserById);

 export default router;