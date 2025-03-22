import express, { Router } from 'express';
const router = express.Router();
import likesController from '../controllers/likes_controllers';
import { authMiddleware } from '../controllers/auth_controller';

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: API for managing likes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       required:
 *         - postId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the like
 *         postId:
 *           type: string
 *           description: The ID of the post being liked
 *       example:
 *         id: "like789"
 *         postId: "post123"
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Create a new like
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Like'
 *     responses:
 *       201:
 *         description: Like added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 */
router.post('/', authMiddleware, likesController.createLike);

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Remove a like by ID
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the like to delete
 *     responses:
 *       200:
 *         description: Like removed successfully
 */
router.delete('/:id', authMiddleware, likesController.deleteLike);

export default router;
