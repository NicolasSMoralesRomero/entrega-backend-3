import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints para gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', usersController.getAllUsers);

/**
 * @swagger
 * /api/users/{uid}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:uid', usersController.getUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   put:
 *     summary: Actualizar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put('/:uid', usersController.updateUser);

/**
 * @swagger
 * /api/users/{uid}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:uid', usersController.deleteUser);

/**
 * @swagger
 * components:
 *   schemas:
 *     PetRef:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID del pet referenciado
 *           example: "642de9e8390f6c20e46d95a5"

 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: "605c5f45073f3b0023b2d3e6"
 *         first_name:
 *           type: string
 *           example: "Juan"
 *         last_name:
 *           type: string
 *           example: "Pérez"
 *         email:
 *           type: string
 *           example: "juan@example.com"
 *         password:
 *           type: string
 *           description: Contraseña hasheada del usuario
 *           example: "$2b$10$abc..."
 *         role:
 *           type: string
 *           example: "user"
 *         pets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetRef'

 *     UserUpdate:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           example: "NuevoNombre"
 *         last_name:
 *           type: string
 *           example: "NuevoApellido"
 *         role:
 *           type: string
 *           example: "admin"
 *         pets:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PetRef'
 */

export default router;