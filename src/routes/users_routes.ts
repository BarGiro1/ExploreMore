import express from 'express';
const router = express.Router();
import usersController from '../controllers/users_controllers';

router.post('/', usersController.create);
router.put("/:id", usersController.update);
router.get('/', usersController.getAll);
router.get("/:id", usersController.getById);

export default router;
